# Complete Cruising: Sun Princess 2026 Edition

## Static Content Architecture v0.1

### Product context

**Complete Cruising: Sun Princess 2026 Edition** is a one-cruise, hard-coded PWA guidebook for the Lawrence family's August 2026 Sun Princess Mediterranean sailing.

The app is not a reusable cruise management platform. It is a focused, content-led, installable guidebook for one specific cruise.

The architecture must therefore prioritise:

* accuracy
* simplicity
* visual quality
* offline usefulness
* predictable behaviour
* content maintainability
* removal of database and import failure points

The core architectural principle is:

> **Content is code.**

---

## 1. Purpose of this document

This document defines how cruise guidebook content should be structured, stored, validated and presented in the new single-sailing app.

It replaces the previous Complete Cruising data-management architecture with a static, typed content model.

The aim is to give Codex and future development work a clear rule set:

* no database
* no import workflow
* no reset workflow
* no multi-sailing abstraction
* no editable CRUD screens
* no enrichment management UI
* no user-managed data lifecycle

The app should be useful because its content is deliberately curated before deployment.

---

## 2. Architectural position

The new app is a **static-content PWA**.

It should be implemented as a React, TypeScript and Vite application where the main guidebook data lives in source-controlled content files.

The app may include a very small amount of runtime state for:

* current route
* UI expansion state
* weather cache
* offline detection
* PWA update state

The app must not depend on a local application database to hold the cruise guide.

Core cruise data should be available from bundled static content at build time.

---

## 3. Static content principles

### 3.1 One cruise only

All content belongs to the Sun Princess Mediterranean 2026 sailing.

There should be no need to choose, create, edit, duplicate, archive or reset a sailing.

### 3.2 Typed content, not loose JSON

Content should be represented using TypeScript types.

This gives the app compile-time structure without introducing runtime import complexity.

### 3.3 Source-controlled guidebook

All curated guidebook content should be committed to the repository.

A future content change should be made by editing source files and redeploying the app, not by importing into the running app.

### 3.4 Read-only by default

The app is a guidebook.

It should not expose edit controls, commit controls, import screens, reset actions or database safety tools.

### 3.5 Clear separation of source notes and app content

Human-readable research and verification notes should live separately from polished app content.

The app should consume curated TypeScript content.
The repository should also retain Markdown source notes for traceability.

### 3.6 Confidence must survive simplification

Removing the database must not remove trust language.

Static content should still carry confidence, caveat and final-check metadata.

### 3.7 Weather is the only permitted dynamic intelligence

Weather may be fetched at runtime using deterministic no-key logic, subject to explicit approval.

Weather behaviour should be automatic and unobtrusive.

---

## 4. Repository-level structure

Recommended project structure:

```text
complete-cruising-sun-princess-2026/
|-- AGENTS.md
|-- README.md
|-- docs/
|  |-- decisions/
|  |  `-- 0001-project-reset-to-single-sailing-guidebook.md
|  |-- 01-sun-princess-2026-guidebook-brief.md
|  |-- 02-static-content-architecture.md
|  |-- 03-weather-intelligence-specification.md
|  |-- 04-ocean-luxe-static-pwa-visual-system.md
|  |-- 05-build-plan-single-sailing-pwa.md
|  `-- 06-static-data-contract.md
|-- content-source/
|  |-- 00-source-register.md
|  |-- 01-confirmed-itinerary.md
|  |-- 02-ship-guide-sun-princess.md
|  |-- 03-port-guide-civitavecchia.md
|  |-- 04-port-guide-naples.md
|  |-- 05-port-guide-souda-bay-chania.md
|  |-- 06-port-guide-kusadasi-ephesus.md
|  |-- 07-port-guide-mykonos.md
|  |-- 08-port-guide-athens-piraeus.md
|  |-- 09-port-guide-santorini.md
|  |-- 10-port-guide-bar-montenegro.md
|  |-- 11-port-guide-corfu.md
|  |-- 12-port-guide-messina.md
|  |-- 13-port-guide-barcelona.md
|  |-- 14-day-guides.md
|  |-- 15-shore-plans.md
|  |-- 16-seb-discovery.md
|  |-- 17-weather-baselines.md
|  `-- 18-final-check-list.md
|-- prompts/
|  |-- 01-ship-guide-template.md
|  |-- 02-port-guide-template.md
|  |-- 03-day-guide-template.md
|  |-- 04-shore-plan-template.md
|  |-- 05-seb-discovery-template.md
|  `-- 06-source-verification-template.md
`-- app/
   |-- package.json
   |-- vite.config.ts
   |-- index.html
   |-- public/
   `-- src/
```

The exact repository name may differ, but the separation between `docs`, `content-source`, `prompts` and `app/src/content` should be preserved.

---

## 5. App source structure

Recommended `app/src` structure:

```text
src/
|-- main.tsx
|-- App.tsx
|-- routes/
|  |-- AppRoutes.tsx
|  `-- routeConfig.ts
|-- content/
|  |-- index.ts
|  |-- sailing.ts
|  |-- itinerary.ts
|  |-- ship.ts
|  |-- ports/
|  |  |-- index.ts
|  |  |-- civitavecchia.ts
|  |  |-- naples.ts
|  |  |-- soudaBayChania.ts
|  |  |-- kusadasi.ts
|  |  |-- mykonos.ts
|  |  |-- athensPiraeus.ts
|  |  |-- santorini.ts
|  |  |-- barMontenegro.ts
|  |  |-- corfu.ts
|  |  |-- messina.ts
|  |  `-- barcelona.ts
|  |-- dayGuides/
|  |  |-- index.ts
|  |  `-- dayGuideContent.ts
|  |-- shorePlans/
|  |  |-- index.ts
|  |  `-- shorePlanContent.ts
|  |-- familyGuide.ts
|  |-- weatherBaselines.ts
|  |-- finalChecks.ts
|  `-- sources.ts
|-- types/
|  |-- contentTypes.ts
|  |-- itineraryTypes.ts
|  |-- portTypes.ts
|  |-- shipTypes.ts
|  |-- weatherTypes.ts
|  `-- sourceTypes.ts
|-- services/
|  |-- guidebook/
|  |  |-- guidebookService.ts
|  |  |-- todayService.ts
|  |  |-- itineraryService.ts
|  |  `-- confidenceService.ts
|  `-- weather/
|     |-- weatherService.ts
|     |-- weatherCache.ts
|     |-- weatherRules.ts
|     `-- openMeteoClient.ts
|-- components/
|-- features/
|-- styles/
|-- utils/
`-- tests/
```

---

## 6. Content-source layer

The `content-source/` folder is for human-authored research, verification and review notes.

It is not consumed directly by the app unless a future build step explicitly introduces that capability.

### Purpose

The source layer should preserve:

* where information came from
* what has been confirmed
* what remains uncertain
* what needs checking close to departure
* what is family judgement rather than fact
* when content was last reviewed

### Recommended content-source file structure

Each source file should use a consistent Markdown pattern:

```text
# Port Guide Source: Naples

## Status

Draft / Reviewed / Final check needed / Confirmed

## Last checked

YYYY-MM-DD

## Primary sources

- Official source
- Supporting source
- Family note

## Confirmed facts

- ...

## Researched guidance

- ...

## Family judgement

- ...

## Inferred recommendations

- ...

## Final-check-required items

- ...

## App content notes

- ...

## Open questions

- ...
```

### Source-source distinction

A source note is not automatically app-ready.

Content should move from research notes into app content only after it has been curated, shortened and assigned confidence metadata.

---

## 7. App content layer

The `src/content/` folder contains app-ready guidebook content.

This content should be:

* concise
* typed
* curated
* display-ready
* confidence-labelled
* source-aware
* free of sensitive private data unless explicitly approved

### Content files should avoid

* long unstructured prose
* copied source text
* private booking data
* speculative operational claims
* raw source dumps
* implementation logic
* UI component code

### Content files may include

* structured facts
* polished summaries
* card text
* guidebook sections
* lists of highlights
* shore plan summaries
* Seb prompts
* confidence labels
* final-check flags
* source IDs
* weather baseline references

---

## 8. Core content modules

### 8.1 `sailing.ts`

Defines the one sailing.

Expected content:

* sailing name
* product name
* cruise line
* ship
* route
* dates
* nights
* ports
* sea days
* family travellers
* high-level caveats
* visual summary
* source references

This file should not include sensitive booking details unless explicitly approved.

### 8.2 `itinerary.ts`

Defines the complete day-by-day cruise spine.

Expected content per day:

* day ID
* day number
* date
* day type
* title
* port ID, where relevant
* arrival time
* departure time
* all-aboard time, where confirmed
* tender status, where known
* timezone
* weather location
* primary plan ID
* backup plan ID
* guide ID
* confidence
* final-check flags

Itinerary content should be treated as operationally sensitive and must carry caveats where not fully confirmed.

### 8.3 `ship.ts`

Defines the Sun Princess guide.

Expected sections:

* ship at a glance
* identity and character
* layout and orientation
* dining
* cabins and practical life onboard
* pools and recreation
* entertainment
* family and Seb suitability
* sea day strategy
* tips and watchouts
* first-day priorities

### 8.4 `ports/`

Defines reusable-style port guide content for this one sailing.

Although the app is one-cruise only, port content should still be structured cleanly.

Expected sections per port:

* at a glance
* why this port matters
* cruise logistics
* getting around
* top highlights
* family lens
* Seb angle
* food and culture
* photography
* hints and watchouts
* weather and seasonality
* suggested plans
* final-check items

### 8.5 `dayGuides/`

Defines curated day-by-day guidance.

Expected content:

* today at a glance
* what matters today
* plan summary
* backup guidance
* take ashore checklist
* local language and currency
* Seb discovery
* photo prompt
* return buffer advice
* confidence notes

Sea days should use a different structure focused on onboard rhythm, relaxation, activities, food, ship exploration and memory prompts.

### 8.6 `shorePlans/`

Defines possible shore plans.

Expected content per plan:

* plan name
* associated day or port
* plan type
* recommendation status
* summary
* estimated duration
* transport mode
* effort level
* weather dependency
* return risk
* family fit
* Seb fit
* practical steps
* what to take
* fallback notes
* confidence and caveats

### 8.7 `familyGuide.ts`

Defines cross-cruise family guidance for this sailing.

Expected content:

* Seb discovery themes
* geography prompts
* flag prompts
* phrase prompts
* quiz prompts
* food comfort notes
* pacing guidance
* family photo themes
* low-energy fallback guidance

### 8.8 `weatherBaselines.ts`

Defines seasonal weather baselines for each port or sea-day region.

Expected content:

* typical August temperature
* rain tendency
* humidity or heat notes
* wind or sea breeze notes
* UV guidance
* clothing guidance
* plan sensitivity
* source references
* confidence

This is the fallback when live forecast data is unavailable or not yet useful.

### 8.9 `sources.ts`

Defines source references used by app content.

Expected content:

* source ID
* source title
* source type
* publisher or authority
* URL, where appropriate
* last checked date
* confidence contribution
* notes

Do not show every source in the main UI. The source register should support transparency through an About or Sources page.

### 8.10 `finalChecks.ts`

Defines final pre-travel verification items.

Expected content:

* item ID
* label
* related day or port
* reason
* recommended check date
* status
* priority
* source to check

Examples:

* confirm Naples departure time
* confirm Santorini tender status
* confirm all-aboard times
* confirm shuttle availability
* check Princess app for dining or show reservations
* check Sagrada Familia booking time for Barcelona

---

## 9. Shared content metadata

Every significant content item should support lightweight metadata.

Recommended shared metadata shape:

```ts
export type ConfidenceLevel =
  | 'confirmed'
  | 'high'
  | 'medium'
  | 'inferred'
  | 'unknown';

export type ReviewState =
  | 'draft'
  | 'reviewed'
  | 'final-check-needed'
  | 'confirmed';

export type ContentMeta = {
  confidence: ConfidenceLevel;
  reviewState: ReviewState;
  sourceIds: string[];
  lastChecked?: string;
  finalCheckRequired?: boolean;
  caveat?: string;
};
```

The app should use this metadata to show calm, concise confidence labels.

---

## 10. Suggested static data contracts

### 10.1 Sailing

```ts
export type SailingContent = {
  id: string;
  productName: string;
  sailingName: string;
  cruiseLine: string;
  shipName: string;
  route: {
    from: string;
    to: string;
    summary: string;
  };
  dates: {
    embarkationDate: string;
    disembarkationDate: string;
  };
  stats: {
    nights: number;
    portDays: number;
    seaDays: number;
  };
  travellers: string[];
  tagline: string;
  heroSummary: string;
  caveats: string[];
  meta: ContentMeta;
};
```

### 10.2 Itinerary day

```ts
export type CruiseDayType =
  | 'embarkation'
  | 'port'
  | 'sea'
  | 'disembarkation';

export type TenderStatus =
  | 'confirmed-tender'
  | 'likely-tender'
  | 'confirmed-docked'
  | 'likely-docked'
  | 'not-applicable'
  | 'unknown';

export type CruiseDay = {
  id: string;
  dayNumber: number;
  date: string;
  type: CruiseDayType;
  title: string;
  subtitle?: string;
  portId?: string;
  arrivalTime?: string;
  departureTime?: string;
  allAboardTime?: string;
  tenderStatus?: TenderStatus;
  timezone?: string;
  weatherLocationId?: string;
  primaryPlanId?: string;
  backupPlanId?: string;
  dayGuideId: string;
  highlights: string[];
  operationalNotes: string[];
  meta: ContentMeta;
};
```

### 10.3 Port guide

```ts
export type PortGuide = {
  id: string;
  name: string;
  displayName: string;
  country: string;
  flag: string;
  language: string;
  currency: string;
  timezone: string;
  portType: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  hero: {
    shortTitle: string;
    summary: string;
    imagePrompt?: string;
  };
  sections: {
    whyItMatters: string;
    cruiseLogistics: string;
    gettingAround: string;
    familyLens: string;
    sebAngle: string;
    foodAndCulture: string;
    photography: string;
    hintsAndWatchouts: string[];
  };
  highlights: PortHighlight[];
  suggestedPlanIds: string[];
  weatherBaselineId: string;
  finalCheckIds: string[];
  meta: ContentMeta;
};
```

### 10.4 Port highlight

```ts
export type PortHighlight = {
  id: string;
  name: string;
  type:
    | 'landmark'
    | 'history'
    | 'culture'
    | 'viewpoint'
    | 'food'
    | 'beach'
    | 'family'
    | 'transport'
    | 'other';
  summary: string;
  whyItMatters: string;
  typicalDuration?: string;
  distanceFromPort?: string;
  bookingNeed?: 'required' | 'recommended' | 'optional' | 'not-required' | 'unknown';
  familyFit: 'excellent' | 'good' | 'mixed' | 'poor' | 'unknown';
  sebInterest: 'high' | 'medium' | 'low' | 'unknown';
  weatherSensitivity: 'low' | 'medium' | 'high' | 'indoor' | 'unknown';
  meta: ContentMeta;
};
```

### 10.5 Shore plan

```ts
export type ShorePlan = {
  id: string;
  portId: string;
  dayId?: string;
  name: string;
  planType:
    | 'recommended'
    | 'low-effort'
    | 'family-balanced'
    | 'ambitious'
    | 'weather-fallback'
    | 'ship-safe'
    | 'booked-excursion';
  status: 'preferred' | 'shortlisted' | 'fallback' | 'idea' | 'booked';
  summary: string;
  estimatedDuration: string;
  transportMode: string;
  effortLevel: 'low' | 'medium' | 'high';
  returnRisk: 'low' | 'medium' | 'high' | 'unknown';
  weatherDependency: 'low' | 'medium' | 'high' | 'unknown';
  familyFit: 'excellent' | 'good' | 'mixed' | 'poor' | 'unknown';
  sebFit: 'excellent' | 'good' | 'mixed' | 'poor' | 'unknown';
  steps: string[];
  whatToTake: string[];
  backupAdvice?: string;
  returnBufferAdvice: string;
  meta: ContentMeta;
};
```

### 10.6 Day guide

```ts
export type DayGuide = {
  id: string;
  dayId: string;
  title: string;
  mode: 'pre-cruise' | 'embarkation' | 'port-day' | 'sea-day' | 'disembarkation' | 'post-cruise';
  atAGlance: string[];
  whatMattersToday: string[];
  primaryPlanSummary?: string;
  backupPlanSummary?: string;
  takeAshore?: string[];
  onboardIdeas?: string[];
  sebDiscoveryId?: string;
  photoPrompt?: string;
  returnBufferAdvice?: string;
  confidenceNotes: string[];
  meta: ContentMeta;
};
```

### 10.7 Seb discovery

```ts
export type SebDiscovery = {
  id: string;
  dayId?: string;
  portId?: string;
  title: string;
  flag?: string;
  localPhrase?: {
    phrase: string;
    meaning: string;
    pronunciationHint?: string;
  };
  geographyFact: string;
  thingToSpot: string;
  quiz: {
    question: string;
    answer: string;
  };
  memoryPrompt: string;
  meta: ContentMeta;
};
```

### 10.8 Weather baseline

```ts
export type WeatherBaseline = {
  id: string;
  locationId: string;
  locationName: string;
  month: 'August';
  typicalHighC?: number;
  typicalLowC?: number;
  summary: string;
  rainTendency: string;
  heatGuidance: string;
  windGuidance?: string;
  uvGuidance?: string;
  clothingGuidance: string;
  planSensitivity: string[];
  meta: ContentMeta;
};
```

### 10.9 Source reference

```ts
export type SourceReference = {
  id: string;
  title: string;
  sourceType:
    | 'official-cruise-line'
    | 'booking-confirmed'
    | 'official-port'
    | 'official-tourism'
    | 'official-attraction'
    | 'official-transport'
    | 'reputable-guide'
    | 'family-note'
    | 'weather-source'
    | 'other';
  publisher?: string;
  url?: string;
  lastChecked?: string;
  notes?: string;
};
```

---

## 11. Data loading pattern

Content should be imported directly from static modules.

Example:

```ts
import { sailing } from '../content/sailing';
import { itinerary } from '../content/itinerary';
import { ports } from '../content/ports';
import { dayGuides } from '../content/dayGuides';
```

Feature code should not import scattered content files directly where avoidable.

Prefer a small guidebook service layer.

Example:

```ts
getSailing()
getItinerary()
getCruiseDayByDate(date)
getTodayGuide(date)
getPortById(portId)
getPlansForPort(portId)
getFinalChecksForDay(dayId)
```

This keeps UI components simpler and allows future refactoring without changing every screen.

---

## 12. Today service architecture

The Today screen should be derived from static content and the current date.

Recommended service:

```text
src/services/guidebook/todayService.ts
```

Responsibilities:

* determine current cruise mode
* find today's cruise day
* find upcoming cruise day before departure
* find completed-day state after cruise
* combine itinerary, day guide, shore plan, port and weather data
* return a UI-friendly view model

Suggested modes:

```ts
export type TodayMode =
  | 'pre-cruise'
  | 'embarkation-day'
  | 'port-day'
  | 'sea-day'
  | 'disembarkation-day'
  | 'post-cruise';
```

The Today screen should not contain complex date logic directly.

---

## 13. Weather content and dynamic weather boundary

Weather has two layers.

### 13.1 Static weather baseline

Stored in:

```text
src/content/weatherBaselines.ts
```

Used when:

* live forecast is unavailable
* cruise day is outside forecast range
* app is offline
* future weather service fails

### 13.2 Dynamic weather forecast

Handled by:

```text
src/services/weather/
```

Permitted only for no-key services approved for the project.

Weather service should not change core app content.
It should return transient or cached display data only.

Acceptable browser storage:

* `localStorage` for small weather cache
* Cache API through service worker for app shell/static assets
* no Dexie
* no IndexedDB data model

---

## 14. Content validation strategy

Static content should be validated during development and tests, not through runtime import screens.

Recommended validation:

* TypeScript compile checks
* unit tests for required content references
* tests ensuring every itinerary day has a day guide
* tests ensuring every port day has a port guide
* tests ensuring every shore plan points to a valid port
* tests ensuring every source ID exists
* tests ensuring final-check IDs resolve
* tests ensuring no forbidden sensitive fields are present

Example test areas:

```text
src/tests/contentIntegrity.test.ts
src/tests/itineraryIntegrity.test.ts
src/tests/sourceIntegrity.test.ts
src/tests/privacyGuardrails.test.ts
```

---

## 15. Content integrity rules

The app should fail tests if:

* an itinerary day references a missing port
* a port day has no day guide
* a shore plan references a missing port
* a day guide references a missing Seb discovery item
* content references a missing source ID
* a final-check item references a missing day or port
* a weather baseline is missing for a port day
* confidence metadata is missing from major content items
* forbidden sensitive terms appear in static content

---

## 16. Sensitive data guardrails

Static content must not include sensitive details by default.

Forbidden unless explicitly approved:

* booking reference
* passport number
* insurance policy number
* cabin number
* home address
* payment card information
* full identity document details
* private emergency contact details

Allowed:

* traveller first names
* general family preferences
* checklist labels
* non-sensitive travel notes
* port and ship guidance
* "passport packed" style readiness prompts

Privacy tests should scan for obvious forbidden keys and terms.

---

## 17. Source and confidence display

The main UI should show trust information without overwhelming the user.

Recommended display levels:

### Main cards

Show:

* Confirmed
* High confidence
* Medium confidence
* Inferred
* Final check needed

### Detail sections

May show:

* last checked date
* short caveat
* source type
* final-check reason

### Sources page

May show:

* source register
* official sources
* guidebook sources
* family notes
* weather sources
* last checked dates

The UI should avoid making the app look like an audit tool.

---

## 18. Relationship between content and components

Components should render content.
They should not own cruise facts.

Correct pattern:

```text
static content -> guidebook service -> view model -> component
```

Avoid:

```text
component contains cruise facts directly
```

Acceptable exceptions:

* tiny labels
* visual headings
* fallback empty-state copy
* route labels

Major guidebook information should live in `src/content`.

---

## 19. Routing architecture

Suggested routes:

```text
/
#/today
#/itinerary
#/ship
#/ports
#/ports/:portId
#/plans
#/family
#/memories
#/final-checks
#/sources
#/about
```

Hash routing is acceptable because the app is intended for static hosting.

There should be no routes for:

```text
#/sailings
#/sailing-setup
#/import-export
#/data-management
#/enrichment-requests
#/weather-review
#/backstage
#/reset
```

---

## 20. Build-time and runtime responsibilities

### Build-time responsibilities

* bundle static cruise content
* compile TypeScript
* verify content integrity through tests
* generate static assets
* prepare PWA shell
* ensure routes render

### Runtime responsibilities

* render the guidebook
* determine Today mode
* fetch weather when appropriate
* cache weather display data
* detect offline state
* present static fallback content
* support PWA install and offline usage

Runtime should not create, mutate or reconcile the guidebook dataset.

---

## 21. Migration from original Complete Cruising

The original Complete Cruising app should not be migrated.

Reusable ideas may be copied manually:

* visual design language
* component naming inspiration
* Today hierarchy
* itinerary concepts
* port guide concepts
* ship guide concepts
* confidence wording
* weather principles

Do not copy forward:

* Dexie schema
* database repositories
* import workflows
* reset flows
* data safety pages
* enrichment request pages
* conflict resolution logic
* multi-sailing state
* generic CRUD pages

A clean rewrite is the intended path.

---

## 22. Codex implementation guidance

Codex should treat this architecture as binding.

When implementing tranches, Codex should:

* create typed static content
* keep content outside components
* add tests for content references
* avoid introducing persistence unless explicitly instructed
* avoid creating editable screens
* avoid adding generic data-management UI
* preserve Ocean Luxe presentation
* keep mobile use central
* use British English
* report validation and limitations at the end of each tranche

Any suggestion to add Dexie, imports, reset tools or multi-sailing management should be treated as a regression.

---

## 23. Success criteria

The static content architecture is successful if:

* the app can be useful immediately after build
* cruise content is visible without import or setup
* no database reset can block use
* no missing import can break the guidebook
* every major content item has confidence metadata
* every port day has a guide
* every port has a guidebook page
* Today can be derived automatically
* weather fallback works without connectivity
* the app remains simple to reason about
* Codex can build in small, safe tranches

---

## 24. Product judgement

The static content approach deliberately trades flexibility for reliability.

That trade-off is correct for **Complete Cruising: Sun Princess 2026 Edition**.

The app exists to serve one real family cruise, not to prove a general-purpose cruise platform.

A future reusable Complete Cruising product may revisit databases, imports and enrichment workflows after this single-sailing edition has proved its value in real travel conditions.
