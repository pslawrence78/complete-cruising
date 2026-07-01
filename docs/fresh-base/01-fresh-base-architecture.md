# Fresh-Base Architecture

## Runtime shape

The fresh base is a static React + TypeScript + Vite application using one bundled cruise data module and hash-based routing.

## Data rule

The runtime reads from `app/src/data/sunPrincess2026.ts`. Cruise facts live in static code, not in a browser-managed database.

## UI rule

Components render static cruise view models through lightweight helper services. They do not own cruise facts directly.

## Deferred items

- weather integration
- offline caching hardening
- persistent memories
- post-cruise backlog features
