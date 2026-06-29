# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application through Tranche 24, including the Ocean Luxe experience, Zod-backed canonical data, local Dexie persistence, production PWA app-shell readiness, GitHub Pages deployment readiness, production-smoke release hardening, real Sun Princess 2026 onboarding, guarded Data Safety, managed sailing setup, governed enrichment request generation, six-type return-schema import routing, MVP cruise usability polish, the Cartographic Port Atlas, the cruise weather intelligence layer, trust-aware manual Open-Meteo refresh, the derived day-readiness surfaces and a preferred-snapshot weather review flow with local audit events.

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

The application renders a responsive Ocean Luxe dashboard, itinerary, Today view, ship handbook, port guidebook, three personal experience routes, a guided sailing setup workflow, a guidebook tools workbench, a premium Import / Export workbench, a Weather Review route and a guarded Data Safety area. Reusable guidebook records and sailing-specific records retain separate strict schemas and version 3 weather snapshot review persistence. The default onboarding path selects or creates the real Eastern Mediterranean Cruise on Sun Princess for 2026-08-15 to 2026-08-29, generates 15 itinerary rows and leaves arrival, departure and all-aboard fields empty until reviewed. Ports and Itinerary now include a MapLibre-powered Port Atlas using the no-key OpenFreeMap Liberty style, centralised attribution/configuration and approximate port-area coordinates for visual orientation only. Tranche 21 adds local weather intelligence with Open-Meteo forecast and archive refreshes, route badges, Today and port weather cards, itinerary weather chips, weather states and local snapshot persistence. Tranche 21A adds an existing-sailing management surface with edit/archive/delete guardrails, a shared six-type enrichment request catalogue, governed JSON-only prompt exports, and safe preview/commit routing for sailing shell, itinerary, ship pack, port pack, day guide and shore plan imports. Tranche 22 adds a derived conditions feature that scores day readiness from existing itinerary, weather, day-guide and shore-plan records and surfaces that assessment on Dashboard, Today and Itinerary without writing new data. Tranche 23 refines weather into a manual-only Open-Meteo flow with visit-date forecast, weather-now-in-port, same-day-check and forecast-pending distinctions plus explicit attribution and trusted-snapshot protection. Tranche 24 fixes sea-day wording, preserves every stored weather snapshot, keeps primary screens on the explicit preferred pointer and records audit events whenever the preferred snapshot is changed or a conflict is acknowledged. Ship and port governed returns currently commit reusable enrichment runs and sections only, leaving broader patch proposals review-led. Static presentation fixtures remain available as sample/demo material but no longer lead the primary runtime flow when the real sailing exists. No backend, authentication, sync, geocoding, route calculation, browser geolocation or offline map tiles are included.

Vite and Vitest use their runner-based configuration loader so validation remains compatible with restricted Windows workspaces without requiring broader filesystem access.

## GitHub Pages base path

Vite and the web app manifest are configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for the GitHub Pages deployment at `https://pslawrence78.github.io/complete-cruising/`.

Routing remains hash-based, so URLs such as `/complete-cruising/#/itinerary`, `/complete-cruising/#/sailing-setup`, `/complete-cruising/#/enrichment-requests`, `/complete-cruising/#/import-export` and `/complete-cruising/#/data-management` are static-host safe without a Pages 404 fallback.

The GitHub Actions workflow at `../.github/workflows/deploy.yml` installs with `npm ci`, runs typecheck, tests and build, uploads `app/dist`, then deploys through GitHub Pages Actions. In the GitHub repository settings, Pages should be configured to use **GitHub Actions** as the source.

The Tranche 16 production-smoke record is documented at `../docs/16-production-smoke-test-and-release-hardening-v0.1.md`.

The path may need revisiting if the app moves to a differently named repository or a custom-domain root. A future custom domain under `/complete-cruising/` should continue to work with the current base path.
