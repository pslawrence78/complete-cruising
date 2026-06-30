# Complete Cruising: Sun Princess 2026 Edition

## Guidebook Brief v0.1

### Product status

New single-sailing product direction
Part of the Lawrence Family Series

### Product name

**Complete Cruising: Sun Princess 2026 Edition**

### Working tagline

**Your Sun Princess sailing, fully understood.**

### Product type

A one-cruise, hard-coded, installable PWA guidebook for the Lawrence family's August 2026 Sun Princess Mediterranean cruise.

---

## 1. Product vision

**Complete Cruising: Sun Princess 2026 Edition** is a beautiful, practical and personalised cruise guidebook for one specific sailing.

The product exists to help Phil, Rebecca and Seb prepare for, understand and enjoy their upcoming **Sun Princess Mediterranean 2026** cruise from Rome to Barcelona.

The app should feel like a premium cruise companion that already knows the sailing, the ship, the itinerary, the ports, the family context and the practical questions that matter during the holiday.

It should combine the feel of:

* a Berlitz-grade cruise guide
* a luxury travel folio
* a port-by-port Mediterranean guidebook
* a ship handbook
* a practical onboard daily companion
* a family discovery journal
* a calm operational assistant

The app should not feel like:

* a database
* a planning admin tool
* an import workflow
* a generic cruise tracker
* a multi-cruise management platform
* a partially finished product framework

The purpose is not to create a reusable platform.
The purpose is to create something genuinely useful for this cruise.

---

## 2. Product purpose

The app should help the Lawrence family:

1. Understand the complete cruise before travel.
2. See the itinerary as a clear day-by-day voyage.
3. Know what matters today before leaving the cabin or ship.
4. Understand Sun Princess as a ship, not just as a booking.
5. Explore each port with useful guidebook context.
6. Compare realistic shore options without over-planning.
7. Surface weather guidance automatically and sensibly.
8. Give Seb engaging geography, history, language and discovery prompts.
9. Keep confidence, caveats and final-check items visible.
10. Preserve the emotional value of the trip through memory prompts.

The app should reduce uncertainty, increase anticipation and provide confidence during a complex moving holiday.

---

## 3. Product reset context

The original Complete Cruising implementation attempted to become a reusable local-first cruise platform with imports, database persistence, enrichment workflows, reset controls, review states and multi-cruise abstractions.

That implementation is no longer the route forward.

This edition starts again from a simpler premise:

> One cruise. One family. One beautiful hard-coded guidebook. No database. No imports. No reset flows.

The valuable product thinking from the original work remains, especially:

* Ocean Luxe design direction
* Today view operational hierarchy
* itinerary timeline model
* ship guide concept
* port guide concept
* shore plan comparison
* Seb discovery layer
* weather intelligence
* confidence and caveat language
* source-aware content discipline
* PWA and offline ambition

The failed implementation complexity must not be carried forward.

---

## 4. Target sailing

### Sailing

**Sun Princess Mediterranean 2026**

### Cruise line

**Princess Cruises**

### Ship

**Sun Princess**

### Route

**Rome to Barcelona**

### Timing

**August 2026**

### Expected route structure

The app should model the actual sailing once confirmed against official sources.

The known route context includes:

* Civitavecchia / Rome
* Naples
* sea days
* Souda Bay / Chania
* Kusadasi / Ephesus
* Mykonos
* Athens / Piraeus
* Santorini
* Bar, Montenegro
* Corfu
* Messina
* Barcelona

Final port order, dates, timings, all-aboard times, tender status and operational details must be confirmed against booking documentation, Princess Cruises material and the Princess app before travel.

---

## 5. Primary users

### Phil

Needs a clear, reliable and visually polished cruise command centre that turns the sailing into practical daily intelligence.

Likely priorities:

* accuracy
* visual quality
* itinerary clarity
* ship and port context
* weather intelligence
* return-to-ship risk
* source confidence
* useful family decision support

### Rebecca

Needs a calm, attractive and easy-to-use guide that supports the holiday without making the trip feel over-administered.

Likely priorities:

* easy daily guidance
* realistic port plans
* family-friendly pacing
* food, comfort and photo opportunities
* avoiding unnecessary stress
* clear practical information

### Seb

Needs the cruise to feel exciting, understandable and educational.

Likely interests:

* countries
* flags
* capitals
* maps
* seas
* geography
* language
* history
* ships
* quizzes
* things to spot ashore

Seb's layer should feel warm and personal but not childish or visually detached from the premium app.

---

## 6. Product principles

### 6.1 One sailing only

The app is built for the Sun Princess Mediterranean 2026 cruise.

There should be no multi-sailing selector, sailing creation flow, archive, duplicate, import or reusable cruise manager.

### 6.2 Hard-coded content first

Core cruise content should be curated into source-controlled static files.

The app should not depend on user-entered data, pasted JSON, uploaded files or database state to become useful.

### 6.3 Read-only by default

The app should behave like a guidebook, not a management tool.

Editing, importing, resetting and data safety workflows are out of scope unless explicitly approved in a later tranche.

### 6.4 Beautiful but operational

The app must be visually premium, but Today must remain instantly useful.

The user should be able to open the app and understand the current day within five seconds.

### 6.5 Confidence without clutter

Confidence, caveats and final-check warnings should remain visible but calm.

The app should not present uncertain information as confirmed.

### 6.6 Weather should be automatic

Weather should appear through sensible default logic.

There should be no weather conflict review workflow and no user-managed weather snapshot process.

### 6.7 Offline matters

Cruise holidays often involve poor signal, expensive Wi-Fi or inconsistent roaming.

The core guidebook must remain available once installed and loaded.

### 6.8 British English

All copy, labels and documentation must use British English.

---

## 7. Non-goals

This edition will not attempt to:

* support multiple cruises
* create new sailings
* import itinerary JSON
* import enrichment packs
* manage a local database
* provide reset or restore functionality
* replace the Princess Cruises app
* scrape cruise line systems
* manage onboard reservations
* store passports or sensitive identity details
* store booking references unless explicitly approved
* hold cabin numbers unless explicitly approved
* become a generic Mediterranean travel guide
* track every onboard activity
* provide a complete restaurant or show booking system
* provide live maps requiring paid APIs
* require authentication, cloud sync or a backend

---

## 8. Information architecture

The app should have a compact, guidebook-led structure.

### Primary navigation

* **Dashboard**
* **Today**
* **Itinerary**
* **Ship**
* **Ports**
* **Plans**
* **Family**
* **Memories**

### Supporting areas

* **Final checks**
* **Sources and caveats**
* **Offline readiness**
* **About this guide**

There should be no Data Management, Import / Export, Enrichment Requests, Backstage or Reset area in this edition.

---

## 9. Core screens

### 9.1 Dashboard

Purpose:

Create the premium opening view for the sailing.

The Dashboard should show:

* sailing name
* ship
* cruise line
* route
* dates
* countdown
* number of nights
* number of ports
* number of sea days
* next important cruise milestone
* next port or next day preview
* weather readiness summary
* guidebook completion status
* final-check warnings

The Dashboard should feel cinematic and anticipatory.

### 9.2 Today

Purpose:

Provide the most useful operational screen during the cruise.

Today should automatically adapt to the current date:

* pre-cruise mode
* embarkation day mode
* port day mode
* sea day mode
* disembarkation day mode
* post-cruise mode

For port days, Today should show:

* port name
* date and day number
* arrival time
* departure time
* all-aboard time
* latest sensible return guidance
* weather
* selected or recommended plan
* backup option
* take ashore checklist
* local language
* local currency
* Seb discovery prompt
* photo prompt
* confidence notes
* final-check warnings

All-aboard and return guidance must be visually prominent.

### 9.3 Itinerary

Purpose:

Show the cruise as a complete route.

The Itinerary should show:

* day number
* date
* day type
* port or sea day title
* arrival and departure where relevant
* all-aboard where known
* weather state
* plan state
* confidence state
* final-check requirement

The itinerary should feel like a voyage timeline, not a table.

### 9.4 Ship

Purpose:

Provide a personalised Sun Princess guide.

Ship guide sections should include:

* ship at a glance
* identity and character
* layout and orientation
* dining
* pools and recreation
* entertainment
* family and Seb suitability
* cabin and practical life onboard
* sea day strategy
* tips and watchouts
* first-day priorities

The ship guide should feel like a premium cruise handbook, not brochure copy.

### 9.5 Ports

Purpose:

Provide a curated guidebook for each cruise port.

Each port guide should include:

* port identity
* country, flag, language and currency
* why the port matters
* cruise logistics
* getting around
* top highlights
* family lens
* Seb angle
* food and culture
* photography prompts
* hints and watchouts
* weather and seasonality
* final-check items

Port pages should be visually rich, using postcard-style presentation.

### 9.6 Plans

Purpose:

Help the family compare realistic shore options.

Plans should be curated, not exhaustive.

Each port may include:

* recommended family-balanced plan
* low-effort option
* ambitious option
* weather fallback
* ship-safe short option
* booked excursion, where relevant

Plan cards should show:

* summary
* estimated duration
* transport mode
* walking and effort level
* weather dependency
* Seb suitability
* parent suitability
* return risk
* latest sensible return guidance
* confidence and caveats

### 9.7 Family

Purpose:

Surface personalised family guidance.

The Family area should include:

* Seb discovery cards
* flags
* local phrases
* map facts
* geography facts
* things to spot
* quiz questions
* child-friendly explanations
* comfort notes
* food fallback notes
* family pacing guidance

The tone should be warm, intelligent and lightly playful.

### 9.8 Memories

Purpose:

Prompt reflection without creating a heavy diary system.

The Memories area should provide:

* day-by-day memory prompts
* Seb favourite prompts
* best photo prompts
* food tried prompts
* "would we return?" prompts
* Adventure Almanac preparation notes

This edition may keep memory capture as prompts rather than saved editable entries unless a later tranche explicitly approves local-only notes.

---

## 10. Content model

The app should use static, typed content.

Suggested source structure:

```text
src/content/
  sailing.ts
  itinerary.ts
  ship.ts
  ports/
  dayGuides/
  shorePlans/
  familyGuide.ts
  weatherBaselines.ts
  sources.ts
```

Suggested content-source structure:

```text
content-source/
  00-source-register.md
  01-confirmed-itinerary.md
  02-ship-guide-sun-princess.md
  03-port-guide-civitavecchia.md
  04-port-guide-naples.md
  ...
  15-day-guide-barcelona.md
```

Each content item should separate:

* confirmed facts
* researched guidance
* family judgement
* inferred recommendations
* final-check-required items
* source notes
* last checked date

---

## 11. Confidence and caveat model

The app should preserve trust language without building a heavy review system.

### Confidence labels

* **Confirmed** - checked against official or family-confirmed source
* **High** - strongly supported and unlikely to change materially
* **Medium** - useful but may depend on timing, conditions or source quality
* **Inferred** - reasoned from available context but not directly confirmed
* **Final check needed** - must be checked again before relying on it

### Content caveat principles

The app should clearly label:

* port times needing final confirmation
* all-aboard times needing final confirmation
* tender status uncertainty
* terminal uncertainty
* shuttle uncertainty
* opening hours
* ticketing requirements
* transport timings
* weather-sensitive guidance
* safety or entry guidance

Caveats should be calm and practical, not alarming.

---

## 12. Weather intelligence

Weather should remain a key feature, but with a simplified interaction model.

The app should automatically determine the best available weather state:

### Seasonal baseline

Used when the cruise day is outside the practical forecast window.

Shows:

* typical temperature
* typical rain tendency
* heat and sun guidance
* wind or sea breeze notes
* clothing guidance
* plan sensitivity

### Forecast mode

Used when the cruise day is within a practical forecast window.

Shows:

* forecast high and low
* condition summary
* rain probability
* wind
* UV where available
* comfort guidance
* plan impact
* source and timestamp

### Same-day mode

Used during the cruise for the current day.

Shows:

* today's forecast or current conditions where available
* heat, rain, wind or UV prompts
* take ashore implications
* plan impact
* cached fallback if offline

### Past-day mode

Used after a cruise day has passed.

Shows:

* cached snapshot if available
* otherwise a neutral completed-day weather note
* no unnecessary warning if live weather is no longer available

### Weather rules

* Use no-key services only, such as Open-Meteo, if approved.
* Do not require API keys.
* Do not add user-facing weather conflict resolution.
* Do not expose manual weather data management.
* Clearly label forecast, seasonal, cached and unavailable states.

---

## 13. Visual experience

The visual theme is **Ocean Luxe**.

The app should feel like a luxury ocean voyage translated into an interactive guidebook.

### Visual qualities

* premium
* maritime
* elegant
* calm
* polished
* atmospheric
* practical
* family-aware
* guidebook-led

### Visual motifs

* deep ocean gradients
* sunlit horizon glow
* subtle nautical chart lines
* route dots
* compass accents
* port postcard cards
* boarding pass-style day cards
* navy glass ship panels
* warm ivory guidebook surfaces
* restrained champagne gold highlights
* coral or amber caution accents
* teal confirmation accents
* Seb discovery passport-stamp treatment

### Visual standard

The app should look materially better than a typical personal planning PWA.

It should feel bespoke, not generated.

---

## 14. PWA and offline expectations

The app should be installable and useful offline.

Minimum expectations:

* Vite React TypeScript app
* static build
* GitHub Pages-compatible routing
* web app manifest
* app icons
* theme colour
* service worker or equivalent PWA support
* app shell cached
* static guidebook content cached
* weather fallback when offline
* mobile-first responsive layout
* iPhone home-screen usability

The app should remain useful at sea even without connectivity.

---

## 15. Data privacy

The app should avoid sensitive data.

Do not include by default:

* booking reference
* passport details
* insurance policy number
* cabin number
* exact home address
* private identity documents
* payment card details
* emergency contact details

A checklist item such as "Passports packed" is acceptable.

A stored passport number is not acceptable.

Any sensitive content must be explicitly approved and treated as local-only.

---

## 16. Technical direction

Recommended stack:

* React
* TypeScript
* Vite
* CSS design tokens and structured CSS
* Vitest
* React Testing Library
* PWA manifest and static asset caching
* optional no-key Open-Meteo weather service

Recommended routing:

* HashRouter or static-host-safe routing suitable for GitHub Pages

Not required:

* Dexie
* IndexedDB data model
* Supabase
* authentication
* backend
* server-side rendering
* import validation
* reset workflows
* cloud sync

A tiny weather cache may be acceptable if implemented in a controlled way.

---

## 17. Build approach

Build in small tranches.

Recommended tranche sequence:

1. Repository reset foundations
2. Static PWA scaffold
3. Ocean Luxe guidebook shell
4. Hard-coded sailing and itinerary
5. Today engine
6. Sun Princess ship guide
7. Port guidebook pages
8. Day guides
9. Shore plans and family guidance
10. Weather intelligence
11. Offline and PWA hardening
12. Final content verification and polish

Each tranche should include:

* files changed
* validation performed
* responsive checks
* content assumptions
* known limitations
* suggested commit message
* recommended next tranche

---

## 18. Success criteria

The product is successful if, before departure, the family can install the app and use it as their primary personal guide to the cruise.

Success means:

* the app opens quickly on mobile
* the Dashboard creates excitement and orientation
* Today is useful within five seconds
* the itinerary is clear
* each port guide is useful and accurate enough to act on
* ship guidance helps onboard decisions
* shore plans are realistic
* Seb content feels genuinely personal
* weather guidance appears automatically
* final-check caveats are visible
* offline behaviour is dependable
* no import, reset or database issue can block use
* the app feels beautiful enough to justify opening repeatedly during the trip

---

## 19. Product judgement

The right product for this cruise is not the most flexible product.

The right product is the one that is accurate, beautiful, fast, reliable and available when the family needs it.

**Complete Cruising: Sun Princess 2026 Edition** should therefore prioritise guidebook quality over platform ambition.

Future reusable Complete Cruising development can be reconsidered only after this single-sailing edition proves useful in real travel conditions.
