# Complete Cruising

Complete Cruising is a Lawrence Family Series progressive web app in development: a premium, local-first cruise companion for sailings, itinerary days, ship intelligence, port guidebook content, shore plans, family notes and memories.

The product follows the **Ocean Luxe** direction established by the standalone prototype. It is intended to feel like a personal cruise guidebook, not a generic administration interface.

## Project status

**Local-first application stage - Tranche 20: Cartographic Port Atlas and Map Context v0.1 complete.**

The repository contains the project foundations, governance, illustrative sample records, authoritative visual prototype, tested Ocean Luxe React experience, Zod-backed canonical data and a versioned Dexie/IndexedDB persistence foundation. The app defaults to the real local Sun Princess 2026 Eastern Mediterranean Cruise shell, with Day 1 to Day 15 generated for 2026-08-15 to 2026-08-29 and operational times left empty pending review. Tranche 20 adds a MapLibre-powered Port Atlas using a centralised OpenFreeMap no-key style configuration, visible attribution, approximate port-area coordinates, missing-coordinate fallback states and no geocoding, routing, weather overlays, geolocation or tile caching. The first returned ChatGPT shape, `complete-cruising-sailing-shell-enrichment-v1`, retains its safe sailing-level import mapper for enrichment runs and sections only. Live integrations remain deliberately deferred.

## Start here

- Read the [project knowledge index](docs/README.md) to find the authoritative source for each decision.
- Review the [standalone Ocean Luxe prototype](prototypes/v0.1/complete-cruising-prototype-v0.1.html) before making visual changes.
- Follow [AGENTS.md](AGENTS.md) for mandatory project-working rules.
- Use the [tranche plan](docs/build-plan/tranche-plan-v0.1.md) alongside the authoritative [Build Plan v0.1](docs/07-build-plan-v0.1.md).

## Repository structure

```text
complete-cruising/
|-- app/               Ocean Luxe React app through Tranche 20
|-- docs/              Product foundations, decisions and delivery plans
|-- enrichment/        Prompt, staged-import and reviewed-output workspaces
|-- prototypes/        Preserved visual reference artefacts
`-- samples/           Illustrative sailing, ship and port records
```

## Current artefacts

- Product Specification v0.1
- Enrichment Framework v0.1
- Data Model v0.1
- Visual Experience Brief v0.1
- HTML Prototype Specification v0.1
- Technical Architecture v0.1
- Build Plan v0.1
- Ocean Luxe standalone HTML prototype at `prototypes/v0.1/complete-cruising-prototype-v0.1.html`

## Development approach

Work proceeds in small, independently reviewable tranches. The MVP direction is a visually rich, local-first static PWA suitable for GitHub Pages, with structured and reviewable data flows rather than live external integrations.

Sample data must remain illustrative and must never include sensitive family information, booking references, cabin details, passport data, insurance data, addresses or other private details.

The app can be installed and validated from `app/`; see [app/README.md](app/README.md) for commands and the GitHub Pages base-path decision. The recommended next tranche is **Tranche 21: Cruise Weather Intelligence v0.1**.
