# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application through Tranche 11, including the Ocean Luxe experience, Zod-backed canonical data and local Dexie persistence.

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

The application renders a responsive Ocean Luxe dashboard, itinerary, Today view, ship handbook, port guidebook and three personal experience routes. Reusable guidebook records and sailing-specific records retain separate strict schemas and version 1 Dexie tables. The active sailing comes from local app settings; feature hooks subscribe to repository queries and map records into clean visual view models. Static presentation fixtures are no longer used as runtime screen data and remain only as type-bearing legacy fixtures, canonical seed material or tests. No import preview or commit is implemented, no export file is created, and no backend, authentication, sync, live integration or PWA support is included.

Vite and Vitest use their runner-based configuration loader so validation remains compatible with restricted Windows workspaces without requiring broader filesystem access.

## GitHub Pages base path

Vite is configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for a future project-site deployment on GitHub Pages. The path may need revisiting if the app moves to a custom domain or a differently named repository. Routing and the deployment workflow remain intentionally deferred to later tranches.
