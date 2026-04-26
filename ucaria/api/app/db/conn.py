from __future__ import annotations

import logging
import sqlite3
from collections.abc import Iterator, Mapping
from typing import Any

logger = logging.getLogger("echogarden.db.conn")

from app.core.config import DATABASE_URL, EG_DB_BACKEND, EG_DB_PATH

try:
    import psycopg
except Exception:  # pragma: no cover - optional dependency in sqlite mode
    psycopg = None


def get_backend() -> str:
    return "postgres" if EG_DB_BACKEND == "postgres" else "sqlite"


def is_postgres() -> bool:
    return get_backend() == "postgres"


class CompatRow(Mapping[str, Any]):
    """Row mapping that supports both row['col'] and row[0] access."""

    __slots__ = ("_columns", "_values", "_index")

    def __init__(self, columns: list[str], values: tuple[Any, ...]) -> None:
        self._columns = tuple(columns)
        self._values = tuple(values)
        self._index = {c: i for i, c in enumerate(self._columns)}

    def __getitem__(self, key: str | int) -> Any:
        if isinstance(key, int):
            return self._values[key]
        return self._values[self._index[key]]

    def __iter__(self) -> Iterator[str]:
        return iter(self._columns)

    def __len__(self) -> int:
        return len(self._columns)

    def keys(self):
        return self._columns

    def get(self, key: str, default: Any = None) -> Any:
        idx = self._index.get(key)
        if idx is None:
            return default
        return self._values[idx]


class _EmptyCursor:
    def fetchone(self):
        return None

    def fetchall(self):
        return []


class _CompatCursor:
    def __init__(self, cursor) -> None:
        self._cursor = cursor
        self._columns = [
            getattr(d, "name", None) or d[0]
            for d in (cursor.description or [])
        ]

    def _wrap(self, row: Any) -> CompatRow | None:
        if row is None:
            return None
        return CompatRow(self._columns, tuple(row))

    def fetchone(self):
        try:
            return self._wrap(self._cursor.fetchone())
        finally:
            self._cursor.close()

    def fetchall(self):
        try:
            rows = self._cursor.fetchall()
            return [self._wrap(r) for r in rows if r is not None]
        finally:
            self._cursor.close()


def _convert_qmark_placeholders(query: str) -> str:
    """Convert sqlite-style '?' placeholders to psycopg '%s' placeholders.

    Also escapes ALL existing '%' characters to '%%' because psycopg3
    scans the entire SQL string for format specifiers, even inside
    single-quoted string literals like ``LIKE 'ent:%'``.
    """
    out: list[str] = []
    in_single = False
    in_double = False
    i = 0
    while i < len(query):
        ch = query[i]
        if ch == "'" and not in_double:
            in_single = not in_single
            out.append(ch)
        elif ch == '"' and not in_single:
            in_double = not in_double
            out.append(ch)
        elif ch == "?" and not in_single and not in_double:
            out.append("%s")
        elif ch == "%":
            # Escape ALL literal % for psycopg3 (it parses % everywhere)
            out.append("%%")
        else:
            out.append(ch)
        i += 1
    return "".join(out)


def _convert_sqlite_brackets(query: str) -> str:
    out: list[str] = []
    i = 0
    while i < len(query):
        if query[i] == "[":
            j = query.find("]", i + 1)
            if j != -1:
                ident = query[i + 1 : j]
                out.append(f'"{ident}"')
                i = j + 1
                continue
        out.append(query[i])
        i += 1
    return "".join(out)


def _adapt_query_for_postgres(query: str) -> str:
    q = _convert_sqlite_brackets(query)
    q = _convert_qmark_placeholders(q)
    return q


def _split_sql_script(script: str) -> list[str]:
    statements: list[str] = []
    current: list[str] = []
    in_single = False
    in_double = False

    for ch in script:
        if ch == "'" and not in_double:
            in_single = not in_single
        elif ch == '"' and not in_single:
            in_double = not in_double

        if ch == ";" and not in_single and not in_double:
            stmt = "".join(current).strip()
            if stmt:
                statements.append(stmt)
            current = []
        else:
            current.append(ch)

    tail = "".join(current).strip()
    if tail:
        statements.append(tail)
    return statements


class PostgresCompatConnection:
    def __init__(self, conn) -> None:
        self._conn = conn

    def execute(self, query: str, params: Any = None):
        cursor = self._conn.cursor()
        sql = _adapt_query_for_postgres(query)
        try:
            cursor.execute(sql, params if params is not None else ())
        except Exception as exc:
            logger.error(
                "PostgreSQL execute failed — sql=%s params=%s error=%s",
                sql[:200], repr(params)[:200], exc,
            )
            cursor.close()
            raise
        if cursor.description is None:
            cursor.close()
            return _EmptyCursor()
        return _CompatCursor(cursor)

    def executescript(self, script: str) -> None:
        for stmt in _split_sql_script(script):
            self.execute(stmt)

    def commit(self) -> None:
        self._conn.commit()

    def close(self) -> None:
        self._conn.close()


def _ensure_ssl(url: str) -> str:
    """Append sslmode=require for Supabase URLs if not already present."""
    if ".supabase." in url and "sslmode" not in url:
        sep = "&" if "?" in url else "?"
        return url + sep + "sslmode=require"
    return url


def get_conn():
    """Return backend connection compatible with existing sqlite-style callsites."""
    if is_postgres():
        if psycopg is None:
            raise RuntimeError(
                "Postgres backend selected but psycopg is not installed. "
                "Add 'psycopg[binary]' to requirements."
            )
        if not DATABASE_URL:
            raise RuntimeError(
                "Postgres backend selected but DATABASE_URL is empty."
            )
        conn_url = _ensure_ssl(DATABASE_URL)
        conn = psycopg.connect(conn_url, autocommit=False)
        return PostgresCompatConnection(conn)

    conn = sqlite3.connect(EG_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

