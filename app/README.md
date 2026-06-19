# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application scaffold, the Ocean Luxe shell and the static-data Tranche 3 dashboard.

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

The application renders a responsive Ocean Luxe dashboard with a cinematic sailing hero, representative route ribbon, voyage metrics and readiness cards. Dashboard content comes from typed illustrative static data; all other routes remain placeholders, and no local database, import/export flow or PWA support is included.

Vite and Vitest use their runner-based configuration loader so validation remains compatible with restricted Windows workspaces without requiring broader filesystem access.

## GitHub Pages base path

Vite is configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for a future project-site deployment on GitHub Pages. The path may need revisiting if the app moves to a custom domain or a differently named repository. Routing and the deployment workflow remain intentionally deferred to later tranches.
