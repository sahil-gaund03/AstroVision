# API Documentation — AstroVision ExoLab AI

Base URL: `http://localhost:8000` · Interactive docs: `/docs` (Swagger), `/redoc`.

All list/data responses include a boolean `fallback` indicating whether sample data was
used (live upstream failed or key missing). Errors return `{ "detail": "..." }`.

---

## Health

### `GET /health`
```json
{ "status": "ok", "app": "AstroVision ExoLab AI", "version": "1.0.0",
  "nasa_key_configured": false, "ai_key_configured": false }
```

---

## NASA

### `GET /api/nasa/apod?date=YYYY-MM-DD`
`date` optional, must be valid and not in the future.
```json
{ "date": "2024-01-15", "title": "...", "explanation": "...",
  "media_type": "image", "url": "...", "hdurl": "...", "copyright": "...",
  "fallback": false }
```

### `GET /api/nasa/mars-rover?rover=curiosity&sol=1000&camera=NAVCAM`
```json
{ "rover": "Curiosity", "photos": [
  { "id": 102693, "img_src": "...", "earth_date": "2024-01-15",
    "rover": "Curiosity", "camera": "NAVCAM" } ], "fallback": false }
```

### `GET /api/nasa/images/search?q=galaxy`
```json
{ "query": "galaxy", "items": [
  { "nasa_id": "PIA15985", "title": "...", "description": "...",
    "date_created": "...", "media_type": "image",
    "thumbnail": "...", "image": "..." } ], "fallback": false }
```

---

## Asteroids

### `GET /api/asteroids/upcoming`
Returns the NeoWs feed for the next 7 days, enriched with risk scores, sorted by risk.
```json
{ "element_count": 20, "asteroids": [
  { "id": "54016455", "name": "(2020 SW)", "close_approach_date": "2024-09-04",
    "estimated_diameter_km": 1.35, "relative_velocity_kph": 78900.0,
    "miss_distance_km": 1950000.0, "is_potentially_hazardous": true,
    "absolute_magnitude_h": 18.2, "risk_score": 100, "risk_level": "Critical",
    "explanation": "..." } ], "fallback": false }
```

### `GET /api/asteroids/risk-score`
Query params: `estimated_diameter_km`, `relative_velocity_kph`, `miss_distance_km`,
`is_potentially_hazardous`.
```json
{ "risk_score": 100, "risk_level": "Critical", "explanation": "..." }
```

---

## Exoplanets

### `GET /api/exoplanets/confirmed?limit=100`
### `GET /api/exoplanets/search?q=kepler&limit=100`
```json
{ "count": 100, "exoplanets": [
  { "planet_name": "Kepler-22 b", "host_star": "Kepler-22",
    "discovery_method": "Transit", "discovery_year": 2011,
    "planet_radius_earth": 2.38, "planet_mass_earth": 9.1,
    "orbital_period_days": 289.86, "stellar_temperature": 5518,
    "stellar_radius": 0.98, "equilibrium_temperature": 262,
    "habitability_score": 70, "habitability_category": "Promising",
    "explanation": "...", "missing_data_warning": null } ],
  "fallback": false }
```

### `GET /api/exoplanets/stats`
```json
{ "total": 300, "discovery_methods": { "Transit": 240, "Radial Velocity": 48 },
  "discoveries_by_year": { "2014": 12, "2015": 30 },
  "avg_radius_earth": 2.71, "avg_orbital_period_days": 84.3, "fallback": false }
```

### `GET /api/exoplanets/habitability-score`
Query params: `planet_radius_earth`, `planet_mass_earth`, `orbital_period_days`,
`stellar_temperature`, `equilibrium_temperature` (all optional).
```json
{ "habitability_score": 70, "category": "Promising",
  "explanation": "...", "missing_data_warning": null }
```

---

## Assistant

### `POST /api/assistant/chat`
```json
// request
{ "message": "Could Kepler-22 b support life?",
  "context_type": "exoplanet", "context_data": {} }
// response
{ "reply": "...", "mode": "fallback", "context_used": false }
```
`message`: 1–2000 chars. `mode` is `"ai"` when a Gemini/OpenAI key is configured,
otherwise `"fallback"`.

---

## Solar System

### `GET /api/solar-system/planets`
```json
{ "star": { "name": "Sun", "type": "G-type main-sequence (G2V)",
    "radius_km": 696340, "color": "#fdb813" },
  "planets": [ { "name": "Earth", "color": "#4f93d6", "radius_km": 6371,
    "distance_au": 1.0, "orbital_period_days": 365, "rotation_period_hours": 24,
    "moons": 1, "type": "Terrestrial", "fact": "..." } ], "fallback": false }
```

---

## Favorites (in-memory)

### `GET /api/favorites`
### `POST /api/favorites`  `{ "type": "exoplanet", "title": "Kepler-22 b", "payload": {} }`
### `DELETE /api/favorites/{id}`
```json
{ "id": "uuid", "type": "exoplanet", "title": "Kepler-22 b", "payload": {} }
```
