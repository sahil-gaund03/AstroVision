# AstroVision ExoLab AI

AI-Powered NASA Astronomy Explorer + Exoplanet Discovery Dashboard.

AstroVision ExoLab AI is a full-stack astronomy dashboard that combines NASA imagery, Mars rover photos, near-Earth asteroid tracking, NASA Exoplanet Archive analytics, a 3D solar system view, educational ML scoring, and an AI astronomy assistant.

The frontend never calls NASA, Gemini, or OpenAI directly. It talks only to the FastAPI backend, which owns all provider keys and returns bundled fallback data when an upstream service or key is unavailable.

## Features

- NASA Explorer: APOD, Mars rover photos, and NASA image-library search.
- Exoplanets: confirmed planet data from NASA Exoplanet Archive TAP, search, stats, and habitability scoring.
- Asteroids: upcoming near-Earth objects, hazard flags, and educational risk scoring.
- Solar System: interactive React Three Fiber / Three.js scene with a non-WebGL fallback.
- AI Assistant: Gemini or OpenAI-backed chat with offline fallback responses.
- Favorites, loading states, error states, empty states, and live/demo data badges.

## Architecture

```text
frontend/        Next.js 14 App Router, TypeScript, Tailwind CSS
backend/         FastAPI, Pydantic, httpx, Python services and ML scorers
data/samples/    fallback JSON/CSV datasets
docs/            API, workflow, design, PRD, and TRD notes
```

Required routes:

```text
/
/dashboard
/nasa-explorer
/exoplanets
/asteroids
/solar-system
/assistant
```

Required backend endpoints:

```text
GET  /health
GET  /api/nasa/apod
GET  /api/nasa/apod?date=YYYY-MM-DD
GET  /api/nasa/mars-rover
GET  /api/nasa/images/search?q=galaxy
GET  /api/asteroids/upcoming
GET  /api/asteroids/risk-score
GET  /api/exoplanets/confirmed
GET  /api/exoplanets/stats
GET  /api/exoplanets/search?q=kepler
GET  /api/exoplanets/habitability-score
POST /api/assistant/chat
GET  /api/solar-system/planets
GET  /api/favorites
POST /api/favorites
DELETE /api/favorites/{id}
```

## Local Setup

Prerequisites:

- Node.js 20.9+
- Python 3.11+

Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health
- Backend docs: http://localhost:8000/docs

## Environment Variables

`backend/.env`:

```env
NASA_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
DATABASE_URL=sqlite:///./astrovision.db
ENVIRONMENT=development
CORS_ORIGINS=
```

`frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Only `NEXT_PUBLIC_BACKEND_URL` belongs in frontend env. Do not put NASA, Gemini, or OpenAI keys in `NEXT_PUBLIC_*` variables.

## API Key Setup

NASA API:

- Get a key from NASA Open APIs: https://api.nasa.gov/
- Used for APOD, Mars Rover Photos, and NeoWs Asteroids.
- Store it in `backend/.env` as `NASA_API_KEY`.

NASA Exoplanet Archive:

- No API key required.
- The backend uses the TAP service for confirmed exoplanet data.

Gemini API:

- Get a key from Google AI Studio: https://aistudio.google.com/
- Store it in `backend/.env` as `GEMINI_API_KEY`.

OpenAI API:

- Get a key from OpenAI Platform: https://platform.openai.com/
- Store it in `backend/.env` as `OPENAI_API_KEY`.

Use either Gemini or OpenAI for the AI assistant. Both are not required. If both are blank, the backend returns offline fallback responses.

## Fallback Data

Fallback datasets live in `data/samples/`:

- `apod_sample.json`
- `nasa_images_sample.json`
- `asteroids_sample.json`
- `exoplanets_sample.csv`
- `solar_system_planets.json`

When NASA, the Exoplanet Archive, or an AI provider fails or is unavailable, affected API responses include `"fallback": true` where fallback data is used.

## Security Notes

- Provider keys are backend-only.
- `.env`, `.env.local`, logs, local databases, build outputs, and dependency folders are ignored.
- CORS allows localhost in development and uses `FRONTEND_URL` / `CORS_ORIGINS` in production.
- Production must not use wildcard CORS origins.
- Backend validation rejects invalid dates, rover/camera names, search lengths, assistant context types, and unreasonable scoring inputs.
- Backend errors return safe messages and do not expose stack traces to clients.
- Third-party HTTP INFO logs are suppressed to avoid logging provider query strings.

## Verification Commands

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
```

Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m compileall app
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API smoke checks:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/nasa/apod
curl "http://localhost:8000/api/nasa/images/search?q=galaxy"
curl http://localhost:8000/api/asteroids/upcoming
curl http://localhost:8000/api/exoplanets/confirmed
curl http://localhost:8000/api/exoplanets/stats
curl http://localhost:8000/api/solar-system/planets
```

Assistant check:

```bash
curl -X POST http://localhost:8000/api/assistant/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Explain exoplanets\",\"context_type\":\"general\"}"
```

## Deployment

### Frontend on Vercel

- Root directory: `frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Output: Next.js default
- Environment variables:
  - `NEXT_PUBLIC_BACKEND_URL=https://your-backend.example.com`

After deploy, open the Vercel URL and confirm the dashboard can reach the backend health endpoint.

### Backend on Render or Railway

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables:
  - `NASA_API_KEY`
  - `GEMINI_API_KEY` or `OPENAI_API_KEY`
  - `FRONTEND_URL=https://your-vercel-app.vercel.app`
  - `BACKEND_URL=https://your-backend.example.com`
  - `DATABASE_URL=sqlite:///./astrovision.db`
  - `ENVIRONMENT=production`
  - `CORS_ORIGINS=https://your-vercel-app.vercel.app`

After deploy, verify:

```bash
curl https://your-backend.example.com/health
```

Then set `NEXT_PUBLIC_BACKEND_URL` in Vercel to that backend URL and redeploy the frontend.

## Docker

```bash
docker compose up --build
```

The compose file builds both services and mounts `data/` read-only for backend fallback datasets.

## Notes

The asteroid risk score and exoplanet habitability score are educational heuristics. They are not official NASA hazard assessments or scientifically validated habitability models.
