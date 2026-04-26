# EchoGarden 🌿

EchoGarden is an advanced RAG (Retrieval-Augmented Generation) ingestion and chatbot platform. It parses documents (CSV, PDF, Images), extracts knowledge graphs and entities into Supabase PostgreSQL, embeds text into Qdrant, and provides a fully grounded chatbot via a React frontend.

---

## 🚀 Quick Start Guide (For Any Machine)

Follow these exact steps to get EchoGarden running on a new machine.

### Prerequisites
1. You must have **Docker** and **Docker Compose** installed.
2. If you are on Windows, ensure **WSL2** is running and Docker Desktop is configured to use it.

### Step 1: Clone or Copy the Repository
If you were given a `.tar` file and a `.zip` folder from a teammate for an offline setup:
1. Extract the folder to your computer.
2. *(Optional Offline Mode)* If you were given an offline image tarball (e.g., `echogarden-offline-images.tar`), load it into Docker first:
   ```bash
   docker load -i echogarden-offline-images.tar
   ```

### Step 2: Configure Environment Variables
You need an `.env` file for the backend to connect to Supabase and your LLM provider.

1. In the root of the project (where `docker-compose.yml` is), duplicate the `.env.example` file and rename it to exactly `.env`.
   - **Mac/Linux:** `cp .env.example .env`
   - **Windows:** `copy .env.example .env`

2. Open the new `.env` file in a text editor and fill in your keys:
   - **Supabase Credentials:** You will need `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and the `DATABASE_URL`.
   - **LLM Provider:** Set `EG_LLM_PROVIDER=groq` (or `gemini`, `openai`, etc.) and provide the matching API key (e.g., `GROQ_API_KEY=your_key_here`).

### Step 3: Allow Remote Connections (Optional)
If you want other computers on your local network (LAN) to access your instance:
1. Open `docker-compose.yml`.
2. Under the `ui:` and `api:` sections, ensure the `ports:` do not have `127.0.0.1:`. 
   - **Correct:** `"5173:5173"` and `"8000:8000"`
   - **Incorrect:** `"127.0.0.1:5173:5173"`

### Step 4: Start the System
Open a terminal in the project folder and run:

```bash
# If you are connected to the internet:
docker compose up -d --build

# OR if you loaded the offline .tar file in Step 1:
docker compose up -d --no-build
```

### Step 5: Access the Application
Once Docker says "Running 4/4", open your web browser:
- **Frontend UI:** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Troubleshooting

- **503 Service Unavailable on Upload:** This means your LLM API Key is missing or you have hit a rate limit (very common on free tiers). Check your `.env` file and try waiting 30 seconds.
- **Connection Refused / Curl fails:** Ensure your `docker-compose.yml` binds ports to `5173:5173` instead of `127.0.0.1:5173:5173`. If you are on Windows, try running `wsl --shutdown` and restarting Docker Desktop.
- **Empty Graph / No Entities:** Ensure your Supabase Database is properly migrated. The `graph_node` and `graph_edge` tables must exist in the `public` schema.

---

*This guide was automatically generated to ensure smooth onboarding for any team member, regardless of their environment.*
