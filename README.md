# Resume Optimizer (Lumina Resume)

An AI-powered full-stack application that tailors resumes to a target job description by:
- parsing the JD and current resume,
- running skill/keyword gap analysis,
- asking targeted follow-up questions,
- optionally selecting relevant GitHub projects,
- generating an optimized resume,
- exporting final output as PDF or DOCX.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios, React Router
- **Backend:** FastAPI, Uvicorn, SQLAlchemy, Pydantic
- **AI:** Google Gemini (`google-genai`)
- **Document Processing:** `pdfplumber`, `fpdf2`, `python-docx`
- **Database:** SQLite (`sql_app.db`)

## Project Structure

```text
resume-optimizer/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routes/
│   │   │   └── api.py
│   │   └── services/
│   │       ├── jd_parser.py
│   │       ├── resume_parser.py
│   │       ├── gap_analysis.py
│   │       ├── question_generator.py
│   │       ├── github_analyzer.py
│   │       ├── resume_generator.py
│   │       ├── pdf_generator.py
│   │       └── docx_generator.py
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Features

- Upload JD file (`.pdf`/`.txt`) and resume (`.pdf`)
- Extract structured JD fields:
  - required skills
  - preferred skills
  - tools
  - ATS keywords
  - experience level
- Parse resume into structured sections:
  - skills, experience, projects, education
- Compute skill + keyword match percentage
- Generate contextual interview-like questions for missing areas
- Analyze GitHub profile repos and recommend top projects
- Generate ATS-optimized resume text using combined context
- Export output as PDF and DOCX
- Persist generation history in SQLite

## End-to-End Flow

1. User uploads JD + resume in the frontend.
2. Frontend calls backend endpoints:
   - `/api/parse-jd`
   - `/api/parse-resume`
3. Frontend requests gap analysis:
   - `/api/analyze-gap`
4. Frontend gets targeted questions:
   - `/api/generate-questions`
5. Optional GitHub project ranking:
   - `/api/analyze-github`
6. Final resume generation:
   - `/api/generate-resume`
7. Export:
   - `/api/export-pdf`
   - `/api/export-docx`

## Prerequisites

- Node.js 18+ (recommended 20+)
- Python 3.10+ (recommended 3.11+)
- A valid Google Gemini API key

## Environment Variables

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> The backend loads `.env` via `python-dotenv`.

## Local Setup

### 1) Backend

From `backend/`:

```bash
python -m venv .venv
```

Activate venv:

- **Windows (PowerShell)**  
  `.\.venv\Scripts\Activate.ps1`
- **macOS/Linux**  
  `source .venv/bin/activate`

Install dependencies:

```bash
pip install -r requirements.txt
```

Run API:

```bash
python run.py
```

Backend runs at: `http://localhost:8000`

### 2) Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Overview

Base URL: `http://localhost:8000/api`

- `POST /parse-jd`  
  Accepts `file` (optional) or `jd_text` (optional form field); returns structured JD parse.

- `POST /parse-resume`  
  Accepts resume PDF as `file`; returns structured resume parse.

- `POST /analyze-gap`  
  JSON input of JD skills, resume skills, ATS keywords; returns missing/matching sets + match %.

- `POST /generate-questions`  
  JSON input of missing skills and experience level; returns generated questions.

- `POST /analyze-github`  
  JSON input with GitHub profile URL + JD text; returns ranked repo recommendations.

- `POST /generate-resume`  
  JSON input combining JD, parsed resume, user answers, selected repos; returns generated resume text and history id.

- `POST /export-pdf`  
  Form input `text`; returns downloadable PDF bytes.

- `POST /export-docx`  
  Form input `text`; returns downloadable DOCX bytes.

- `GET /history`  
  Returns saved resume generation history from SQLite.

## Data Persistence

- SQLite DB file: `backend/sql_app.db`
- Table: `resume_history`
- Created automatically on backend startup.

## Important Notes

- Frontend API base URL is currently hardcoded to:
  - `http://localhost:8000/api`
  - file: `frontend/src/services/api.js`
- CORS is currently open (`allow_origins=["*"]`) for development.
- This repo currently includes virtual environment folders in `backend/` (`venv`/`.venv`), which is not recommended for source control.

## Troubleshooting

- **Gemini auth errors / empty AI output**
  - Verify `GEMINI_API_KEY` is set in `backend/.env`
  - Restart backend after changing `.env`

- **Frontend cannot call backend**
  - Ensure backend is running on port `8000`
  - Confirm API URL in `frontend/src/services/api.js`

- **PDF parsing issues**
  - Try a text-based PDF (not scanned image PDF)
  - Ensure file upload is valid and non-empty

- **PowerShell venv activation blocked**
  - Run:
    `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Security and Production Hardening (Recommended)

- Restrict CORS origins in `backend/app/main.py`
- Move API base URL to env-based config in frontend
- Add request limits and file size validation on upload
- Add backend auth/rate limiting for public deployment
- Do not commit `.env` files or local virtual environments

## Future Improvements

- Better JD parser support for `.docx` and richer normalization
- Better ATS scoring logic with weighting per role
- Editable resume sections before export
- Multi-template resume output formatting
- Unit/integration tests and CI pipeline
- Dockerized local and production setup

## License

Add your preferred license (MIT/Apache-2.0/etc.) in a `LICENSE` file.
