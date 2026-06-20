# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application scaffold, the Ocean Luxe shell, Dashboard v0.1, Itinerary v0.1, Today View v0.1 and the static-data Tranche 6 Ship Guide.

## Commands

Run these commands from `app/`:

```text
npm install
npm run dev
npm run typecheck
npm run build
npm run test
```

## Current scope

The application renders a responsive Ocean Luxe dashboard, route-led itinerary, operational Today view and premium Sun Princess ship handbook. All content comes from typed illustrative static data; Port and later routes remain placeholders, and no local database, live weather, import/export flow or PWA support is included.

Vite and Vitest use their runner-based configuration loader so validation remains compatible with restricted Windows workspaces without requiring broader filesystem access.

## GitHub Pages base path

Vite is configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for a future project-site deployment on GitHub Pages. The path may need revisiting if the app moves to a custom domain or a differently named repository. Routing and the deployment workflow remain intentionally deferred to later tranches.
