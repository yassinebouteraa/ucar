# UCAR Pulse — Full Team Documentation
### HACK4UCAR 2025 · Team Submission

---

## 0. TL;DR (Read This First)

We are building **UCAR Pulse** — the operating system for the University of Carthage.

Not a dashboard. Not a chatbot. A complete institutional intelligence platform that:
- Ingests any document format and extracts KPIs automatically
- Monitors 30+ institutions in real time with anomaly alerts
- Answers questions about institutional data with AI — grounded, cited, no hallucination
- Generates board-ready PDF reports in one click

**The one sentence pitch:**
> "Today UCAR manages 30 institutions with Excel and email. UCAR Pulse replaces that entire chain with one platform — from raw documents to strategic decisions."

---

## 1. The Problem We're Solving

### Current Reality at UCAR
- 30+ affiliated institutions, each operating in isolation
- Data lives in PDFs, scanned papers, Excel files, WhatsApp messages
- Every month, someone emails every institution, waits for files, copy-pastes numbers manually
- By the time the rector sees the data, it's already 3 weeks old
- Nobody knows INSAT's dropout is getting worse until it's already a crisis

### The 3 Pain Points We Target
1. **Data is trapped** — in documents no system can read automatically
2. **Problems are invisible** — until they become emergencies
3. **Reporting is manual** — every board presentation is 4 hours of copy-pasting

---

## 2. Our Solution — UCAR Pulse

### What It Is
A multi-tenant web platform where:
- Each institution has its own isolated space
- Central UCAR administration sees everything in one consolidated view
- AI handles the repetitive work: extraction, monitoring, report writing

### What Makes Us Different From Every Other Team
1. **We ingest anything** — scanned PDF, photo of a printed table, Excel, Word doc. Tika + Tesseract handles all of it. Other teams require a clean Excel upload.
2. **Our AI doesn't hallucinate** — EchoGarden's Weaver+Verifier pipeline returns `pass/revise/abstain` verdicts with citations. Every answer is grounded in real data.
3. **We generate real reports** — AI writes the narrative in French, charts are embedded, PDF downloads in 30 seconds. No other team will have this.
4. **We cover all 4 tracks** — not just a dashboard or just a chatbot. The full loop from raw document to strategic decision.

---

## 3. The 4 Tracks — What We Cover

### 🔵 Track 1 — Data Digitalization & Structuring
**What we do:** Upload any document → extract structured KPIs → store in database

**Flow:**
```
File Upload (PDF / Image / Excel / Word)
        ↓
Apache Tika + Tesseract OCR (extract raw text)
        ↓
Gemini Flash (convert text → KPI JSON)
        ↓
Validation & Normalization (backend rules)
        ↓
Supabase (multi-tenant KPI storage)
        ↓
Anomaly Check triggered automatically
```

**Demo moment:** Upload a scanned institutional report PDF. Watch 12 KPIs appear in 8 seconds. System flags dropout rate anomaly automatically.

---

### 🟣 Track 2 — Smart Analytics & Decision Support
**What we do:** Monitor all institutions, detect anomalies, send alerts, show trends

**Anomaly Rules (examples):**
| Rule | Severity | Message |
|---|---|---|
| dropout_rate > 20% | CRITICAL | Dropout rate exceeds safe threshold |
| budget_execution_rate < 50% | WARNING | Budget severely underspent |
| attendance_rate < 65% | WARNING | Attendance critically low |
| absenteeism_rate > 8% | WARNING | Staff absenteeism elevated |
| employability_rate < 50% | CRITICAL | Graduate employment rate critical |

**Features:**
- Multi-institution comparison dashboard
- Trend charts per KPI (3 semesters of history)
- Real-time alert panel with severity levels
- Weekly automated digest (which institutions need attention)

**Demo moment:** Consolidated view of 4 institutions — red/yellow/green per KPI family. One click on a red alert → see the context → AI explains why.

---

### 🟢 Track 3 — AI Assistant & Automation
**What we do:** Natural language interface over all institutional data — structured KPIs + ingested documents combined

**Powered by:** EchoGarden (FastAPI + Qdrant + Ollama/Gemini)

**What makes it different:**
- Retrieves from BOTH the KPI database AND ingested document context
- Weaver generates answers grounded only in retrieved evidence
- Verifier checks every claim — returns `pass`, `revise`, or `abstain`
- Shows citations — which document, which memory card
- Works in French, Arabic, English

**Example queries:**
- *"Compare dropout rates across all institutions and explain the trend at INSAT"*
- *"Which institution has the worst budget execution and what are the reasons?"*
- *"Generate talking points for the board meeting about ENIT's research performance"*
- *"Are there any institutions at risk of missing their semester targets?"*

**Demo moment:** Type a question in French. Get a grounded answer with cited sources. System shows verdict: "pass — all claims supported." That's not a chatbot. That's an analyst.

---

### 🟠 Track 4 — End-to-End Smart Platform
**What we do:** Tie everything together in one unified OS with automated reporting

**Report Types:**

**1. Scheduled Weekly/Monthly Report** (automatic)
- Triggered every Monday 8am or end of month
- Covers all institutions
- Highlights top anomalies, trends, institutions needing attention
- Delivered as PDF to central UCAR admin
- Written in formal French by Gemini Flash

**2. On-Demand Board Report** (one click)
- Any institution, any period
- AI-written executive summary (3 paragraphs, formal French)
- KPI overview table
- Anomaly & alert section
- Trend charts embedded
- AI recommendations (2-3 actionable items)
- Ready in 30 seconds

**Demo moment:** Click "Generate Board Report" for INSAT. 30 seconds. Download PDF. Show the AI-written narrative, charts, anomaly section. Ask the judge: "How long does this take your team today?"

---

## 4. Technical Architecture

### Stack
| Layer | Technology | Why |
|---|---|---|
| Frontend | React + TypeScript + Tailwind | Fast, your team knows it |
| Backend | FastAPI (Python) | Already in EchoGarden, fast |
| AI Pipeline | EchoGarden (Qdrant + Ollama) | Weaver/Verifier = no hallucination |
| LLM | Gemini Flash | Fast, multilingual, free tier |
| OCR/Parse | Apache Tika + Tesseract | Handles any document format |
| Database | Supabase (PostgreSQL) | Multi-tenant, you already know it |
| Report Gen | WeasyPrint + Matplotlib | PDF generation with charts |
| Auth | Supabase Auth | Simple, built-in |

### System Architecture
```
[Web UI]
    ↓
[FastAPI Backend]
    ├── /ingest        → Tika → Gemini → Supabase
    ├── /dashboard     → Supabase KPI queries
    ├── /alerts        → Anomaly engine
    ├── /chat          → EchoGarden pipeline
    └── /reports       → Gemini + WeasyPrint → PDF
         ↓
[Supabase]          [Qdrant]          [Gemini Flash]
KPI data            Vector store       LLM tasks
Multi-tenant        Semantic search    Report writing
```

### Multi-Tenancy
Every table has `institution_id`. Every query is scoped by it. Central admin role sees all. Institution admin sees only their data. Simple, secure, demonstrable.

```sql
-- Core tables
institutions (id, name, slug, type, city, created_at)
kpi_snapshots (id, institution_id, period, data JSONB, created_at)
alerts (id, institution_id, kpi_field, severity, message, resolved, created_at)
reports (id, institution_id, type, period, pdf_url, generated_at)
memory_cards (id, institution_id, content, embedding, source_type, created_at)
users (id, institution_id, role, email)
```

---

## 5. KPI Schema (Full — All 8 Families)

```json
{
  "institution_id": "uuid",
  "institution_name": "string",
  "period": "2024-S2",

  "academic": {
    "success_rate": 0.72,
    "attendance_rate": 0.81,
    "dropout_rate": 0.28,
    "repetition_rate": 0.15,
    "exam_pass_rate": 0.69
  },

  "finance": {
    "budget_allocated": 2400000,
    "budget_used": 1150000,
    "budget_execution_rate": 0.479,
    "cost_per_student": 1850
  },

  "employment": {
    "employability_rate": 0.68,
    "insertion_delay_months": 7,
    "national_partnership_rate": 0.45
  },

  "hr": {
    "teaching_staff_count": 142,
    "admin_staff_count": 38,
    "absenteeism_rate": 0.04,
    "training_completed_rate": 0.61
  },

  "research": {
    "publications_count": 23,
    "active_projects": 8,
    "funding_secured": 180000,
    "patents_filed": 2
  },

  "infrastructure": {
    "classroom_occupancy_rate": 0.87,
    "it_equipment_ok_rate": 0.91,
    "ongoing_works": 3
  },

  "esg": {
    "energy_consumption_kwh": 142000,
    "recycling_rate": 0.12,
    "green_mobility_rate": 0.08
  },

  "partnerships": {
    "active_agreements": 14,
    "outgoing_mobility": 23,
    "incoming_mobility": 11,
    "international_projects": 4
  }
}
```

---

## 6. Mock Data — The 4 Institutions

Each institution has a story. The demo only works if the data has drama.

### Institution 1: INSAT — The Dropout Crisis
**Story:** Academic performance declining 3 semesters in a row. Dropout jumped from 19% to 28%. Budget fine but the human cost is mounting.
- dropout_rate: 0.19 → 0.24 → 0.28 (3 semesters)
- attendance_rate: 0.88 → 0.79 → 0.71
- success_rate: 0.81 → 0.76 → 0.72
- budget_execution_rate: 0.91 (fine)
- **Active alerts:** CRITICAL dropout, WARNING attendance

### Institution 2: ENIT — The Budget Problem
**Story:** Great academic results but they're barely spending their budget. 47% execution rate with 2 months left in the semester. Infrastructure suffering as a result.
- academic KPIs: all healthy (success 0.84, dropout 0.11)
- budget_execution_rate: 0.47 (critical underspend)
- it_equipment_ok_rate: 0.61 (deteriorating)
- ongoing_works: 0
- **Active alerts:** WARNING budget execution, WARNING IT equipment

### Institution 3: ESPRIT — The Star
**Story:** Performing well across the board. High employability, strong research, good finances. The benchmark everyone else is compared to.
- employability_rate: 0.84
- publications_count: 41
- success_rate: 0.88
- budget_execution_rate: 0.89
- **Active alerts:** None — this is what good looks like

### Institution 4: ISG — The HR Crisis
**Story:** Staff instability. High absenteeism, low training completion. Academic results starting to slip as a consequence.
- absenteeism_rate: 0.13 (very high)
- training_completed_rate: 0.29
- success_rate: 0.71 → 0.68 → 0.63 (declining)
- teaching_staff_count dropping each semester
- **Active alerts:** CRITICAL absenteeism, WARNING academic decline

---

## 7. API Endpoints Reference

### Institution & KPI
```
GET  /institutions                          List all institutions
GET  /institutions/:id                      Institution detail
GET  /institutions/:id/kpis                 Latest KPI snapshot
GET  /institutions/:id/kpis/history         KPI trend (all periods)
GET  /dashboard/summary                     All institutions, top-level KPIs
```

### Alerts
```
GET  /alerts                                All active alerts
GET  /alerts?institution_id=:id             Alerts for one institution
GET  /alerts?severity=CRITICAL              Filter by severity
POST /alerts/:id/resolve                    Mark alert resolved
```

### Ingestion
```
POST /ingest/document                       Upload file → extract KPIs
GET  /ingest/jobs/:job_id                   Check ingestion status
```

### AI Assistant
```
POST /chat                                  Query the AI assistant
Body: { message, institution_id?, top_k? }
Response: { answer, verdict, citations, evidence }
```

### Reports
```
POST /reports/generate                      Generate a report
Body: { institution_id, type, period }
GET  /reports/:id                           Download PDF
GET  /reports?institution_id=:id            List reports
```

---

## 8. UI Pages (for Frontend Team)

### Page 1: Dashboard (/)
- Header: UCAR Pulse logo + user role badge
- Institution grid: 4 cards, each showing name + 5 key KPI indicators (green/yellow/red dots)
- Alert strip at top: "3 active critical alerts"
- Global comparison chart: bar chart, all institutions, one KPI at a time (selector)

### Page 2: Institution Detail (/institutions/:id)
- Institution name, type, city
- 8 KPI family cards with current values
- Trend charts for key metrics (3 semesters)
- Active alerts panel
- Recent ingested documents
- "Generate Report" button

### Page 3: AI Assistant (/chat)
- Chat interface
- Institution context selector (or "all institutions")
- Message shows: answer text + verdict badge + citations list
- Suggested questions panel

### Page 4: Report Center (/reports)
- Generate button with: institution selector, period selector, report type
- Reports history table with download links
- Scheduled reports config

### Page 5: Ingest (/ingest)
- Drag and drop upload
- Institution selector
- Live progress: "Extracting text... Analyzing KPIs... Storing data... Done"
- Preview of extracted KPIs before confirmation

---

## 9. The Demo Script (6 Minutes)

**Minute 1 — The Pain (spoken, no screen)**
> "Today, the rector of UCAR manages 30 institutions with Excel files and email chains. Every month is the same: send emails, wait a week, receive 30 different Excel formats, copy-paste manually, and still not know if a crisis is forming. We ended that loop."

**Minute 2 — Ingestion (live demo)**
- Navigate to /ingest
- Upload a scanned PDF report from "INSAT"
- Watch live progress bar
- KPIs appear: 12 fields extracted
- System immediately flags: "⚠️ Dropout rate 28% — CRITICAL. Up from 19% last semester."
- Say: "That alert fired automatically. No rule was written manually for INSAT. The system learned what healthy looks like."

**Minute 3 — Dashboard (live demo)**
- Navigate to /
- Show 4 institutions side by side
- INSAT: red academic dot, ENIT: orange finance dot, ESPRIT: all green, ISG: red HR dot
- Click INSAT → detail view → trend chart showing dropout climbing
- Say: "Every institution, every KPI family, one view. The rector sees this every Monday morning automatically."

**Minute 4 — AI Assistant (live demo)**
- Navigate to /chat
- Type: *"Pourquoi le taux d'abandon à l'INSAT augmente-t-il chaque semestre?"*
- Show response: grounded answer, pulls from both KPI data and ingested documents
- Show citations panel: "Source: INSAT Rapport S1 2024, Memory card #a3f2"
- Show verdict badge: "✅ pass — all claims verified"
- Say: "This is not a chatbot that makes things up. Every statement is cited. If it doesn't know, it says so."

**Minute 5 — Report Generation (live demo)**
- Navigate to /reports
- Select: INSAT, 2024-S2, Board Report
- Click Generate — 30 second wait
- PDF downloads
- Show: AI-written executive summary in French, KPI table, anomaly section, recommendations
- Say: "This used to take 4 hours. It now takes 30 seconds."

**Minute 6 — Vision (spoken)**
> "UCAR Pulse is not a dashboard. It is the operating system for Tunisian higher education. 30 institutions, one platform, zero Excel chains. Built for the people who run universities — not for data scientists. Every feature exists because someone at a university wastes time on it today. We gave them that time back."

---

## 10. Team Responsibilities

| Person | Role | Tasks |
|---|---|---|
| Bedi | Backend — EchoGarden migration | Convert EchoGarden to Supabase, multi-tenant schema, deploy |
| Yassine (you) | Backend — API + Pipeline | KPI endpoints, ingestion pipeline, anomaly engine, report generation |
| Rayen | Frontend | Dashboard, institution detail, alerts panel, charts |
| Yassine F. | Frontend + PPT | Chat UI, report center, ingest page, pitch deck |

---

## 11. Build Order & Timeline

| Time | Task | Owner |
|---|---|---|
| Now → +2h | Supabase schema + mock data seeded | Bedi + you |
| Now → +2h | Frontend mocks with static JSON | Rayen + YF |
| +2h → +5h | Core KPI API endpoints live | You |
| +2h → +5h | EchoGarden connected to Supabase | Bedi |
| +5h → +7h | Ingestion pipeline (Tika → Gemini → DB) | You |
| +5h → +8h | Dashboard + detail page connected to API | Rayen |
| +7h → +9h | Anomaly engine + alerts endpoint | You |
| +8h → +11h | Chat UI + AI assistant connected | YF + Bedi |
| +9h → +12h | Report generation (Gemini + PDF) | You |
| +12h → +14h | Full integration pass, bug fixes | All |
| +14h → +16h | Demo rehearsal, data cleanup | All |
| +16h → +17h | PPT finalized, demo script locked | YF |

---

## 12. What Judges Will Score Us On

| Criterion | How We Win It |
|---|---|
| Impact | We kill the Excel chain. We solve a real, daily pain for every admin in the room |
| Innovation | Weaver+Verifier = grounded AI with no hallucination. Ingests any format. Report generation in 30s |
| Usability | French language, clean UI, no technical knowledge needed, one-click everything |
| Scalability | Multi-tenant Supabase, institution_id on every query, one deployment for all 30 institutions |
| Feasibility | FastAPI + Supabase + Gemini = deployable in Tunisia today, low cost, no GPU needed |

---

*HACK4UCAR 2025 · University of Carthage · ACM ENSTAB*
*Team: Bedi · Yassine · Rayen · Yassine F.*
