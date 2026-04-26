-- EchoGarden unified schema for PostgreSQL / Supabase
-- All statements are idempotent.

-- ── Institutions (UCAR Pulse multi-tenancy) ─────────────
CREATE TABLE IF NOT EXISTS institutions (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    slug         TEXT UNIQUE,
    type         TEXT,
    city         TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);

-- ── Users (future Supabase Auth integration) ────────────
CREATE TABLE IF NOT EXISTS users (
    id               TEXT PRIMARY KEY,
    institution_id   TEXT REFERENCES institutions(id),
    role             TEXT NOT NULL DEFAULT 'viewer',
    email            TEXT UNIQUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_institution ON users(institution_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ── Memory Cards ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memory_card (
    memory_id        TEXT PRIMARY KEY,
    institution_id   TEXT,
    type             TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_time      TIMESTAMPTZ,
    summary          TEXT,
    content_text     TEXT,
    metadata         JSONB,
    metadata_json    JSONB
);

CREATE INDEX IF NOT EXISTS idx_memory_card_created_at ON memory_card(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_card_type ON memory_card(type);
CREATE INDEX IF NOT EXISTS idx_memory_card_institution ON memory_card(institution_id);
CREATE INDEX IF NOT EXISTS idx_memory_card_fts
    ON memory_card USING GIN (to_tsvector('simple', COALESCE(summary, '') || ' ' || COALESCE(content_text, '')));

CREATE TABLE IF NOT EXISTS graph_node (
    node_id      TEXT PRIMARY KEY,
    node_type    TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    props        JSONB
);

CREATE TABLE IF NOT EXISTS graph_edge (
    edge_id       TEXT PRIMARY KEY,
    from_node_id  TEXT NOT NULL REFERENCES graph_node(node_id),
    to_node_id    TEXT NOT NULL REFERENCES graph_node(node_id),
    edge_type     TEXT,
    weight        DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    valid_from    TIMESTAMPTZ,
    valid_to      TIMESTAMPTZ,
    provenance    JSONB
);

CREATE INDEX IF NOT EXISTS idx_graph_edge_from ON graph_edge(from_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edge_to ON graph_edge(to_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edge_type ON graph_edge(edge_type);
CREATE INDEX IF NOT EXISTS idx_graph_edge_valid ON graph_edge(valid_from, valid_to);
CREATE INDEX IF NOT EXISTS idx_graph_node_type ON graph_node(node_type);

CREATE TABLE IF NOT EXISTS embedding (
    embedding_id  TEXT PRIMARY KEY,
    memory_id     TEXT REFERENCES memory_card(memory_id),
    modality      TEXT NOT NULL DEFAULT 'text',
    vector_ref    TEXT
);

CREATE INDEX IF NOT EXISTS idx_embedding_memory ON embedding(memory_id);

CREATE TABLE IF NOT EXISTS citation (
    citation_id  TEXT PRIMARY KEY,
    memory_id    TEXT REFERENCES memory_card(memory_id),
    span_ref     TEXT,
    quote_hash   TEXT
);

CREATE INDEX IF NOT EXISTS idx_citation_memory ON citation(memory_id);

CREATE TABLE IF NOT EXISTS conversation_turn (
    turn_id          TEXT PRIMARY KEY,
    ts               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_text        TEXT,
    assistant_text   TEXT,
    trace_id         TEXT,
    verdict          TEXT
);

CREATE INDEX IF NOT EXISTS idx_conv_turn_trace ON conversation_turn(trace_id);

CREATE TABLE IF NOT EXISTS tool_call (
    call_id      TEXT PRIMARY KEY,
    tool_name    TEXT,
    ts           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    inputs       JSONB,
    outputs      JSONB,
    status       TEXT
);

CREATE INDEX IF NOT EXISTS idx_tool_call_ts ON tool_call(ts DESC);
CREATE INDEX IF NOT EXISTS idx_tool_call_name ON tool_call(tool_name);

CREATE TABLE IF NOT EXISTS exec_node (
    exec_node_id   TEXT PRIMARY KEY,
    call_id        TEXT REFERENCES tool_call(call_id),
    state          TEXT,
    attempt        INTEGER NOT NULL DEFAULT 1,
    timeout_ms     INTEGER,
    trace_id       TEXT,
    started_ts     TIMESTAMPTZ,
    finished_ts    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_exec_node_call ON exec_node(call_id);
CREATE INDEX IF NOT EXISTS idx_exec_node_trace ON exec_node(trace_id);

CREATE TABLE IF NOT EXISTS exec_edge (
    exec_edge_id       TEXT PRIMARY KEY,
    from_exec_node_id  TEXT REFERENCES exec_node(exec_node_id),
    to_exec_node_id    TEXT REFERENCES exec_node(exec_node_id),
    condition          TEXT,
    trace_id           TEXT
);

CREATE INDEX IF NOT EXISTS idx_exec_edge_from ON exec_edge(from_exec_node_id);
CREATE INDEX IF NOT EXISTS idx_exec_edge_to ON exec_edge(to_exec_node_id);
CREATE INDEX IF NOT EXISTS idx_exec_edge_trace ON exec_edge(trace_id);

CREATE TABLE IF NOT EXISTS exec_trace (
    trace_id       TEXT PRIMARY KEY,
    started_ts     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_ts    TIMESTAMPTZ,
    status         TEXT NOT NULL DEFAULT 'running',
    root_call_id   TEXT,
    metadata_json  JSONB
);

CREATE INDEX IF NOT EXISTS idx_exec_trace_status ON exec_trace(status);
CREATE INDEX IF NOT EXISTS idx_exec_trace_started ON exec_trace(started_ts DESC);

CREATE TABLE IF NOT EXISTS source (
    source_id    TEXT PRIMARY KEY,
    source_type  TEXT NOT NULL,
    uri          TEXT NOT NULL UNIQUE,
    created_ts   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blob (
    blob_id      TEXT PRIMARY KEY,
    sha256       TEXT NOT NULL,
    path         TEXT NOT NULL,
    mime         TEXT,
    size_bytes   BIGINT NOT NULL,
    source_id    TEXT REFERENCES source(source_id),
    storage_url  TEXT,
    created_ts   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blob_sha256 ON blob(sha256);
CREATE INDEX IF NOT EXISTS idx_blob_source ON blob(source_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_blob_sha_path ON blob(sha256, path);

CREATE TABLE IF NOT EXISTS file_state (
    path          TEXT PRIMARY KEY,
    mtime_ns      BIGINT NOT NULL,
    size_bytes    BIGINT NOT NULL,
    sha256        TEXT NOT NULL,
    last_seen_ts  TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    job_id        TEXT PRIMARY KEY,
    type          TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'queued',
    created_ts    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_ts    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    attempts      INTEGER NOT NULL DEFAULT 0,
    next_run_ts   TIMESTAMPTZ,
    payload_json  JSONB NOT NULL,
    error_text    TEXT
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_next_run ON jobs(next_run_ts);

CREATE TABLE IF NOT EXISTS chat_citation (
    citation_id  TEXT PRIMARY KEY,
    turn_id      TEXT NOT NULL,
    memory_id    TEXT NOT NULL,
    quote        TEXT,
    span_start   INTEGER,
    span_end     INTEGER,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_citation_turn ON chat_citation(turn_id);
CREATE INDEX IF NOT EXISTS idx_chat_citation_memory ON chat_citation(memory_id);

CREATE TABLE IF NOT EXISTS conversation (
    conversation_id  TEXT PRIMARY KEY,
    title            TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_turn_v2 (
    turn_id          TEXT PRIMARY KEY,
    conversation_id  TEXT NOT NULL REFERENCES conversation(conversation_id),
    user_text        TEXT,
    assistant_text   TEXT,
    verdict          TEXT,
    citations_json   JSONB,
    evidence_json    JSONB,
    trace_id         TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ctv2_conv ON conversation_turn_v2(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ctv2_trace ON conversation_turn_v2(trace_id);

CREATE TABLE IF NOT EXISTS search_query (
    search_id       TEXT PRIMARY KEY,
    query_text      TEXT NOT NULL,
    filters_json    JSONB,
    result_count    INTEGER DEFAULT 0,
    trace_id        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sq_created ON search_query(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sq_trace ON search_query(trace_id);

-- ── KPI + alert persistence for institutional analytics ─
CREATE TABLE IF NOT EXISTS kpi_snapshots (
    id             BIGSERIAL PRIMARY KEY,
    institution_id TEXT NOT NULL,
    period         TEXT NOT NULL,
    trace_id       TEXT NOT NULL,
    data           JSONB NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_institution_period
    ON kpi_snapshots(institution_id, period, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_trace
    ON kpi_snapshots(trace_id);

CREATE TABLE IF NOT EXISTS alerts (
    id             BIGSERIAL PRIMARY KEY,
    institution_id TEXT NOT NULL,
    severity       TEXT NOT NULL,
    message        TEXT NOT NULL,
    trace_id       TEXT,
    status         TEXT NOT NULL DEFAULT 'open',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_institution_created
    ON alerts(institution_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity
    ON alerts(severity);

-- ── Reports ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
    id             TEXT PRIMARY KEY,
    institution_id TEXT NOT NULL,
    type           TEXT NOT NULL,
    period         TEXT,
    pdf_url        TEXT,
    generated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_institution
    ON reports(institution_id, generated_at DESC);


