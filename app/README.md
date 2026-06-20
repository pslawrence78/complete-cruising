# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application through Tranche 10, including the Ocean Luxe experience, Zod-backed canonical data and local Dexie persistence foundation.

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

The application renders a responsive Ocean Luxe dashboard, itinerary, Today view, ship handbook, port guidebook and three personal experience routes. Reusable guidebook records and sailing-specific records have separate strict schemas and version 1 Dexie tables. The validated, non-sensitive illustrative sample can be seeded, cleared and reset through repository-safe database utilities. Existing screens intentionally continue to use static presentation data until Tranche 11. No import is committed, no export file is created, and no backend, authentication, sync, live integration or PWA support is included.

Vite and Vitest use their runner-based configuration loader so validation remains compatible with restricted Windows workspaces without requiring broader filesystem access.

## GitHub Pages base path

Vite is configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for a future project-site deployment on GitHub Pages. The path may need revisiting if the app moves to a custom domain or a differently named repository. Routing and the deployment workflow remain intentionally deferred to later tranches.
