# Complete Cruising

## Decision 0001: Reset to Single-Sailing Guidebook

### Status

Accepted

### Date

2026-07-01

### Decision

Complete Cruising is being reset from a reusable, local-first multi-cruise application into a new, single-sailing, hard-coded PWA guidebook for the Lawrence family's upcoming **Sun Princess Mediterranean 2026** cruise.

The previous implementation is abandoned. It should not be extended, repaired or used as the foundation for the new build.

The new project will start from a clean repository and will preserve only the valuable product thinking, visual direction, content model and cruise-guidebook ambition.

---

## Context

The original Complete Cruising implementation attempted to support a broad reusable cruise companion model, including:

* multiple sailings
* local database persistence
* structured imports
* enrichment workflows
* import preview and commit flows
* reset and data safety controls
* conflict handling
* weather snapshot review
* reusable guidebook records
* sailing-specific itinerary records

After two weeks of development, the implementation has not reached a reliable or useful state. Simple imports are not working reliably, database reset functionality is blocked or disabled, and the data safety area does not provide a dependable recovery path.

The app has therefore failed as a practical deliverable for the upcoming cruise.

The underlying need remains valid: the family still needs a beautiful, accurate and useful cruise companion for one specific sailing.

The simpler and more appropriate product is a hard-coded, read-only, single-cruise PWA that behaves like a premium personalised guidebook rather than a data-management system.

---

## New product direction

The new product will be a one-off guidebook for:

* **Cruise line:** Princess Cruises
* **Ship:** Sun Princess
* **Sailing:** Mediterranean cruise, August 2026
* **Route:** Rome to Barcelona
* **Audience:** Phil, Rebecca and Seb
* **Primary use:** preparation before travel and practical onboard/ashore guidance during the cruise

The app should feel like:

* a Berlitz-grade cruise guide
* a personalised family travel companion
* a premium maritime guidebook
* a practical onboard daily assistant
* a visually rich Ocean Luxe PWA

The app should not feel like:

* a database
* an admin console
* an import tool
* a generic travel planner
* a half-built product platform

---

## Scope of the reset

The new project will preserve these concepts from the original Complete Cruising work:

* Ocean Luxe visual direction
* premium cruise guidebook ambition
* Today view operational hierarchy
* itinerary timeline model
* ship guide concept
* port guide concept
* shore plan comparison
* Seb discovery layer
* weather intelligence
* confidence and caveat language
* source-aware content discipline
* PWA and offline-first ambition

The new project will discard these implementation concepts:

* Dexie or IndexedDB as the core data store
* JSON import workflows
* import preview and commit screens
* reset and data safety pages
* multi-sailing management
* editable CRUD screens
* enrichment request workflows inside the app
* weather conflict review workflows
* protected-field overwrite handling
* generic backstage or admin modes
* reusable guidebook database abstractions
* complex audit trails

---

## Core architectural decision

The new app will use **typed static content** as the primary data source.

Cruise content will live directly in source-controlled TypeScript files, Markdown source files, or other static content files curated before build time.

The app may include a small runtime cache for weather responses and PWA offline behaviour, but it must not depend on a user-managed local database.

The application must be able to run as a static PWA and deploy to GitHub Pages or an equivalent static host.

---

## Hard rules for the new build

The new project must follow these rules:

1. Build for one cruise only.
2. Do not implement a database.
3. Do not implement imports.
4. Do not implement reset flows.
5. Do not implement multi-cruise management.
6. Do not create generic editing screens.
7. Store core cruise content as typed static app content.
8. Keep the user experience read-only unless a future tranche explicitly approves limited local notes.
9. Preserve the Ocean Luxe visual standard.
10. Use British English throughout.
11. Keep Today, Itinerary, Ship, Ports and Day Guides immediately useful.
12. Treat weather as automatic app behaviour, not a user-managed workflow.
13. Make uncertainty visible through calm caveats and confidence labels.
14. Do not present unverified operational details as confirmed.
15. Avoid sensitive booking data, passport data, cabin numbers or private identity details unless explicitly approved for local-only use.

---

## Weather decision

Weather remains valuable, but the interaction model changes.

The previous weather snapshot review and conflict-resolution model will not be carried forward.

The new app should use fixed weather intelligence rules:

* show seasonal baseline guidance before forecast data is useful
* fetch no-key forecast data when a cruise day enters the practical forecast window
* prioritise today's port during the cruise
* cache the latest successful weather result where useful
* show cached or seasonal fallback guidance when offline
* clearly label weather as forecast, seasonal expectation, cached or unavailable

There should be no manual refresh button unless later proven necessary.

There should be no user-facing weather conflict review screen.

---

## Content decision

The new app will be content-led.

The key content artefacts should be created before or alongside implementation:

* confirmed itinerary
* source register
* Sun Princess ship guide
* port guides for each destination
* shore plan options
* day-by-day guides
* Seb discovery prompts
* weather baselines
* photo prompts
* family comfort notes
* final-check list

Each piece of operational content should distinguish between:

* confirmed facts
* researched guidance
* family judgement
* inferred recommendations
* final-check-required items

---

## Visual decision

The new project should reuse the Ocean Luxe visual direction, not the failed app implementation.

The visual experience should preserve:

* deep ocean backgrounds
* sunlit horizon treatments
* port postcard cards
* route timeline motifs
* navy glass ship panels
* prominent all-aboard cards
* warm Seb discovery cards
* guidebook-style port pages
* calm confidence and caveat chips
* premium mobile-first presentation

The new app should not regress into plain cards, forms or administrative screens.

---

## Consequences

### Positive consequences

* The new app can be built faster.
* The family gets something useful for the actual cruise.
* Failure points around import, reset and database state are removed.
* The product becomes easier to verify.
* The interface can focus on guidebook quality rather than data management.
* Offline usefulness becomes simpler to achieve.
* Codex tranches become smaller, clearer and less risky.

### Negative consequences

* The app will not support future cruises without code changes.
* Content changes require source edits and redeployment.
* There is no general-purpose enrichment import workflow.
* The original reusable platform ambition is deferred.
* Some previous implementation work is intentionally discarded.

These trade-offs are accepted.

---

## Relationship to the original Complete Cruising concept

The original long-term concept remains valid as a possible future product.

This decision does not permanently rule out a reusable Complete Cruising platform.

The August 2026 deliverable, however, must prioritise reliability, beauty, accuracy and usefulness over platform completeness.

If the single-sailing guidebook succeeds, a future cruise may justify revisiting a reusable architecture with much stricter scope control.

---

## Recommended new repository direction

The new repository should be treated as a fresh project.

Suggested working name:

```text
sun-princess-2026-guide
```

Suggested app identity:

```text
Sun Princess 2026 Cruise Guide
```

Suggested description:

```text
A one-cruise Ocean Luxe PWA guidebook for the Lawrence family's Sun Princess Mediterranean 2026 sailing.
```

---

## Validation expectations

Every tranche in the new project should report:

* files changed
* visual and responsive checks
* content assumptions
* known limitations
* build and test status
* suggested commit message
* recommended next tranche

Validation should focus on whether the app is useful, accurate, readable, installable and visually polished.

---

## Suggested commit message

```text
Record reset to single-sailing guidebook approach
```
