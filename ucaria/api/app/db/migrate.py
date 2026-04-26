import logging
import os
from pathlib import Path

from app.core.config import EG_DB_PATH
from app.db.conn import get_backend, get_conn, is_postgres

logger = logging.getLogger("echogarden.migrate")

_SCHEMA_DIR = Path(__file__).parent
_SCHEMA_FILE = _SCHEMA_DIR / "schema.sql"
_SCHEMA_CAPTURE_FILE = _SCHEMA_DIR / "schema_capture.sql"
_SCHEMA_PHASE3_FILE = _SCHEMA_DIR / "schema_phase3.sql"
_SCHEMA_PHASE7_FILE = _SCHEMA_DIR / "schema_phase7.sql"
_SCHEMA_PHASE8_FILE = _SCHEMA_DIR / "schema_phase8.sql"
_SCHEMA_POSTGRES_FILE = _SCHEMA_DIR / "schema_postgres.sql"


def _get_table_columns(conn, table: str) -> list[str]:
    """Return column names for a table — works on both SQLite and Postgres."""
    try:
        if is_postgres():
            rows = conn.execute(
                """SELECT column_name
                   FROM information_schema.columns
                   WHERE table_schema = current_schema()
                     AND table_name = ?
                   ORDER BY ordinal_position""",
                (table.lower(),),
            ).fetchall()
            return [r[0] for r in rows]
        rows = conn.execute(f"PRAGMA table_info({table})").fetchall()
        return [r[1] for r in rows]
    except Exception as exc:
        logger.debug("Could not introspect table %s: %s", table, exc)
        return []


def _safe_add_column(conn, table: str, column: str, col_type: str) -> None:
    """Add a column to a table if it doesn't already exist.
    Works on both SQLite and Postgres backends.
    """
    try:
        existing = _get_table_columns(conn, table)
        if column.lower() not in [c.lower() for c in existing]:
            if is_postgres():
                # Postgres: don't use SQLite-specific defaults like datetime('now')
                pg_type = col_type
                if "datetime('now')" in pg_type:
                    pg_type = "TIMESTAMPTZ DEFAULT NOW()"
                conn.execute(f'ALTER TABLE "{table}" ADD COLUMN "{column}" {pg_type}')
            else:
                conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}")
            logger.info("Added column %s.%s", table, column)
    except Exception as exc:
        logger.debug("Column %s.%s skipped: %s", table, column, exc)


def _run_phase6_migration(conn) -> None:
    """Phase 6: ensure memory_card has content_text + metadata_json columns.
    
    On Postgres, these columns are already defined in schema_postgres.sql,
    so this is a no-op. Only needed for SQLite.
    """
    if is_postgres():
        logger.debug("Phase 6 migration skipped — Postgres schema already has these columns")
        return

    # Detect memory card table
    tables = [
        r[0]
        for r in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        ).fetchall()
    ]

    mc_table = "memory_card"
    if "MEMORY_CARD" in tables:
        mc_table = "MEMORY_CARD"

    # Add missing columns
    _safe_add_column(conn, mc_table, "content_text", "TEXT")
    _safe_add_column(conn, mc_table, "metadata_json", "TEXT")
    _safe_add_column(conn, mc_table, "source_time", "TEXT")

    # Ensure type and created_at exist (they should from schema.sql)
    _safe_add_column(conn, mc_table, "type", "TEXT")
    _safe_add_column(conn, mc_table, "created_at",
                     "TEXT NOT NULL DEFAULT (datetime('now'))")

    # Create FTS table if missing
    try:
        conn.execute(
            f"""CREATE VIRTUAL TABLE IF NOT EXISTS memory_card_fts
                USING fts5(summary, content='[{mc_table}]', content_rowid='rowid')"""
        )
    except Exception:
        pass  # may already exist or fail on rebuild

    logger.info("Phase 6 migration complete for table %s", mc_table)


def run_migration() -> None:
    """Apply idempotent schema migration for configured backend."""
    backend = get_backend()
    if backend == "sqlite":
        # Ensure the directory for the DB file exists
        os.makedirs(os.path.dirname(EG_DB_PATH), exist_ok=True)

        conn = get_conn()
        try:
            # Core schema (Phase 1 + 2)
            conn.executescript(_SCHEMA_FILE.read_text())
            # Capture subsystem schema (file_state, source, blob, jobs)
            conn.executescript(_SCHEMA_CAPTURE_FILE.read_text())

            # Phase 3: exec_trace table + extensions
            conn.executescript(_SCHEMA_PHASE3_FILE.read_text())

            # Phase 3: add trace_id + timestamp columns to existing tables
            _safe_add_column(conn, "exec_node", "trace_id", "TEXT")
            _safe_add_column(conn, "exec_node", "started_ts", "TEXT")
            _safe_add_column(conn, "exec_node", "finished_ts", "TEXT")
            _safe_add_column(conn, "exec_edge", "trace_id", "TEXT")
            _safe_add_column(conn, "conversation_turn", "trace_id", "TEXT")

            # Indexes on the new trace_id columns
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_exec_node_trace ON exec_node(trace_id)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_exec_edge_trace ON exec_edge(trace_id)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_conv_turn_trace ON conversation_turn(trace_id)"
            )

            # Phase 6: content_text + metadata_json on memory_card
            _run_phase6_migration(conn)

            # Phase 7: grounded Q&A — chat_citation table + conversation_turn.verdict
            if _SCHEMA_PHASE7_FILE.exists():
                conn.executescript(_SCHEMA_PHASE7_FILE.read_text())
            _safe_add_column(conn, "conversation_turn", "verdict", "TEXT")

            # Phase 8: conversation threads, search_query
            if _SCHEMA_PHASE8_FILE.exists():
                conn.executescript(_SCHEMA_PHASE8_FILE.read_text())

            conn.commit()
            logger.info("SQLite migrations complete (Phase 1-8)")
        finally:
            conn.close()
        return

    # ── Postgres / Supabase path ──────────────────────────
    conn = get_conn()
    try:
        if not _SCHEMA_POSTGRES_FILE.exists():
            raise RuntimeError(f"Postgres schema file not found: {_SCHEMA_POSTGRES_FILE}")
        conn.executescript(_SCHEMA_POSTGRES_FILE.read_text())

        # Idempotent column additions for existing databases
        _safe_add_column(conn, "blob", "storage_url", "TEXT")

        conn.commit()
        logger.info("Postgres / Supabase migration complete")
    finally:
        conn.close()

    # Ensure Supabase Storage bucket exists (best-effort)
    try:
        from app.db.supabase_client import ensure_storage_bucket, is_supabase_configured
        if is_supabase_configured():
            ensure_storage_bucket()
    except Exception:
        logger.debug("Supabase storage bucket init skipped", exc_info=True)
