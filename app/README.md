# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application through Tranche 15, including the Ocean Luxe experience, Zod-backed canonical data, local Dexie persistence, production PWA app-shell readiness and GitHub Pages deployment readiness.

## Commands

Run these commands from `app/`:

```text
npm install
npm run dev
npm run typecheck
npm run build
npm run test
npm run preview -- --host 127.0.0.1
```

## Current scope

The application renders a responsive Ocean Luxe dashboard, itinerary, Today view, ship handbook, port guidebook, three personal experience routes and a premium Import / Export workbench. Reusable guidebook records and sailing-specific records retain separate strict schemas and version 1 Dexie tables. The active sailing comes from local app settings; feature hooks subscribe to repository queries and map records into clean visual view models. Static presentation fixtures are no longer used as runtime screen data and remain only as type-bearing legacy fixtures, canonical seed material or tests. Production builds include install metadata, icon placeholders, service-worker registration, static app-shell caching and a visible offline readiness indicator. No backend, authentication, sync or live integration is included.

Vite and Vitest use their runner-based configuration loader so validation remains compatible with restricted Windows workspaces without requiring broader filesystem access.

## GitHub Pages base path

Vite and the web app manifest are configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for the GitHub Pages deployment at `https://pslawrence78.github.io/complete-cruising/`.

Routing remains hash-based, so URLs such as `/complete-cruising/#/itinerary` and `/complete-cruising/#/import-export` are static-host safe without a Pages 404 fallback.

The GitHub Actions workflow at `../.github/workflows/deploy.yml` installs with `npm ci`, runs typecheck, tests and build, uploads `app/dist`, then deploys through GitHub Pages Actions. In the GitHub repository settings, Pages should be configured to use **GitHub Actions** as the source.

The path may need revisiting if the app moves to a differently named repository or a custom-domain root. A future custom domain under `/complete-cruising/` should continue to work with the current base path.
