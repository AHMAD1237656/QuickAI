# QuickAI

QuickAI is a modern AI productivity SaaS platform that brings **10 useful AI-powered
tools** and a **Prompt Library** into a single, clean workspace. It ships with
authentication, a credit system, usage history, and Google Gemini integration,
built on a production-style three-tier architecture.

```
Next.js Frontend  →  Django REST API  →  FastAPI AI Microservice  →  Google Gemini
```

---

## Features

- 🔐 JWT-based authentication (register, login, token refresh, protected routes, change password)
- 🎁 10 free credits automatically granted on signup
- ⚡ 10 AI tools: Text Generator, Blog Writer, Email Writer, Summarizer, Grammar
  Checker, Paraphraser, Caption Generator, Hashtag Generator, Resume Assistant,
  Study Assistant
- 📚 **Prompt Library** — ready-made prompts across 6 categories (Blog Writing,
  Business, Email, Social Media, Study, Programming). Copy any prompt, or send
  it straight into the matching AI tool with one click.
- 💳 Real, database-backed credit system — 1 credit per successful generation,
  never deducted on failure, blocked at 0 credits
- 🕘 Per-user usage history (input, output, credits used, timestamp) with search,
  per-item delete, and clear-all
- 👤 Profile page with editable basic info and password change
- 📱 Fully responsive premium dashboard with a collapsible sidebar
- 🎨 Smooth, lightweight animated background (layered gradient orbs) across the
  entire site for a modern SaaS feel — pure CSS, no heavy 3D/WebGL library
- 🧠 Pluggable AI provider abstraction: **demo mode** (no key needed), **Gemini**
  (via the official `google-genai` SDK), or any OpenAI-compatible endpoint

---

## Tech Stack

| Layer            | Technology                                             |
|-------------------|--------------------------------------------------------|
| Frontend          | Next.js 16 (App Router), React, JavaScript, Tailwind CSS |
| Main Backend      | Python, Django 5.2, Django REST Framework, SimpleJWT   |
| AI Microservice   | FastAPI, Uvicorn, Pydantic, httpx, google-genai         |
| Database          | PostgreSQL                                              |
| AI Provider       | Google Gemini (default), or any OpenAI-compatible API   |

### Why three services?

- **Django** owns users, credits, and history — the durable business data.
- **FastAPI** is a small, focused service whose only job is talking to an AI
  provider. This keeps AI-provider concerns (keys, retries, prompt shaping)
  isolated from the main business API, and makes it easy to scale or swap the
  AI layer independently.

---

## Project Structure

```
QuickAI/
├── frontend/         # Next.js app (JavaScript, Tailwind CSS)
│   └── src/
│       ├── app/
│       │   ├── prompts/         # Prompt Library page
│       │   ├── tools/            # AI tools listing + 10 individual tool pages
│       │   ├── dashboard/, history/, profile/, login/, register/
│       ├── components/            # Sidebar, Navbar, ToolLayout, AnimatedBackground, ...
│       └── lib/                    # api.js (backend calls), tools.js, promptLibrary.js
├── backend/           # Django + DRF main API
│   ├── users/          # custom User model, auth, profile, change-password
│   ├── tools/           # AI tools registry + generate endpoint
│   ├── credits/          # credit balance endpoint
│   └── history/           # usage history (list / delete / clear)
├── ai-service/         # FastAPI AI microservice (demo / gemini / openai)
├── README.md
└── .gitignore
```

---

## Prerequisites (Windows)

- [Node.js 24.x](https://nodejs.org/) and npm
- [Python 3.12+](https://www.python.org/downloads/windows/)
- [PostgreSQL 17](https://www.postgresql.org/download/windows/)
- A Google Gemini API key (optional — the app runs fine in demo mode without one).
  Get one at https://aistudio.google.com/apikey

---

## 1. Database Setup (PostgreSQL)

Open **pgAdmin** or `psql` and create a database and user for QuickAI:

```sql
CREATE DATABASE quickai;
CREATE USER quickai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE quickai TO quickai_user;
```

---

## 2. Environment Variables

Copy each `.env.example` to `.env` and fill in real values. **Never commit
`.env` files** — they are already listed in `.gitignore`.

```powershell
copy backend\.env.example backend\.env
copy ai-service\.env.example ai-service\.env
copy frontend\.env.example frontend\.env.local
```

### `backend/.env`

| Variable        | Description                                      |
|------------------|---------------------------------------------------|
| `DEBUG`          | `True` for local development                      |
| `SECRET_KEY`     | Django secret key — generate a real one for prod   |
| `ALLOWED_HOSTS`  | Comma-separated hosts Django will serve            |
| `DB_NAME`/`DB_USER`/`DB_PASSWORD`/`DB_HOST`/`DB_PORT` | PostgreSQL connection |
| `CORS_ALLOWED_ORIGINS` | Origins allowed to call the API (frontend URL) |
| `AI_SERVICE_URL` | Base URL of the FastAPI service                    |

### `ai-service/.env`

| Variable         | Description                                                   |
|-------------------|----------------------------------------------------------------|
| `AI_PROVIDER`     | `demo` (no key needed), `gemini` (recommended), or `openai`    |
| `GEMINI_API_KEY`  | Your Gemini API key — used when `AI_PROVIDER=gemini`           |
| `GEMINI_MODEL`    | Gemini model name, e.g. `gemini-2.5-flash`                     |
| `AI_API_KEY`      | Generic key, used for `openai`, or as a fallback for Gemini     |
| `AI_MODEL`        | Generic model name, used for `openai`, or as a fallback         |
| `PORT`            | Reference only — the actual port is set on the uvicorn command  |

### `frontend/.env.local`

| Variable               | Description                          |
|-------------------------|---------------------------------------|
| `NEXT_PUBLIC_API_URL`   | Base URL of the Django backend        |

---

## 3. Run the Backend (Django)

Open a terminal (**Terminal 2** — Terminal 1 is your PostgreSQL server, already running as a Windows service):

```powershell
cd backend
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin access
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`.

## 4. Run the AI Microservice (FastAPI)

Open a new terminal (**Terminal 3**):

```powershell
cd ai-service
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

The AI service will be available at `http://127.0.0.1:8001` (interactive docs
at `http://127.0.0.1:8001/docs`). By default it runs in **demo mode** and
needs no API key. To use real Gemini responses, set in `ai-service/.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-2.5-flash
```

then restart this terminal.

## 5. Run the Frontend (Next.js)

Open a new terminal (**Terminal 4**):

```powershell
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Running All Four Together

| Terminal | Service      | URL                          |
|----------|--------------|-------------------------------|
| 1        | PostgreSQL   | `localhost:5432`              |
| 2        | Django       | `http://127.0.0.1:8000`       |
| 3        | FastAPI      | `http://127.0.0.1:8001`       |
| 4        | Next.js      | `http://localhost:3000`       |

Start them in this order (PostgreSQL first, then Django and FastAPI can start
in either order, frontend last). Then visit `http://localhost:3000`, register
an account, and you'll land in the dashboard with 10 free credits ready to use.

---

## How the Services Communicate

```
Browser
  ↓  fetch() using NEXT_PUBLIC_API_URL
Next.js Frontend
  ↓  HTTP + JWT
Django REST API  (checks auth, checks credits, saves history)
  ↓  HTTP, using AI_SERVICE_URL
FastAPI AI Service
  ↓  google-genai SDK
Google Gemini API
```

The frontend **never** calls FastAPI or Gemini directly, and the Gemini API
key only ever lives in `ai-service/.env` — it's never sent to the browser.

---

## Credit System

- Every new user starts with **10 credits**.
- Each successful AI generation costs **1 credit**.
- If a generation fails (AI service error, network issue, etc.), **no
  credit is deducted**.
- At 0 credits, the API returns `402 Payment Required` with the message:
  _"Insufficient credits. Please upgrade your plan or purchase more credits."_

## Usage History

- Every successful generation is saved with the tool, input, output, credits
  used, and timestamp.
- `GET /api/history/` — list your own history (never another user's).
- `DELETE /api/history/<id>/` — delete a single entry.
- `DELETE /api/history/clear/` — delete all of your history.
- The History page includes a client-side search box over tool name and input.

## Prompt Library

- Static, ready-made prompts organized into 6 categories: Blog Writing,
  Business, Email, Social Media, Study, and Programming.
- Defined in `frontend/src/lib/promptLibrary.js` — add new prompts there by
  appending to the `PROMPTS` array with a `category` and a `toolSlug` (the
  AI tool it should open in).
- Each prompt card supports **Copy** (clipboard) and **Use in AI Tools**,
  which navigates to `/tools/<tool-slug>?prompt=<the prompt text>` — the
  target tool page reads that query param and pre-fills its main input field.

## Animated Background

- `frontend/src/components/AnimatedBackground.js` renders a fixed, low-opacity
  layer of blurred, softly floating gradient orbs plus a faint dot-grid behind
  all page content, mounted once in the root layout so it's present site-wide.
- Implemented in pure CSS (Tailwind keyframe animations) rather than
  Three.js/WebGL, keeping it smooth and lightweight on low-end devices.
- Foreground cards and forms stay on opaque white/dark backgrounds, so the
  effect adds ambience without ever affecting readability.

## AI Provider Integration

`ai-service/services/ai_service.py` implements the provider abstraction:

- `AI_PROVIDER=demo` (default): returns clearly-labeled placeholder text so
  the entire platform works locally without any API key or cost.
- `AI_PROVIDER=gemini`: calls Google Gemini using the official `google-genai`
  SDK. Reads `GEMINI_API_KEY` / `GEMINI_MODEL` (falls back to the generic
  `AI_API_KEY` / `AI_MODEL` if those are set instead).
- `AI_PROVIDER=openai`: calls an OpenAI-compatible `/chat/completions`
  endpoint using `AI_API_KEY` and `AI_MODEL`.

To add another provider, add a new branch inside `generate_text()` — no
other code needs to change, since Django only ever talks to the FastAPI
`/ai/generate` endpoint.

---

## Deployment Notes

- **Frontend**: Vercel-compatible out of the box (`next build` / `next start`).
- **Backend & AI service**: these are long-running Python processes and are
  **not** deployable as Vercel serverless functions. They need a host that
  supports persistent processes/containers (e.g. Render, Railway, Fly.io, a
  VPS, or a container platform). Configure `AI_SERVICE_URL`,
  `CORS_ALLOWED_ORIGINS`, and database credentials via environment variables
  for whichever platform you choose — nothing is hardcoded.
- Set `DEBUG=False` and a real `SECRET_KEY` in production, and restrict
  `CORS_ALLOWED_ORIGINS`/`ALLOWED_HOSTS` to your real domains.
- Never commit a real `GEMINI_API_KEY` or `SECRET_KEY` — only `.env.example`
  files with placeholders are included in this project.

---

## API Overview

```
POST   /api/users/register/            Create an account (10 free credits)
POST   /api/users/login/               Obtain JWT access + refresh tokens
POST   /api/users/token/refresh/       Refresh an access token
GET    /api/users/profile/             Get the current user's profile
PATCH  /api/users/profile/             Update basic profile info
POST   /api/users/change-password/     Change the current user's password

GET    /api/tools/                     List all AI tools
POST   /api/tools/generate/            Run a tool (deducts 1 credit on success)

GET    /api/credits/                   Current credit balance and plan

GET    /api/history/                   The current user's generation history
DELETE /api/history/<id>/              Delete a single history entry
DELETE /api/history/clear/             Delete all of the user's history
```

The Prompt Library is a frontend-only feature (static data in
`lib/promptLibrary.js`) and does not have its own backend endpoints.

---

## License

This project is provided as a learning / portfolio / final-year-project
starting point. Adapt it freely for your own use.
