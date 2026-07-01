# Complete Cruising project knowledge index

This is the entry point for project knowledge in the Complete Cruising repository. It records the current fresh-base rescue direction, points to the authoritative documents for each decision, and marks the older failed runtime as archived reference material rather than active product code.

Last inventoried: 1 July 2026.

## Repository at a glance

Complete Cruising is currently a documentation-first, premium, local-first cruise companion for the Lawrence family's real **Sun Princess Mediterranean 2026** sailing. The active product direction is a **fresh-base reset**: a static, hash-routed, cruise-stable guidebook that can deploy safely to GitHub Pages before the real trip.

The earlier reusable local-database implementation remains preserved under `legacy/` for reference, learning and possible post-cruise reuse, but it is no longer the active runtime.

```text
complete-cruising/
|-- AGENTS.md                         Mandatory working instructions
|-- README.md                         Contributor-facing project introduction
|-- app/
|   |-- README.md                     Active fresh-base app notes and commands
|   |-- index.html                    Vite HTML entry point for the live app
|   |-- package.json                  App scripts and dependencies
|   |-- package-lock.json             Reproducible npm lockfile
|   |-- tsconfig.json                 TypeScript project references
|   |-- tsconfig.app.json             Browser TypeScript config
|   |-- tsconfig.node.json            Tooling TypeScript config
|   |-- vite.config.ts                Vite config with GitHub Pages base path
|   |-- vitest.config.ts              Test runner config
|   `-- src/
|       |-- App.tsx                   Active hash-routed app composition
|       |-- main.tsx                  React entry point
|       |-- vite-env.d.ts             Vite type declarations
|       |-- components/
|       |   `-- AppShell.tsx          Shared shell, hero and primary navigation
|       |-- data/
|       |   `-- sunPrincess2026.ts    Static sailing, itinerary, port and ship content
|       |-- pages/                    Dashboard, Today, Itinerary, Ports, Ship, Plans, Memories and About
|       |-- routes/
|       |   `-- routeConfig.ts        Hash route definitions and matching
|       |-- services/
|       |   `-- guidebook.ts          Today-mode and countdown derivation helpers
|       |-- styles/
|       |   |-- tokens.css            Ocean Luxe design tokens
|       |   |-- base.css              Global base styles
|       |   `-- app.css               Shell, cards and responsive layout styles
|       `-- tests/
|           |-- App.test.tsx          Routing and primary-view render tests
|           `-- setup.ts              Testing Library setup
|-- content-source/
|   `-- 00-source-register.md         Source, confidence and verification register
|-- docs/
|   |-- README.md                     This living knowledge index
|   |-- 01-sun-princess-2026-guidebook-brief.md
|   |                                  Single-sailing guidebook brief
|   |-- 02-static-content-architecture.md
|   |                                  Static content architecture brief
|   |-- 01-product-specification-v0.1.md
|   |-- 02-enrichment-framework-v0.1.md
|   |-- 03-data-model-v0.1.md
|   |-- 04-visual-experience-brief-v0.1.md
|   |-- 05-html-prototype-specification-v0.1.md
|   |-- 06-technical-architecture-v0.1.md
|   |-- 07-build-plan-v0.1.md         Original foundation set
|   |-- 12-import-preview-v0.1.md
|   |-- 13-import-commit-and-export-v0.1.md
|   |-- 14-pwa-and-offline-readiness-v0.1.md
|   |-- 15-github-pages-deployment-v0.1.md
|   |-- 16-production-smoke-test-and-release-hardening-v0.1.md
|   |-- 17-sailing-setup-and-enrichment-request-workflow-v0.1.md
|   |-- 18A-sailing-shell-enrichment-import-mapper-v0.1.md
|   |-- 18B-mvp-recovery-real-sailing-onboarding-and-guidebook-mode-v0.1.md
|   |-- 19-mvp-cruise-usability-and-visual-polish-v0.1.md
|   |-- 20-cartographic-port-atlas-and-map-context-v0.1.md
|   |-- 21-cruise-weather-intelligence-v0.1.md
|   |-- 21A-enrichment-workflow-contract-repair-v0.1.md
|   |-- 22-cruise-conditions-and-day-readiness-v0.1.md
|   |-- 23-open-meteo-manual-weather-refresh-v0.1.md
|   |-- 24-weather-snapshot-review-and-conflict-resolution-v0.1.md
|   |-- 24A-more-navigation-menu-repair-v0.1.md
|   |-- 25-weather-snapshot-review-workflow-polish-v0.1.md
|   |                                  Historical tranche records retained for context
|   |-- build-plan/
|   |   `-- tranche-plan-v0.1.md      Historical tranche sequencing
|   |-- decisions/
|   |   |-- 0001-project-start.md
|   |   |-- 0001-project-reset-to-single-sailing-guidebook.md
|   |   `-- 0002-fresh-base-reset.md  Decision to replace the failed runtime with a new app base
|   |-- fresh-base/
|   |   |-- 00-fresh-base-product-brief.md
|   |   |-- 01-fresh-base-architecture.md
|   |   |-- 02-cruise-stable-scope.md
|   |   `-- 03-post-cruise-backlog.md Fresh-base delivery pack
|   `-- rescue/
|       `-- 2026-07-01-fresh-base-reset.md
|                                      Rescue note explaining the reset
|-- enrichment/                       Preserved enrichment workspace docs
|-- legacy/
|   |-- failed-v1-app-README.md       Archived previous app README
|   |-- failed-v1-notes.md            Summary of why v1 was retired
|   |-- failed-v1-app-src/            Archived previous runtime source
|   `-- failed-v1-public/             Archived previous public assets and PWA files
|-- prototypes/
|   `-- v0.1/
|       `-- complete-cruising-prototype-v0.1.html
|                                      Authoritative Ocean Luxe visual reference
`-- samples/                          Preserved illustrative JSON examples
```

## Project file inventory

| Path | Classification | Purpose and authority |
| --- | --- | --- |
| [../AGENTS.md](../AGENTS.md) | Governance | Mandatory working rules: preserve Ocean Luxe, use British English, work in small tranches, protect record separation and trust metadata, and include validation notes, limitations and a suggested commit message in each tranche. |
| [../README.md](../README.md) | Project introduction | Concise contributor entry point for the active fresh-base direction. |
| [README.md](README.md) | Knowledge index | Living repository inventory and routing guide for project knowledge. |
| [../content-source/00-source-register.md](../content-source/00-source-register.md) | Source register | Tracks research inputs, verification expectations, confidence and release-readiness checks for the single-sailing edition. |
| [01-sun-princess-2026-guidebook-brief.md](01-sun-princess-2026-guidebook-brief.md) | Product brief | Defines the Sun Princess 2026 guidebook users, outcomes, content priorities, confidence model and release constraints. |
| [02-static-content-architecture.md](02-static-content-architecture.md) | Content architecture | Defines static content boundaries, content-source separation, integrity rules and publication constraints. |
| [fresh-base/00-fresh-base-product-brief.md](fresh-base/00-fresh-base-product-brief.md) | Fresh-base brief | The active rescue product brief for the cruise-stable app base. |
| [fresh-base/01-fresh-base-architecture.md](fresh-base/01-fresh-base-architecture.md) | Fresh-base architecture | The active technical structure for the rebuilt static app. |
| [fresh-base/02-cruise-stable-scope.md](fresh-base/02-cruise-stable-scope.md) | Stable scope | Defines what must be present before the cruise and what should stay out. |
| [fresh-base/03-post-cruise-backlog.md](fresh-base/03-post-cruise-backlog.md) | Deferred backlog | Captures intentionally postponed features and complexities. |
| [rescue/2026-07-01-fresh-base-reset.md](rescue/2026-07-01-fresh-base-reset.md) | Rescue record | Explains why the reset happened and how the repository was stabilised. |
| [decisions/0002-fresh-base-reset.md](decisions/0002-fresh-base-reset.md) | Architectural decision | Records the choice to replace the failed runtime with a fresh cruise-stable base while preserving history. |
| [decisions/0001-project-start.md](decisions/0001-project-start.md), [decisions/0001-project-reset-to-single-sailing-guidebook.md](decisions/0001-project-reset-to-single-sailing-guidebook.md) | Historical decisions | Earlier product-shaping decisions retained as authoritative background. |
| [01-product-specification-v0.1.md](01-product-specification-v0.1.md), [02-enrichment-framework-v0.1.md](02-enrichment-framework-v0.1.md), [03-data-model-v0.1.md](03-data-model-v0.1.md), [04-visual-experience-brief-v0.1.md](04-visual-experience-brief-v0.1.md), [05-html-prototype-specification-v0.1.md](05-html-prototype-specification-v0.1.md), [06-technical-architecture-v0.1.md](06-technical-architecture-v0.1.md) and [07-build-plan-v0.1.md](07-build-plan-v0.1.md) | Foundation set | Original product, trust, data, visual and technical foundations that still guide the fresh-base implementation unless superseded by newer rescue documents. |
| [../prototypes/v0.1/complete-cruising-prototype-v0.1.html](../prototypes/v0.1/complete-cruising-prototype-v0.1.html) | Visual reference | The authoritative Ocean Luxe prototype used as the visual benchmark rather than as copy-paste production code. |
| [../app/README.md](../app/README.md), [index.html](../app/index.html), [package.json](../app/package.json), [vite.config.ts](../app/vite.config.ts), [vitest.config.ts](../app/vitest.config.ts) and [tsconfig.json](../app/tsconfig.json) | Active app tooling | Defines how the fresh-base app runs, builds, tests and deploys to GitHub Pages. |
| [../app/src/App.tsx](../app/src/App.tsx), [main.tsx](../app/src/main.tsx), [routes/routeConfig.ts](../app/src/routes/routeConfig.ts) and [components/AppShell.tsx](../app/src/components/AppShell.tsx) | Active app shell | Compose the fresh-base React shell, hash-safe routing and eight primary guidebook routes. |
| [../app/src/data/sunPrincess2026.ts](../app/src/data/sunPrincess2026.ts) and [services/guidebook.ts](../app/src/services/guidebook.ts) | Active content and derivation layer | Bundle the static sailing, itinerary, port, ship, plan and memory content and derive Today/Countdown behaviour without external services. |
| [../app/src/pages/DashboardPage.tsx](../app/src/pages/DashboardPage.tsx), [TodayPage.tsx](../app/src/pages/TodayPage.tsx), [ItineraryPage.tsx](../app/src/pages/ItineraryPage.tsx), [PortsPage.tsx](../app/src/pages/PortsPage.tsx), [ShipPage.tsx](../app/src/pages/ShipPage.tsx), [PlansPage.tsx](../app/src/pages/PlansPage.tsx), [MemoriesPage.tsx](../app/src/pages/MemoriesPage.tsx) and [AboutPage.tsx](../app/src/pages/AboutPage.tsx) | Active guidebook views | Implement the cruise-stable user-facing pages for the fresh-base release. |
| [../app/src/styles/tokens.css](../app/src/styles/tokens.css), [base.css](../app/src/styles/base.css) and [app.css](../app/src/styles/app.css) | Active styling | Translate Ocean Luxe into maintainable design tokens, surfaces and responsive layouts for the fresh-base app. |
| [../app/src/tests/App.test.tsx](../app/src/tests/App.test.tsx) and [setup.ts](../app/src/tests/setup.ts) | Active validation | Provide route and render smoke coverage for the fresh-base shell. |
| [../legacy/failed-v1-notes.md](../legacy/failed-v1-notes.md), [../legacy/failed-v1-app-README.md](../legacy/failed-v1-app-README.md), [../legacy/failed-v1-app-src](../legacy/failed-v1-app-src) and [../legacy/failed-v1-public](../legacy/failed-v1-public) | Archived v1 implementation | Preserved failed runtime, PWA assets and notes for reference. These files are not the active application and should not be revived implicitly. |
| [12-import-preview-v0.1.md](12-import-preview-v0.1.md) through [25-weather-snapshot-review-workflow-polish-v0.1.md](25-weather-snapshot-review-workflow-polish-v0.1.md) | Historical tranche records | Document the previous implementation path and remain useful for auditability, learned lessons and possible future feature recovery. |

## Knowledge routing

Use the narrowest authoritative source before making a change.

| Question or task | Read first | Then cross-check |
| --- | --- | --- |
| What is the current rescue product we are shipping? | [fresh-base/00-fresh-base-product-brief.md](fresh-base/00-fresh-base-product-brief.md) | [rescue/2026-07-01-fresh-base-reset.md](rescue/2026-07-01-fresh-base-reset.md) |
| What must stay in scope before the real cruise? | [fresh-base/02-cruise-stable-scope.md](fresh-base/02-cruise-stable-scope.md) | [fresh-base/03-post-cruise-backlog.md](fresh-base/03-post-cruise-backlog.md) |
| How should the rebuilt app be structured? | [fresh-base/01-fresh-base-architecture.md](fresh-base/01-fresh-base-architecture.md) | [06-technical-architecture-v0.1.md](06-technical-architecture-v0.1.md) |
| How should content be sourced, trusted and protected? | [../content-source/00-source-register.md](../content-source/00-source-register.md) | [02-static-content-architecture.md](02-static-content-architecture.md) |
| How should the app look and feel? | [04-visual-experience-brief-v0.1.md](04-visual-experience-brief-v0.1.md) | [../prototypes/v0.1/complete-cruising-prototype-v0.1.html](../prototypes/v0.1/complete-cruising-prototype-v0.1.html) |
| What historical context explains the reset? | [rescue/2026-07-01-fresh-base-reset.md](rescue/2026-07-01-fresh-base-reset.md) | [../legacy/failed-v1-notes.md](../legacy/failed-v1-notes.md) |
| What rules apply to every tranche? | [../AGENTS.md](../AGENTS.md) | This index |

## Canonical project decisions

- The product remains a premium, visually rich cruise companion for the Lawrence family.
- Ocean Luxe remains the visual direction and should be translated into maintainable React/CSS rather than copied directly from the prototype.
- The near-term release target is a static, local-first app suitable for GitHub Pages.
- The active runtime is the fresh-base React, TypeScript and Vite app under `app/src`.
- Routing remains hash-based for static-host compatibility.
- The fresh-base release uses bundled static content before the cruise rather than live integrations.
- Reusable guidebook knowledge and sailing-specific itinerary content remain conceptually separate even inside a single bundled content module.
- Confidence, review and refresh cues remain visible wherever time-sensitive or uncertain information appears.
- Trusted or confirmed information must not be silently replaced.
- The retired v1 runtime remains archived under `legacy/` for reference, not as active code.
- Product copy and documentation use British English.
- Work proceeds in small, independently reviewable tranches.

## Current repository gaps

The following expected artefacts are not yet present in the active fresh-base runtime:

- production-specific public assets for a new favicon, manifest and offline shell, following the retirement of the archived v1 PWA assets;
- automated visual regression references for the fresh-base rescue UI;
- content build validation beyond route/render smoke tests.

## Maintenance rules

Update this index whenever a tranche adds, removes, renames or supersedes a project file.

- Add new knowledge-bearing files to both the tree and inventory table.
- Mark archived or superseded material clearly; do not silently replace trusted project knowledge.
- Keep dependency folders and build output out of the knowledge inventory unless they are deliberate reference artefacts.
- Remove a gap from the register when it has genuinely been addressed by a committed file or workflow.

## Inventory validation

This inventory was refreshed after the 1 July 2026 fresh-base reset and reflects the repository state in which the previous runtime has been archived and the new static cruise-stable app under `app/src` is the active application.
