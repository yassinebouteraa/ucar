"""Router: Ingest — delegates to the Active Orchestrator."""

from __future__ import annotations

import asyncio
import logging
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field

from app.capture.hasher import detect_mime, sha256_file
from app.capture.repo import upsert_blob, upsert_source
from app.core.config import EG_DATA_DIR
from app.db.supabase_client import (
    ensure_storage_bucket,
    is_supabase_configured,
    upload_to_storage,
)
from app.llm.ollama_client import LLMUnavailableError
from app.orchestrator.models import StepResult
from app.orchestrator.orchestrator import Orchestrator

router = APIRouter(tags=["ingest"])
_orch = Orchestrator()
logger = logging.getLogger("echogarden.ingest")


class IngestRequest(BaseModel):
    text: str
    institution_id: uuid.UUID
    period: str


class IngestResponse(BaseModel):
    memory_id: str | None = None
    trace_id: str
    steps: list[StepResult] = Field(default_factory=list)
    status: str = "ok"


@router.post("/ingest", response_model=IngestResponse)
async def ingest(req: IngestRequest):
    """Ingest raw text via the Orchestrator pipeline."""
    trace_id = uuid.uuid4().hex
    result = await _orch.ingest_blob(
        blob_id=uuid.uuid4().hex,
        source_id=uuid.uuid4().hex,
        path="<inline>",
        mime="text/plain",
        institution_id=req.institution_id,
        period=req.period,
        size_bytes=len(req.text.encode("utf-8")),
        inline_text=req.text,
        trace_id=trace_id,
    )
    return IngestResponse(
        memory_id=result.memory_id,
        trace_id=result.trace_id,
        steps=result.steps,
        status=result.status,
    )


@router.post("/upload", response_model=IngestResponse)
async def upload_file(
    file: UploadFile = File(...),
    institution_id: uuid.UUID = Form(...),
    period: str = Form("2024-Q1"),
):
    """Upload a document, parse it (Tika/OCR pipeline), and ingest automatically.
    
    If Supabase Storage is configured, also uploads the file there for
    persistence beyond the local Docker filesystem.
    """
    original_name = (file.filename or "").strip()
    if not original_name:
        raise HTTPException(status_code=400, detail="Uploaded file must include a filename.")

    safe_name = Path(original_name).name
    upload_dir = Path(EG_DATA_DIR) / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Keep uploaded files on disk so /cards/{id}/open can stream sources later.
    file_id = uuid.uuid4().hex
    file_path = upload_dir / f"{file_id}_{safe_name}"
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    await file.close()

    size_bytes = file_path.stat().st_size
    mime = (file.content_type or "").strip() or detect_mime(str(file_path))
    source_id = upsert_source(uri=str(file_path), source_type="manual_upload")
    blob_id = upsert_blob(
        sha256=sha256_file(str(file_path)),
        path=str(file_path),
        mime=mime,
        size_bytes=size_bytes,
        source_id=source_id,
    )
    trace_id = uuid.uuid4().hex

    # ── Upload to Supabase Storage (best-effort, non-blocking) ──
    storage_path: str | None = None
    if is_supabase_configured():
        storage_name = f"{file_id}_{safe_name}"
        try:
            # Run storage upload in a background thread to avoid blocking the response
            loop = asyncio.get_running_loop()
            storage_path = await loop.run_in_executor(
                None,
                lambda: _upload_to_supabase(str(file_path), storage_name, mime),
            )
            if storage_path:
                logger.info(
                    "File %s uploaded to Supabase Storage: %s",
                    safe_name, storage_path,
                )
                # Update the blob record with the storage URL
                _update_blob_storage_url(blob_id, storage_path)
        except Exception:
            logger.warning(
                "Supabase Storage upload failed for %s (non-fatal)",
                safe_name, exc_info=True,
            )

    try:
        result = await _orch.ingest_blob(
            blob_id=blob_id,
            source_id=source_id,
            path=str(file_path),
            mime=mime,
            institution_id=institution_id,
            period=period,
            size_bytes=size_bytes,
            trace_id=trace_id,
        )
    except LLMUnavailableError as e:
        logger.error(f"Ingestion failed due to LLM error: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"LLM Provider Error: {str(e)}"
        )
    return IngestResponse(
        memory_id=result.memory_id,
        trace_id=result.trace_id,
        steps=result.steps,
        status=result.status,
    )


def _upload_to_supabase(file_path: str, storage_name: str, mime: str) -> str | None:
    """Synchronous helper to upload a file to Supabase Storage.
    
    Ensures the bucket exists before uploading.
    """
    ensure_storage_bucket()
    return upload_to_storage(
        file_path=file_path,
        storage_path=storage_name,
        content_type=mime,
    )


def _update_blob_storage_url(blob_id: str, storage_path: str) -> None:
    """Best-effort update of the blob row with the Supabase Storage path."""
    try:
        from app.db.conn import get_conn
        conn = get_conn()
        try:
            conn.execute(
                """UPDATE blob SET storage_url = ? WHERE blob_id = ?""",
                (storage_path, blob_id),
            )
            conn.commit()
        finally:
            conn.close()
    except Exception:
        logger.debug("Failed to update blob storage_url (non-fatal)", exc_info=True)
