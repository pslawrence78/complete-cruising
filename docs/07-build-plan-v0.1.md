# Complete Cruising

## Build Plan v0.1

### Product context

**Complete Cruising** is a Lawrence Family Series application designed to become a visually rich, local-first cruise companion.

The app will help manage cruise sailings, itinerary days, ship intelligence, port guidebook content, shore plans, weather snapshots, family notes, Seb discovery prompts, memory capture and structured enrichment imports.

This build plan converts the product foundations into a controlled tranche-based implementation sequence.

---

# 1. Purpose of this build plan

This document defines how Complete Cruising should be built.

The plan is designed to:

1. Protect the visual ambition established by the standalone HTML prototype.
    
2. Prevent the app becoming a plain CRUD interface.
    
3. Build the PWA in controlled tranches.
    
4. Establish a clean GitHub and Codex workflow.
    
5. Keep data architecture, enrichment and visual experience aligned.
    
6. Ensure every tranche is reviewable, testable and committable.
    
7. Avoid premature complexity such as live APIs, backend hosting or authentication.
    

The build should proceed deliberately. The prototype has proved the creative direction, but the working app now needs proper foundations.

---

# 2. Build principles

## 2.1 Build in tranches

Each tranche should have a narrow objective, clear acceptance criteria and a specific commit outcome.

Avoid asking Codex to “build the app”.

## 2.2 Preserve the Ocean Luxe design

The app should retain the premium cruise/ocean design language from the prototype.

The implementation should preserve:

- cinematic sailing hero
    
- deep ocean backgrounds
    
- port postcard cards
    
- route timeline
    
- Today ashore operational hierarchy
    
- ship guide richness
    
- shore plan comparison cards
    
- Seb discovery warmth
    
- memory journal styling
    
- confidence and refresh chips
    

## 2.3 Build from sample data first

The early product should use curated sample data before persistence and imports are added.

This allows visual and interaction quality to be reviewed before database complexity is introduced.

## 2.4 Separate reusable and sailing-specific data

Reusable guidebook data must remain separate from sailing-specific itinerary data.

A port is reusable.  
A port call on a specific sailing is itinerary-specific.

## 2.5 Confidence and review metadata must survive

Confidence, review status and refresh status are core product concepts.

They must not be removed for simplicity.

## 2.6 No live APIs in MVP

The MVP should not use API keys or live integrations.

Weather, enrichment and guide content should begin through sample data and JSON imports.

## 2.7 Codex must report validation

Every Codex tranche should end with:

- files changed
    
- validation performed
    
- known limitations
    
- suggested commit message
    
- recommended next tranche
    

---

# 3. Current artefact set

The following artefacts should be treated as current project sources.

```text
01-product-specification-v0.1.md
02-enrichment-framework-v0.1.md
03-data-model-v0.1.md
04-visual-experience-brief-v0.1.md
05-html-prototype-specification-v0.1.md
06-technical-architecture-v0.1.md
07-build-plan-v0.1.md
```

The standalone prototype should be retained as:

```text
prototypes/v0.1/complete-cruising-prototype-v0.1.html
```

The prototype is a visual reference, not production code.

---

# 4. Recommended repository structure

The repository should be named:

```text
complete-cruising
```

Recommended root structure:

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
│  ├─ 07-build-plan-v0.1.md
│  ├─ decisions/
│  │  └─ 0001-project-start.md
│  └─ build-plan/
│     └─ tranche-plan-v0.1.md
├─ prototypes/
│  └─ v0.1/
│     └─ complete-cruising-prototype-v0.1.html
├─ samples/
│  ├─ sailings/
│  ├─ ships/
│  └─ ports/
├─ enrichment/
│  ├─ prompts/
│  ├─ imports/
│  └─ reviewed/
└─ app/
   └─ README.md
```

The actual PWA implementation should later live inside:

```text
app/
```

---

# 5. Build phases

The build should be divided into five broad phases.

## Phase 0: Project foundations

Purpose:

- create repo
    
- store artefacts
    
- preserve prototype
    
- establish Codex rules
    
- create sample data placeholders
    

## Phase 1: Visual PWA foundation

Purpose:

- scaffold the app
    
- create Ocean Luxe design system
    
- translate prototype into React components
    
- use static sample data
    

## Phase 2: Core product experience

Purpose:

- build dashboard
    
- build itinerary
    
- build Today view
    
- build ship and port previews
    
- build family, plans and memories screens
    

## Phase 3: Local-first data foundation

Purpose:

- add local persistence
    
- formalise schemas
    
- seed sample records
    
- load screens from local data
    

## Phase 4: Enrichment and import/export

Purpose:

- validate JSON imports
    
- preview imports
    
- commit accepted data
    
- export backups and Adventure Almanac payloads
    

## Phase 5: PWA readiness and deployment

Purpose:

- add manifest
    
- service worker
    
- offline readiness
    
- GitHub Pages build
    
- deployment workflow
    

---

# 6. Tranche sequence overview

Recommended tranche order:

|Tranche|Name|Purpose|
|---|---|---|
|0|Repository Foundations|Establish project structure and source artefacts|
|1|App Scaffold|Create Vite React TypeScript app|
|2|Ocean Luxe Shell|Translate visual identity into app shell|
|3|Dashboard v0.1|Build sailing hero and voyage intelligence cards|
|4|Itinerary v0.1|Build route timeline and itinerary day cards|
|5|Today View v0.1|Build operational daily companion|
|6|Ship Guide v0.1|Build ship intelligence preview|
|7|Port Guide v0.1|Build port guidebook preview|
|8|Plans, Family and Memories v0.1|Build supporting experience screens|
|9|Data Types and Schemas|Add TypeScript types and Zod schemas|
|10|Local Database Foundation|Add Dexie and seed sample data|
|11|Data-Driven Screens|Replace static props with local data queries|
|12|Import Preview v0.1|Add JSON paste/upload validation preview|
|13|Import Commit and Export v0.1|Commit safe imports and export backups|
|14|PWA and Offline Readiness|Add manifest, service worker and offline shell|
|15|GitHub Pages Deployment|Configure production build and deploy workflow|

The sequence may be adjusted after review, but the first eight tranches should avoid database complexity until the visual and user experience foundations are in place.

---

# 7. Tranche 0: Repository Foundations

## Objective

Create a clean repository foundation before app development begins.

## Deliverables

- README.md
    
- AGENTS.md
    
- docs folder with all artefacts
    
- prototypes folder with standalone HTML prototype
    
- samples folder
    
- enrichment folder
    
- decisions folder
    
- build-plan folder
    
- .gitignore
    
- app placeholder README
    

## Acceptance criteria

- Repository opens cleanly.
    
- Documentation is easy to find.
    
- Prototype is preserved under `prototypes/v0.1`.
    
- AGENTS.md contains Codex operating rules.
    
- No production app code exists yet.
    
- First commit is documentation and structure only.
    

## Suggested commit message

```text
Initial Complete Cruising product foundations
```

---

# 8. Tranche 1: App Scaffold

## Objective

Create the working application scaffold.

## Deliverables

- Vite React TypeScript app under `app/`
    
- package.json
    
- tsconfig
    
- vite config
    
- basic App component
    
- initial route structure
    
- basic test setup
    
- initial static sample data file
    
- GitHub Pages base path configured or documented
    

## Recommended stack

```text
React
TypeScript
Vite
Vitest
React Testing Library
```

## Acceptance criteria

- App runs locally.
    
- App builds successfully.
    
- TypeScript compiles.
    
- Test command runs.
    
- Route skeleton exists.
    
- No visual ambition is implemented yet beyond a simple placeholder shell.
    

## Suggested validation

```text
npm install
npm run dev
npm run build
npm run test
```

## Suggested commit message

```text
Scaffold Complete Cruising React app
```

---

# 9. Tranche 2: Ocean Luxe Shell

## Objective

Translate the prototype’s visual identity into the app foundation.

## Deliverables

- design tokens
    
- global base styles
    
- app shell
    
- top navigation
    
- responsive layout base
    
- reusable card surface styles
    
- status chip styles
    
- confidence chip styles
    
- background treatments
    
- accessibility focus states
    

## Key files likely affected

```text
app/src/styles/
app/src/components/layout/
app/src/components/navigation/
app/src/components/status/
app/src/App.tsx
```

## Acceptance criteria

- App no longer looks like a default scaffold.
    
- Ocean Luxe background and card surfaces are implemented.
    
- Navigation is responsive.
    
- Status and confidence chips exist.
    
- Basic accessibility focus states exist.
    
- No content-heavy screens are required yet.
    

## Visual acceptance criteria

- Deep ocean visual identity is visible.
    
- Ivory, gold, teal and coral accents are available.
    
- The app feels closer to the prototype than to a default React app.
    

## Suggested commit message

```text
Add Ocean Luxe app shell and visual system
```

---

# 10. Tranche 3: Dashboard v0.1

## Objective

Build the main dashboard using static sample data.

## Deliverables

- SailingHero component
    
- RouteRibbon component
    
- MetricCard component
    
- VoyageStatusGrid component
    
- Dashboard screen
    
- sample Sun Princess sailing data
    
- responsive desktop, tablet and mobile layout
    

## Content to include

- sailing name
    
- ship
    
- cruise line
    
- route
    
- countdown
    
- nights
    
- port count
    
- sea day count
    
- document readiness
    
- enrichment readiness
    
- next port to review
    
- weather refresh status
    
- family focus
    

## Acceptance criteria

- Dashboard visually resembles the prototype’s ambition.
    
- Hero section is cinematic.
    
- Route ribbon is present.
    
- Key cards are readable on mobile.
    
- No overlapping text at narrow widths.
    
- Prototype data is labelled as illustrative.
    

## Suggested validation

- Check at 1440px, 1024px, 768px, 430px and 390px.
    
- Run build.
    
- Run tests.
    

## Suggested commit message

```text
Build Ocean Luxe dashboard from sample sailing data
```

---

# 11. Tranche 4: Itinerary v0.1

## Objective

Build the day-by-day itinerary route experience.

## Deliverables

- Itinerary screen
    
- ItineraryTimeline component
    
- ItineraryDayCard component
    
- day type visual differentiation
    
- sample itinerary for Sun Princess Mediterranean 2026
    
- active day highlight
    
- chips for confidence, review and refresh state
    

## Required day types

- embarkation
    
- port
    
- sea
    
- disembarkation
    

## Acceptance criteria

- Itinerary feels like a voyage, not a table.
    
- Desktop layout is visually rich.
    
- Mobile layout becomes a vertical timeline.
    
- Day cards show key timing fields where available.
    
- Sea days and port days are visually distinct.
    
- Sample data remains illustrative.
    

## Suggested commit message

```text
Add itinerary timeline and day cards
```

---

# 12. Tranche 5: Today View v0.1

## Objective

Build the operational Today screen.

## Deliverables

- Today screen
    
- TodayAshorePanel
    
- AllAboardCard
    
- WeatherTile
    
- TakeAshoreChecklist
    
- TodayPlanSummary
    
- SebDiscoveryPreview
    
- ConfidenceNotes
    

## Required content

- current day
    
- port
    
- arrival time
    
- departure time
    
- all-aboard time
    
- latest safe return
    
- weather
    
- likely plan
    
- backup plan
    
- take ashore checklist
    
- local language
    
- local currency
    
- Seb discovery prompt
    
- refresh/confidence notes
    

## Acceptance criteria

- User can understand the day within five seconds.
    
- All-aboard time is visually prominent.
    
- Checklist is mobile-friendly.
    
- Weather is clearly marked as illustrative or sample.
    
- Operational hierarchy is stronger than decorative detail.
    

## Suggested commit message

```text
Add Today ashore operational view
```

---

# 13. Tranche 6: Ship Guide v0.1

## Objective

Build the first ship guide screen.

## Deliverables

- Ship screen
    
- ShipHero component
    
- ShipGuideCard component
    
- ship facts panel
    
- enrichment status panel
    
- ship section cards
    

## Required ship sections

- identity and character
    
- layout and orientation
    
- dining
    
- family and Seb suitability
    
- pools and recreation
    
- entertainment
    
- tips and watchouts
    

## Acceptance criteria

- Ship guide feels like a premium ship handbook.
    
- Cards are not plain database rows.
    
- Ship section statuses are visible.
    
- Visual treatment uses navy, glass and restrained gold.
    
- Content is concise and sample-based.
    

## Suggested commit message

```text
Add Sun Princess ship guide preview
```

---

# 14. Tranche 7: Port Guide v0.1

## Objective

Build the first port guidebook screen.

## Deliverables

- Ports list or port guide screen
    
- PortPostcard component
    
- PortFactChips
    
- PortGuideSection
    
- AttractionHighlightCard
    
- FamilyLensCard
    
- PhotoPromptCard
    
- HintsWatchoutsCard
    

## Sample port

Use Naples, Italy.

## Required sections

- port identity
    
- flag, language, currency
    
- cruise logistics
    
- getting around summary
    
- top highlights
    
- family lens
    
- food and culture
    
- photography
    
- hints and watchouts
    
- confidence and refresh state
    

## Acceptance criteria

- Port guide feels like a curated guidebook.
    
- Port postcard visual treatment is present.
    
- Attractions are separated from port summary.
    
- Family lens is visible but not childish.
    
- Confidence and refresh chips are visible.
    

## Suggested commit message

```text
Add Naples port guide preview
```

---

# 15. Tranche 8: Plans, Family and Memories v0.1

## Objective

Build supporting experience areas that prove the app is personal, not generic.

## Deliverables

- Shore plans screen or section
    
- Family guide screen or section
    
- Memories screen or section
    
- ShorePlanCard
    
- SebDiscoveryCard
    
- MemoryCard
    
- AdventureAlmanacExportPreview
    

## Required shore plans

- low-effort city plan
    
- family-balanced plan
    
- ambitious Pompeii plan
    

## Required family content

- flag
    
- phrase
    
- geography fact
    
- thing to spot
    
- quiz question and answer
    
- memory prompt
    

## Required memory content

- daily reflection
    
- Seb favourite
    
- best photo prompt
    
- would return indicator
    
- export readiness
    

## Acceptance criteria

- Shore plans are comparable.
    
- One selected plan is visually highlighted.
    
- Seb Discovery feels premium and warm.
    
- Memories feel reflective, not administrative.
    
- Adventure Almanac export concept is visible.
    

## Suggested commit message

```text
Add shore plans, family guide and memory previews
```

---

# 16. Tranche 9: Data Types and Schemas

## Objective

Formalise the data model into TypeScript types and Zod schemas.

## Deliverables

- shared metadata types
    
- sailing types
    
- ship types
    
- port types
    
- itinerary day types
    
- shore plan types
    
- day guide types
    
- weather snapshot types
    
- enrichment section types
    
- memory entry types
    
- import batch types
    
- Zod schemas for core import shapes
    

## Required schemas

- common metadata schema
    
- sailing schema
    
- itinerary day schema
    
- ship schema
    
- port schema
    
- attraction schema
    
- shore plan schema
    
- enrichment section schema
    
- weather snapshot schema
    
- memory entry schema
    

## Acceptance criteria

- TypeScript types align with Data Model v0.1.
    
- Zod schemas validate sample data.
    
- Tests exist for valid and invalid sample payloads.
    
- Confidence, review and refresh metadata are preserved.
    

## Suggested commit message

```text
Add TypeScript data types and validation schemas
```

---

# 17. Tranche 10: Local Database Foundation

## Objective

Add local-first browser persistence.

## Deliverables

- Dexie setup
    
- database definition
    
- initial tables
    
- database version 1
    
- seed sample data
    
- repository functions
    
- reset sample data utility, if useful
    

## Initial tables

At minimum:

- sailings
    
- ships
    
- cruiseLines
    
- ports
    
- countries
    
- itineraryDays
    
- attractions
    
- shorePlans
    
- dayGuides
    
- weatherSnapshots
    
- enrichmentSections
    
- familyNotes
    
- memoryEntries
    
- importBatches
    
- appSettings
    

## Acceptance criteria

- Database initialises successfully.
    
- Sample data can be seeded.
    
- Sample data can be cleared and reseeded.
    
- Repository functions can load active sailing, itinerary and port data.
    
- Tests cover repository utilities where practical.
    

## Suggested commit message

```text
Add Dexie local database and sample data seed
```

---

# 18. Tranche 11: Data-Driven Screens

## Objective

Replace static screen props with local database-backed data.

## Deliverables

- dashboard loads from local data
    
- itinerary loads from local data
    
- Today view loads from selected itinerary day
    
- ship guide loads from local data
    
- port guide loads from local data
    
- loading and empty states
    
- sample data reset option, possibly under Settings
    

## Acceptance criteria

- App still looks visually polished.
    
- Screens work after local data seed.
    
- Empty states are helpful and on-brand.
    
- No screen breaks if data is missing.
    
- Static fallback data is removed or clearly isolated.
    

## Suggested commit message

```text
Connect core screens to local cruise data
```

---

# 19. Tranche 12: Import Preview v0.1

## Objective

Add JSON import validation and preview without committing changes.

## Deliverables

- Import / Export screen
    
- import type selector
    
- paste JSON input
    
- file upload input, if simple
    
- schema validation
    
- validation warning display
    
- import summary preview
    
- conflict detection placeholder
    
- ImportBatch draft creation optional
    

## Supported import types for v0.1

- sailing shell
    
- itinerary
    
- ship enrichment
    
- port enrichment
    
- day guide
    

## Acceptance criteria

- Valid sample imports pass.
    
- Invalid imports produce helpful errors.
    
- Preview shows target object, records to create, records to update and warnings.
    
- No import silently commits data.
    
- Protected fields are flagged if affected.
    

## Suggested commit message

```text
Add JSON import validation and preview
```

---

# 20. Tranche 13: Import Commit and Export v0.1

## Objective

Allow safe import commit and basic exports.

## Deliverables

- commit validated import
    
- ImportBatch record
    
- section-level acceptance where practical
    
- protected field warning flow
    
- full backup export
    
- sailing export
    
- Adventure Almanac export draft
    

## Acceptance criteria

- User can preview before commit.
    
- User can commit safe imports.
    
- ImportBatch is recorded.
    
- Protected field overwrite requires explicit confirmation.
    
- Full backup export produces valid JSON.
    
- Adventure Almanac export produces a draft structure.
    

## Suggested commit message

```text
Add safe import commit and JSON export workflows
```

---

# 21. Tranche 14: PWA and Offline Readiness

## Objective

Make Complete Cruising installable and offline-capable at app-shell level.

## Deliverables

- web app manifest
    
- app icons placeholder
    
- theme colour
    
- service worker
    
- static asset caching
    
- offline fallback
    
- offline status indicator
    
- last data update display
    
- Ready for sea indicator, if feasible
    

## Acceptance criteria

- App builds.
    
- Manifest is valid.
    
- Static app shell loads offline after first visit.
    
- Core local data remains available offline.
    
- Offline status is visible.
    
- No live API dependencies exist.
    

## Suggested commit message

```text
Add PWA manifest and offline app shell
```

---

# 22. Tranche 15: GitHub Pages Deployment

## Objective

Prepare and deploy the static app to GitHub Pages.

## Deliverables

- Vite base path configured
    
- production build validated
    
- GitHub Actions workflow
    
- deployment documentation
    
- README deployment section
    
- Pages branch or workflow-based deployment
    

## Acceptance criteria

- `npm run build` succeeds.
    
- App works under `/complete-cruising/`.
    
- Routes work using hash routing.
    
- Assets load correctly.
    
- Deployment workflow is documented.
    
- Public data caveat is visible if sample data is deployed.
    

## Suggested commit message

```text
Configure GitHub Pages deployment
```

---

# 23. Post-MVP tranche candidates

These should not be built until the core MVP is stable.

## Candidate A: Weather import and refresh model

- weather snapshot import
    
- forecast refresh prompts
    
- no-key API evaluation
    
- weather confidence status
    
- weather impact on plans
    

## Candidate B: Visual maps

- static route map
    
- MapLibre feasibility
    
- port coordinate views
    
- no API key dependency if possible
    

## Candidate C: Enrichment prompt library

- ship pack prompts
    
- port pack prompts
    
- attraction pack prompts
    
- day guide prompts
    
- importable JSON examples
    

## Candidate D: Properly Packed export

- cruise packing intelligence
    
- sea day bag
    
- port day bag
    
- formal night
    
- tender day
    
- sun protection
    

## Candidate E: Officially Organised reminders

- check-in opens
    
- balance due
    
- passport check
    
- insurance review
    
- excursion booking window
    

## Candidate F: Adventure Almanac import alignment

- confirmed travel chronology export
    
- countries visited
    
- ports visited
    
- memories
    
- Seb learning notes
    

## Candidate G: Rich media and photos

- photo prompts
    
- local image attachment
    
- memory photo references
    
- export-safe media notes
    

---

# 24. Definition of done for every tranche

Every tranche should satisfy the following before commit.

## Functional checks

- App runs locally.
    
- App builds successfully.
    
- Relevant tests pass.
    
- No obvious console errors.
    
- No broken navigation introduced.
    

## Visual checks

- Desktop layout reviewed.
    
- Tablet layout reviewed.
    
- Mobile layout reviewed.
    
- Narrow mobile reviewed.
    
- No text overlap.
    
- No unreadable cards.
    
- Ocean Luxe design still intact.
    

## Data checks

- Existing sample data still loads.
    
- No trusted fields are casually overwritten.
    
- Confidence and review metadata remain intact where relevant.
    

## Documentation checks

- README updated if usage changes.
    
- Known limitations captured.
    
- Suggested next tranche provided.
    

## Codex closure format

Codex should end each tranche with:

```text
Summary:
- ...

Validation:
- ...

Known limitations:
- ...

Suggested commit message:
...
```

---

# 25. Visual validation checklist

Every UI tranche should be reviewed against the standalone HTML prototype.

## Required viewport checks

```text
1440px desktop
1024px tablet landscape
768px tablet portrait
430px large phone
390px narrow phone
```

## Required visual questions

1. Does it still feel cruise-specific?
    
2. Does it still feel premium?
    
3. Is the Today view operationally clear?
    
4. Are all-aboard and timing details prominent?
    
5. Are cards visually distinct?
    
6. Are chips readable?
    
7. Does the mobile layout avoid clutter?
    
8. Has the app become too generic?
    
9. Has the app become too decorative?
    
10. Does it still feel like Complete Cruising?
    

---

# 26. Data validation checklist

Every data or import tranche should check:

1. Valid sample data passes validation.
    
2. Invalid sample data produces clear errors.
    
3. Required fields are enforced.
    
4. Confidence values are validated.
    
5. Review statuses are validated.
    
6. Refresh flags are preserved.
    
7. Parent-child relationships are valid.
    
8. Protected fields are not overwritten silently.
    
9. Exported JSON can be parsed again.
    
10. Schema version is included.
    

---

# 27. Git workflow

Recommended Git approach:

## Main branch

```text
main
```

Holds stable committed work.

## Optional feature branches

Codex may work on branches such as:

```text
tranche-01-app-scaffold
tranche-02-ocean-luxe-shell
tranche-03-dashboard
```

## Commit style

Suggested commit style:

```text
Add Ocean Luxe app shell
Build itinerary timeline
Add Today ashore operational view
Connect dashboard to local data
Add JSON import validation preview
```

## Release tags

Optional tags:

```text
v0.1-prototype-html
v0.1-foundations
v0.2-visual-shell
v0.3-core-experience
v0.4-local-data
v0.5-import-export
```

The exact versioning can be decided later.

---

# 28. Codex prompt pattern

Each Codex prompt should follow this structure.

```text
You are working in the Complete Cruising repository.

Objective:
[one tranche objective]

Relevant sources:
- docs/[specific docs]
- prototypes/v0.1/complete-cruising-prototype-v0.1.html
- AGENTS.md

Scope:
[what to do]

Out of scope:
[what not to do]

Acceptance criteria:
[list]

Validation required:
[list commands or checks]

Closure notes required:
- summary
- validation
- known limitations
- suggested commit message
```

Avoid vague prompts.

Poor prompt:

```text
Build Complete Cruising.
```

Good prompt:

```text
Implement Tranche 3: Dashboard v0.1 using static sample data. Preserve the Ocean Luxe visual direction from the prototype. Do not add Dexie or import workflows yet.
```

---

# 29. AGENTS.md minimum content

The first AGENTS.md should include:

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

# 30. Initial sample data requirements

Before the app becomes database-backed, sample data should exist for:

## Sailing sample

```text
Sun Princess Mediterranean 2026
Rome to Barcelona
14 nights
9 ports
4 sea days
Princess Cruises
Sun Princess
```

## Itinerary sample

Include representative days:

- Civitavecchia / Rome
    
- Naples
    
- Sea day
    
- Souda Bay / Chania
    
- Kusadasi / Ephesus
    
- Mykonos
    
- Athens / Piraeus
    
- Santorini
    
- Bar
    
- Corfu
    
- Messina
    
- Barcelona
    

## Port sample

Use Naples for first depth sample.

## Ship sample

Use Sun Princess for first depth sample.

## Family sample

Include limited safe sample content:

- Seb discovery enabled
    
- geography fact
    
- phrase
    
- thing to spot
    
- quiz question
    
- memory prompt
    

Avoid sensitive real booking details in public sample data.

---

# 31. First coding prompt recommendation

The first implementation prompt should not start with Tranche 3 or the full PWA.

It should start with:

**Tranche 0: Repository Foundations**

or, if the repo is already prepared manually:

**Tranche 1: App Scaffold**

Best next step after this build plan:

```text
Create Initial Codex Implementation Prompt v0.1
```

That prompt should cover:

- repository foundations
    
- app scaffold
    
- source artefact placement
    
- prototype placement
    
- AGENTS.md
    
- validation requirements
    

---

# 32. MVP target state

The MVP should be considered reached when Complete Cruising has:

- GitHub repository
    
- documented artefacts
    
- preserved HTML prototype
    
- React TypeScript PWA
    
- Ocean Luxe visual system
    
- dashboard
    
- itinerary
    
- Today view
    
- ship guide
    
- port guide
    
- shore plans
    
- Seb discovery
    
- memories preview
    
- local database
    
- seed data
    
- JSON import preview
    
- safe import commit
    
- backup export
    
- Adventure Almanac export draft
    
- PWA manifest and offline shell
    
- GitHub Pages deployment
    

Live weather, maps and cross-app integration can follow later.

---

# 33. v0.1 conclusion

Complete Cruising should now move from concept to implementation through disciplined, tranche-based development.

The HTML prototype has proved the visual ambition. The technical architecture has defined the PWA direction. This build plan defines the controlled execution path.

The correct next step is not to build everything. The correct next step is to establish a clean repository, preserve the artefacts, scaffold the app and then build the experience in focused tranches.

Complete Cruising should become a premium, personal and practical cruise companion because each tranche protects the same three priorities:

1. beautiful experience
    
2. trusted data
    
3. family usefulness