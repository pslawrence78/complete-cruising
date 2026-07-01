# Complete Cruising: Sun Princess 2026 Edition

## 00 Source Register and Verified Cruise Corpus Checklist

### Purpose

This file is the master control register for the verified cruise corpus.

It tracks the research, verification and readiness state of the content used to build **Complete Cruising: Sun Princess 2026 Edition**.

The app itself is a hard-coded guidebook. This register is therefore the working checklist that ensures the guidebook content is accurate, source-aware and ready to convert into typed static app content.

---

## 1. Corpus management principles

### 1.1 Source first, app content second

Do not move information into app content until it has been captured, checked and labelled in the source corpus.

### 1.2 Confirmed facts must stay distinct from guidance

The corpus must separate:

* confirmed facts
* researched guidance
* family judgement
* inferred recommendations
* weather baselines
* final-check-required items

### 1.3 Operational content needs stronger verification

The following items must not be treated as confirmed unless checked against authoritative sources close to travel:

* port order
* port dates
* arrival times
* departure times
* all-aboard times
* tender status
* terminal or docking location
* shuttle availability
* attraction opening hours
* ticketing requirements
* transport timings
* local disruption
* entry or travel requirements

### 1.4 Static content must still show uncertainty

The app has no import or review system, but the content must still carry confidence metadata.

Each major content item should be labelled as one of:

* Confirmed
* High confidence
* Medium confidence
* Inferred
* Final check needed

### 1.5 No sensitive data by default

The corpus must not include sensitive private details unless explicitly approved.

Do not include:

* booking reference
* passport numbers
* insurance policy numbers
* cabin number
* home address
* payment card information
* full identity document details
* private emergency contact details

Checklist-style notes such as "passports packed" are acceptable.

---

## 2. Source authority hierarchy

Use this hierarchy when deciding how much trust to place in a source.

### Tier 1 - Highest authority

| Source type | Use for |
| --- | --- |
| Princess Cruises booking documentation | Sailing dates, ship, booked route, packages |
| Princess Cruises app | Final itinerary, onboard information, all-aboard details, shipboard updates |
| Princess Cruises official website | Ship facts, cruise line policy, general ship information |
| Official port authority | Terminal, docking, cruise logistics |
| Official tourism board | Destination facts, visitor guidance |
| Official attraction website | Opening hours, ticketing, access rules |
| Official transport operator | Train, ferry, shuttle or route information |
| UK Government travel advice | Entry, safety, local travel guidance |

### Tier 2 - Strong supporting sources

| Source type | Use for |
| --- | --- |
| Reputable guide publishers | Destination context, highlights, practical guidance |
| Established cruise publications | Ship experience, cruise-specific logistics |
| Recognised travel media | Guidebook-style judgement and visitor context |
| Major mapping platforms | Distances, walking feasibility, route context |
| Museum or attraction partners | Supporting attraction detail |

### Tier 3 - Useful but lower authority

| Source type | Use for |
| --- | --- |
| Traveller blogs | Hints, experience-led advice, watchouts |
| Cruise forums | Practical tips and possible friction points |
| YouTube cruise reviews | Onboard experience, layout feel, queues, atmosphere |
| Social media | Recent anecdotal context only |
| General travel listicles | Inspiration only, not operational facts |

### Tier 4 - Family authority

| Source type | Use for |
| --- | --- |
| Phil's notes | Family judgement, priorities, app direction |
| Rebecca's preferences | Pacing, comfort, photo, food and family fit |
| Seb's interests | Discovery content, quiz prompts, child lens |
| Previous family travel experience | Practical judgement and likely friction points |

---

## 3. Source ID convention

Every source used in app content should have a stable source ID.

Use this format:

```text
SRC-[CATEGORY]-[LOCATION-OR-SUBJECT]-[NUMBER]
```

Examples:

```text
SRC-PRINCESS-SAILING-001
SRC-PRINCESS-SHIP-001
SRC-PORT-NAPLES-001
SRC-TOURISM-BARCELONA-001
SRC-ATTRACTION-POMPEII-001
SRC-WEATHER-NAPLES-001
SRC-FAMILY-SEB-001
```

Suggested category values:

| Category | Meaning |
| --- | --- |
| PRINCESS | Princess Cruises or booking source |
| PORT | Official port or cruise terminal source |
| TOURISM | Official tourism source |
| ATTRACTION | Official attraction source |
| TRANSPORT | Official transport source |
| GUIDE | Reputable travel guide or publisher |
| CRUISE | Cruise publication or review source |
| MAP | Mapping or distance source |
| WEATHER | Weather or climate source |
| FAMILY | Family-authored context |
| GOV | Government or official travel advice |

---

## 4. Source register

Add verified sources here as they are used.

| Source ID | Title | Source type | Authority tier | URL or location | Used for | Last checked | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SRC-PRINCESS-SAILING-001 | Princess Cruises booking / itinerary source | Princess / booking | Tier 1 | Private booking or Princess app | Final route, dates, ship, timings | Not checked | Required | Do not store booking reference in app content |
| SRC-PRINCESS-SHIP-001 | Princess Cruises official Sun Princess ship page | Official cruise line | Tier 1 | To be added | Ship facts and facilities | Not checked | Required | Use for ship baseline facts |
| SRC-PRINCESS-APP-001 | Princess Cruises app | Official cruise line app | Tier 1 | Mobile app | Final onboard and operational details | Not checked | Required before travel | Use close to departure and onboard |
| SRC-WEATHER-OPENMETEO-001 | Open-Meteo forecast and weather data | Weather source | Tier 2 | To be added | Forecast logic and no-key weather service | Not checked | Candidate | Use only if approved for runtime weather |
| SRC-FAMILY-SEB-001 | Family context: Seb interests | Family note | Tier 4 | Internal | Seb discovery prompts | Checked | Active | Geography, flags, capitals, maps, languages, ships |
| SRC-FAMILY-PACING-001 | Family context: pacing and comfort | Family note | Tier 4 | Internal | Family lens and shore plan suitability | Checked | Active | Avoid over-planning, preserve flexible family pace |
| SRC-FAMILY-PHOTO-001 | Family context: photography interest | Family note | Tier 4 | Internal | Photo prompts and viewpoint guidance | Checked | Active | Include harbour, ship, skyline and family memory prompts |
| SRC-GOV-TRAVEL-001 | UK Government travel advice | Government source | Tier 1 | To be added | Entry, safety and travel guidance | Not checked | Required near travel | Check relevant countries before departure |
| SRC-MAP-GENERAL-001 | Mapping source for approximate distances | Mapping source | Tier 2 | To be added | Walking feasibility and travel time estimates | Not checked | Required | Use as approximate only |

---

## 5. Verified cruise corpus checklist

### Status values

Use these consistently:

| Status | Meaning |
| --- | --- |
| Not started | No useful content captured yet |
| Draft | Initial content exists but is not verified |
| Source captured | Sources identified and linked |
| Reviewed | Human reviewed for usefulness and tone |
| Final check needed | Useful but must be checked close to travel |
| Confirmed | Checked against appropriate source |
| App ready | Curated and ready to convert into `src/content` |
| In app content | Converted into typed static app content |
| Needs revision | Known issue or quality concern |

---

## 6. Master corpus index

| File | Content area | Purpose | Status | Priority | App target |
| --- | --- | --- | --- | --- | --- |
| `00-source-register.md` | Corpus control | Master source register and checklist | Draft | Critical | `sources.ts`, `finalChecks.ts` |
| `01-confirmed-itinerary.md` | Sailing and itinerary | Confirm route, dates, times and day structure | Not started | Critical | `sailing.ts`, `itinerary.ts` |
| `02-ship-guide-sun-princess.md` | Ship guide | Sun Princess handbook content | Not started | High | `ship.ts` |
| `03-port-guide-civitavecchia.md` | Port guide | Embarkation port and Rome context | Not started | High | `ports/civitavecchia.ts` |
| `04-port-guide-naples.md` | Port guide | Naples guide and shore options | Not started | High | `ports/naples.ts` |
| `05-port-guide-souda-bay-chania.md` | Port guide | Souda Bay / Chania guide | Not started | High | `ports/soudaBayChania.ts` |
| `06-port-guide-kusadasi-ephesus.md` | Port guide | Kusadasi / Ephesus guide | Not started | High | `ports/kusadasi.ts` |
| `07-port-guide-mykonos.md` | Port guide | Mykonos guide | Not started | High | `ports/mykonos.ts` |
| `08-port-guide-athens-piraeus.md` | Port guide | Athens / Piraeus guide | Not started | High | `ports/athensPiraeus.ts` |
| `09-port-guide-santorini.md` | Port guide | Santorini guide | Not started | High | `ports/santorini.ts` |
| `10-port-guide-bar-montenegro.md` | Port guide | Bar, Montenegro guide | Not started | Medium | `ports/barMontenegro.ts` |
| `11-port-guide-corfu.md` | Port guide | Corfu guide | Not started | High | `ports/corfu.ts` |
| `12-port-guide-messina.md` | Port guide | Messina guide | Not started | High | `ports/messina.ts` |
| `13-port-guide-barcelona.md` | Port guide | Disembarkation and post-cruise Barcelona guide | Not started | Critical | `ports/barcelona.ts` |
| `14-day-guides.md` | Day guides | One curated guide per cruise day | Not started | Critical | `dayGuides/dayGuideContent.ts` |
| `15-shore-plans.md` | Shore plans | Recommended, fallback and ambitious plans | Not started | Critical | `shorePlans/shorePlanContent.ts` |
| `16-seb-discovery.md` | Family guide | Flags, phrases, facts, quizzes and things to spot | Not started | High | `familyGuide.ts` |
| `17-weather-baselines.md` | Weather | Seasonal baselines and weather-sensitive guidance | Not started | High | `weatherBaselines.ts` |
| `18-final-check-list.md` | Verification | Close-to-travel operational checks | Not started | Critical | `finalChecks.ts` |
| `19-sources-and-caveats-page.md` | Transparency | User-facing source and caveat summary | Not started | Medium | Sources / About page |
| `20-offline-readiness-notes.md` | PWA readiness | Offline content and sea-use checks | Not started | Medium | About / Offline status |

---

## 7. Sailing and itinerary checklist

File:

```text
content-source/01-confirmed-itinerary.md
```

### Required content

| Item | Status | Source ID | Notes |
| --- | --- | --- | --- |
| Sailing name | Not started | SRC-PRINCESS-SAILING-001 | |
| Cruise line | Not started | SRC-PRINCESS-SAILING-001 | |
| Ship name | Not started | SRC-PRINCESS-SAILING-001 | |
| Embarkation date | Not started | SRC-PRINCESS-SAILING-001 | |
| Disembarkation date | Not started | SRC-PRINCESS-SAILING-001 | |
| Route summary | Not started | SRC-PRINCESS-SAILING-001 | |
| Number of nights | Not started | SRC-PRINCESS-SAILING-001 | |
| Number of port days | Not started | SRC-PRINCESS-SAILING-001 | |
| Number of sea days | Not started | SRC-PRINCESS-SAILING-001 | |
| Day-by-day port order | Not started | SRC-PRINCESS-SAILING-001 | |
| Arrival times | Not started | SRC-PRINCESS-SAILING-001 | Must be final checked |
| Departure times | Not started | SRC-PRINCESS-SAILING-001 | Must be final checked |
| All-aboard times | Not started | SRC-PRINCESS-APP-001 | Usually needs Princess app / onboard check |
| Tender status | Not started | SRC-PRINCESS-APP-001 | Especially relevant for Santorini / Greek islands |
| Local timezones | Not started | SRC-PRINCESS-SAILING-001 | Check port-by-port |
| Embarkation practical notes | Not started | SRC-PRINCESS-APP-001 | |
| Disembarkation practical notes | Not started | SRC-PRINCESS-APP-001 | |
| Final itinerary caveats | Not started | SRC-PRINCESS-SAILING-001 | |

### App readiness criteria

Before this area is marked **App ready**:

* every cruise day has a day number
* every cruise day has a date
* every port day has a port ID
* every port day has a confidence label
* every operational time has a source or caveat
* all uncertain timings are flagged as final-check-required
* no booking reference or sensitive data has been added

---

## 8. Ship guide checklist

File:

```text
content-source/02-ship-guide-sun-princess.md
```

### Required sections

| Section | Status | Source ID | Notes |
| --- | --- | --- | --- |
| Ship at a glance | Not started | SRC-PRINCESS-SHIP-001 | |
| Ship identity and class | Not started | SRC-PRINCESS-SHIP-001 | |
| Design character | Not started | SRC-PRINCESS-SHIP-001 | |
| Layout and orientation | Not started | SRC-PRINCESS-SHIP-001 | |
| Dining overview | Not started | SRC-PRINCESS-SHIP-001 | Avoid claiming menus as fixed |
| Included dining | Not started | SRC-PRINCESS-SHIP-001 | |
| Speciality dining | Not started | SRC-PRINCESS-SHIP-001 | Booking rules may change |
| Pools and recreation | Not started | SRC-PRINCESS-SHIP-001 | |
| Entertainment and venues | Not started | SRC-PRINCESS-SHIP-001 | Do not assume specific shows |
| Family and Seb suitability | Not started | SRC-FAMILY-SEB-001 | |
| Sea day strategy | Not started | SRC-FAMILY-PACING-001 | |
| First-day priorities | Not started | SRC-PRINCESS-APP-001 | May need app/onboard check |
| Watchouts | Not started | To be confirmed | |
| Source caveats | Not started | Multiple | |

### App readiness criteria

Before this area is marked **App ready**:

* ship facts have at least one authoritative source
* speculative brochure language has been removed
* family judgement is clearly labelled where used
* onboard details likely to change are caveated

---

## 9. Port guide checklist

Each file should cover one port guide.

Required files:

```text
content-source/03-port-guide-civitavecchia.md
content-source/04-port-guide-naples.md
content-source/05-port-guide-souda-bay-chania.md
content-source/06-port-guide-kusadasi-ephesus.md
content-source/07-port-guide-mykonos.md
content-source/08-port-guide-athens-piraeus.md
content-source/09-port-guide-santorini.md
content-source/10-port-guide-bar-montenegro.md
content-source/11-port-guide-corfu.md
content-source/12-port-guide-messina.md
content-source/13-port-guide-barcelona.md
```

### Required content areas per port

| Area | Required |
| --- | --- |
| Why this port matters | Yes |
| Cruise logistics | Yes |
| Getting around | Yes |
| Highlights | Yes |
| Family lens | Yes |
| Seb angle | Yes |
| Food and culture | Preferred |
| Photography | Preferred |
| Hints and watchouts | Yes |
| Weather and seasonality | Yes |
| Final-check items | Yes |

### Port readiness matrix

| File | Port | Status | Why it matters | Logistics | Getting around | Highlights | Family lens | Weather baseline linked | Final-check list | App ready |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `03-port-guide-civitavecchia.md` | Civitavecchia / Rome | Not started | No | No | No | No | No | No | No | No |
| `04-port-guide-naples.md` | Naples | Not started | No | No | No | No | No | No | No | No |
| `05-port-guide-souda-bay-chania.md` | Souda Bay / Chania | Not started | No | No | No | No | No | No | No | No |
| `06-port-guide-kusadasi-ephesus.md` | Kusadasi / Ephesus | Not started | No | No | No | No | No | No | No | No |
| `07-port-guide-mykonos.md` | Mykonos | Not started | No | No | No | No | No | No | No | No |
| `08-port-guide-athens-piraeus.md` | Athens / Piraeus | Not started | No | No | No | No | No | No | No | No |
| `09-port-guide-santorini.md` | Santorini | Not started | No | No | No | No | No | No | No | No |
| `10-port-guide-bar-montenegro.md` | Bar, Montenegro | Not started | No | No | No | No | No | No | No | No |
| `11-port-guide-corfu.md` | Corfu | Not started | No | No | No | No | No | No | No | No |
| `12-port-guide-messina.md` | Messina | Not started | No | No | No | No | No | No | No | No |
| `13-port-guide-barcelona.md` | Barcelona | Not started | No | No | No | No | No | No | No | No |

---

## 10. Day guide checklist

File:

```text
content-source/14-day-guides.md
```

### Required content per cruise day

| Field | Required for port day | Required for sea day | Notes |
| --- | ---: | ---: | --- |
| Day number | Yes | Yes | Must match itinerary |
| Date | Yes | Yes | Must match itinerary |
| Day type | Yes | Yes | Embarkation / port / sea / disembarkation |
| Today at a glance | Yes | Yes | Short, operational |
| What matters today | Yes | Yes | Main opportunity and constraint |
| Primary plan | Yes | No | For port days |
| Backup plan | Yes | Optional | Weather / tiredness / disruption |
| Weather guidance | Yes | Yes | Forecast or baseline |
| Take ashore checklist | Yes | No | Port days only |
| Onboard ideas | Optional | Yes | Sea days |
| Seb discovery | Yes | Optional | Sea days may use ship/sea theme |
| Photo prompt | Yes | Yes | One strong prompt |
| Return buffer advice | Yes | No | Port days only |
| Confidence notes | Yes | Yes | Keep visible |
| Final-check items | Where relevant | Where relevant | Especially timings and tender status |

### App readiness criteria

Before this area is marked **App ready**:

* every itinerary day has a day guide
* every port day has a plan or clear "unplanned" guidance
* every port day has return-to-ship guidance
* sea days do not inherit port-day language
* Today view can derive its content from the day guides

---

## 11. Shore plan checklist

File:

```text
content-source/15-shore-plans.md
```

### Required plan types

Each major port should ideally have:

| Plan type | Purpose |
| --- | --- |
| Recommended | Best family-balanced option |
| Low-effort | Easy option if tired, hot or delayed |
| Ambitious | High-value but higher effort or higher risk |
| Weather fallback | Works better in rain, heat or wind |
| Ship-safe short option | Safe shorter plan close to port |
| Booked excursion | Only where actually booked or shortlisted |

### Required fields per plan

| Field | Required | Notes |
| --- | --- | --- |
| Plan name | Yes | Clear and scannable |
| Port | Yes | Must match port ID |
| Summary | Yes | Concise |
| Estimated duration | Yes | Approximate is acceptable with caveat |
| Transport mode | Yes | Walk, taxi, shuttle, train, excursion, mixed |
| Effort level | Yes | Low / medium / high |
| Weather dependency | Yes | Low / medium / high |
| Return risk | Yes | Low / medium / high |
| Seb fit | Yes | Excellent / good / mixed / poor |
| Parent fit | Yes | Include family judgement |
| What to take | Yes | Practical checklist |
| Latest sensible return guidance | Yes | Must be caveated unless confirmed |
| Final-check items | Where relevant | Transport, tickets, opening hours |

---

## 12. Seb discovery checklist

File:

```text
content-source/16-seb-discovery.md
```

### Required content types

| Content type | Status | Notes |
| --- | --- | --- |
| Country flag prompts | Not started | One per port country |
| Local phrase prompts | Not started | Short, useful, pronounceable |
| Geography facts | Not started | Seas, islands, volcanoes, straits, capitals |
| History facts | Not started | Pompeii, Ephesus, Athens, Venice influence, etc. |
| Things to spot | Not started | Visible, achievable, not abstract |
| Quiz questions | Not started | One per port day |
| Quiz answers | Not started | Keep simple and factual |
| Memory prompts | Not started | Could Seb explain this day later? |
| Sea day prompts | Not started | Ship, navigation, sea, maps, weather |

### App readiness criteria

Before this area is marked **App ready**:

* every port day has at least one Seb prompt
* quiz answers are accurate
* prompts are age-appropriate
* tone is warm but not babyish
* content reflects Seb's interest in geography, maps, flags, countries and languages

---

## 13. Weather baseline checklist

File:

```text
content-source/17-weather-baselines.md
```

### Required weather baseline fields

| Field | Required | Notes |
| --- | --- | --- |
| Location | Yes | Port or sea-day region |
| Month | Yes | August |
| Typical high | Preferred | Celsius |
| Typical low | Preferred | Celsius |
| Rain tendency | Yes | Plain English |
| Heat guidance | Yes | Especially for Mediterranean ports |
| UV guidance | Preferred | Useful for family guidance |
| Wind or sea breeze notes | Optional | Where useful |
| Clothing guidance | Yes | Practical |
| Plan sensitivity | Yes | What changes if hot, wet or windy |
| Source ID | Yes | Use weather or climate source |
| Confidence | Yes | Usually medium/high depending source |

### App readiness criteria

Before this area is marked **App ready**:

* every port day has a weather baseline
* sea days have sensible region-level guidance or neutral sea-day fallback
* baseline content does not pretend to be a forecast
* forecast and seasonal wording are clearly distinct

---

## 14. Final-check list

File:

```text
content-source/18-final-check-list.md
```

### Required final-check categories

| Category | Required checks |
| --- | --- |
| Itinerary | Dates, port order, arrival/departure times |
| All aboard | All-aboard time for each port day |
| Tendering | Santorini, Greek islands, any uncertain ports |
| Terminals | Civitavecchia, Naples, Piraeus, Barcelona and other cruise areas |
| Shuttle | Ports where shuttle may materially affect plans |
| Transport | Trains, taxis, ferries, transfer times |
| Attractions | Opening hours, ticketing, closures, timed entry |
| Shore plans | Return buffer and route realism |
| Weather | Forecast window and same-day checks |
| Princess app | Dining, show, onboard and operational updates |
| Travel advice | Country entry and safety guidance |
| Barcelona post-cruise | Hotel, luggage, sightseeing timings, airport transfer |

### Suggested final-check dates

| Check window | What to check |
| --- | --- |
| 90 days before travel | Major bookings, required tickets, ship guide updates |
| 60 days before travel | Port logistics, likely shore plans, travel advice |
| 30 days before travel | Attraction openings, transport assumptions, Princess app updates |
| 16 days before each port | Weather forecast begins to become useful |
| 7 days before travel | All high-priority timings and route assumptions |
| Day before each port | Weather, all-aboard, Princess app, tender/shuttle notes |
| Morning of each port | Today view, weather, cruise card, return time, take ashore |

---

## 15. App-content conversion checklist

Before converting a source file into `src/content`, confirm:

| Check | Required |
| --- | ---: |
| Source IDs are recorded | Yes |
| Last checked date is present | Yes |
| Confirmed facts are separated from guidance | Yes |
| Family judgement is labelled | Yes |
| Inferred content is labelled | Yes |
| Final-check items are listed | Yes |
| Sensitive data has been excluded | Yes |
| Content has been shortened for app display | Yes |
| Confidence metadata has been assigned | Yes |
| Port/day/plan IDs are stable | Yes |
| British English has been used | Yes |
| App target file has been identified | Yes |

---

## 16. Static content integrity checklist

Before each release candidate, verify:

| Integrity check | Status |
| --- | --- |
| Every itinerary day has a day guide | Not checked |
| Every port day references an existing port guide | Not checked |
| Every port has a weather baseline | Not checked |
| Every primary shore plan references an existing port | Not checked |
| Every Seb discovery prompt references a valid day or port | Not checked |
| Every final-check item references a valid day, port or content area | Not checked |
| Every source ID referenced in content exists in this register | Not checked |
| No forbidden sensitive data appears in app content | Not checked |
| Every major content item has confidence metadata | Not checked |
| Sea days use sea-day wording, not port-day wording | Not checked |
| All-aboard times are visually prominent where available | Not checked |
| Unconfirmed operational claims have caveats | Not checked |

---

## 17. Release readiness checklist

The verified cruise corpus is ready for release when:

| Release criterion | Status |
| --- | --- |
| Confirmed itinerary file is complete | No |
| Ship guide is app-ready | No |
| All port guides are app-ready | No |
| All day guides are app-ready | No |
| Shore plans are complete enough for travel use | No |
| Seb discovery content covers all port days | No |
| Weather baselines cover all port days | No |
| Final-check list is complete | No |
| Source register is populated | No |
| Sensitive data review has passed | No |
| Content has been converted into typed static app files | No |
| Content integrity tests pass | No |
| Final caveats are visible in the app | No |

---

## 18. Open questions

Track unresolved corpus questions here.

| Question | Area | Priority | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Are all port dates and timings final? | Itinerary | Critical | Phil | Open | Confirm against Princess |
| Is Naples departure 18:30 or 19:00? | Itinerary | Critical | Phil | Open | Known discrepancy to resolve |
| Which ports are tender ports? | Itinerary / logistics | High | Phil | Open | Especially Santorini and Greek islands |
| Which terminal or docking area applies in Barcelona? | Barcelona | High | Phil | Open | Important for post-cruise transfer |
| Which Barcelona activities are booked or preferred? | Barcelona | High | Phil | Open | Sagrada Familia, Park Guell, Casa Batllo / Casa Mila |
| Should any cabin detail be included locally? | Privacy | Medium | Phil | Open | Default is no |
| Should local memory notes be implemented later? | Memories | Low | Phil | Open | Current assumption: prompts only |
| Should weather use Open-Meteo in first release? | Weather | High | Phil | Open | No-key service preferred if approved |

---

## 19. Working notes

Use this section for short corpus-management notes.

```text
2026-07-01:
Created initial source register and corpus checklist for Complete Cruising: Sun Princess 2026 Edition.
This file is intended to govern content collation, verification and conversion into typed static app content.
```

---

## 20. Suggested app content mapping

| Source corpus area | Static app file |
| --- | --- |
| Sailing summary | `src/content/sailing.ts` |
| Confirmed itinerary | `src/content/itinerary.ts` |
| Ship guide | `src/content/ship.ts` |
| Port guides | `src/content/ports/*.ts` |
| Day guides | `src/content/dayGuides/dayGuideContent.ts` |
| Shore plans | `src/content/shorePlans/shorePlanContent.ts` |
| Seb discovery | `src/content/familyGuide.ts` |
| Weather baselines | `src/content/weatherBaselines.ts` |
| Source register | `src/content/sources.ts` |
| Final checks | `src/content/finalChecks.ts` |

---

## 21. Current corpus status summary

| Area | Status | Summary |
| --- | --- | --- |
| Source register | Draft | Structure created, sources need population |
| Itinerary | Not started | Must be confirmed against Princess sources |
| Ship guide | Not started | Sun Princess guide required |
| Port guides | Not started | All ports require source capture and guide content |
| Day guides | Not started | Depends on itinerary and port guide maturity |
| Shore plans | Not started | Depends on port guide and family judgement |
| Seb discovery | Not started | Can begin once port list is confirmed |
| Weather baselines | Not started | Requires weather/climate sources |
| Final checks | Draft | Initial categories defined |
| App content conversion | Not started | Do not begin until source content is curated |

---

## 22. Product judgement

This register exists because the new app is intentionally simple.

The app will not have imports, review queues, database resets or enrichment management screens.

That means content quality must be governed before deployment.

A strong source corpus is the replacement for the failed data-management system.
