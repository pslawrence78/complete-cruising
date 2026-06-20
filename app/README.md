# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application through Tranche 8, including the Ocean Luxe shell, core cruise views, Naples Shore Plans, Family Guide, Memories and Adventure Almanac export preview.

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

The application renders a responsive Ocean Luxe dashboard, itinerary, Today view, ship handbook, port guidebook and three personal experience routes. Shore plans and memories are sailing-specific illustrative data; Family Guide content is family-focused presentation of reusable Naples context. No data is persisted, no export file is created, and no local database, live integration or PWA support is included.

Vite and Vitest use their runner-based configuration loader so validation remains compatible with restricted Windows workspaces without requiring broader filesystem access.

## GitHub Pages base path

Vite is configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for a future project-site deployment on GitHub Pages. The path may need revisiting if the app moves to a custom domain or a differently named repository. Routing and the deployment workflow remain intentionally deferred to later tranches.
