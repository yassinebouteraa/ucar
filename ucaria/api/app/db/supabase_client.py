"""Singleton Supabase client — used for Auth, Storage, Realtime features.

Falls back gracefully when credentials are not configured (local/SQLite mode).
The direct psycopg connection in conn.py is still used for all SQL queries.
"""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger("echogarden.supabase")

_client: Any = None
_UPLOAD_BUCKET = "uploads"


def get_supabase_client():
    """Return a cached Supabase client, or None if not configured."""
    global _client
    if _client is not None:
        return _client

    from app.core.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logger.info(
            "Supabase client not configured — SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. "
            "This is fine if you are using SQLite or direct Postgres."
        )
        return None

    try:
        from supabase import create_client

        _client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        logger.info("Supabase client initialised for %s", SUPABASE_URL)
        return _client
    except ImportError:
        logger.warning("supabase-py not installed — pip install supabase")
        return None
    except Exception as exc:
        logger.error("Failed to create Supabase client: %s", exc)
        return None


def is_supabase_configured() -> bool:
    """Quick check if Supabase credentials are present."""
    from app.core.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
    return bool(SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)


# ── Storage helpers ──────────────────────────────────────

def ensure_storage_bucket(bucket: str = _UPLOAD_BUCKET) -> bool:
    """Create the storage bucket if it doesn't exist. Returns True on success."""
    client = get_supabase_client()
    if client is None:
        return False
    try:
        # List existing buckets and check if ours exists
        buckets = client.storage.list_buckets()
        existing = {b.name for b in buckets} if buckets else set()
        if bucket in existing:
            logger.debug("Storage bucket '%s' already exists", bucket)
            return True
        # Create the bucket — public so we can serve files via signed URLs
        client.storage.create_bucket(
            bucket,
            options={"public": False, "file_size_limit": 50 * 1024 * 1024},  # 50 MB
        )
        logger.info("Created Supabase Storage bucket: %s", bucket)
        return True
    except Exception as exc:
        logger.warning("Failed to ensure storage bucket '%s': %s", bucket, exc)
        return False


def upload_to_storage(
    file_path: str,
    storage_path: str,
    content_type: str = "application/octet-stream",
    bucket: str = _UPLOAD_BUCKET,
) -> str | None:
    """Upload a local file to Supabase Storage.
    
    Args:
        file_path: Local filesystem path to the file.
        storage_path: Path within the bucket (e.g. "abc123_report.pdf").
        content_type: MIME type for the upload.
        bucket: Storage bucket name.
    
    Returns:
        The storage path on success, or None on failure.
    """
    client = get_supabase_client()
    if client is None:
        return None
    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read()

        client.storage.from_(bucket).upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": content_type, "upsert": "true"},
        )
        logger.info("Uploaded %s to Supabase Storage: %s/%s", file_path, bucket, storage_path)
        return storage_path
    except Exception as exc:
        logger.warning("Failed to upload to Supabase Storage: %s", exc)
        return None


def get_signed_url(
    storage_path: str,
    bucket: str = _UPLOAD_BUCKET,
    expires_in: int = 3600,
) -> str | None:
    """Generate a signed URL for a file in Supabase Storage.
    
    Args:
        storage_path: Path within the bucket.
        bucket: Storage bucket name.
        expires_in: URL expiry in seconds (default 1 hour).
    
    Returns:
        Signed URL string, or None on failure.
    """
    client = get_supabase_client()
    if client is None:
        return None
    try:
        result = client.storage.from_(bucket).create_signed_url(storage_path, expires_in)
        if result and isinstance(result, dict):
            return result.get("signedURL") or result.get("signedUrl")
        return None
    except Exception as exc:
        logger.debug("Failed to create signed URL for %s: %s", storage_path, exc)
        return None


def get_public_url(
    storage_path: str,
    bucket: str = _UPLOAD_BUCKET,
) -> str | None:
    """Get the public URL for a file in Supabase Storage (bucket must be public).
    
    Returns:
        Public URL string, or None on failure.
    """
    client = get_supabase_client()
    if client is None:
        return None
    try:
        result = client.storage.from_(bucket).get_public_url(storage_path)
        return result if isinstance(result, str) else None
    except Exception as exc:
        logger.debug("Failed to get public URL for %s: %s", storage_path, exc)
        return None
