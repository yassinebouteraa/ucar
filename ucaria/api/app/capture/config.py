"""Capture subsystem configuration — read from environment variables."""

from __future__ import annotations

import os


# Comma-separated list of directories to watch inside the container.
EG_WATCH_ROOTS: list[str] = [
    r.strip()
    for r in os.environ.get("EG_WATCH_ROOTS", "/host_watch").split(",")
    if r.strip()
]

# Polling interval in seconds (float-friendly).
EG_POLL_INTERVAL: float = float(os.environ.get("EG_POLL_INTERVAL", "2"))

# Maximum file size in megabytes.  Files larger than this are still
# registered (blob + placeholder card) but their content is NOT loaded.
EG_MAX_FILE_MB: float = float(os.environ.get("EG_MAX_FILE_MB", "20"))

# Derived byte limit.
EG_MAX_FILE_BYTES: int = int(EG_MAX_FILE_MB * 1024 * 1024)

# Default institutional context for watcher-triggered ingest jobs.
# Can be overridden per API request in /ingest.
EG_DEFAULT_INSTITUTION_ID: str = os.environ.get(
    "EG_DEFAULT_INSTITUTION_ID",
    "00000000-0000-0000-0000-000000000000",
)
EG_DEFAULT_PERIOD: str = os.environ.get("EG_DEFAULT_PERIOD", "unspecified")

# Extensions considered "text-like" — content will be read and summarised.
TEXT_EXTENSIONS: frozenset[str] = frozenset(
    {".txt", ".md", ".json", ".csv", ".log"}
)
