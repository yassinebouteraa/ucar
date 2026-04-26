import os

EG_DATA_DIR: str = os.environ.get("EG_DATA_DIR", "/data")
EG_DB_PATH: str = os.environ.get("EG_DB_PATH", "/data/sqlite/echogarden.db")
DATABASE_URL: str = os.environ.get("DATABASE_URL", "").strip()
EG_DB_BACKEND: str = os.environ.get(
    "EG_DB_BACKEND",
    "postgres" if DATABASE_URL.lower().startswith(("postgres://", "postgresql://")) else "sqlite",
).strip().lower()
QDRANT_URL: str = os.environ.get("QDRANT_URL", "http://qdrant:6333")

# Phase 4
TIKA_URL: str = os.environ.get("TIKA_URL", "http://tika:9998")
EG_MODELS_DIR: str = os.environ.get("EG_MODELS_DIR", "/data/models")
EG_WHISPER_MODE: str = os.environ.get("EG_WHISPER_MODE", "local")
EG_OPENCLIP_MODE: str = os.environ.get("EG_OPENCLIP_MODE", "local")
EG_CAPTURE_API_KEY: str = os.environ.get("EG_CAPTURE_API_KEY", "")

# Phase 6 — LLM Configuration
EG_LLM_PROVIDER: str = os.environ.get("EG_LLM_PROVIDER", "auto").strip().lower()
EG_OLLAMA_URL: str = os.environ.get("EG_OLLAMA_URL", "http://host.docker.internal:11434")
EG_OLLAMA_MODEL: str = os.environ.get("EG_OLLAMA_MODEL", "phi3:mini")
EG_OLLAMA_TIMEOUT: float = float(os.environ.get("EG_OLLAMA_TIMEOUT", "180"))

GEMINI_API_KEY: str = os.environ.get("GEMINI_API_KEY", "").strip()
EG_GEMINI_MODEL: str = os.environ.get("EG_GEMINI_MODEL", "gemini-2.5-flash")

OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "").strip()
OPENAI_BASE_URL: str = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").strip()
EG_OPENAI_MODEL: str = os.environ.get("EG_OPENAI_MODEL", "gpt-4o-mini")

GROQ_API_KEY: str = os.environ.get("GROQ_API_KEY", "").strip()
EG_GROQ_BASE_URL: str = os.environ.get("EG_GROQ_BASE_URL", "https://api.groq.com/openai/v1").strip()
EG_GROQ_MODEL: str = os.environ.get("EG_GROQ_MODEL", "llama-3.3-70b-versatile")

ANTHROPIC_API_KEY: str = os.environ.get("ANTHROPIC_API_KEY", "").strip()
EG_ANTHROPIC_BASE_URL: str = os.environ.get("EG_ANTHROPIC_BASE_URL", "https://api.anthropic.com/v1").strip()
EG_ANTHROPIC_MODEL: str = os.environ.get("EG_ANTHROPIC_MODEL", "claude-3-5-sonnet-latest")

# ── Supabase client config ────────────────────────────────
SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "").strip()
SUPABASE_ANON_KEY: str = os.environ.get("SUPABASE_ANON_KEY", "").strip()
SUPABASE_SERVICE_ROLE_KEY: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()

# ── CORS (cloud deployment) ──────────────────────────────
CORS_ORIGINS: list[str] = [
    o.strip()
    for o in os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
    ).split(",")
    if o.strip()
]
