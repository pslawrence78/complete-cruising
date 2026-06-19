# Complete Cruising

## Technical Architecture v0.1

### Product context

**Complete Cruising** is a Lawrence Family Series application designed to become a visually rich, personalised cruise companion.

The application will manage cruise sailings, ship intelligence, port guidebook content, itinerary days, shore plans, weather snapshots, family notes, Seb discovery prompts, memory capture and structured enrichment imports.

The technical architecture must preserve the ambition defined in the Product Specification, Enrichment Framework, Data Model, Visual Experience Brief and HTML Prototype Specification.

The first standalone HTML prototype has proved the intended visual direction. The production app should now translate that direction into a maintainable PWA architecture.

---

# 1. Purpose of this architecture

This document defines the recommended technical architecture for Complete Cruising v0.1.

It should guide:

- repository setup
    
- local folder structure
    
- frontend stack
    
- PWA strategy
    
- local-first data storage
    
- data validation
    
- JSON import/export
    
- enrichment handling
    
- visual system translation
    
- offline behaviour
    
- GitHub Pages deployment
    
- testing expectations
    
- tranche-based development
    

The architecture must support a beautiful app, not merely a functional one.

---

# 2. Architectural position

Complete Cruising should be built as a **local-first static PWA**.

The first production version should not require:

- backend hosting
    
- user accounts
    
- cloud database
    
- paid APIs
    
- API keys
    
- server-side rendering
    
- authentication
    
- external cruise line integration
    

The app should run as a static web application, installable where supported, with its core data stored locally in the browser.

This keeps the first version practical, private, portable and deployable through GitHub Pages.

---

# 3. Architecture goals

The architecture should deliver the following goals.

## 3.1 Preserve the Ocean Luxe visual ambition

The app must not regress from the standalone HTML prototype into a plain admin interface.

The React implementation should preserve:

- deep ocean visual identity
    
- premium card system
    
- voyage route styling
    
- port postcard language
    
- Today ashore operational hierarchy
    
- ship guide richness
    
- Seb discovery warmth
    
- memory journal feel
    

## 3.2 Support structured cruise data

The app must be able to store and manage:

- sailings
    
- ships
    
- cruise lines
    
- itinerary days
    
- countries
    
- ports
    
- attractions
    
- shore plans
    
- day guides
    
- weather snapshots
    
- enrichment sections
    
- family notes
    
- document checklist items
    
- memory entries
    
- import batches
    
- Adventure Almanac exports
    

## 3.3 Support targeted enrichment workflows

The app must allow enriched JSON to be imported in small, isolated, reviewable packs.

A port logistics import should not be treated the same as a ship dining import or a day guide import.

## 3.4 Be offline-capable

Cruise travel creates weak-connectivity scenarios.

The app should make core sailing, itinerary, port and ship guide content available offline once loaded.

## 3.5 Avoid unnecessary complexity

The first version should be a high-quality local PWA. It should avoid premature backend, authentication and live integration work.

## 3.6 Make future growth possible

The architecture should not block later additions such as:

- weather refresh
    
- MapLibre route views
    
- Properly Packed integration
    
- Officially Organised reminder export
    
- Adventure Almanac import/export
    
- cloud sync
    
- richer media support
    

---

# 4. Recommended technology stack

## 4.1 Application framework

Recommended:

```text
React + TypeScript + Vite
```

Rationale:

- consistent with modern PWA development
    
- suitable for component-led UI
    
- strong TypeScript support
    
- deployable as static files
    
- appropriate for GitHub Pages
    
- suitable for Codex-driven tranche development
    

## 4.2 Styling approach

Recommended for v0.1:

```text
CSS Modules or structured CSS files with design tokens
```

Tailwind CSS is not required for the first implementation.

The visual ambition of Complete Cruising is high. The app needs rich backgrounds, complex cards, custom responsive behaviour, subtle nautical motifs and premium visual treatments. A handcrafted design-token approach may preserve the prototype character better than forcing every visual decision through utility classes.

Possible approach:

```text
src/styles/
  tokens.css
  base.css
  layout.css
  components.css
  responsive.css
```

Or:

```text
Component.module.css
```

The key rule is simple:

**Do not let the implementation flatten the Ocean Luxe design language.**

## 4.3 Local database

Recommended:

```text
Dexie.js over IndexedDB
```

Rationale:

- browser-native persistence through IndexedDB
    
- suitable for local-first data
    
- supports structured records
    
- avoids backend dependency
    
- easier developer experience than raw IndexedDB
    
- suitable for offline cruise use
    

## 4.4 Data validation

Recommended:

```text
Zod
```

Rationale:

- validates imported JSON
    
- provides TypeScript-aligned schemas
    
- supports safe parsing of untrusted import data
    
- helps prevent broken enrichment imports
    
- allows clear validation error messages
    

## 4.5 Routing

Recommended:

```text
React Router or lightweight route state
```

For v0.1, use a small route structure rather than over-engineering navigation.

Suggested routes:

```text
/
 /sailings
 /sailings/:sailingId
 /sailings/:sailingId/itinerary
 /sailings/:sailingId/today
 /ships/:shipId
 /ports
 /ports/:portId
 /plans
 /family-guide
 /memories
 /import-export
 /settings
```

GitHub Pages deployment needs careful route handling. Hash routing may be simplest for early static deployment.

Recommended initial choice:

```text
HashRouter
```

Future option:

```text
BrowserRouter with GitHub Pages fallback handling
```

## 4.6 PWA support

Recommended:

```text
Web app manifest + service worker
```

Initial PWA support should include:

- app name
    
- icons
    
- theme colour
    
- display mode
    
- static asset caching
    
- offline app shell
    
- last refreshed metadata in UI
    

Do not over-invest in complex service worker behaviour in the first tranche.

## 4.7 Testing

Recommended:

```text
Vitest for unit tests
React Testing Library for component tests
Playwright later for visual and flow testing
```

Initial tranches should at least include:

- data schema tests
    
- import validation tests
    
- key utility tests
    
- basic render tests for major screens
    

Visual validation can start manually using the standalone prototype as reference, then become more formal later.

---

# 5. Deployment architecture

## 5.1 Target deployment

Primary target:

```text
GitHub Pages
```

Likely public URL:

```text
https://pslawrence78.github.io/complete-cruising/
```

Possible custom domain path later:

```text
https://www.lawnetcloud.uk/complete-cruising/
```

## 5.2 Static hosting requirement

The app must build to static files.

Output:

```text
dist/
```

The app should not depend on runtime server routes.

## 5.3 Base path

The Vite base path must be configured for GitHub Pages path deployment.

Expected setting:

```text
base: "/complete-cruising/"
```

This may need adjustment if deployed under a custom domain path.

## 5.4 GitHub Actions

A later tranche should add GitHub Actions deployment.

Initial development can use manual local build.

Recommended eventual workflow:

```text
push to main
  -> install dependencies
  -> run tests
  -> build
  -> deploy dist to GitHub Pages
```

## 5.5 Security and privacy

The app should initially be treated as private or non-public while it contains family-specific sample data.

If published publicly, sample data should be carefully reviewed.

Family-sensitive content should not be exposed through a public GitHub Pages site unless intentionally sanitised.

---

# 6. Repository structure

Recommended repository name:

```text
complete-cruising
```

Recommended structure:

```text
complete-cruising/
├─ README.md
├─ AGENTS.md
├─ .gitignore
├─ docs/
│  ├─ 01-product-specification-v0.1.md
│  ├─ 02-enrichment-framework-v0.1.md
│  ├─ 03-data-model-v0.1.md
│  ├─ 04-visual-experience-brief-v0.1.md
│  ├─ 05-html-prototype-specification-v0.1.md
│  ├─ 06-technical-architecture-v0.1.md
│  ├─ decisions/
│  │  └─ 0001-project-start.md
│  └─ build-plan/
│     └─ tranche-plan-v0.1.md
├─ prototypes/
│  └─ v0.1/
│     └─ complete-cruising-prototype-v0.1.html
├─ samples/
│  ├─ sailings/
│  │  └─ sun-princess-mediterranean-2026.sample.json
│  ├─ ships/
│  │  └─ sun-princess.sample.json
│  └─ ports/
│     └─ naples.sample.json
├─ enrichment/
│  ├─ prompts/
│  ├─ imports/
│  └─ reviewed/
└─ app/
   ├─ package.json
   ├─ vite.config.ts
   ├─ tsconfig.json
   ├─ index.html
   ├─ public/
   │  ├─ manifest.webmanifest
   │  └─ icons/
   └─ src/
      ├─ main.tsx
      ├─ App.tsx
      ├─ routes/
      ├─ components/
      ├─ features/
      ├─ data/
      ├─ db/
      ├─ schemas/
      ├─ styles/
      ├─ utils/
      └─ tests/
```

The `app/` folder should contain the actual PWA implementation.

The root repository should preserve docs, prototypes, samples and enrichment artefacts alongside the app.

---

# 7. App source structure

Recommended `app/src` structure:

```text
src/
├─ main.tsx
├─ App.tsx
├─ routes/
│  ├─ AppRoutes.tsx
│  └─ routeConfig.ts
├─ components/
│  ├─ layout/
│  ├─ cards/
│  ├─ navigation/
│  ├─ status/
│  └─ visual/
├─ features/
│  ├─ dashboard/
│  ├─ sailings/
│  ├─ itinerary/
│  ├─ today/
│  ├─ ships/
│  ├─ ports/
│  ├─ plans/
│  ├─ family-guide/
│  ├─ documents/
│  ├─ memories/
│  ├─ enrichment/
│  └─ import-export/
├─ data/
│  ├─ seed/
│  ├─ sampleData.ts
│  └─ constants.ts
├─ db/
│  ├─ completeCruisingDb.ts
│  ├─ repositories/
│  └─ seedDatabase.ts
├─ schemas/
│  ├─ commonSchemas.ts
│  ├─ sailingSchemas.ts
│  ├─ shipSchemas.ts
│  ├─ portSchemas.ts
│  ├─ enrichmentSchemas.ts
│  ├─ importSchemas.ts
│  └─ exportSchemas.ts
├─ styles/
│  ├─ tokens.css
│  ├─ base.css
│  ├─ app-shell.css
│  ├─ components.css
│  └─ responsive.css
├─ utils/
│  ├─ dateUtils.ts
│  ├─ itineraryUtils.ts
│  ├─ confidenceUtils.ts
│  ├─ importUtils.ts
│  └─ exportUtils.ts
└─ tests/
```

---

# 8. Visual architecture

The visual system should be treated as a first-class technical concern.

## 8.1 Design tokens

Create shared CSS variables for:

- colours
    
- shadows
    
- spacing
    
- border radii
    
- typography scale
    
- z-index layers
    
- transitions
    
- surface effects
    

Example categories:

```text
--colour-navy-950
--colour-ocean-700
--colour-teal-500
--colour-gold-400
--colour-ivory-100
--surface-glass
--surface-paper
--radius-card
--shadow-card
--space-section
```

## 8.2 Theme identity

Initial theme:

```text
Ocean Luxe
```

Theme characteristics:

- deep navy background
    
- ocean gradients
    
- ivory guidebook cards
    
- restrained gold accents
    
- teal active states
    
- coral caution accents
    
- subtle nautical chart texture
    
- route and port motifs
    

## 8.3 Component families

Create visual component families early.

Core visual components:

- AppShell
    
- TopNavigation
    
- MobileNavigation
    
- SailingHero
    
- RouteRibbon
    
- MetricCard
    
- StatusChip
    
- ConfidenceChip
    
- ItineraryTimeline
    
- ItineraryDayCard
    
- TodayAshorePanel
    
- AllAboardCard
    
- WeatherTile
    
- PortPostcard
    
- ShipGuideCard
    
- ShorePlanCard
    
- SebDiscoveryCard
    
- MemoryCard
    
- EnrichmentStatusCard
    
- ImportPreviewCard
    

## 8.4 Prototype translation rule

The HTML prototype is not production code, but it is a design reference.

Production components should preserve:

- the cinematic sailing hero
    
- the route timeline feel
    
- the Today operational hierarchy
    
- port postcard treatment
    
- ship guide cards
    
- Seb discovery card
    
- enrichment status language
    
- responsive behaviour
    

Do not copy the prototype blindly if better implementation patterns are available, but do not discard its design language.

---

# 9. Data architecture

## 9.1 Data model ownership

The Data Model v0.1 is the conceptual source of truth.

The implementation should translate it into:

- TypeScript types
    
- Zod schemas
    
- Dexie table definitions
    
- sample JSON files
    
- import validation logic
    

## 9.2 Recommended entity groups

### Core sailing entities

- CruiseLine
    
- Ship
    
- Cabin
    
- Traveller
    
- Sailing
    
- ItineraryDay
    

### Guidebook entities

- Country
    
- Port
    
- Attraction
    
- ShorePlan
    
- DayGuide
    

### Intelligence entities

- WeatherSnapshot
    
- EnrichmentRun
    
- EnrichmentSection
    
- SourceReference
    

### Family and memory entities

- DocumentChecklist
    
- DocumentItem
    
- FamilyNote
    
- MemoryEntry
    
- AdventureAlmanacExport
    

### System entities

- ImportBatch
    
- AppSetting
    

## 9.3 Initial simplification

The first implementation may simplify some entities if needed.

Acceptable early simplifications:

- store Traveller as names on Sailing
    
- store DocumentChecklist and DocumentItems together
    
- store SourceReference as sourceSummary text on EnrichmentSection
    
- seed sample data from static TypeScript before building full import
    

Not acceptable simplifications:

- flatten all data into one giant object
    
- remove confidence metadata
    
- remove review status
    
- remove separation between Port and ItineraryDay
    
- hard-code all app screens without a route to real data
    

---

# 10. Local database architecture

## 10.1 Database name

Recommended:

```text
completeCruisingDb
```

## 10.2 Versioning

Use explicit database versions.

Initial version:

```text
version 1
```

Future data migrations should be deliberate.

## 10.3 Suggested Dexie tables

```text
cruiseLines
ships
cabins
travellers
sailings
itineraryDays
countries
ports
attractions
shorePlans
dayGuides
weatherSnapshots
enrichmentRuns
enrichmentSections
documentChecklists
familyNotes
memoryEntries
adventureAlmanacExports
importBatches
appSettings
```

## 10.4 Indexing principles

Index fields needed for common queries.

Examples:

```text
sailings: id, status, departureDate, shipId
itineraryDays: id, sailingId, date, dayNumber, portId
ports: id, countryId, name
attractions: id, portId, type
shorePlans: id, itineraryDayId, portId, status
weatherSnapshots: id, itineraryDayId, forecastDate, snapshotType
enrichmentSections: id, parentType, parentId, sectionType, reviewStatus
memoryEntries: id, sailingId, itineraryDayId, adventureAlmanacReady
```

## 10.5 Data access pattern

Do not query Dexie directly from UI components.

Use repository or service functions.

Suggested pattern:

```text
features/sailings/useSailings.ts
db/repositories/sailingRepository.ts
db/completeCruisingDb.ts
```

This keeps UI components cleaner and makes future storage changes easier.

---

# 11. State management

## 11.1 Initial state approach

Recommended:

```text
React component state + custom hooks + Dexie live queries
```

Avoid adding a global state library in the first tranche unless there is a clear need.

## 11.2 App-level state

App-level state should include:

- active sailing ID
    
- selected itinerary day
    
- current route
    
- import preview state
    
- theme setting
    
- offline/readiness status
    

## 11.3 Derived state

Derived state should be calculated using utilities.

Examples:

- next upcoming sailing
    
- current cruise day
    
- next port
    
- itinerary completeness
    
- enrichment readiness
    
- document readiness
    
- active weather snapshot
    
- Adventure Almanac export readiness
    

---

# 12. Import and export architecture

## 12.1 Import philosophy

Imports are core to Complete Cruising.

The app should support structured JSON import for:

- sailing shell
    
- itinerary
    
- ship enrichment
    
- port enrichment
    
- attraction enrichment
    
- day guides
    
- weather snapshots
    
- memories
    
- full backup
    

## 12.2 Import flow

Recommended flow:

```text
Select import type
  -> paste or upload JSON
  -> parse
  -> validate with Zod
  -> detect target records
  -> identify conflicts
  -> preview proposed changes
  -> accept all or selected sections
  -> commit
  -> record ImportBatch
```

## 12.3 Import preview requirement

The app should never silently overwrite trusted data.

Preview should show:

- import type
    
- target object
    
- records to create
    
- records to update
    
- conflicts
    
- warnings
    
- confidence states
    
- refresh flags
    

## 12.4 Protected fields

The following should require explicit confirmation before overwrite:

- booking reference
    
- sailing dates
    
- ship
    
- cruise line
    
- cabin number
    
- itinerary date
    
- port name
    
- arrival time
    
- departure time
    
- all-aboard time
    
- completed memories
    

## 12.5 Export types

The app should support:

- full app backup
    
- sailing backup
    
- enrichment shell export
    
- ship enrichment export
    
- port enrichment export
    
- Adventure Almanac export
    
- readable JSON export for review
    

## 12.6 Schema versioning

Every import and export should include:

```text
schema
schemaVersion
createdAt
sourceApp
```

Example:

```text
schema: complete-cruising-sailing
schemaVersion: 1
sourceApp: Complete Cruising
```

---

# 13. Enrichment architecture

## 13.1 Enrichment units

The core unit is:

```text
EnrichmentSection
```

Each section attaches to:

- sailing
    
- ship
    
- port
    
- attraction
    
- itinerary day
    
- shore plan
    

## 13.2 Enrichment metadata

Each EnrichmentSection should include:

- parent type
    
- parent ID
    
- section type
    
- title
    
- short summary
    
- structured facts
    
- practical guidance
    
- family relevance
    
- watchouts
    
- confidence
    
- review status
    
- source type
    
- refresh flag
    
- last reviewed date
    

## 13.3 Enrichment run traceability

An EnrichmentRun should record:

- pack name
    
- generated date
    
- import date
    
- target object
    
- status
    
- validation warnings
    
- accepted sections
    
- rejected sections
    

## 13.4 Review state

Review states should remain visible in UI.

Supported states:

- not reviewed
    
- needs user review
    
- reviewed
    
- verified
    
- needs refresh
    
- stale
    
- rejected
    

## 13.5 UI integration

Enrichment should not sit hidden in a data area.

It should power:

- ship guide cards
    
- port guide cards
    
- Today view
    
- shore plan comparison
    
- confidence chips
    
- enrichment readiness dashboard
    

---

# 14. PWA and offline architecture

## 14.1 PWA scope for v0.1

Initial PWA behaviour should include:

- manifest
    
- installable app name
    
- app icons
    
- theme colour
    
- static asset caching
    
- offline shell
    
- local IndexedDB data
    

## 14.2 Offline priority

The app should make these available offline:

- dashboard shell
    
- active sailing
    
- itinerary
    
- Today guide
    
- port guide content
    
- ship guide content
    
- shore plans
    
- family notes
    
- memories
    
- documents checklist
    

Weather refresh and future external data will require connectivity.

## 14.3 Offline UI

The app should show:

- offline status
    
- last data update
    
- last weather refresh
    
- data confidence
    
- whether the sailing is ready for offline use
    

Possible label:

```text
Ready for sea
```

## 14.4 Service worker strategy

Initial strategy:

- cache static assets
    
- cache app shell
    
- do not cache dynamic remote API responses because none are used in v0.1
    

Future strategy:

- cache weather responses with timestamp
    
- expire stale weather
    
- allow manual refresh
    

---

# 15. Weather architecture

## 15.1 MVP weather behaviour

MVP should store weather manually or through imported JSON.

No live API should be introduced in the first build.

WeatherSnapshot records should support:

- climate expectation
    
- forecast
    
- same-day forecast
    
- observed weather
    
- source name
    
- generated date
    
- refresh status
    
- plan impact
    

## 15.2 Future weather integration

A later tranche may add no-key public weather APIs where suitable.

Candidate future direction:

- Open-Meteo for forecast and climate style data
    
- manual refresh button
    
- no stored API keys
    
- clear timestamp and confidence display
    

## 15.3 Weather rule

Weather should never be treated as permanent content.

Every weather card should show:

- snapshot type
    
- last updated
    
- source
    
- confidence
    
- refresh status
    

---

# 16. Relationship with other Lawrence Family apps

## 16.1 Properly Packed

Future integration:

- cruise-specific packing suggestions
    
- port-day bag
    
- sea-day bag
    
- formal night
    
- swim items
    
- tender day footwear
    
- sun protection
    
- travel documents
    

Initial architecture:

- prepare export shape only
    
- no live integration in v0.1
    

## 16.2 Adventure Almanac

Future integration:

- completed sailing export
    
- ports visited
    
- countries visited
    
- ship and cruise line
    
- memories
    
- Seb educational notes
    

Initial architecture:

- build AdventureAlmanacExport entity
    
- support JSON export
    
- no direct integration in v0.1
    

## 16.3 Officially Organised

Future integration:

- balance due
    
- check-in opens
    
- dining booking window
    
- excursion booking window
    
- passport reminders
    
- insurance review
    
- travel day reminders
    

Initial architecture:

- define reminder-ready fields
    
- no live calendar integration in v0.1
    

---

# 17. Security and privacy

## 17.1 Local-first privacy

Data is stored locally in the browser.

This avoids backend exposure but creates device-specific responsibility.

## 17.2 Public deployment caution

A GitHub Pages deployment is public unless otherwise protected.

Do not publish real sensitive family data unless intentionally sanitised.

## 17.3 Sensitive data rule

The app should track readiness rather than store sensitive identity values.

For example:

Use:

```text
Passports checked
Travel insurance saved
Cruise documents downloaded
```

Avoid storing:

```text
passport numbers
full policy numbers
medical information
private booking details
```

Unless there is a deliberate later decision to support a secure document vault.

## 17.4 Backup caution

JSON exports may contain family data.

Export screens should make this clear.

Suggested warning:

```text
This export may contain personal travel details. Store it carefully.
```

---

# 18. Accessibility architecture

Visual richness must not compromise usability.

## 18.1 Minimum requirements

- semantic HTML
    
- keyboard accessible navigation
    
- visible focus states
    
- strong contrast
    
- readable text sizes
    
- colour labels as text, not colour only
    
- reduced motion support
    
- no critical data hidden behind hover-only interactions
    

## 18.2 Mobile usability

Critical port-day data should be easy to read on a phone.

Priority data:

- all-aboard time
    
- departure time
    
- selected plan
    
- weather impact
    
- return buffer
    
- take ashore checklist
    

## 18.3 Motion

Animations should be subtle and optional.

Avoid constant movement.

---

# 19. Testing architecture

## 19.1 Early tests

Initial test coverage should prioritise data correctness.

Recommended tests:

- Zod schema validation
    
- import parsing
    
- conflict detection
    
- date utilities
    
- itinerary ordering
    
- confidence mapping
    
- export payload generation
    

## 19.2 Component tests

Test key render behaviour for:

- SailingHero
    
- ItineraryTimeline
    
- TodayAshorePanel
    
- PortPostcard
    
- ShipGuideCard
    
- ShorePlanCard
    
- SebDiscoveryCard
    
- ImportPreview
    

## 19.3 Manual visual testing

Every tranche that affects UI should be manually checked at:

- desktop width
    
- tablet width
    
- mobile width
    
- narrow mobile width
    

Minimum viewport checks:

```text
1440px
1024px
768px
430px
390px
```

The prototype should remain the visual reference.

## 19.4 Acceptance notes

Each tranche should end with:

- what changed
    
- validation performed
    
- known limitations
    
- suggested commit message
    
- next recommended tranche
    

---

# 20. Development workflow

## 20.1 Repo-first workflow

Development should happen against the GitHub repository, not loose files.

Recommended sequence:

1. Create repo
    
2. Add docs and prototype
    
3. Commit foundations
    
4. Create app scaffold
    
5. Commit scaffold
    
6. Build in tranches
    
7. Keep each tranche focused
    
8. Use pull requests or clear commits
    

## 20.2 Codex workflow

Codex should be given:

- current objective
    
- relevant artefact references
    
- strict scope
    
- acceptance criteria
    
- validation requirements
    
- commit message request
    

Codex should not be asked to “build the app” in one pass.

## 20.3 Tranche rule

Each tranche should be small enough to review.

Good tranche examples:

- scaffold the app and theme shell
    
- implement sample data model
    
- build dashboard from sample data
    
- implement itinerary timeline
    
- implement Today view
    
- implement Dexie database
    
- add import preview
    
- add ship guide
    
- add port guide
    

Poor tranche examples:

- build the full app
    
- implement all features
    
- create the complete cruise platform
    
- add all enrichment workflows at once
    

---

# 21. Initial development sequence

Recommended first implementation sequence:

## Tranche 0: Repository foundations

- README
    
- AGENTS.md
    
- docs
    
- prototype
    
- samples folder
    
- enrichment folder
    
- decisions folder
    

No app code.

## Tranche 1: App scaffold

- Vite React TypeScript app
    
- basic routing
    
- CSS tokens
    
- Ocean Luxe shell
    
- static sample data
    
- deployment-ready base config
    

## Tranche 2: Dashboard visual translation

- AppShell
    
- SailingHero
    
- metric cards
    
- voyage intelligence cards
    
- responsive layout
    

## Tranche 3: Itinerary and Today

- ItineraryTimeline
    
- ItineraryDayCard
    
- TodayAshorePanel
    
- AllAboardCard
    
- WeatherTile
    
- static sample data
    

## Tranche 4: Ship and Port guide previews

- Ship guide screen
    
- Port guide screen
    
- Port postcard
    
- attraction cards
    
- confidence chips
    

## Tranche 5: Shore plans, Family Guide and Memories

- ShorePlanCard
    
- plan selection
    
- SebDiscoveryCard
    
- MemoryCard
    
- Adventure Almanac readiness preview
    

## Tranche 6: Local database foundation

- Dexie setup
    
- seed sample data
    
- repository functions
    
- load dashboard from local DB
    

## Tranche 7: JSON schemas and import preview

- Zod schemas
    
- import type selector
    
- paste JSON
    
- validation preview
    
- no destructive commit yet
    

## Tranche 8: Commit imports and exports

- commit validated imports
    
- ImportBatch records
    
- full backup export
    
- Adventure Almanac export draft
    

## Tranche 9: PWA and GitHub Pages deployment

- manifest
    
- service worker
    
- installability
    
- static asset caching
    
- GitHub Pages workflow
    

This order allows the visual product to take shape early while the data foundation matures in controlled steps.

---

# 22. GitHub Pages considerations

## 22.1 Base path

The app must support path deployment.

Expected initial path:

```text
/complete-cruising/
```

## 22.2 Routing

Hash routing is recommended initially because it is simpler on static hosting.

Example URLs:

```text
/complete-cruising/#/
/complete-cruising/#/itinerary
/complete-cruising/#/today
```

This can be revisited later.

## 22.3 Public data caution

A GitHub Pages site is visible if the repository or Pages deployment is public.

Use sample or sanitised data for public builds.

## 22.4 Custom domain

A later custom domain path may be:

```text
https://www.lawnetcloud.uk/complete-cruising/
```

Deployment paths should be checked carefully if this changes.

---

# 23. AGENTS.md requirements

The repository should contain an `AGENTS.md` file.

Suggested instructions:

```text
This project is Complete Cruising, a Lawrence Family Series PWA.

Preserve the premium Ocean Luxe visual direction established by the standalone HTML prototype.

Do not reduce the app to a plain CRUD interface.

Use British English.

Avoid external APIs and API keys unless explicitly approved.

Build in small tranches.

Maintain separation between reusable guidebook records and sailing-specific itinerary records.

Preserve confidence metadata, review status and refresh status.

Do not overwrite trusted or confirmed data silently.

Every tranche must include validation notes, known limitations and a suggested commit message.
```

---

# 24. Architectural decisions

## Decision 1: Static local-first PWA

Chosen because it is private, portable, low-cost and suitable for GitHub Pages.

## Decision 2: React TypeScript Vite

Chosen for maintainable component development, static builds and compatibility with modern PWA development.

## Decision 3: Dexie IndexedDB

Chosen for local browser persistence without backend dependency.

## Decision 4: Zod schemas

Chosen to validate imported JSON and protect data quality.

## Decision 5: No live APIs in MVP

Chosen to avoid complexity, API keys and fragile dependencies.

## Decision 6: Handcrafted design system

Chosen to preserve the richness of the Ocean Luxe prototype.

## Decision 7: Hash routing initially

Chosen to simplify GitHub Pages static deployment.

## Decision 8: Enrichment as structured import

Chosen because targeted enrichment is a core product capability, not a side feature.

---

# 25. Known risks

## Risk 1: Visual quality drops during React conversion

Mitigation:

Build design tokens and component CSS early. Keep the prototype as reference.

## Risk 2: Data model becomes too complex too early

Mitigation:

Implement a minimum viable subset first, but do not destroy the conceptual model.

## Risk 3: Import/export becomes fragile

Mitigation:

Use Zod validation, schema versions and import preview before commit.

## Risk 4: Public deployment exposes personal data

Mitigation:

Use sample data for public builds and keep real exports local.

## Risk 5: Offline support is overbuilt too early

Mitigation:

Start with app shell and local database. Add advanced caching later.

## Risk 6: Codex tries to build too much at once

Mitigation:

Use strict tranche prompts with acceptance criteria and validation steps.

---

# 26. MVP technical definition

The first viable technical version should include:

- static PWA shell
    
- Ocean Luxe visual system
    
- sample Sun Princess sailing
    
- dashboard
    
- itinerary
    
- Today view
    
- ship guide preview
    
- port guide preview
    
- shore plan comparison
    
- Seb discovery
    
- memory preview
    
- local data model foundation
    
- basic local persistence
    
- import/export design stub
    
- GitHub Pages build readiness
    

It does not need:

- live weather
    
- full import commit
    
- full enrichment workflow
    
- all cruise history
    
- authentication
    
- backend
    
- map library
    
- photo storage
    
- real cruise line data integration
    

---

# 27. Recommended next artefact

The next artefact should be:

**Complete Cruising Build Plan v0.1**

Purpose:

- convert this architecture into a tranche sequence
    
- define deliverables per tranche
    
- define validation criteria
    
- define commit sequence
    
- prepare Codex implementation prompts
    

After the Build Plan, produce:

**Initial Codex Implementation Prompt v0.1**

That prompt should start with repository foundations and app scaffold, not a full product build.

---

# 28. v0.1 conclusion

Complete Cruising should be built as a local-first static PWA with a strong visual system, structured cruise data, modular enrichment, confidence metadata and offline readiness.

The architecture should protect the product from two failure modes:

1. becoming a beautiful but static mock-up
    
2. becoming a functional but visually dull database app
    

The correct path is a visually rich PWA built on disciplined data structures and targeted enrichment workflows.

Complete Cruising should feel premium, personal and useful because the architecture supports all three.