# User Workflow — AstroVision ExoLab AI

## Entry: Landing Page (`/`)
1. User arrives at the cinematic landing page (hero, mission cards, timeline).
2. Pill navbar links and CTAs route into the dashboard app.
3. "Launch Dashboard" / module cards → internal pages.

## Dashboard (`/dashboard`)
1. On load, four requests fire in parallel (`Promise.allSettled`): APOD, latest imagery,
   asteroid alerts, exoplanet stats. A failure in one does not break the others.
2. User sees the APOD preview, discovery-method chart, top asteroid alerts, image grid.
3. "AI Space Summary" opens the assistant modal for a quick overview.
4. Module cards deep-link into each feature.

## NASA Explorer (`/nasa-explorer`)
1. **APOD tab:** view today's image; pick a date; click image to zoom; favorite it;
   "AI Explain" for a plain-language description.
2. **Mars Rover tab:** choose rover + camera, Apply → gallery; click to zoom.
3. **Image Search tab:** type a query → results grid; favorite; zoom modal with AI explain.

## Exoplanets (`/exoplanets`)
1. On load, confirmed planets + stats load; charts render (method, radius, year).
2. User searches by planet/host star; clicks a row to select.
3. Detail card shows physical params + habitability score/category + AI explanation.
4. A disclaimer notes scores are educational approximations.

## Asteroids (`/asteroids`)
1. NeoWs 7-day feed loads, sorted by risk; summary tiles + risk-level chart render.
2. User selects an object → detail card with diameter/velocity/miss-distance/hazard.
3. "AI Risk Explanation" explains the score in plain language.

## 3D Solar System (`/solar-system`)
1. Animated orrery renders with all 8 planets on relative orbits.
2. User adjusts the speed slider, clicks the orbit area to pause/resume.
3. Clicking a planet (or pill) opens its info panel + "AI Planet Explanation".

## AI Assistant (`/assistant`)
1. User picks a context (general/apod/mars/exoplanet/asteroid/planet).
2. User types or clicks a suggested prompt.
3. Each assistant reply shows an **AI** or **Offline Demo** badge based on mode.
4. Errors surface inline if the backend is unreachable.

## States Everywhere
- **Loading:** spinner with a contextual label.
- **Error:** message + Retry button.
- **Empty:** friendly icon + message.
- **Demo/Live badges:** indicate whether data is live or fallback.
