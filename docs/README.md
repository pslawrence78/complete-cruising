# Complete Cruising project knowledge index

This is the entry point for project knowledge in the Complete Cruising repository. It inventories the current project files, explains which document to consult for each kind of decision, and records gaps between the documented target and the repository as it exists.

Last inventoried: 30 June 2026.

## Repository at a glance

Complete Cruising is a documentation-first project for a premium, local-first Lawrence Family Series PWA. The intended experience is a rich cruise guidebook and companion, not a plain administration or CRUD interface.

The repository currently contains project governance, seven v0.1 foundation documents, the standalone Ocean Luxe HTML prototype, the delivery tracker, illustrative sample records, reserved enrichment workspaces and the tested Ocean Luxe application through Tranche 25, plus the corrective Tranche 24A More-navigation repair. Core records have TypeScript types, strict Zod schemas, canonical illustrative fixtures and versioned import/export validation. A version 3 Dexie weather store now covers both snapshots and weather review events, joining the validated sample seeding, guarded reset utilities, real Sun Princess 2026 onboarding and repository access; guidebook screens subscribe to local repository queries, a premium Import / Export route provides JSON parsing, validation, conflict preview, protected-field confirmation, transactional local import commits, ImportBatch auditing, browser-native JSON exports and safe governed routing for sailing shell, itinerary, ship pack, port pack, day guide and shore plan returns. Sailing Setup can now manage existing sailings with edit, archive and delete-empty-draft guardrails, and Enrichment Requests now use one typed six-request catalogue with calmer type-first filtering and JSON-only prompt governance. Setup can auto-generate itinerary dates, Data Safety provides backup/reset/clear/reseed controls, and primary navigation now opens as a polished cruise guidebook before backstage tools. Production PWA install metadata, app icon placeholders, service-worker registration, static app-shell caching, an offline readiness indicator, a GitHub Pages Actions deployment workflow and documented production-smoke release checks are present. Tranche 20 adds a constrained MapLibre/OpenFreeMap Port Atlas with centralised provider configuration, visible attribution, route-order utilities, approximate visual-orientation port coordinates, missing-coordinate fallbacks and no geocoding, route calculation, weather overlays, geolocation or remote tile caching. Tranche 21 adds local-first cruise weather intelligence with Open-Meteo forecast and archive refreshes, route badges, Today and port weather cards, itinerary weather chips and local weather snapshot persistence. Tranche 22 adds a derived Cruise Conditions and Day Readiness layer that scores timing, weather, plan, family comfort and trust without introducing new persistence. Tranche 23 refines weather into a manual-only Open-Meteo refresh flow with visit-date forecast, weather-now context, forecast-availability timing and trusted-snapshot protection. Tranche 24 fixes sea-day wording, adds preferred-snapshot review and audit events, and keeps competing weather snapshots available for traceability. Tranche 24A repairs the More menu state and mobile layering across the shell. Tranche 25 adds route-level illustrative review scenarios, clearer weather-review state grouping, user-facing audit summaries and mobile-tight comparison cards while keeping every snapshot preserved. Live APIs remain absent apart from the approved weather source.

```text
complete-cruising/
|-- .git/                             Git repository metadata; not project knowledge
|-- .gitattributes                    Text-file normalisation configuration
|-- .gitignore                        Future app and local-tool exclusions
|-- .github/
|   `-- workflows/deploy.yml          GitHub Pages deployment workflow
|-- AGENTS.md                         Mandatory project-working instructions
|-- README.md                         Contributor-facing project introduction
|-- app/
|   |-- README.md                     Scaffold usage, current scope and base-path note
|   |-- index.html                    Vite HTML entry point
|   |-- package.json                  App scripts and dependencies
|   |-- package-lock.json             Reproducible npm dependency lock
|   |-- vite.config.ts                Vite and GitHub Pages base-path config
|   |-- vitest.config.ts              Component-test configuration
|   |-- tsconfig.json                 TypeScript project references
|   |-- tsconfig.app.json             Browser-source TypeScript config
|   |-- tsconfig.node.json            Tooling TypeScript config
|   |-- public/
|   |   |-- manifest.webmanifest       PWA install metadata
|   |   |-- sw.js                      Static app-shell service worker
|   |   |-- offline.html               Offline fallback document
|   |   `-- icons/                    Ocean Luxe PWA icon placeholders
|   `-- src/
|       |-- App.tsx                   Lightweight hash routing
|       |-- main.tsx                  React entry point
|       |-- vite-env.d.ts             Vite client types
|       |-- components/
|       |   |-- layout/AppShell.tsx
|       |   |-- navigation/TopNavigation.tsx
|       |   |-- navigation/MobileNavigation.tsx
|       |   |-- status/StatusChip.tsx
|       |   |-- status/ConfidenceChip.tsx
|       |   |-- status/PwaReadinessStatus.tsx
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
|       |-- hooks/usePwaReadiness.ts    Offline readiness state hook
|       |-- pwa/registerServiceWorker.ts
|       |                                  Production service-worker registration
|       |-- types/                      Inferred domain and import/export types
|       |-- schemas/                    Strict Zod entity and envelope schemas
|       |-- features/conditions/      Derived day-readiness services, badges and summary cards
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
|       |-- features/weather/
|       |   |-- openMeteoClient.ts    No-key Open-Meteo manual refresh client
|       |   |-- weatherCopy.ts
|       |   |-- weatherPresentation.ts
|       |   |-- weatherReadiness.ts
|       |   |-- weatherRefreshService.ts
|       |   |-- weatherStateService.ts
|       |   |-- weatherTypes.ts
|       |   |-- WeatherRefreshButton.tsx
|       |   |-- weatherReviewDemoService.ts
|       |   |-- WeatherSnapshotReviewPage.tsx
|       |   |-- WeatherSnapshotReviewPage.css
|       |   `-- components/
|       |       `-- WeatherSeasonalityPanel.tsx
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
|       |-- features/import-export/    JSON validation, safe import commit and local export workbench
|       |-- features/sailing-setup/    Guided local sailing shell and itinerary setup workflow
|       |-- features/enrichment-requests/
|       |                                  Structured request JSON and prompt generation
|       |-- features/maps/             MapLibre Port Atlas components, config, utilities and tests
|       |-- features/experience-pages.css
|       |                                  Shared Tranche 8 responsive styling
|       |-- routes/routeConfig.ts     Twelve implemented hash routes including Weather Review
|       |-- styles/
|       |   |-- tokens.css            Ocean Luxe design tokens
|       |   |-- base.css              Global and accessibility foundations
|       |   |-- app-shell.css         Shell and landing layout
|       |   |-- components.css        Shared component treatments
|       |   `-- responsive.css        Responsive shell behaviour
|       |-- tests/App.test.tsx        View, trust metadata, import/export and routing tests
|       |-- tests/conditionsComponents.test.tsx
|       |                                  Day readiness panel, condition badge and summary card render tests
|       |-- tests/dayReadinessService.test.ts
|       |                                  Derived readiness scoring and trust-state tests
|       |-- tests/deploymentReadiness.test.ts
|       |                                  GitHub Pages deployment readiness checks
|       |-- tests/pwaAssets.test.ts   PWA manifest and service-worker asset checks
|       |-- tests/weatherClient.test.ts
|       |                                  Open-Meteo client mapping tests
|       |-- tests/weatherComponents.test.tsx
|       |                                  Weather card and refresh-button render tests
|       |-- tests/weatherConflictService.test.ts
|       |                                  Deterministic conflict-detection threshold tests
|       |-- tests/weatherReadiness.test.ts
|       |                                  Forecast-window and readiness classification tests
|       |-- tests/weatherRefresh.test.ts
|       |                                  Manual refresh, overwrite-protection and snapshot tests
|       |-- tests/weatherReviewComponents.test.tsx
|       |                                  Sea-day wording and review-copy render tests
|       |-- tests/weatherReviewDemoService.test.ts
|       |                                  Deterministic review-demo seed and restore tests
|       |-- tests/weatherSnapshotReviewPage.test.tsx
|       |                                  Weather Review route state and audit presentation tests
|       |-- tests/weatherSnapshotReviewService.test.ts
|       |                                  Preferred-pointer and review-event persistence tests
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
|   |-- 12-import-preview-v0.1.md      Tranche 12 implementation record
|   |-- 13-import-commit-and-export-v0.1.md
|   |                                  Tranche 13 implementation record
|   |-- 14-pwa-and-offline-readiness-v0.1.md
|   |                                  Tranche 14 implementation record
|   |-- 15-github-pages-deployment-v0.1.md
|   |                                  Tranche 15 implementation record
|   |-- 16-production-smoke-test-and-release-hardening-v0.1.md
|   |                                  Tranche 16 implementation record
|   |-- 17-sailing-setup-and-enrichment-request-workflow-v0.1.md
|   |                                  Tranche 17 implementation record
|   |-- 18A-sailing-shell-enrichment-import-mapper-v0.1.md
|   |                                  Tranche 18A implementation record
|   |-- 18B-mvp-recovery-real-sailing-onboarding-and-guidebook-mode-v0.1.md
|   |                                  Tranche 18B implementation record
|   |-- 19-mvp-cruise-usability-and-visual-polish-v0.1.md
|   |                                  Tranche 19 implementation record
|   |-- 20-cartographic-port-atlas-and-map-context-v0.1.md
|   |                                  Tranche 20 implementation record
|   |-- 21-cruise-weather-intelligence-v0.1.md
|   |                                  Tranche 21 implementation record
|   |-- 21A-enrichment-workflow-contract-repair-v0.1.md
|   |                                  Tranche 21A implementation record
|   |-- 22-cruise-conditions-and-day-readiness-v0.1.md
|   |                                  Tranche 22 implementation record
|   |-- 23-open-meteo-manual-weather-refresh-v0.1.md
|   |                                  Tranche 23 implementation record
|   |-- 24-weather-snapshot-review-and-conflict-resolution-v0.1.md
|   |                                  Tranche 24 implementation record
|   |-- 24A-more-navigation-menu-repair-v0.1.md
|   |                                  Corrective navigation repair record
|   |-- 25-weather-snapshot-review-workflow-polish-v0.1.md
|   |                                  Tranche 25 implementation record
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
| [../.github/workflows/deploy.yml](../.github/workflows/deploy.yml) | Deployment workflow | Builds, validates, uploads and deploys `app/dist` to GitHub Pages through GitHub Actions. |
| [README.md](README.md) | Project knowledge | Living repository inventory, knowledge router, current-state summary and gap register. |
| [01-product-specification-v0.1.md](01-product-specification-v0.1.md) | Product foundation | Defines the vision, audience, journeys, scope, information architecture, product-level data concepts, enrichment philosophy, visual ambition and success criteria. |
| [02-enrichment-framework-v0.1.md](02-enrichment-framework-v0.1.md) | Trust and content foundation | Defines targeted enrichment packs, source hierarchy, confidence, review and refresh metadata, review workflow, family lenses, import standards and anti-patterns. |
| [03-data-model-v0.1.md](03-data-model-v0.1.md) | Data foundation | Defines conceptual entities, relationships, enumerations, protected-field conflict rules, quality rules and the boundary between reusable guidebook data and sailing-specific records. |
| [04-visual-experience-brief-v0.1.md](04-visual-experience-brief-v0.1.md) | Experience foundation | Defines Ocean Luxe visual direction, layout and card systems, core screens, interaction, responsiveness, accessibility, imagery and the visual acceptance bar. |
| [05-html-prototype-specification-v0.1.md](05-html-prototype-specification-v0.1.md) | Prototype specification | Defines the expected standalone prototype, sample sailing content, page sections, interactions, responsive behaviour, CSS approach and prototype acceptance criteria. It is a specification, not the prototype itself. |
| [06-technical-architecture-v0.1.md](06-technical-architecture-v0.1.md) | Technical foundation | Defines the target PWA architecture, stack, source structure, local data, imports and exports, offline behaviour, security, testing, deployment and architectural decisions. |
| [07-build-plan-v0.1.md](07-build-plan-v0.1.md) | Delivery foundation | Converts the foundations into ordered implementation tranches with deliverables, acceptance criteria, validation expectations and suggested commit messages. |
| [12-import-preview-v0.1.md](12-import-preview-v0.1.md) | Tranche record | Documents supported JSON import previews, validation, protected-field handling, safety boundaries, testing and limitations. |
| [13-import-commit-and-export-v0.1.md](13-import-commit-and-export-v0.1.md) | Tranche record | Documents safe validated import commits, ImportBatch auditing, protected-field confirmation, full backup export, sailing export and Adventure Almanac draft export. |
| [14-pwa-and-offline-readiness-v0.1.md](14-pwa-and-offline-readiness-v0.1.md) | Tranche record | Documents install metadata, app icon placeholders, conservative app-shell service-worker caching, offline fallback, readiness UI, validation and limitations. |
| [15-github-pages-deployment-v0.1.md](15-github-pages-deployment-v0.1.md) | Tranche record | Documents the GitHub Pages target path, Vite base-path handling, hash routing, Pages workflow, PWA publication checks, local validation and limitations. |
| [16-production-smoke-test-and-release-hardening-v0.1.md](16-production-smoke-test-and-release-hardening-v0.1.md) | Tranche record | Documents production build and preview verification, GitHub Pages workflow review, path-scoped manifest and service-worker checks, offline smoke testing, responsive sanity checks, known limitations and release-readiness judgement. |
| [17-sailing-setup-and-enrichment-request-workflow-v0.1.md](17-sailing-setup-and-enrichment-request-workflow-v0.1.md) | Tranche record | Documents the guided Create sailing flow, enrichment request contract, six prompt types, return schema handling, import-preview relationship, privacy exclusions, validation and limitations. |
| [18A-sailing-shell-enrichment-import-mapper-v0.1.md](18A-sailing-shell-enrichment-import-mapper-v0.1.md) | Tranche record | Documents the safe mapper for `complete-cruising-sailing-shell-enrichment-v1`, including target-sailing checks, enrichment-run and section upserts, reviewed-section overwrite blocking, ImportBatch auditing, validation and limitations. |
| [18B-mvp-recovery-real-sailing-onboarding-and-guidebook-mode-v0.1.md](18B-mvp-recovery-real-sailing-onboarding-and-guidebook-mode-v0.1.md) | Tranche record | Documents MVP recovery around the real Sun Princess 2026 sailing, guarded Data Management controls, setup date generation, guidebook navigation mode, protected-field behaviour, validation and limitations. |
| [19-mvp-cruise-usability-and-visual-polish-v0.1.md](19-mvp-cruise-usability-and-visual-polish-v0.1.md) | Tranche record | Documents the MVP cruise usability polish pass across Dashboard, pre-cruise Today, Itinerary, Ports, Ship, backstage More/Manage, empty states, prototype comparison, validation and limitations. |
| [20-cartographic-port-atlas-and-map-context-v0.1.md](20-cartographic-port-atlas-and-map-context-v0.1.md) | Tranche record | Documents the MapLibre/OpenFreeMap Port Atlas, centralised attribution/configuration, coordinate handling, missing-coordinate fallback, loading/error states, offline limits, validation and non-goals. |
| [21-cruise-weather-intelligence-v0.1.md](21-cruise-weather-intelligence-v0.1.md) | Tranche record | Documents the Open-Meteo-backed cruise weather layer, local snapshot persistence, refresh states, route badges, Today and port weather cards, validation and limitations. |
| [21A-enrichment-workflow-contract-repair-v0.1.md](21A-enrichment-workflow-contract-repair-v0.1.md) | Tranche record | Documents the six-type enrichment workflow repair, managed sailing setup, governed JSON-only prompts, safe preview/commit routing, validation and limitations. |
| [22-cruise-conditions-and-day-readiness-v0.1.md](22-cruise-conditions-and-day-readiness-v0.1.md) | Tranche record | Documents the derived readiness model, weather interpretation rules, affected screens, validation and limitations for Cruise Conditions and Day Readiness. |
| [23-open-meteo-manual-weather-refresh-v0.1.md](23-open-meteo-manual-weather-refresh-v0.1.md) | Tranche record | Documents the manual-only Open-Meteo refresh flow, forecast-window handling, source attribution, overwrite rules, validation and limitations. |
| [build-plan/tranche-plan-v0.1.md](build-plan/tranche-plan-v0.1.md) | Delivery tracker | Concise tranche sequence for implementation; subordinate to the detailed Build Plan v0.1 and intended to evolve transparently. |
| [decisions/0001-project-start.md](decisions/0001-project-start.md) | Decision record | Records the accepted local-first static PWA, prototype-reference, tranche-delivery, no-live-API MVP and sample-data privacy decisions. |
| [../prototypes/v0.1/complete-cruising-prototype-v0.1.html](../prototypes/v0.1/complete-cruising-prototype-v0.1.html) | Authoritative visual reference | Standalone Ocean Luxe concept prototype. Use it to preserve the proven visual direction during production implementation; it is reference material, not production code. |
| [../samples/sailings/sun-princess-mediterranean-2026.sample.json](../samples/sailings/sun-princess-mediterranean-2026.sample.json) | Illustrative sample data | Non-sensitive sailing shell for Rome to Barcelona; it is not a confirmed itinerary or booking record. |
| [../samples/ships/sun-princess.sample.json](../samples/ships/sun-princess.sample.json) | Illustrative sample data | Lightweight reusable Sun Princess guidebook record, explicitly marked partial and illustrative. |
| [../samples/ports/naples.sample.json](../samples/ports/naples.sample.json) | Illustrative sample data | Lightweight reusable Naples guidebook record, explicitly marked partial and illustrative. |
| [../enrichment/prompts/README.md](../enrichment/prompts/README.md) | Enrichment workspace guidance | Reserves the prompt area for small, structured packs while preserving trust metadata and record boundaries. |
| [../enrichment/imports/README.md](../enrichment/imports/README.md) | Enrichment workspace guidance | Reserves the import staging area and states that staged files are neither trusted nor committed data. |
| [../enrichment/reviewed/README.md](../enrichment/reviewed/README.md) | Enrichment workspace guidance | Reserves the reviewed-output area without allowing reviewed content to overwrite trusted data silently. |
| [../app/README.md](../app/README.md) | App guidance | Records scaffold commands, current scope, local preview usage, the sailing shell enrichment mapper, production-smoke note and the `/complete-cruising/` GitHub Pages base-path decision. |
| [../app/package.json](../app/package.json) and [package-lock.json](../app/package-lock.json) | App configuration | Define sandbox-compatible development, preview and validation scripts plus locked React, TypeScript, Vite, Vitest, Testing Library, Dexie, Zod and MapLibre dependencies. |
| [../app/index.html](../app/index.html) | App entry point | Provides the static Vite document shell using British English document metadata, manifest link, theme colour and app icons. |
| [../app/public/manifest.webmanifest](../app/public/manifest.webmanifest), [sw.js](../app/public/sw.js), [offline.html](../app/public/offline.html) and [icons](../app/public/icons/complete-cruising-icon.svg) | PWA assets | Define install metadata, Ocean Luxe icon placeholders, production static app-shell caching, deduplicated shell pre-cache URLs and the offline fallback document without live API dependencies. |
| [../app/vite.config.ts](../app/vite.config.ts) and [vitest.config.ts](../app/vitest.config.ts) | Tooling configuration | Configure React builds, the documented GitHub Pages base path and jsdom component tests. |
| [../app/tsconfig.json](../app/tsconfig.json), [tsconfig.app.json](../app/tsconfig.app.json) and [tsconfig.node.json](../app/tsconfig.node.json) | TypeScript configuration | Separate browser-source and tooling checks through TypeScript project references. |
| [../app/src/App.tsx](../app/src/App.tsx), [main.tsx](../app/src/main.tsx), [pwa/registerServiceWorker.ts](../app/src/pwa/registerServiceWorker.ts) and [vite-env.d.ts](../app/src/vite-env.d.ts) | App source | Compose and mount the Ocean Luxe shell with lightweight hash switching across implemented routes and production service-worker registration. |
| [../app/src/components/layout/AppShell.tsx](../app/src/components/layout/AppShell.tsx), [navigation](../app/src/components/navigation/TopNavigation.tsx), [status](../app/src/components/status/PwaReadinessStatus.tsx), [surfaces](../app/src/components/surfaces/CardSurface.tsx) and [visual](../app/src/components/visual/BrandMark.tsx) components | Shell components | Provide maintainable layout, responsive navigation, status, confidence, offline readiness, surface, brand and route-motif primitives. |
| [../app/src/routes/routeConfig.ts](../app/src/routes/routeConfig.ts) and [data/sampleData.ts](../app/src/data/sampleData.ts) | App routing | Define implemented hash routes across Dashboard, Today, Itinerary, Ports, Ship, Plans, Family, Memories, Sailing Setup, Guidebook Tools, Import / Export and Data Safety while retaining shell metadata placeholders. |
| [../app/src/data/sampleDashboardData.ts](../app/src/data/sampleDashboardData.ts), [sampleItineraryData.ts](../app/src/data/sampleItineraryData.ts), [sampleTodayData.ts](../app/src/data/sampleTodayData.ts), [sampleShipData.ts](../app/src/data/sampleShipData.ts), [samplePortData.ts](../app/src/data/samplePortData.ts) and [sampleExperienceData.ts](../app/src/data/sampleExperienceData.ts) | Legacy presentation fixtures | Retain visual view-model types and historical illustrative reference data; runtime screens no longer import their sample values. |
| [../app/src/features/conditions](../app/src/features/conditions/conditionTypes.ts), [dayReadinessService.ts](../app/src/features/conditions/dayReadinessService.ts) and [conditions.css](../app/src/features/conditions/conditions.css) | Tranche 22 readiness feature | Implements derived cruise-condition and day-readiness scoring, view helpers and Ocean Luxe conditions panels without writing new persistent records. |
| [../app/src/features/dashboard/DashboardPage.tsx](../app/src/features/dashboard/DashboardPage.tsx), [DashboardPage.css](../app/src/features/dashboard/DashboardPage.css) and [dashboard components](../app/src/features/dashboard/components/SailingHero.tsx) | Dashboard feature | Implement the cinematic active-sailing hero, route ribbon, cruise weather outlook card, cruise conditions summary, metrics and voyage-readiness cards as maintainable React components. |
| [../app/src/data/sampleItineraryData.ts](../app/src/data/sampleItineraryData.ts) | Itinerary sample data | Supplies 15 illustrative days across embarkation, nine port calls, four sea days and disembarkation with confidence, review and refresh metadata. |
| [../app/src/features/itinerary/ItineraryPage.tsx](../app/src/features/itinerary/ItineraryPage.tsx), [ItineraryPage.css](../app/src/features/itinerary/ItineraryPage.css) and [itinerary components](../app/src/features/itinerary/components/ItineraryTimeline.tsx) | Itinerary feature | Implement the route summary, legend, horizontal desktop timeline, vertical mobile timeline and visually differentiated day cards with weather chips, readiness badges, guidance and refresh controls. |
| [../app/src/data/sampleTodayData.ts](../app/src/data/sampleTodayData.ts) | Today sample data | Supplies the illustrative Naples operational day, weather, plans, checklist, local context and protected confidence/refresh notes. |
| [../app/src/features/today/TodayPage.tsx](../app/src/features/today/TodayPage.tsx), [TodayPage.css](../app/src/features/today/TodayPage.css) and [Today components](../app/src/features/today/components/TodayAshorePanel.tsx) | Today feature | Implement the pre-cruise companion state, five-second operational summary, prominent all-aboard time, day readiness board, return buffer, weather and comfort card, plan, checklist, Seb discovery and confidence notes. |
| [24A-more-navigation-menu-repair-v0.1.md](24A-more-navigation-menu-repair-v0.1.md) | Tranche record | Documents the More-menu corrective fix, root cause, behaviour changes, responsive smoke validation, limitations and suggested commit message. |
| [25-weather-snapshot-review-workflow-polish-v0.1.md](25-weather-snapshot-review-workflow-polish-v0.1.md) | Tranche record | Documents the Weather Review workflow polish, illustrative demo controls, responsive smoke validation, known limitations and the next narrow tranche. |
| [../app/src/features/weather/openMeteoClient.ts](../app/src/features/weather/openMeteoClient.ts), [weatherCopy.ts](../app/src/features/weather/weatherCopy.ts), [weatherPresentation.ts](../app/src/features/weather/weatherPresentation.ts), [weatherReadiness.ts](../app/src/features/weather/weatherReadiness.ts), [weatherRefreshService.ts](../app/src/features/weather/weatherRefreshService.ts), [weatherReviewDemoService.ts](../app/src/features/weather/weatherReviewDemoService.ts), [weatherSnapshotConflictService.ts](../app/src/features/weather/weatherSnapshotConflictService.ts), [weatherSnapshotReviewService.ts](../app/src/features/weather/weatherSnapshotReviewService.ts), [weatherStateService.ts](../app/src/features/weather/weatherStateService.ts), [weatherTypes.ts](../app/src/features/weather/weatherTypes.ts), [WeatherRefreshButton.tsx](../app/src/features/weather/WeatherRefreshButton.tsx), [WeatherSnapshotReviewPage.tsx](../app/src/features/weather/WeatherSnapshotReviewPage.tsx) and [WeatherSeasonalityPanel.tsx](../app/src/features/weather/components/WeatherSeasonalityPanel.tsx) | Tranche 21, 23, 24 and 25 weather feature | Implements the no-key Open-Meteo client, forecast-window helpers, trust-aware manual refresh flow, local snapshot mapping, preferred-snapshot conflict detection, review-event auditing, illustrative review-demo seeding, polished weather review UI, sea-day-safe copy helpers, button-state labels and the port seasonality panel while preserving confidence, review and refresh metadata. |
| [../app/src/data/sampleShipData.ts](../app/src/data/sampleShipData.ts) | Ship guide sample data | Supplies a reusable, explicitly illustrative Sun Princess handbook record with seven guide sections and visible confidence, review and refresh metadata. |
| [../app/src/features/ship/ShipPage.tsx](../app/src/features/ship/ShipPage.tsx), [ShipPage.css](../app/src/features/ship/ShipPage.css) and [Ship components](../app/src/features/ship/components/ShipHero.tsx) | Ship guide feature | Implement the premium ship hero, handbook facts, enrichment readiness and seven editorial guide cards without mixing ship knowledge into sailing-specific records. |
| [../app/src/data/samplePortData.ts](../app/src/data/samplePortData.ts) | Port guide sample data | Supplies a reusable, explicitly illustrative Naples guidebook record with separate attraction ideas and visible confidence, review and refresh metadata. |
| [../app/src/data/sampleExperienceData.ts](../app/src/data/sampleExperienceData.ts) | Tranche 8 sample data | Keeps sailing-specific Naples shore plans and memory prompts separate from reusable port context, while supplying non-sensitive Family Guide presentation data and visible trust metadata. |
| [../app/src/data/sampleSchemaData.ts](../app/src/data/sampleSchemaData.ts) | Tranche 9 canonical samples | Provides non-sensitive schema-aligned sailing, itinerary, ship, port, attraction, shore plan, Today, weather, enrichment, memory and Almanac fixtures derived from the existing illustrative presentation content. |
| [../app/src/db](../app/src/db/index.ts), [hooks/useLocalData.ts](../app/src/hooks/useLocalData.ts), [hooks/usePwaReadiness.ts](../app/src/hooks/usePwaReadiness.ts) and [data/viewModelMappers.ts](../app/src/data/viewModelMappers.ts) | Tranche 10-14 local data flow | Defines the Dexie database, safe illustrative seeding, screen repository bundles, live feature hooks, offline readiness metadata and explicit mapping into Ocean Luxe visual models. The weather tranche extends this foundation with version 3 preferred-snapshot and review-event access. |
| [../app/src/db/repositories/weatherRepository.ts](../app/src/db/repositories/weatherRepository.ts), [weatherSnapshotReviewRepository.ts](../app/src/db/repositories/weatherSnapshotReviewRepository.ts) and [../app/src/db/completeCruisingDb.ts](../app/src/db/completeCruisingDb.ts) | Tranche 21 and 24 weather persistence | Provide local weather snapshot lookups, preferred-snapshot access, review-event storage, refresh-state queries, non-destructive upserts and the version 3 weather snapshot review store. |
| [../app/src/tests/database.test.ts](../app/src/tests/database.test.ts) | Tranche 10 database tests | Verifies schema creation, seed idempotency, clear/reseed behaviour, repositories, record separation and trust metadata using a test-only IndexedDB polyfill. |
| [../app/src/types](../app/src/types/index.ts) | Tranche 9 data types | Exposes shared, cruise, guidebook, plan, memory and import/export TypeScript types inferred from the canonical Zod schemas to prevent type drift. |
| [../app/src/schemas](../app/src/schemas/index.ts) | Tranche 9, 13 and 18A validation | Defines strict shared metadata and core entity schemas plus versioned import/export envelopes, enriched section content fields, nullable confidence review dates and ImportBatch audit metadata. |
| [../app/src/features/import-export](../app/src/features/import-export/ImportExportPage.tsx) | Tranche 12-13, 18A and 21A import/export workflow | Implements the Ocean Luxe import workbench, six schema-aware governed return paths, ID-based IndexedDB comparison, trust warnings, protected-field confirmation, transactional local commits and full backup, sailing and Adventure Almanac draft JSON exports. |
| [../app/src/features/sailing-setup](../app/src/features/sailing-setup/SailingSetupPage.tsx) | Tranche 17 and 21A sailing setup workflow | Implements the guided Create sailing route plus existing-sailing management, sailing shell persistence, guarded archive/delete handling, manual itinerary rows, origin/trust summary and local-first repository reuse for cruise lines, ships and ports. |
| [../app/src/features/enrichment-requests](../app/src/features/enrichment-requests/EnrichmentRequestsPage.tsx) | Tranche 17 and 21A enrichment request workflow | Implements the shared six-type request catalogue, calmer type-first filter flow, governed JSON-only prompt generation, copy/export UI and exact return-schema alignment without live research or automatic model calls. |
| [../app/src/features/ports/PortGuidePage.tsx](../app/src/features/ports/PortGuidePage.tsx), [PortGuidePage.css](../app/src/features/ports/PortGuidePage.css) and [Port Guide components](../app/src/features/ports/components/PortPostcard.tsx) | Port guide feature | Implement the warm postcard hero, practical guide sections, separate attraction cards, restrained family lens, photography prompt, weather seasonality panel and uncertainty notes without mixing port knowledge into itinerary-day timings. |
| [../app/src/features/maps](../app/src/features/maps/mapConfig.ts) and [../app/src/features/ports/portAtlasViewModel.ts](../app/src/features/ports/portAtlasViewModel.ts) | Port Atlas feature | Implements the constrained MapLibre/OpenFreeMap map layer, provider configuration, Ocean Luxe map surfaces, loading/error/missing-coordinate fallbacks, coordinate utilities, route-order view model and tests without geocoding, routing, geolocation or tile caching. |
| [../app/src/features/plans/PlansPage.tsx](../app/src/features/plans/PlansPage.tsx), [family/FamilyGuidePage.tsx](../app/src/features/family/FamilyGuidePage.tsx), [memories/MemoriesPage.tsx](../app/src/features/memories/MemoriesPage.tsx) and [experience-pages.css](../app/src/features/experience-pages.css) | Tranche 8 experience features | Implement three premium Naples experience routes, selected plan comparison, Seb discovery, reflective memory prompts and a non-functional Adventure Almanac export preview. |
| [../app/src/styles/tokens.css](../app/src/styles/tokens.css), [base.css](../app/src/styles/base.css), [app-shell.css](../app/src/styles/app-shell.css), [components.css](../app/src/styles/components.css) and [responsive.css](../app/src/styles/responsive.css) | App styles | Translate Ocean Luxe into shared tokens, atmospheric backgrounds, reusable surfaces, accessible focus states and responsive layouts. |
| [../app/src/tests/App.test.tsx](../app/src/tests/App.test.tsx), [conditionsComponents.test.tsx](../app/src/tests/conditionsComponents.test.tsx), [dayReadinessService.test.ts](../app/src/tests/dayReadinessService.test.ts), [deploymentReadiness.test.ts](../app/src/tests/deploymentReadiness.test.ts), [pwaAssets.test.ts](../app/src/tests/pwaAssets.test.ts), [weatherClient.test.ts](../app/src/tests/weatherClient.test.ts), [weatherComponents.test.tsx](../app/src/tests/weatherComponents.test.tsx), [weatherReadiness.test.ts](../app/src/tests/weatherReadiness.test.ts), [weatherRefresh.test.ts](../app/src/tests/weatherRefresh.test.ts), [weatherReviewDemoService.test.ts](../app/src/tests/weatherReviewDemoService.test.ts), [weatherSnapshotReviewPage.test.tsx](../app/src/tests/weatherSnapshotReviewPage.test.tsx), [importPreviewService.test.ts](../app/src/tests/importPreviewService.test.ts), [importCommitService.test.ts](../app/src/tests/importCommitService.test.ts), [exportService.test.ts](../app/src/tests/exportService.test.ts), [sailingSetupService.test.ts](../app/src/tests/sailingSetupService.test.ts), [enrichmentRequestService.test.ts](../app/src/tests/enrichmentRequestService.test.ts), [enrichmentReturnFixtures.ts](../app/src/tests/enrichmentReturnFixtures.ts), [database.test.ts](../app/src/tests/database.test.ts), [schemas.test.ts](../app/src/tests/schemas.test.ts) and [setup.ts](../app/src/tests/setup.ts) | App tests | Verify eleven routes, derived day readiness, manual weather refresh classification, Open-Meteo mapping, overwrite protection, weather UI rendering, deterministic weather-review demo seeding, route-level review-state presentation, local data flows, repository separation, schema validity, six-type governed return previews, transactional import commits, ImportBatch auditing, sailing setup management guardrails, enrichment request/prompt generation, local JSON export payloads, PWA app-shell assets and GitHub Pages deployment readiness. |

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

- automated visual regression references;

## Maintenance rules

Update this index whenever a tranche adds, removes, renames or supersedes a project file.

- Add new knowledge-bearing files to both the tree and inventory table.
- Mark superseded documents clearly; do not silently replace or delete trusted project knowledge.
- Keep generated files, dependency folders and build output out of the knowledge inventory unless they are deliberate reference artefacts.
- Record absent-but-expected artefacts under current repository gaps.
- When a gap is filled, remove it from the gap register and add the new file to the inventory.
- Preserve version labels on fixed foundation artefacts. Keep this `README.md` unversioned because it is a living index.

## Inventory validation

This inventory was updated from a recursive repository file listing with Git metadata, dependency folders, build output and coverage output excluded from the knowledge set. Every knowledge-bearing file present on 28 June 2026 is represented above.
