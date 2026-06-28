# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application through Tranche 19, including the Ocean Luxe experience, Zod-backed canonical data, local Dexie persistence, production PWA app-shell readiness, GitHub Pages deployment readiness, production-smoke release hardening, real Sun Princess 2026 onboarding, guarded Data Safety, sailing setup date generation, enrichment request generation, the first sailing-level return-schema import mapper and MVP cruise usability polish.

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

The application renders a responsive Ocean Luxe dashboard, itinerary, Today view, ship handbook, port guidebook, three personal experience routes, a guided sailing setup workflow, a guidebook tools workbench, a premium Import / Export workbench and a guarded Data Safety area. Reusable guidebook records and sailing-specific records retain separate strict schemas and version 1 Dexie tables. The default onboarding path selects or creates the real Eastern Mediterranean Cruise on Sun Princess for 2026-08-15 to 2026-08-29, generates 15 itinerary rows and leaves arrival, departure and all-aboard fields empty until reviewed. The primary cruise screens now present a more polished MVP: Dashboard uses active-sailing voyage copy and a live countdown, Today has a pre-cruise companion state, Itinerary labels port calls and pending times clearly, and Ports/Ship use guidebook-rich pending and partial states. The Import / Export workbench can safely commit `complete-cruising-sailing-shell-enrichment-v1` as sailing-level enrichment run and section records only; it does not update itinerary, port, timing or protected booking fields. Static presentation fixtures remain available as sample/demo material but no longer lead the primary runtime flow when the real sailing exists. No backend, authentication, sync or live integration is included.

Vite and Vitest use their runner-based configuration loader so validation remains compatible with restricted Windows workspaces without requiring broader filesystem access.

## GitHub Pages base path

Vite and the web app manifest are configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for the GitHub Pages deployment at `https://pslawrence78.github.io/complete-cruising/`.

Routing remains hash-based, so URLs such as `/complete-cruising/#/itinerary`, `/complete-cruising/#/sailing-setup`, `/complete-cruising/#/enrichment-requests`, `/complete-cruising/#/import-export` and `/complete-cruising/#/data-management` are static-host safe without a Pages 404 fallback.

The GitHub Actions workflow at `../.github/workflows/deploy.yml` installs with `npm ci`, runs typecheck, tests and build, uploads `app/dist`, then deploys through GitHub Pages Actions. In the GitHub repository settings, Pages should be configured to use **GitHub Actions** as the source.

The Tranche 16 production-smoke record is documented at `../docs/16-production-smoke-test-and-release-hardening-v0.1.md`.

The path may need revisiting if the app moves to a differently named repository or a custom-domain root. A future custom domain under `/complete-cruising/` should continue to work with the current base path.
