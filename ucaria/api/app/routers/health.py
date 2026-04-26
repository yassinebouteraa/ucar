import httpx
from fastapi import APIRouter

from app.core.config import QDRANT_URL
from app.db.conn import get_backend, get_conn

router = APIRouter()


@router.get("/healthz")
async def healthz():
    # ── DB check ──
    db_status = "ok"
    try:
        conn = get_conn()
        conn.execute("SELECT 1")
        conn.close()
    except Exception:
        db_status = "error"

    # ── Qdrant check ──
    qdrant_status = "ok"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(f"{QDRANT_URL}/collections")
            if resp.status_code != 200:
                qdrant_status = "error"
    except Exception:
        qdrant_status = "unreachable"

    # ── LLM check ──
    llm_status = "unavailable"
    try:
        from app.llm.ollama_client import check_llm_health
        if await check_llm_health():
            llm_status = "ok"
    except Exception:
        llm_status = "error"

    ok = db_status == "ok" and qdrant_status == "ok"
    return {
        "ok": ok,
        "db_backend": get_backend(),
        "db": db_status,
        "qdrant": qdrant_status,
        "llm": llm_status,
    }
