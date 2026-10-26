# UCARIA

RAG-based LLM assistant built at **HACK4UCAR 2026**, where our team placed in the **top 5 of 30 teams**.

UCARIA ingests documents (CSV, PDF, images), stores extracted knowledge in Supabase (PostgreSQL) and a vector store, and answers questions with a chatbot grounded in those documents.

## Repository layout

**Root:** the Next.js 16 / React 19 / TypeScript web app (Tailwind CSS, Framer Motion, Recharts, Supabase).

**`ucaria/`:** the RAG backend (`api/`) and chat UI (`ui/`), run with Docker Compose. See `ucaria/README.md` for setup.

## Run the web app

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## My role

[Yassine Bouteraa](https://github.com/yassinebouteraa): front end.
