# Product Requirements Document — AstroVision ExoLab AI

## 1. Vision
A cinematic, research-grade web platform that makes NASA's open astronomy data
explorable and understandable for students, enthusiasts, and recruiters — unifying
imagery, exoplanets, asteroids, a 3D solar system, and an AI assistant in one premium
dark space-tech experience.

## 2. Target Users
- **Space enthusiasts & students** wanting an engaging way to browse NASA data.
- **Educators** needing clear, beginner-friendly explanations and visualizations.
- **Recruiters / reviewers** evaluating full-stack + data + AI integration skills.

## 3. Goals
- Integrate real NASA data sources with graceful demo-data fallback.
- Provide educational ML scoring for asteroid risk and exoplanet habitability.
- Offer an AI assistant that explains objects in plain language.
- Deliver a visually striking, responsive, premium UI.

## 4. Core Features
| # | Feature | Description |
|---|---------|-------------|
| 1 | Cinematic landing | Hero, glassmorphism, scroll-reveal, mission cards, timeline |
| 2 | Dashboard | APOD, latest imagery, asteroid alerts, exoplanet stats, AI summary |
| 3 | NASA Explorer | APOD + date picker, Mars rover gallery, image search, modal, favorites |
| 4 | Exoplanets | Table, search, charts, habitability scoring, AI explanation |
| 5 | Asteroids | NeoWs feed, risk scoring, hazard flags, charts, AI explanation |
| 6 | 3D Solar System | Interactive orrery, clickable planets, speed control, data panel |
| 7 | AI Assistant | Chat, suggested prompts, context selector, AI/fallback modes |

## 5. Non-Functional Requirements
- **Resilience:** every external call has a fallback; no single failure breaks a page.
- **Security:** API keys backend-only, never logged, CORS-restricted, inputs validated.
- **Performance:** async backend calls, lightweight dependency-free charts.
- **Accessibility:** semantic markup, keyboard-focusable controls, sufficient contrast.
- **Responsiveness:** mobile → desktop layouts for all pages.

## 6. Success Metrics
- All pages render with live data OR clearly-badged demo data.
- Backend health endpoint green; all documented endpoints return 200.
- Frontend production build passes with zero type errors.

## 7. Out of Scope (v1)
- User authentication and persistent multi-user storage.
- Real WebGL/Three.js solar system with textures (CSS/SVG orrery used instead).
- Streaming AI responses.

## 8. Disclaimers
ML scores are **educational approximations**, not official NASA hazard assessments or
scientifically validated habitability models.
