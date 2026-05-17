# 📊 JobMarket AI — India IT Intelligence Platform

> **Full-stack job market analytics platform** — real-time skill demand, salary intelligence, and city heatmaps across 15 IT roles in India's hiring market.

👉 **[Live App](https://jobmarket-frontend.vercel.app/)** &nbsp;|&nbsp; 🔧 **[Backend Repo](https://github.com/aftabdayer/datamind-backend)**

---

## What It Does

JobMarket AI turns 1,000 scraped job postings into actionable hiring intelligence — no SQL required. Business stakeholders, recruiters, and job seekers can explore skill demand, benchmark salaries, and identify high-paying cities through an 8-page interactive dashboard.

| Page | What You Get |
|------|-------------|
| **Overview** | Market summary — 999 jobs, 84 companies, 24 cities, 125 skills |
| **Skills** | Top skills by role; demand trends over time |
| **Cities** | Heatmap of hiring activity across 24 Indian cities |
| **Companies** | Company-level hiring volume and role breakdown |
| **Salaries** | Percentile engine (P25/P50/P75/P90) by role and city |
| **Trends** | Weekly posting volume; role demand over time |
| **Job Search** | Filter and browse live postings |
| **AI Analyst** | Groq + LLaMA3 chatbot — ask questions, get answers grounded in real data |

---

## Key Stats

| Metric | Value |
|--------|-------|
| Job postings processed | 1,000 |
| IT roles covered | 15 |
| Unique skills catalogued | 125 |
| Skill–role associations | 9,833 |
| Cities tracked | 24 |
| Salary percentiles | P25 / P50 / P75 / P90 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 · TypeScript · Tailwind CSS |
| Backend | FastAPI · SQLite · Python |
| NLP Pipeline | Custom skill extraction · regex + keyword matching |
| AI Chatbot | Groq API · LLaMA3 · live DB context |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Architecture

```
jobmarket-frontend/          ← This repo (Next.js 14 + TypeScript)
jobmarket-backend/           ← FastAPI + SQLite + NLP pipeline
    ├── main.py              ← API routes
    ├── scraper.py           ← Job data ingestion
    ├── nlp_extractor.py     ← Skill extraction pipeline
    ├── salary_engine.py     ← Percentile calculations
    └── chatbot.py           ← Groq LLM integration
```

---

## Running Locally

```bash
# 1. Clone the frontend
git clone https://github.com/aftabdayer/jobmarket-frontend.git
cd jobmarket-frontend

# 2. Install dependencies
npm install

# 3. Set environment variable
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 4. Run dev server
npm run dev
```

For the backend, see → [jobmarket-backend](https://github.com/aftabdayer/jobmarket-backend)

---

## Highlights

- **Percentile salary engine** — identifies roles paying 30–40% above market median across 24 cities
- **NLP extraction pipeline** — catalogued 125 unique skills from free-text job descriptions with zero manual labelling
- **LLM chatbot grounded in live data** — responses cite actual job counts and salary figures, not hallucinated generalities
- **Zero SQL for end users** — all insights accessible through the dashboard UI

---

## Author

**Aftab Dayer** · [LinkedIn](https://linkedin.com/in/aftabdayer) · [GitHub](https://github.com/aftabdayer)  
NIT Hamirpur 2025 · IEEE Published · Microsoft Power BI Certified (PL-300)
