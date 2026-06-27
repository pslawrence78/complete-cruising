# Complete Cruising

Complete Cruising is a Lawrence Family Series progressive web app in development: a premium, local-first cruise companion for sailings, itinerary days, ship intelligence, port guidebook content, shore plans, family notes and memories.

The product follows the **Ocean Luxe** direction established by the standalone prototype. It is intended to feel like a personal cruise guidebook, not a generic administration interface.

## Project status

**Local-first application stage - Tranche 14: PWA and Offline Readiness v0.1 complete.**

The repository contains the project foundations, governance, illustrative sample records, authoritative visual prototype, tested Ocean Luxe React experience, Zod-backed canonical data and a versioned Dexie/IndexedDB persistence foundation. Nine routes now include a premium Import / Export workbench with five supported JSON shapes, field-level validation, ID-based local conflict detection, protected-field confirmation, transactional local commits, ImportBatch audit records and three browser-native JSON exports. The app also has install metadata, Ocean Luxe icon placeholders, production service-worker registration, static app-shell caching and a visible offline readiness cue. Live integrations remain deliberately deferred.

## Start here

- Read the [project knowledge index](docs/README.md) to find the authoritative source for each decision.
- Review the [standalone Ocean Luxe prototype](prototypes/v0.1/complete-cruising-prototype-v0.1.html) before making visual changes.
- Follow [AGENTS.md](AGENTS.md) for mandatory project-working rules.
- Use the [tranche plan](docs/build-plan/tranche-plan-v0.1.md) alongside the authoritative [Build Plan v0.1](docs/07-build-plan-v0.1.md).

## Repository structure

```text
complete-cruising/
|-- app/               Ocean Luxe React app through Tranche 14
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

The app can be installed and validated from `app/`; see [app/README.md](app/README.md) for commands and the GitHub Pages base-path decision. The next planned tranche is **Tranche 15: GitHub Pages Deployment**.
