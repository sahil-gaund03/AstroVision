# Technical Requirements Document — AstroVision ExoLab AI

## 1. System Architecture
```
Browser ──HTTP──▶ Next.js 14 (frontend, SSR/CSR)
                      │  fetch (NEXT_PUBLIC_BACKEND_URL)
                      ▼
                 FastAPI (backend)  ──▶ NASA APIs / Exoplanet Archive / AI providers
                      │                     (secrets backend-only)
                      ▼
                 data/samples/ (fallback JSON + CSV)
```
The frontend talks **only** to the backend. The backend owns all secrets and normalizes
every response into a stable shape with a `fallback` flag.

## 2. Frontend
- **Framework:** Next.js 14 App Router, TypeScript, Tailwind CSS 3.4.
- **Routing:** `/` (landing), `/dashboard`, `/nasa-explorer`, `/exoplanets`,
  `/asteroids`, `/solar-system`, `/assistant`.
- **API client:** `lib/api.ts` — centralized `request<T>()` with `no-store`, typed
  methods, `ApiError`, query-string builder. Domain re-exports in `lib/{nasa,asteroids,
  exoplanets,assistant}.ts`.
- **Components:** `ui/` (GlassCard, Badges, States), `layout/DashboardShell`,
  `charts/BarChart`, `three/Orrery`, `assistant/AIExplain`, landing `Navbar` +
  `MissionsGrid`.
- **Animations:** custom keyframes in `globals.css` + Tailwind config; scroll-reveal via
  IntersectionObserver client component.

## 3. Backend
- **Framework:** FastAPI + Pydantic v2 + httpx (async) + Uvicorn.
- **Layers:** `api/` (routers) → `services/` (integration + fallback) → `ml/` (scoring)
  / `schemas/` (Pydantic) / `core/` (config, cors, logging, rate limit, security) /
  `utils/` (api_client, fallback_loader, validators).
- **Config:** `pydantic-settings` loads `.env`; `NASA_API_KEY` falls back to `DEMO_KEY`.
- **Resilience:** `api_client` enforces a 12s timeout and raises `UpstreamError`; each
  service catches it and loads sample data, setting `fallback: true`.
- **Middleware:** CORS (restricted origins) + in-memory rate limiter (120 req/60s/IP).

## 4. Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Status + key-configured flags |
| GET | `/api/nasa/apod[?date=]` | Astronomy Picture of the Day |
| GET | `/api/nasa/mars-rover[?rover&sol&camera]` | Mars rover photos |
| GET | `/api/nasa/images/search?q=` | NASA image library search |
| GET | `/api/asteroids/upcoming` | NeoWs 7-day feed + risk scores |
| GET | `/api/asteroids/risk-score?...` | Score a single asteroid |
| GET | `/api/exoplanets/confirmed[?limit]` | Confirmed exoplanets |
| GET | `/api/exoplanets/stats` | Aggregate statistics |
| GET | `/api/exoplanets/search?q=` | Search exoplanets |
| GET | `/api/exoplanets/habitability-score?...` | Score habitability |
| POST | `/api/assistant/chat` | AI assistant (ai/fallback) |
| GET | `/api/solar-system/planets` | Planetary dataset |
| GET/POST/DELETE | `/api/favorites[/{id}]` | Favorites CRUD |

## 5. Data Normalization
- **Exoplanets:** raw TAP cols (`pl_name`, `pl_rade`, …) → normalized fields
  (`planet_name`, `planet_radius_earth`, …) + habitability score.
- **Asteroids:** NeoWs nested JSON → flat fields + risk score, sorted by risk desc.

## 6. ML Scoring
- `ml/asteroid_risk_score.py` and `ml/habitability_score.py` — pure functions, clamped
  0–100, returning score + level/category + explanation (+ missing-data warning).

## 7. Security
- Secrets only in `backend/.env`; query strings stripped before logging.
- Pydantic validation + custom validators (date format, query length, safe float parse).
- Frontend exposes only `NEXT_PUBLIC_BACKEND_URL`.

## 8. Tooling / Versions
- Node 18+, Python 3.11+ (tested on 3.14 with relaxed pins).
- Dependency-free charts and CSS/SVG orrery to keep the build lean.
