# Complete Cruising

## Enrichment Framework v0.1

### Product context

**Complete Cruising** is a Lawrence Family Series application designed to act as a personalised, visually rich cruise companion.

The application will hold cruise-specific intelligence for upcoming, active and completed sailings. It will combine the practical usefulness of a cruise handbook, the selective curation of a destination guidebook, the structure of an itinerary planner, and the personal relevance of a family travel journal.

This enrichment framework defines how information should be researched, structured, reviewed, refreshed and imported into the application.

---

## 1. Purpose of this framework

The purpose of this framework is to prevent enrichment from becoming broad, shallow or unreliable.

Complete Cruising should not rely on one large prompt to enrich a sailing, ship or port. That approach would create content that is difficult to verify, hard to refresh, and likely to blend factual information with opinion or inference.

Instead, enrichment should be performed in targeted, isolated passes.

Each enrichment pass should have:

- one clear subject
    
- one clear scope
    
- one intended output shape
    
- one review status
    
- explicit confidence metadata
    
- a refresh rule where relevant
    

The framework is designed to support a living guidebook model.

---

## 2. Core enrichment principle

**Small, targeted enrichment is more valuable than large, impressive enrichment.**

The goal is not to generate the most text. The goal is to create useful, trusted, structured cruise intelligence that can be reviewed, corrected, reused and refreshed.

A good enrichment pass should answer a narrow question well.

A poor enrichment pass tries to answer everything at once.

---

## 3. Enrichment philosophy

Complete Cruising enrichment should follow ten principles.

### 1. Enrich one object at a time

A ship, port, attraction, itinerary day or sailing should be enriched separately.

Do not enrich multiple ports together unless the task is explicitly comparative.

### 2. Enrich one context at a time

A port fact file, port logistics guide, top attractions list and family suitability guide should be separate enrichment tasks.

### 3. Preserve the difference between fact and judgement

Facts, recommendations, assumptions and family opinions must not be blended together without distinction.

### 4. Use confidence metadata

The app should know whether information is confirmed, researched, inferred, outdated or awaiting review.

### 5. Keep time-sensitive content refreshable

Port times, weather, opening hours, tender status, transport options, cruise terminal details and official requirements may change.

### 6. Prefer structured data over prose

Narrative summaries are useful, but importable structured data is more valuable.

### 7. Make content reusable

A port guide for Barcelona should be reusable across multiple sailings, but a specific day guide for Barcelona on a given cruise should remain sailing-specific.

### 8. Make content personal

Generic travel advice is not enough. Enrichment should consider Phil, Rebecca and Seb where appropriate.

### 9. Make uncertainty visible

The application should never make uncertain content look authoritative.

### 10. Support review before commit

No enrichment import should silently overwrite trusted existing content.

---

## 4. Enrichment layers

Complete Cruising should use layered enrichment.

Each layer builds upon the previous one.

### Layer 1: Core record

Basic user-entered or imported data.

Examples:

- sailing dates
    
- cruise line
    
- ship
    
- cabin
    
- port names
    
- itinerary days
    
- arrival and departure times
    

### Layer 2: Factual enrichment

Objective information about the ship, port, country, terminal, attraction or itinerary.

Examples:

- country
    
- currency
    
- language
    
- coordinates
    
- ship class
    
- passenger capacity
    
- terminal location
    
- attraction opening pattern
    

### Layer 3: Practical enrichment

Information that helps the family make decisions.

Examples:

- distance from port to city centre
    
- likely transport options
    
- walking feasibility
    
- expected crowding
    
- time needed at attractions
    
- return-to-ship risk
    

### Layer 4: Curated enrichment

Selective, guidebook-style recommendations.

Examples:

- top 10 highlights
    
- best short plan
    
- best family plan
    
- best photography spot
    
- best low-effort option
    
- best rainy-day alternative
    

### Layer 5: Family enrichment

Personalised guidance for Phil, Rebecca and Seb.

Examples:

- Seb discovery prompts
    
- child-friendly suitability
    
- family pace warnings
    
- food comfort options
    
- local geography learning
    
- photo prompts
    
- memory prompts
    

### Layer 6: Operational enrichment

Time-sensitive and cruise-day guidance.

Examples:

- today’s weather
    
- all-aboard reminder
    
- ashore checklist
    
- transport timing
    
- return buffer
    
- plan A and plan B
    
- live notes
    

### Layer 7: Memory enrichment

Post-travel reflections.

Examples:

- what happened
    
- what worked
    
- what surprised us
    
- Seb’s favourite moment
    
- whether we would return
    
- confirmed memories for Adventure Almanac
    

---

## 5. Object types requiring enrichment

The following object types should be enriched separately.

### 5.1 Sailing

Represents a specific cruise booking.

Typical enrichment:

- sailing summary
    
- route context
    
- cruise line context
    
- planning status
    
- package notes
    
- document readiness
    
- risk areas
    
- pre-cruise task list
    

### 5.2 Ship

Represents the cruise ship.

Typical enrichment:

- identity and class
    
- design character
    
- deck orientation
    
- dining
    
- cabins
    
- family facilities
    
- entertainment
    
- pools and recreation
    
- practical tips
    
- watchouts
    

### 5.3 Itinerary day

Represents one day of the sailing.

Typical enrichment:

- day summary
    
- port timing
    
- local context
    
- weather
    
- planned activity
    
- backup option
    
- ashore checklist
    
- Seb discovery
    
- return buffer
    

### 5.4 Port

Represents a reusable cruise port record.

Typical enrichment:

- fact file
    
- cruise logistics
    
- getting around
    
- attractions
    
- family suitability
    
- food and drink
    
- culture
    
- photography
    
- hints and tips
    
- safety notes
    
- weather seasonality
    

### 5.5 Attraction

Represents a specific point of interest linked to a port.

Typical enrichment:

- why it matters
    
- travel time from port
    
- visit duration
    
- booking need
    
- family suitability
    
- weather sensitivity
    
- cost level
    
- accessibility notes
    

### 5.6 Shore plan

Represents a possible or confirmed plan for a port day.

Typical enrichment:

- route
    
- timings
    
- transport
    
- cost
    
- risk level
    
- family fit
    
- backup plan
    
- return buffer
    
- booking notes
    

### 5.7 Weather snapshot

Represents forecast or climate intelligence for a specific date and location.

Typical enrichment:

- temperature
    
- rain probability
    
- wind
    
- sunrise and sunset
    
- sea conditions, where available
    
- comfort notes
    
- clothing guidance
    
- weather-sensitive plan warnings
    

### 5.8 Memory entry

Represents what actually happened.

Typical enrichment:

- family reflection
    
- confirmed travel fact
    
- Seb’s favourite element
    
- highlight
    
- learning point
    
- photo note
    
- repeat visit judgement
    

---

## 6. Ship enrichment framework

Ship enrichment should be performed as a series of focused packs.

Each ship pack should be capable of being generated, reviewed and refreshed independently.

### Ship Pack 1: Ship identity and character

#### Purpose

Create a reliable overview of what the ship is and what kind of cruise experience it offers.

#### Scope

- ship name
    
- cruise line
    
- ship class
    
- year built
    
- refit or major update history
    
- approximate size and capacity
    
- design character
    
- target passenger experience
    
- family relevance
    
- standout features
    

#### Exclusions

Do not cover detailed dining, entertainment, cabins or deck-by-deck guidance.

#### Output sections

- Ship at a glance
    
- What this ship is known for
    
- Style and atmosphere
    
- Family relevance
    
- Watchouts
    
- Confidence notes
    

---

### Ship Pack 2: Deck layout and orientation

#### Purpose

Help the family understand how to move around the ship.

#### Scope

- main public decks
    
- key vertical movement points
    
- cabin-to-venue convenience
    
- dining zones
    
- pool and recreation zones
    
- theatre and entertainment zones
    
- quiet spaces
    
- embarkation orientation tips
    

#### Exclusions

Do not attempt to recreate a full official deck plan.

#### Output sections

- Orientation summary
    
- Key decks
    
- Useful routes
    
- Likely crowd pinch points
    
- Family navigation tips
    
- Confidence notes
    

---

### Ship Pack 3: Dining

#### Purpose

Create a practical guide to dining choices.

#### Scope

- main dining rooms
    
- buffet
    
- casual dining
    
- speciality dining
    
- included versus paid options
    
- family-friendly venues
    
- booking requirements
    
- dress code considerations
    
- likely busy times
    
- food comfort options for Seb
    

#### Exclusions

Do not present menus as permanent facts unless they are confirmed for the sailing.

#### Output sections

- Dining overview
    
- Included dining
    
- Paid dining
    
- Family-friendly choices
    
- Booking and timing tips
    
- Seb suitability
    
- Confidence notes
    

---

### Ship Pack 4: Cabins and practical life onboard

#### Purpose

Help the family understand the cabin and practical onboard living.

#### Scope

- cabin type
    
- deck position
    
- nearby lifts or stairs
    
- likely noise considerations
    
- storage
    
- power sockets
    
- bathroom considerations
    
- laundry
    
- medical centre
    
- Wi-Fi
    
- onboard payments
    
- daily practical routines
    

#### Exclusions

Do not claim precise cabin-specific details unless confirmed from booking or official sources.

#### Output sections

- Cabin intelligence
    
- Practical onboard living
    
- Useful habits
    
- Watchouts
    
- Confidence notes
    

---

### Ship Pack 5: Family and Seb suitability

#### Purpose

Assess the ship through the lens of the Lawrence family.

#### Scope

- child-friendly facilities
    
- activities Seb may enjoy
    
- learning opportunities
    
- water/pool relevance
    
- shows and entertainment suitability
    
- spaces for calm time
    
- possible boredom risks
    
- parent convenience
    

#### Output sections

- Best for Seb
    
- Best for family time
    
- Likely adult wins
    
- Possible friction points
    
- Suggested onboard routines
    
- Confidence notes
    

---

### Ship Pack 6: Entertainment and venues

#### Purpose

Summarise evening and onboard entertainment options.

#### Scope

- theatres
    
- lounges
    
- live music
    
- activity venues
    
- family entertainment
    
- major shows
    
- booking requirements
    
- crowding and timing considerations
    

#### Exclusions

Do not assume a specific show schedule unless confirmed for the sailing.

#### Output sections

- Entertainment overview
    
- Venues to know
    
- Family-friendly options
    
- Booking considerations
    
- Best times
    
- Confidence notes
    

---

### Ship Pack 7: Pools, recreation and relaxation

#### Purpose

Understand where the family may spend sea days or relaxed onboard time.

#### Scope

- pools
    
- hot tubs
    
- water features
    
- sports areas
    
- spa
    
- adult-only areas
    
- quiet decks
    
- sun/shade considerations
    
- sea day crowding
    

#### Output sections

- Pool and recreation overview
    
- Best family areas
    
- Best calm areas
    
- Sea day strategy
    
- Watchouts
    
- Confidence notes
    

---

### Ship Pack 8: Tips, watchouts and best experiences

#### Purpose

Capture practical traveller wisdom.

#### Scope

- embarkation tips
    
- disembarkation tips
    
- best early actions onboard
    
- reservation tips
    
- crowd avoidance
    
- photo opportunities
    
- premium experiences
    
- things to avoid
    
- things worth prioritising
    

#### Output sections

- First day priorities
    
- Best experiences
    
- Avoidable frustrations
    
- Hidden gems
    
- Practical watchouts
    
- Confidence notes
    

---

## 7. Port enrichment framework

Port enrichment should be performed in narrow packs. Each port should become a reusable guidebook record.

### Port Pack 1: Port fact file

#### Purpose

Create the core factual identity of the port.

#### Scope

- port name
    
- country
    
- region
    
- language
    
- currency
    
- timezone
    
- flag
    
- local identity
    
- short history
    
- why the place matters
    
- basic geography
    
- local phrase starter
    

#### Exclusions

Do not cover transport, attractions or shore plans in detail.

#### Output sections

- At a glance
    
- Country and region
    
- Language and currency
    
- Why this port matters
    
- Useful phrases
    
- Seb discovery
    
- Confidence notes
    

---

### Port Pack 2: Cruise logistics

#### Purpose

Understand the port from a cruise passenger perspective.

#### Scope

- likely terminal or docking area
    
- tender versus docked likelihood
    
- distance to city centre
    
- shuttle availability, if known
    
- taxi expectations
    
- walking feasibility
    
- port facilities
    
- return-to-ship implications
    
- local time considerations
    

#### Exclusions

Do not make a precise terminal claim unless confirmed.

#### Output sections

- Arrival experience
    
- Docking or tender notes
    
- Distance and movement
    
- Port facilities
    
- Return-to-ship considerations
    
- Confidence notes
    

---

### Port Pack 3: Getting around

#### Purpose

Help the family decide how to move ashore.

#### Scope

- walking
    
- taxi
    
- shuttle
    
- public transport
    
- private tour
    
- cruise excursion
    
- car hire, if relevant
    
- accessibility
    
- child suitability
    
- traffic and delay considerations
    

#### Output sections

- Movement overview
    
- Best low-effort option
    
- Best independent option
    
- Best organised option
    
- Transport watchouts
    
- Confidence notes
    

---

### Port Pack 4: Top 10 highlights

#### Purpose

Create a selective DK-style guide to the best things to see or do.

#### Scope

For each highlight:

- name
    
- type
    
- why it matters
    
- distance from port
    
- typical time needed
    
- family suitability
    
- weather sensitivity
    
- booking need
    
- priority score
    

#### Rules

The list should be selective, not exhaustive.

The top 10 should include a mix of:

- landmark
    
- history
    
- culture
    
- scenery
    
- food/local experience
    
- child-friendly option
    
- quick-win option
    
- photography option
    

#### Output sections

- Top 10 highlights
    
- Best three for this family
    
- Best quick option
    
- Best educational option
    
- Best rainy-day option
    
- Confidence notes
    

---

### Port Pack 5: Family lens

#### Purpose

Assess the port for Phil, Rebecca and Seb.

#### Scope

- what Seb may enjoy
    
- what Rebecca may appreciate
    
- what Phil may value
    
- likely boredom risks
    
- heat and walking risks
    
- crowding risks
    
- food comfort options
    
- realistic pacing
    
- rest opportunities
    

#### Output sections

- Seb fit
    
- Parent fit
    
- Likely family wins
    
- Likely friction points
    
- Recommended pace
    
- Confidence notes
    

---

### Port Pack 6: Food, culture and local experience

#### Purpose

Identify realistic cultural and food experiences.

#### Scope

- local specialities
    
- low-risk food options
    
- quick snack or drink ideas
    
- market or café culture
    
- etiquette
    
- phrases
    
- child-friendly eating
    
- places where food may become part of the experience
    

#### Exclusions

Do not recommend specific restaurants unless reliable and relevant.

#### Output sections

- Local flavour
    
- Family-safe food ideas
    
- Cultural quick wins
    
- Useful phrases
    
- Watchouts
    
- Confidence notes
    

---

### Port Pack 7: Photography and views

#### Purpose

Help the family capture memorable images.

#### Scope

- best viewpoints
    
- harbour views
    
- landmark angles
    
- family photo spots
    
- golden hour opportunities
    
- arrival or sailaway views
    
- indoor alternatives
    
- drone considerations, only as general caution unless researched separately
    

#### Output sections

- Best views
    
- Best family photo spot
    
- Best ship photo opportunity
    
- Best Seb memory photo
    
- Light and timing notes
    
- Confidence notes
    

---

### Port Pack 8: Hints, tips and watchouts

#### Purpose

Capture practical, experience-led guidance.

#### Scope

- queues
    
- crowds
    
- heat
    
- scams
    
- tourist traps
    
- closures
    
- uneven walking
    
- cash/card considerations
    
- comfort breaks
    
- local sensitivities
    
- return risks
    

#### Output sections

- What to know before stepping ashore
    
- Common frustrations
    
- Things to avoid
    
- Comfort tips
    
- Return buffer advice
    
- Confidence notes
    

---

### Port Pack 9: Weather and seasonality

#### Purpose

Set expectations for weather before forecast windows open.

#### Scope

- typical temperature
    
- rainfall tendency
    
- humidity
    
- wind
    
- daylight
    
- sea breeze
    
- clothing guidance
    
- weather-sensitive attractions
    
- likely comfort level for Seb
    

#### Output sections

- Seasonal expectation
    
- Clothing guidance
    
- Weather-sensitive plans
    
- Heat, rain or wind cautions
    
- Refresh recommendation
    
- Confidence notes
    

---

### Port Pack 10: Suggested shore plans

#### Purpose

Turn port intelligence into practical options.

#### Scope

Create several possible plans:

- low-effort plan
    
- family-balanced plan
    
- highlights plan
    
- cultural plan
    
- weather fallback
    
- ambitious plan
    
- ship-safe short plan
    

Each plan should include:

- summary
    
- start point
    
- attractions included
    
- estimated timings
    
- transport mode
    
- risk level
    
- return buffer
    
- suitability
    
- what to take
    

#### Output sections

- Recommended plan
    
- Alternative plans
    
- Plan comparison
    
- Return-to-ship risk
    
- Confidence notes
    

---

## 8. Attraction enrichment framework

Attractions should be enriched separately when they are likely to feature in shore plans.

### Attraction Pack 1: Attraction fact file

#### Purpose

Understand what the attraction is.

#### Scope

- name
    
- type
    
- location
    
- why it matters
    
- historical or cultural significance
    
- typical visit duration
    
- booking need
    
- cost level
    
- family suitability
    

### Attraction Pack 2: Cruise suitability

#### Purpose

Assess whether the attraction works during a port call.

#### Scope

- distance from port
    
- travel time
    
- queue risk
    
- time ashore needed
    
- weather sensitivity
    
- return buffer implications
    
- child suitability
    
- whether to self-guide or book
    

### Attraction Pack 3: Family and Seb lens

#### Purpose

Make the attraction meaningful for the Lawrence family.

#### Scope

- what Seb might notice
    
- simple explanation
    
- photo prompt
    
- boredom risk
    
- physical effort
    
- best way to frame the visit
    
- nearby fallback options
    

---

## 9. Itinerary day enrichment framework

A day guide should only be generated once the relevant sailing, ship and port data is sufficiently mature.

### Day Pack 1: Day summary

#### Purpose

Create a curated summary of the day.

#### Scope

- date
    
- day number
    
- port or sea day
    
- arrival and departure
    
- all-aboard
    
- local time
    
- weather status
    
- planned activity
    
- backup activity
    

### Day Pack 2: Today ashore

#### Purpose

Create the operational guide for a port day.

#### Scope

- key times
    
- local facts
    
- plan A
    
- plan B
    
- what to take
    
- transport
    
- return buffer
    
- family warnings
    
- comfort notes
    

### Day Pack 3: Seb discovery

#### Purpose

Make the day educational and fun for Seb.

#### Scope

- flag
    
- local phrase
    
- map fact
    
- one thing to spot
    
- quiz question
    
- simple explanation
    
- memory prompt
    

### Day Pack 4: Sea day guide

#### Purpose

Create a useful guide for a sea day.

#### Scope

- onboard opportunities
    
- food plans
    
- pool strategy
    
- shows or activities
    
- relaxation ideas
    
- family downtime
    
- weather and deck comfort
    
- memory prompt
    

### Day Pack 5: Embarkation or disembarkation guide

#### Purpose

Create practical guidance for the beginning or end of a cruise.

#### Scope

- timing
    
- documents
    
- luggage
    
- transfers
    
- food
    
- waiting
    
- family comfort
    
- first or final ship priorities
    
- stress points
    

---

## 10. Source hierarchy

Not all sources should be treated equally.

The app should preserve source type and source confidence.

### Highest authority

- cruise line booking documentation
    
- official cruise line itinerary
    
- official cruise line app
    
- official port authority
    
- official tourism board
    
- official attraction website
    
- official government travel or entry guidance
    

### Strong supporting sources

- reputable travel guide publishers
    
- established cruise review publications
    
- recognised travel media
    
- major mapping platforms
    
- official transport operators
    
- museum or attraction partners
    

### Useful but lower authority

- traveller blogs
    
- forums
    
- YouTube cruise reviews
    
- social media
    
- cruise community comments
    
- general travel listicles
    

### Family authority

- family’s own experience
    
- previous visits
    
- personal preferences
    
- notes from earlier cruises
    
- confirmed memories
    

### Source rule

A source can be useful without being authoritative.

The app should allow lower-authority sources to influence hints and tips, but not overwrite confirmed itinerary, safety, timing or booking data.

---

## 11. Confidence model

Every enriched section should carry confidence metadata.

### Confidence levels

#### confirmed

Information has been confirmed by booking documentation, official cruise line material, official port material, or direct family knowledge.

#### high

Information is supported by multiple reliable sources and is unlikely to vary significantly.

#### medium

Information appears reliable but may depend on timing, season, local conditions or incomplete source coverage.

#### low

Information may be useful but needs verification before being relied upon.

#### inferred

Information has been reasoned from available context but has not been confirmed.

#### unknown

Confidence cannot be established.

### Review statuses

- not_reviewed
    
- needs_user_review
    
- reviewed
    
- verified
    
- needs_refresh
    
- stale
    
- rejected
    

### Refresh flags

The following should usually be marked refreshable:

- port times
    
- all-aboard time
    
- terminal
    
- tender status
    
- shuttle availability
    
- attraction opening hours
    
- attraction ticket rules
    
- transport options
    
- weather
    
- safety guidance
    
- visa or entry notes
    
- restaurant details
    
- cruise line policies
    

---

## 12. Data separation rules

Complete Cruising must avoid mixing different categories of information.

### Confirmed data

Examples:

- booking reference
    
- sailing dates
    
- cruise line
    
- ship
    
- cabin
    
- confirmed itinerary
    
- confirmed port times
    
- confirmed packages
    

This should be protected.

### Researched data

Examples:

- port guide
    
- ship guide
    
- attractions
    
- logistics
    
- food
    
- photography spots
    

This should be reviewable and refreshable.

### Inferred data

Examples:

- likely tender risk
    
- suggested return buffer
    
- likely family suitability
    
- likely crowding
    

This should be clearly marked.

### Personal data

Examples:

- family preferences
    
- Seb interests
    
- Rebecca preferences
    
- previous family experience
    
- notes from Phil
    

This should be treated as family-authored context.

### Generated guidance

Examples:

- recommended plan
    
- Today guide
    
- Seb quiz
    
- packing suggestions
    

This should be traceable back to underlying data.

---

## 13. Enrichment output standards

Every enrichment output should follow a consistent structure.

### Required metadata

Each enrichment pack should include:

- enrichmentPackId
    
- parentType
    
- parentId or parentName
    
- sectionType
    
- title
    
- generatedDate
    
- sourceTypesUsed
    
- confidence
    
- reviewStatus
    
- refreshRecommended
    
- refreshReason
    
- notes
    

### Required content fields

Each pack should include:

- shortSummary
    
- structuredFacts
    
- practicalGuidance
    
- familyRelevance
    
- watchouts
    
- suggestedNextActions
    

### Optional content fields

Depending on the pack:

- sebDiscovery
    
- photoPrompts
    
- weatherSensitivity
    
- accessibilityNotes
    
- bookingAdvice
    
- costNotes
    
- timingAdvice
    
- returnBufferAdvice
    
- mapNotes
    

---

## 14. Example enrichment JSON shape

The final schema may evolve, but each enrichment import should broadly resemble this pattern.

```json
{
  "schema": "complete-cruising-enrichment-v1",
  "enrichmentRun": {
    "id": "enrich-port-barcelona-logistics-2026-06-17",
    "generatedDate": "2026-06-17",
    "target": {
      "parentType": "port",
      "parentName": "Barcelona",
      "sectionType": "cruise_logistics"
    },
    "sourceTypesUsed": [
      "official_port_source",
      "official_tourism_source",
      "reputable_travel_source"
    ],
    "confidence": "medium",
    "reviewStatus": "needs_user_review",
    "refreshRecommended": true,
    "refreshReason": "Cruise terminal, shuttle, traffic and timing details may change before sailing."
  },
  "content": {
    "shortSummary": "",
    "structuredFacts": [],
    "practicalGuidance": [],
    "familyRelevance": [],
    "watchouts": [],
    "suggestedNextActions": []
  }
}
```

---

## 15. Prompting rules for enrichment

Each enrichment prompt should be narrow and explicit.

### Good enrichment prompt pattern

A good prompt should specify:

- the target object
    
- the exact enrichment pack
    
- what to include
    
- what to exclude
    
- preferred source hierarchy
    
- whether web research is required
    
- output structure
    
- confidence requirements
    
- refresh requirements
    
- family lens, if appropriate
    

### Poor enrichment prompt pattern

Poor prompts ask for everything at once.

Examples to avoid:

- “Enrich this cruise.”
    
- “Tell me everything about Sun Princess.”
    
- “Create a full guide to Naples.”
    
- “Research all ports.”
    
- “Build me the complete cruise guide.”
    

These can be useful for early brainstorming, but not for importable data creation.

---

## 16. Standard enrichment prompt template

The following template should be used as the baseline for future enrichment work.

```text
You are creating one targeted enrichment pack for Complete Cruising, a personal Lawrence Family cruise companion application.

Target object:
[ship / port / attraction / itinerary day / sailing]

Target name:
[insert name]

Enrichment pack:
[insert pack name]

Purpose:
[explain what this pack must achieve]

Important context:
[insert sailing, family or itinerary context if relevant]

Include:
[list exact inclusions]

Exclude:
[list exclusions to prevent scope creep]

Source expectations:
Prioritise official and reputable sources.
Separate confirmed facts from researched guidance and inference.
Flag anything time-sensitive or uncertain.

Family lens:
Consider Phil, Rebecca and Seb where relevant.
Seb is curious, geography-focused, enjoys facts, flags, maps, languages and animals, but pacing and child suitability matter.

Output format:
Return structured JSON only using the agreed Complete Cruising enrichment schema.
Include confidence, reviewStatus, refreshRecommended and refreshReason.
Do not include unsupported claims.
Do not overwrite confirmed booking or itinerary data unless explicitly instructed.
```

---

## 17. Review workflow

Every enrichment import should pass through review.

### Step 1: Generate

Create one enrichment pack.

### Step 2: Inspect

Review the content for:

- factual plausibility
    
- scope compliance
    
- unsupported claims
    
- excessive generic wording
    
- overconfidence
    
- missing refresh flags
    

### Step 3: Import preview

The app should show:

- target object
    
- affected section
    
- confidence
    
- refresh status
    
- proposed additions
    
- proposed overwrites
    
- warnings
    

### Step 4: Commit

The user commits the enrichment.

### Step 5: Mark review state

Possible outcomes:

- accepted as reviewed
    
- accepted but needs refresh
    
- partially accepted
    
- rejected
    
- held for manual correction
    

### Step 6: Refresh later

Time-sensitive sections should be revisited.

---

## 18. Refresh model

Complete Cruising should support planned refresh cycles.

### Static or slow-changing content

Refresh occasionally.

Examples:

- ship overview
    
- general port history
    
- basic language
    
- currency
    
- geography
    
- major attractions
    

Suggested refresh:

- before a new sailing using the same ship or port
    
- annually if still relevant
    
- after major ship refit or port redevelopment
    

### Medium-changing content

Refresh before travel.

Examples:

- dining venues
    
- onboard facilities
    
- transport options
    
- attraction ticketing
    
- opening patterns
    
- cruise terminal information
    

Suggested refresh:

- 60 to 30 days before sailing
    
- again 14 to 7 days before sailing if important
    

### Fast-changing content

Refresh close to the relevant date.

Examples:

- weather
    
- sea conditions
    
- port times
    
- shuttle operation
    
- local disruption
    
- strikes
    
- attraction closures
    
- official safety guidance
    

Suggested refresh:

- 16 days before
    
- 7 days before
    
- 48 hours before
    
- same day, where possible
    

---

## 19. Sailing enrichment sequence

A new sailing should be enriched in the following order.

### Stage 1: Create sailing shell

Input:

- cruise line
    
- ship
    
- sailing dates
    
- itinerary
    
- known port times
    
- cabin
    
- travellers
    

Output:

- structured sailing record
    

### Stage 2: Validate itinerary spine

Objective:

- confirm day numbers
    
- confirm dates
    
- confirm ports
    
- confirm sea days
    
- confirm embarkation and disembarkation
    
- identify unknown port times
    

### Stage 3: Enrich ship identity

Objective:

- establish ship baseline
    

### Stage 4: Enrich ship experience packs

Objective:

- dining
    
- layout
    
- family
    
- entertainment
    
- practical tips
    

### Stage 5: Enrich ports individually

Objective:

- create reusable port records
    

### Stage 6: Enrich top attractions

Objective:

- create attraction records only for realistic candidates
    

### Stage 7: Create suggested shore plans

Objective:

- turn port data into practical options
    

### Stage 8: Generate day guides

Objective:

- create curated daily guidance
    

### Stage 9: Refresh operational data

Objective:

- weather
    
- port timing
    
- terminal
    
- local disruption
    

### Stage 10: Capture memories

Objective:

- record what actually happened
    
- prepare Adventure Almanac export
    

---

## 20. Example pack sequencing for one port

For a port such as Naples, enrichment should not happen in one pass.

Recommended sequence:

1. Naples Port Fact File
    
2. Naples Cruise Logistics
    
3. Naples Getting Around
    
4. Naples Top 10 Highlights
    
5. Naples Family Lens
    
6. Naples Food, Culture and Local Experience
    
7. Naples Photography and Views
    
8. Naples Hints, Tips and Watchouts
    
9. Naples Weather and Seasonality
    
10. Naples Suggested Shore Plans
    
11. Naples Day Guide for the specific sailing
    

This gives better accuracy, better review control and better future reuse.

---

## 21. Example pack sequencing for one ship

For a ship such as Sun Princess, enrichment should not happen in one pass.

Recommended sequence:

1. Sun Princess Ship Identity and Character
    
2. Sun Princess Layout and Orientation
    
3. Sun Princess Dining
    
4. Sun Princess Cabins and Practical Life Onboard
    
5. Sun Princess Family and Seb Suitability
    
6. Sun Princess Entertainment and Venues
    
7. Sun Princess Pools, Recreation and Relaxation
    
8. Sun Princess Tips, Watchouts and Best Experiences
    
9. Sun Princess Sailing-Specific Family Guide
    

This prevents the ship guide from becoming a single bloated text block.

---

## 22. Family lens rules

The family lens should be used carefully.

It should personalise the content without distorting factual accuracy.

### Phil lens

Potential considerations:

- practical confidence
    
- technology
    
- photography
    
- logistics
    
- maps
    
- efficient planning
    
- desire for high-quality experiences
    
- interest in enriched data and structured records
    

### Rebecca lens

Potential considerations:

- comfort
    
- family enjoyment
    
- avoiding unnecessary stress
    
- good food and pleasant settings
    
- photography relevance
    
- practicality during family travel
    

### Seb lens

Potential considerations:

- geography
    
- maps
    
- flags
    
- countries
    
- languages
    
- animals
    
- ships
    
- facts
    
- quizzes
    
- child-friendly pacing
    
- boredom risk
    
- food caution
    
- heat or tiredness sensitivity
    

### Rule

The family lens should make guidance more useful. It should not invent preferences or over-personalise where the general answer is sufficient.

---

## 23. Guidebook style rules

Complete Cruising should aim for curated guidebook quality.

### Style inspiration

The enrichment should capture the essence of:

- a top 10 destination guide
    
- a cruise ship handbook
    
- a family travel planner
    
- a practical port-day briefing
    
- a personal memory journal
    

### Writing style

Use:

- concise summaries
    
- ranked recommendations
    
- practical judgement
    
- clear caveats
    
- confident but not reckless guidance
    
- elegant travel language where appropriate
    

Avoid:

- generic tourist brochure phrasing
    
- long encyclopaedic history
    
- unsupported superlatives
    
- repetitive filler
    
- vague recommendations
    
- false certainty
    
- excessive disclaimers
    

### Recommended tone

The tone should feel informed, selective and useful.

Example:

“Best first hour: leave the port area, walk towards the old town, capture the harbour view, then decide whether to continue independently or settle into a café stop.”

Not:

“This beautiful destination has something for everyone and offers many wonderful attractions.”

---

## 24. Day guide output standard

A day guide should be short enough to use onboard.

Recommended structure:

### Today at a glance

- port or sea day
    
- date
    
- arrival
    
- departure
    
- all-aboard
    
- local time
    
- weather
    

### What matters today

- main opportunity
    
- main constraint
    
- main risk
    
- best family win
    

### Our likely plan

- simple timeline
    
- transport
    
- stops
    
- return buffer
    

### Backup plan

- rain option
    
- tiredness option
    
- low-effort option
    

### Take ashore

- cruise cards
    
- passports, if needed
    
- sun protection
    
- water
    
- charger
    
- local cash/card
    
- medication
    
- comfortable footwear
    

### Seb’s discovery

- flag
    
- phrase
    
- fact
    
- thing to spot
    
- quiz question
    

### Photo prompt

- one realistic image to capture
    

### Confidence notes

- what is confirmed
    
- what needs checking
    
- what may change
    

---

## 25. Import validation rules

The app should validate imported enrichment.

### Required checks

- schema matches expected version
    
- target object exists or can be created
    
- enrichment pack type is recognised
    
- confidence value is valid
    
- review status is valid
    
- no protected confirmed data is overwritten without warning
    
- dates are valid
    
- coordinates are valid, where present
    
- arrays contain expected object shapes
    
- required fields are present
    

### Warning conditions

- low confidence
    
- inferred content
    
- stale content
    
- refresh recommended
    
- source type missing
    
- target mismatch
    
- duplicate attraction
    
- duplicate port
    
- conflicting port time
    
- conflicting currency or timezone
    
- itinerary date mismatch
    

### Commit behaviour

The app should allow:

- accept all
    
- accept selected sections
    
- reject selected sections
    
- save as draft
    
- overwrite existing reviewed content only with explicit confirmation
    

---

## 26. Enrichment quality checklist

Before accepting an enrichment pack, check:

1. Does it answer the exact enrichment question?
    
2. Has it avoided scope creep?
    
3. Are facts separated from judgement?
    
4. Are confidence levels sensible?
    
5. Are refresh flags applied where needed?
    
6. Is the family lens useful but not forced?
    
7. Is the content practical for a cruise passenger?
    
8. Is it concise enough to be useful?
    
9. Could this be imported cleanly?
    
10. Would this help the family make a better decision?
    

---

## 27. Anti-patterns

The following patterns should be avoided.

### Anti-pattern 1: Encyclopaedia dumping

Too much general history or destination trivia.

### Anti-pattern 2: False certainty

Making precise claims about terminals, opening hours or transport without confirmation.

### Anti-pattern 3: Generic family advice

Saying “great for families” without explaining why.

### Anti-pattern 4: Overloading the port record

Putting every possible attraction and plan into one field.

### Anti-pattern 5: Mixing current and historic data

Old traveller comments should not be treated as current operational guidance.

### Anti-pattern 6: Treating weather as static

Forecasts must have timestamps and refresh rules.

### Anti-pattern 7: Treating AI output as final

Every enrichment pack should be reviewable.

### Anti-pattern 8: Duplicating cruise line apps

Complete Cruising should add a personal intelligence layer, not recreate official onboard systems.

---

## 28. Recommended first enrichment target

The first real enrichment programme should focus on one upcoming sailing.

Recommended starting candidate:

**Sun Princess, Rome to Barcelona, August 2026**

The first enrichment run should not attempt to cover the whole cruise.

Recommended first batch:

1. Sailing shell
    
2. Itinerary spine
    
3. Sun Princess Ship Identity and Character
    
4. Sun Princess Layout and Orientation
    
5. Rome/Civitavecchia Port Fact File
    
6. Rome/Civitavecchia Cruise Logistics
    

This creates enough substance to test the framework without overloading the process.

---

## 29. Relationship to visual design

The enrichment framework should directly support the visual experience.

Each enrichment pack should feed specific interface components.

Examples:

### Ship identity

Feeds:

- ship hero card
    
- ship profile page
    
- sailing dashboard
    

### Port fact file

Feeds:

- port postcard card
    
- flag/language/currency chips
    
- Seb discovery card
    

### Cruise logistics

Feeds:

- port arrival card
    
- getting ashore card
    
- return buffer card
    

### Top 10 highlights

Feeds:

- attraction carousel
    
- shore plan builder
    
- family recommendation panel
    

### Weather

Feeds:

- Today view
    
- packing guidance
    
- plan warning cards
    

### Photography

Feeds:

- photo prompt card
    
- memory capture page
    

### Family lens

Feeds:

- Seb discovery
    
- family suitability tags
    
- recommended plan ranking
    

This prevents enrichment from becoming hidden content. Each pack should power a visible and useful part of the app.

---

## 30. v0.1 conclusion

Complete Cruising should treat enrichment as a structured publishing process.

The application’s value depends on the quality, accuracy and usability of its enriched data. The best results will come from targeted, isolated enrichment packs that can be reviewed, imported, refreshed and reused.

This framework establishes the operating model:

- one object at a time
    
- one context at a time
    
- clear source hierarchy
    
- visible confidence
    
- structured output
    
- review before commit
    
- refresh when time-sensitive
    
- family relevance where useful
    
- beautiful presentation in the app
    

The result should be a living cruise guidebook that feels personal, practical and premium.

**Complete Cruising should not simply know where the ship is going. It should help the family understand what each sailing can become.**