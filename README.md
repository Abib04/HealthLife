# HealthLife — Digital Endurance Self-Coaching MVP

A runnable frontend MVP based on the **Digital Endurance Self-Coaching Platform** blueprint.

## Included vertical slice

- Daily coaching dashboard and race countdown
- Weekly training plan with completion state
- Activity logging: type, distance, duration, RPE
- Planned vs actual weekly volume and completion signals
- Training preparation/progress page
- Athlete profile and assessment restriction visibility
- Persistent browser state through `localStorage`

## Run

```bash
npm ci
npm run dev
```

Use Node.js 22.12+ (tested with Node.js 24.11.1 and npm 11.17.0).
Open the URL emitted by Vite, normally `http://localhost:5173/healthlife/`.
The project source is intended to live at the repository root.

## Build

```bash
npm run build
npm run preview
```

Preview at the URL printed by Vite, normally `http://localhost:4173/healthlife/`.
The production output is `dist/` and includes a PWA manifest and generated service worker.
Serve over HTTPS (or localhost) for PWA installation. The deployment path is configured
as `/healthlife/` in `vite.config.js`; update `base`, manifest `start_url`, and `scope`
when hosting at a different path. GitHub Pages is not configured by this repository.
Dependencies, build output, APK bundles, and credentials are excluded from version control.

## Scope note

This is a UI-first local MVP. It uses seeded athlete/training data and browser storage, with no authentication, server API, or medical decision-making. The coaching rule and training-preparation disclaimer implement the blueprint's safety boundary.

## Next production slice

Replace localStorage with a backend/API, introduce user auth and a relational model for goals, plans, sessions, activities, weekly reviews, and documented rule-based adjustments.
