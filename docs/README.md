# Complete Cruising project knowledge index

This is the entry point for project knowledge in the Complete Cruising repository. It inventories the current project files, explains which document to consult for each kind of decision, and records gaps between the documented target and the repository as it exists.

Last inventoried: 21 June 2026.

## Repository at a glance

Complete Cruising is a documentation-first project for a premium, local-first Lawrence Family Series PWA. The intended experience is a rich cruise guidebook and companion, not a plain administration or CRUD interface.

The repository currently contains project governance, seven v0.1 foundation documents, the standalone Ocean Luxe HTML prototype, the delivery tracker, illustrative sample records, reserved enrichment workspaces and the tested Ocean Luxe application through Tranche 11. Core records have TypeScript types, strict Zod schemas, canonical illustrative fixtures and versioned import/export shape validation. A version 1 Dexie database provides validated sample seeding, reset utilities and repository access; all eight core screens now subscribe to local repository queries through feature hooks and view-model mappers. Import preview and commit, export download, live APIs, PWA support and deployment workflow remain absent.

```text
complete-cruising/
|-- .git/                             Git repository metadata; not project knowledge
|-- .gitattributes                    Text-file normalisation configuration
|-- .gitignore                        Future app and local-tool exclusions
|-- AGENTS.md                         Mandatory project-working instructions
|-- README.md                         Contributor-facing project introduction
|-- app/
|   |-- README.md                     Scaffold usage and base-path note
|   |-- index.html                    Vite HTML entry point
|   |-- package.json                  App scripts and dependencies
|   |-- package-lock.json             Reproducible npm dependency lock
|   |-- vite.config.ts                Vite and GitHub Pages base-path config
|   |-- vitest.config.ts              Component-test configuration
|   |-- tsconfig.json                 TypeScript project references
|   |-- tsconfig.app.json             Browser-source TypeScript config
|   |-- tsconfig.node.json            Tooling TypeScript config
|   `-- src/
|       |-- App.tsx                   Lightweight eight-view hash routing
|       |-- main.tsx                  React entry point
|       |-- vite-env.d.ts             Vite client types
|       |-- components/
|       |   |-- layout/AppShell.tsx
|       |   |-- navigation/TopNavigation.tsx
|       |   |-- navigation/MobileNavigation.tsx
|       |   |-- status/StatusChip.tsx
|       |   |-- status/ConfidenceChip.tsx
|       |   |-- states/LocalDataState.tsx
|       |   |-- surfaces/CardSurface.tsx
|       |   |-- visual/BrandMark.tsx
|       |   `-- visual/RouteMotif.tsx
|       |-- data/sampleData.ts        Static shell metadata
|       |-- data/sampleDashboardData.ts
|       |                                  Typed illustrative dashboard data
|       |-- data/sampleItineraryData.ts
|       |                                  Typed 15-day itinerary data
|       |-- data/sampleTodayData.ts   Typed illustrative Naples day data
|       |-- data/sampleShipData.ts    Typed reusable ship guide sample
|       |-- data/samplePortData.ts    Typed reusable Naples guide sample
|       |-- data/sampleExperienceData.ts
|       |                                  Typed plans, family guidance and memories
|       |-- data/sampleSchemaData.ts    Canonical schema-aligned illustrative fixtures
|       |-- data/viewModelMappers.ts    Local records to visual screen models
|       |-- db/                         Versioned Dexie database, seed/reset utilities and repositories
|       |-- hooks/useLocalData.ts       Live repository-backed feature hooks
|       |-- types/                      Inferred domain and import/export types
|       |-- schemas/                    Strict Zod entity and envelope schemas
|       |-- features/dashboard/
|       |   |-- DashboardPage.tsx     Dashboard screen composition
|       |   |-- DashboardPage.css     Dashboard visual and responsive rules
|       |   `-- components/
|       |       |-- SailingHero.tsx
|       |       |-- RouteRibbon.tsx
|       |       |-- MetricCard.tsx
|       |       |-- VoyageStatusGrid.tsx
|       |       |-- VoyageStatusCard.tsx
|       |       |-- NextPortCard.tsx
|       |       `-- FamilyFocusCard.tsx
|       |-- features/itinerary/
|       |   |-- ItineraryPage.tsx     Itinerary screen composition
|       |   |-- ItineraryPage.css     Timeline and day-type treatments
|       |   `-- components/
|       |       |-- ItineraryTimeline.tsx
|       |       |-- ItineraryDayCard.tsx
|       |       |-- ItinerarySummaryPanel.tsx
|       |       `-- ItineraryLegend.tsx
|       |-- features/today/
|       |   |-- TodayPage.tsx         Today screen composition
|       |   |-- TodayPage.css         Operational and responsive styling
|       |   `-- components/
|       |       |-- TodayAshorePanel.tsx
|       |       |-- AllAboardCard.tsx
|       |       |-- WeatherTile.tsx
|       |       |-- TakeAshoreChecklist.tsx
|       |       |-- TodayPlanSummary.tsx
|       |       |-- SebDiscoveryPreview.tsx
|       |       `-- ConfidenceNotes.tsx
|       |-- features/ports/
|       |   |-- PortGuidePage.tsx     Naples guidebook composition
|       |   |-- PortGuidePage.css     Postcard and responsive styling
|       |   `-- components/
|       |       |-- PortPostcard.tsx
|       |       |-- PortFactChips.tsx
|       |       |-- PortGuideSection.tsx
|       |       |-- AttractionHighlightCard.tsx
|       |       |-- FamilyLensCard.tsx
|       |       |-- PhotoPromptCard.tsx
|       |       `-- HintsWatchoutsCard.tsx
|       |-- features/ship/
|       |   |-- ShipPage.tsx          Ship handbook screen composition
|       |   |-- ShipPage.css          Ship guide and responsive styling
|       |   `-- components/
|       |       |-- ShipHero.tsx
|       |       |-- ShipGuideCard.tsx
|       |       |-- ShipFactsPanel.tsx
|       |       `-- EnrichmentStatusPanel.tsx
|       |-- features/plans/            Naples shore-plan comparison
|       |-- features/family/           Premium family discovery guide
|       |-- features/memories/         Reflective prompts and Almanac preview
|       |-- features/experience-pages.css
|       |                                  Shared Tranche 8 responsive styling
|       |-- routes/routeConfig.ts     Implemented and placeholder routes
|       |-- styles/
|       |   |-- tokens.css            Ocean Luxe design tokens
|       |   |-- base.css              Global and accessibility foundations
|       |   |-- app-shell.css         Shell and landing layout
|       |   |-- components.css        Shared component treatments
|       |   `-- responsive.css        Responsive shell behaviour
|       |-- tests/App.test.tsx        View, trust metadata and routing tests
|       |-- tests/schemas.test.ts     Valid and invalid schema coverage
|       `-- tests/setup.ts            Testing Library setup and cleanup
|-- docs/
|   |-- README.md                     This living inventory and knowledge index
|   |-- 01-product-specification-v0.1.md
|   |-- 02-enrichment-framework-v0.1.md
|   |-- 03-data-model-v0.1.md
|   |-- 04-visual-experience-brief-v0.1.md
|   |-- 05-html-prototype-specification-v0.1.md
|   |-- 06-technical-architecture-v0.1.md
|   |-- 07-build-plan-v0.1.md
|   |-- build-plan/
|   |   `-- tranche-plan-v0.1.md
|   `-- decisions/
|       `-- 0001-project-start.md
|-- enrichment/
|   |-- imports/README.md
|   |-- prompts/README.md
|   `-- reviewed/README.md
|-- prototypes/
|   `-- v0.1/
|       `-- complete-cruising-prototype-v0.1.html
`-- samples/
    |-- ports/naples.sample.json
    |-- sailings/sun-princess-mediterranean-2026.sample.json
    `-- ships/sun-princess.sample.json
```

## Project file inventory

| Path | Classification | Purpose and authority |
| --- | --- | --- |
| [../AGENTS.md](../AGENTS.md) | Governance | Mandatory working rules: preserve Ocean Luxe, use British English, avoid unapproved external APIs, work in small tranches, protect record separation and trust metadata, and report validation, limitations and a suggested commit message. |
| [../README.md](../README.md) | Project introduction | Concise contributor entry point covering status, repository structure, current artefacts, development approach, sample-data safety and the next tranche. |
| [../.gitattributes](../.gitattributes) | Repository configuration | Enables automatic text detection and LF normalisation. |
| [../.gitignore](../.gitignore) | Repository configuration | Excludes dependency folders, build output, local environment files, editor settings, logs and coverage output without hiding project artefacts. |
| [README.md](README.md) | Project knowledge | Living repository inventory, knowledge router, current-state summary and gap register. |
| [01-product-specification-v0.1.md](01-product-specification-v0.1.md) | Product foundation | Defines the vision, audience, journeys, scope, information architecture, product-level data concepts, enrichment philosophy, visual ambition and success criteria. |
| [02-enrichment-framework-v0.1.md](02-enrichment-framework-v0.1.md) | Trust and content foundation | Defines targeted enrichment packs, source hierarchy, confidence, review and refresh metadata, review workflow, family lenses, import standards and anti-patterns. |
| [03-data-model-v0.1.md](03-data-model-v0.1.md) | Data foundation | Defines conceptual entities, relationships, enumerations, protected-field conflict rules, quality rules and the boundary between reusable guidebook data and sailing-specific records. |
| [04-visual-experience-brief-v0.1.md](04-visual-experience-brief-v0.1.md) | Experience foundation | Defines Ocean Luxe visual direction, layout and card systems, core screens, interaction, responsiveness, accessibility, imagery and the visual acceptance bar. |
| [05-html-prototype-specification-v0.1.md](05-html-prototype-specification-v0.1.md) | Prototype specification | Defines the expected standalone prototype, sample sailing content, page sections, interactions, responsive behaviour, CSS approach and prototype acceptance criteria. It is a specification, not the prototype itself. |
| [06-technical-architecture-v0.1.md](06-technical-architecture-v0.1.md) | Technical foundation | Defines the target PWA architecture, stack, source structure, local data, imports and exports, offline behaviour, security, testing, deployment and architectural decisions. |
| [07-build-plan-v0.1.md](07-build-plan-v0.1.md) | Delivery foundation | Converts the foundations into ordered implementation tranches with deliverables, acceptance criteria, validation expectations and suggested commit messages. |
| [build-plan/tranche-plan-v0.1.md](build-plan/tranche-plan-v0.1.md) | Delivery tracker | Concise 16-tranche sequence for implementation; subordinate to the detailed Build Plan v0.1 and intended to evolve transparently. |
| [decisions/0001-project-start.md](decisions/0001-project-start.md) | Decision record | Records the accepted local-first static PWA, prototype-reference, tranche-delivery, no-live-API MVP and sample-data privacy decisions. |
| [../prototypes/v0.1/complete-cruising-prototype-v0.1.html](../prototypes/v0.1/complete-cruising-prototype-v0.1.html) | Authoritative visual reference | Standalone Ocean Luxe concept prototype. Use it to preserve the proven visual direction during production implementation; it is reference material, not production code. |
| [../samples/sailings/sun-princess-mediterranean-2026.sample.json](../samples/sailings/sun-princess-mediterranean-2026.sample.json) | Illustrative sample data | Non-sensitive sailing shell for Rome to Barcelona; it is not a confirmed itinerary or booking record. |
| [../samples/ships/sun-princess.sample.json](../samples/ships/sun-princess.sample.json) | Illustrative sample data | Lightweight reusable Sun Princess guidebook record, explicitly marked partial and illustrative. |
| [../samples/ports/naples.sample.json](../samples/ports/naples.sample.json) | Illustrative sample data | Lightweight reusable Naples guidebook record, explicitly marked partial and illustrative. |
| [../enrichment/prompts/README.md](../enrichment/prompts/README.md) | Enrichment workspace guidance | Reserves the prompt area for small, structured packs while preserving trust metadata and record boundaries. |
| [../enrichment/imports/README.md](../enrichment/imports/README.md) | Enrichment workspace guidance | Reserves the import staging area and states that staged files are neither trusted nor committed data. |
| [../enrichment/reviewed/README.md](../enrichment/reviewed/README.md) | Enrichment workspace guidance | Reserves the reviewed-output area without allowing reviewed content to overwrite trusted data silently. |
| [../app/README.md](../app/README.md) | App guidance | Records scaffold commands, current scope and the `/complete-cruising/` GitHub Pages base-path decision. |
| [../app/package.json](../app/package.json) and [package-lock.json](../app/package-lock.json) | App configuration | Define sandbox-compatible development and validation scripts plus locked React, TypeScript, Vite, Vitest and Testing Library dependencies. |
| [../app/index.html](../app/index.html) | App entry point | Provides the static Vite document shell using British English document metadata. |
| [../app/vite.config.ts](../app/vite.config.ts) and [vitest.config.ts](../app/vitest.config.ts) | Tooling configuration | Configure React builds, the documented GitHub Pages base path and jsdom component tests. |
| [../app/tsconfig.json](../app/tsconfig.json), [tsconfig.app.json](../app/tsconfig.app.json) and [tsconfig.node.json](../app/tsconfig.node.json) | TypeScript configuration | Separate browser-source and tooling checks through TypeScript project references. |
| [../app/src/App.tsx](../app/src/App.tsx), [main.tsx](../app/src/main.tsx) and [vite-env.d.ts](../app/src/vite-env.d.ts) | App source | Compose and mount the Ocean Luxe shell with lightweight hash switching across eight implemented routes. |
| [../app/src/components/layout/AppShell.tsx](../app/src/components/layout/AppShell.tsx), [navigation](../app/src/components/navigation/TopNavigation.tsx), [status](../app/src/components/status/StatusChip.tsx), [surfaces](../app/src/components/surfaces/CardSurface.tsx) and [visual](../app/src/components/visual/BrandMark.tsx) components | Shell components | Provide maintainable layout, responsive navigation, status, confidence, surface, brand and route-motif primitives. |
| [../app/src/routes/routeConfig.ts](../app/src/routes/routeConfig.ts) and [data/sampleData.ts](../app/src/data/sampleData.ts) | App placeholders | Mark Dashboard, Itinerary, Today, Ship and Ports as implemented while retaining non-functional future-route and shell metadata placeholders. |
| [../app/src/data/sampleDashboardData.ts](../app/src/data/sampleDashboardData.ts), [sampleItineraryData.ts](../app/src/data/sampleItineraryData.ts), [sampleTodayData.ts](../app/src/data/sampleTodayData.ts), [sampleShipData.ts](../app/src/data/sampleShipData.ts), [samplePortData.ts](../app/src/data/samplePortData.ts) and [sampleExperienceData.ts](../app/src/data/sampleExperienceData.ts) | Legacy presentation fixtures | Retain visual view-model types and historical illustrative reference data; runtime screens no longer import their sample values. |
| [../app/src/features/dashboard/DashboardPage.tsx](../app/src/features/dashboard/DashboardPage.tsx), [DashboardPage.css](../app/src/features/dashboard/DashboardPage.css) and [dashboard components](../app/src/features/dashboard/components/SailingHero.tsx) | Dashboard feature | Implement the cinematic sailing hero, route ribbon, metrics and six voyage-readiness cards as maintainable React components. |
| [../app/src/data/sampleItineraryData.ts](../app/src/data/sampleItineraryData.ts) | Itinerary sample data | Supplies 15 illustrative days across embarkation, nine port calls, four sea days and disembarkation with confidence, review and refresh metadata. |
| [../app/src/features/itinerary/ItineraryPage.tsx](../app/src/features/itinerary/ItineraryPage.tsx), [ItineraryPage.css](../app/src/features/itinerary/ItineraryPage.css) and [itinerary components](../app/src/features/itinerary/components/ItineraryTimeline.tsx) | Itinerary feature | Implement the route summary, legend, horizontal desktop timeline, vertical mobile timeline and visually differentiated day cards. |
| [../app/src/data/sampleTodayData.ts](../app/src/data/sampleTodayData.ts) | Today sample data | Supplies the illustrative Naples operational day, weather, plans, checklist, local context and protected confidence/refresh notes. |
| [../app/src/features/today/TodayPage.tsx](../app/src/features/today/TodayPage.tsx), [TodayPage.css](../app/src/features/today/TodayPage.css) and [Today components](../app/src/features/today/components/TodayAshorePanel.tsx) | Today feature | Implement the five-second operational summary, prominent all-aboard time, return buffer, sample weather, plan, temporary checklist, Seb discovery and confidence notes. |
| [../app/src/data/sampleShipData.ts](../app/src/data/sampleShipData.ts) | Ship guide sample data | Supplies a reusable, explicitly illustrative Sun Princess handbook record with seven guide sections and visible confidence, review and refresh metadata. |
| [../app/src/features/ship/ShipPage.tsx](../app/src/features/ship/ShipPage.tsx), [ShipPage.css](../app/src/features/ship/ShipPage.css) and [Ship components](../app/src/features/ship/components/ShipHero.tsx) | Ship guide feature | Implement the premium ship hero, handbook facts, enrichment readiness and seven editorial guide cards without mixing ship knowledge into sailing-specific records. |
| [../app/src/data/samplePortData.ts](../app/src/data/samplePortData.ts) | Port guide sample data | Supplies a reusable, explicitly illustrative Naples guidebook record with separate attraction ideas and visible confidence, review and refresh metadata. |
| [../app/src/data/sampleExperienceData.ts](../app/src/data/sampleExperienceData.ts) | Tranche 8 sample data | Keeps sailing-specific Naples shore plans and memory prompts separate from reusable port context, while supplying non-sensitive Family Guide presentation data and visible trust metadata. |
| [../app/src/data/sampleSchemaData.ts](../app/src/data/sampleSchemaData.ts) | Tranche 9 canonical samples | Provides non-sensitive schema-aligned sailing, itinerary, ship, port, attraction, shore plan, Today, weather, enrichment, memory and Almanac fixtures derived from the existing illustrative presentation content. |
| [../app/src/db](../app/src/db/index.ts), [hooks/useLocalData.ts](../app/src/hooks/useLocalData.ts) and [data/viewModelMappers.ts](../app/src/data/viewModelMappers.ts) | Tranche 10–11 local data flow | Defines the version 1 Dexie database, safe illustrative seeding, screen repository bundles, live feature hooks and explicit mapping into Ocean Luxe visual models. |
| [../app/src/tests/database.test.ts](../app/src/tests/database.test.ts) | Tranche 10 database tests | Verifies schema creation, seed idempotency, clear/reseed behaviour, repositories, record separation and trust metadata using a test-only IndexedDB polyfill. |
| [../app/src/types](../app/src/types/index.ts) | Tranche 9 data types | Exposes shared, cruise, guidebook, plan, memory and import/export TypeScript types inferred from the canonical Zod schemas to prevent type drift. |
| [../app/src/schemas](../app/src/schemas/index.ts) | Tranche 9 validation | Defines strict shared metadata and core entity schemas plus versioned, shape-only import and export envelopes; no import commit or export workflow is implemented. |
| [../app/src/features/ports/PortGuidePage.tsx](../app/src/features/ports/PortGuidePage.tsx), [PortGuidePage.css](../app/src/features/ports/PortGuidePage.css) and [Port Guide components](../app/src/features/ports/components/PortPostcard.tsx) | Port guide feature | Implement the warm postcard hero, practical guide sections, separate attraction cards, restrained family lens, photography prompt and uncertainty notes without mixing port knowledge into itinerary-day timings. |
| [../app/src/features/plans/PlansPage.tsx](../app/src/features/plans/PlansPage.tsx), [family/FamilyGuidePage.tsx](../app/src/features/family/FamilyGuidePage.tsx), [memories/MemoriesPage.tsx](../app/src/features/memories/MemoriesPage.tsx) and [experience-pages.css](../app/src/features/experience-pages.css) | Tranche 8 experience features | Implement three premium Naples experience routes, selected plan comparison, Seb discovery, reflective memory prompts and a non-functional Adventure Almanac export preview. |
| [../app/src/styles/tokens.css](../app/src/styles/tokens.css), [base.css](../app/src/styles/base.css), [app-shell.css](../app/src/styles/app-shell.css), [components.css](../app/src/styles/components.css) and [responsive.css](../app/src/styles/responsive.css) | App styles | Translate Ocean Luxe into shared tokens, atmospheric backgrounds, reusable surfaces, accessible focus states and responsive layouts. |
| [../app/src/tests/App.test.tsx](../app/src/tests/App.test.tsx), [database.test.ts](../app/src/tests/database.test.ts), [schemas.test.ts](../app/src/tests/schemas.test.ts) and [setup.ts](../app/src/tests/setup.ts) | App tests | Verify all eight screens from local IndexedDB data, missing-active-sailing behaviour, routing, repository separation, trust metadata and schema validity. |

## Knowledge routing

Use this table to find the narrowest authoritative source before making a change.

| Question or task | Read first | Then cross-check |
| --- | --- | --- |
| What is the product and what belongs in scope? | Product Specification | Build Plan |
| How should information be researched, trusted or refreshed? | Enrichment Framework | Data Model |
| Where should a field live, and can it be overwritten? | Data Model | Enrichment Framework |
| How should the app look and feel? | Visual Experience Brief | HTML Prototype Specification |
| What should a specific prototype screen contain? | HTML Prototype Specification | Visual Experience Brief |
| How should documented visual intent appear in practice? | Standalone HTML prototype | Visual Experience Brief and HTML Prototype Specification |
| Which technologies and repository structure should be used? | Technical Architecture | Build Plan |
| What should be built next and how is it accepted? | Build Plan | Relevant specialist foundation document |
| What rules apply to all work in the repository? | `AGENTS.md` | This index |

## Canonical project decisions

These decisions recur across the current foundation set and should be treated as established unless the project owner explicitly changes them:

- The product is a visually rich, personalised cruise companion for the Lawrence family.
- Ocean Luxe is the visual direction; premium guidebook presentation must survive implementation.
- The target is a static, local-first PWA suitable for GitHub Pages.
- The recommended application stack is React, TypeScript and Vite, with Dexie for IndexedDB and Zod for validation.
- Initial navigation should use hash routing for static-host compatibility.
- MVP enrichment enters through structured, reviewable imports rather than live external APIs.
- Reusable guidebook records, including ships and ports, remain separate from sailing-specific itinerary records.
- Confidence, source, review and refresh metadata remain attached to enriched or time-sensitive information.
- Manual, booking-derived, trusted or confirmed data must not be silently replaced by generic enrichment.
- Work proceeds in small, independently reviewable tranches.
- Product copy and project documentation use British English.

## Document relationships

The documents form a deliberate progression:

1. The Product Specification establishes the product promise and boundaries.
2. The Enrichment Framework defines how knowledge earns trust.
3. The Data Model gives that knowledge a durable structure.
4. The Visual Experience Brief translates the product into an experience language.
5. The HTML Prototype Specification turns that language into a concrete visual proof brief.
6. The standalone HTML prototype provides the authoritative visual proof and implementation reference.
7. The Technical Architecture defines how to implement the proven direction.
8. The Build Plan sequences implementation into controlled tranches.

Specialist documents take precedence for decisions in their own domain. Product intent should still be checked against the Product Specification, and all implementation remains subject to `AGENTS.md`.

## Current repository gaps

The following are described by the foundation documents but are not present in the repository at the date of this inventory:

- production routing beyond the eight implemented views and typed future placeholders;
- import/export commit or download logic;
- automated visual regression references;
- PWA manifest, service worker and GitHub Pages workflow;

## Maintenance rules

Update this index whenever a tranche adds, removes, renames or supersedes a project file.

- Add new knowledge-bearing files to both the tree and inventory table.
- Mark superseded documents clearly; do not silently replace or delete trusted project knowledge.
- Keep generated files, dependency folders and build output out of the knowledge inventory unless they are deliberate reference artefacts.
- Record absent-but-expected artefacts under current repository gaps.
- When a gap is filled, remove it from the gap register and add the new file to the inventory.
- Preserve version labels on fixed foundation artefacts. Keep this `README.md` unversioned because it is a living index.

## Inventory validation

This inventory was updated from a recursive repository file listing with Git metadata, dependency folders, build output and coverage output excluded from the knowledge set. Every knowledge-bearing file present on 20 June 2026 is represented above.
