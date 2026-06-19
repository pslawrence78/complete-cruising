# Complete Cruising

## HTML Prototype Specification v0.1

### Product context

**Complete Cruising** is a Lawrence Family Series application designed to become a personalised, visually rich cruise companion.

The application should transform a cruise booking into a living guidebook that combines sailing data, ship intelligence, port enrichment, day-by-day planning, weather context, family guidance, Seb discovery content and post-cruise memory capture.

This document defines the first standalone HTML prototype.

The prototype should not be a wireframe. It should be a visually polished, emotionally compelling, cruise-themed concept that proves the product direction.

---

# 1. Purpose of the prototype

The purpose of the standalone HTML prototype is to prove the visual and experiential ambition of Complete Cruising before committing to the full PWA build.

The prototype should demonstrate:

1. A premium maritime visual identity.
    
2. A visually rich cruise dashboard.
    
3. A day-by-day itinerary structure.
    
4. A practical Today view.
    
5. Port guidebook presentation.
    
6. Ship guide presentation.
    
7. Shore plan comparison.
    
8. Seb-focused discovery content.
    
9. Memory capture and Adventure Almanac export concept.
    
10. Enrichment and confidence status presentation.
    
11. Responsive behaviour across desktop, tablet and mobile.
    

The prototype should make the app feel desirable, not merely functional.

---

# 2. Prototype format

The first prototype should be a **single standalone HTML file**.

It should include:

- HTML
    
- CSS
    
- minimal JavaScript if useful
    
- no external dependencies
    
- no required API keys
    
- no build tooling
    
- no framework dependency
    
- no server requirement
    

The prototype should open directly in a browser.

Recommended file name:

```text
complete-cruising-prototype-v0.1.html
```

The HTML file should be suitable for manual iteration before any React, Vite or PWA implementation begins.

---

# 3. Prototype quality bar

The prototype should look materially better than a standard application dashboard.

It should feel:

- cruise-specific
    
- premium
    
- polished
    
- oceanic
    
- elegant
    
- interactive
    
- practical
    
- family-aware
    
- visually distinctive from Properly Packed
    
- closer in richness to Adventure Almanac
    

The prototype should be good enough to validate the design ambition with a single glance.

A successful first impression should be:

**“This feels like a bespoke cruise companion, not an admin app.”**

---

# 4. Prototype scope

## 4.1 Included

The prototype should include the following sections:

1. App shell and navigation
    
2. Cinematic dashboard hero
    
3. Voyage status cards
    
4. Itinerary route timeline
    
5. Today ashore preview
    
6. Port guide preview
    
7. Ship guide preview
    
8. Shore plan comparison
    
9. Seb discovery section
    
10. Memory and Adventure Almanac preview
    
11. Enrichment readiness preview
    
12. Responsive mobile presentation
    

## 4.2 Excluded

The prototype should not attempt to include:

- real data persistence
    
- Dexie or IndexedDB
    
- login
    
- user accounts
    
- live weather APIs
    
- real map libraries
    
- cruise line integrations
    
- document storage
    
- full import/export implementation
    
- full editing flows
    
- full data validation
    
- live scraping
    
- backend services
    

The prototype is a visual and experiential concept, not the working product.

---

# 5. Sample sailing

The prototype should use one realistic sample sailing.

Recommended sample:

**Sun Princess Mediterranean 2026**  
**Rome to Barcelona**  
**August 2026**

This sailing is well suited because it has a strong Mediterranean route, several different port types, sea days, iconic destinations and enough complexity to prove the model.

## 5.1 Sample route

Use the following representative route structure:

1. Civitavecchia / Rome
    
2. Naples
    
3. Sea Day
    
4. Souda Bay / Chania
    
5. Sea Day
    
6. Kusadasi / Ephesus
    
7. Mykonos
    
8. Athens / Piraeus
    
9. Santorini
    
10. Sea Day
    
11. Bar, Montenegro
    
12. Corfu
    
13. Messina
    
14. Sea Day
    
15. Barcelona
    

## 5.2 Data caveat

The prototype should display a small, elegant data caveat:

```text
Prototype data is illustrative. Final sailing details should be confirmed against booking and cruise line sources before travel.
```

This should not dominate the UI, but it should be present.

---

# 6. Visual theme

## 6.1 Theme name

Recommended theme name:

**Ocean Luxe**

## 6.2 Visual mood

The visual mood should combine:

- deep ocean atmosphere
    
- cruise ship elegance
    
- sunlit Mediterranean warmth
    
- nautical chart detail
    
- premium guidebook styling
    
- family travel personality
    

## 6.3 Colour palette

Use a custom CSS variable palette.

Suggested variables:

```css
:root {
  --navy-950: #061827;
  --navy-900: #082235;
  --navy-800: #0c3048;
  --ocean-700: #0e5a66;
  --teal-500: #1ca6a8;
  --aqua-300: #8ee4e1;
  --ivory-100: #fff8ec;
  --sand-200: #ead7b8;
  --gold-400: #d8b56d;
  --coral-400: #f07c61;
  --mist-200: #d8e7ea;
  --ink-900: #13212b;
}
```

The exact palette can be adjusted, but the design should retain the balance of ocean depth, warm guidebook surfaces and restrained premium accents.

## 6.4 Background treatment

The body background should use layered visual treatments:

- deep ocean gradient
    
- subtle radial horizon glow
    
- faint nautical chart line pattern
    
- soft wave or route curve accents
    

The prototype should avoid plain flat backgrounds.

---

# 7. Typography

The prototype should use system-safe font stacks to remain standalone.

Recommended approach:

## 7.1 Display headings

Use:

```css
font-family: Georgia, 'Times New Roman', serif;
```

Purpose:

- product name
    
- sailing title
    
- port names
    
- section hero headings
    

## 7.2 Interface and body text

Use:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Purpose:

- navigation
    
- cards
    
- labels
    
- buttons
    
- metrics
    
- body copy
    

## 7.3 Typography rules

- Large headings should feel editorial and premium.
    
- Operational data should be highly legible.
    
- Time values should be prominent.
    
- Body copy should remain concise.
    
- Avoid overly small labels on mobile.
    

---

# 8. App shell

## 8.1 Desktop shell

Desktop layout should include:

- top brand bar
    
- compact navigation pills
    
- large hero dashboard
    
- multi-column content grid
    

The desktop shell should feel cinematic and spacious.

## 8.2 Tablet shell

Tablet layout should include:

- top brand bar
    
- scrollable navigation row
    
- two-column content where appropriate
    
- card stacks for detail sections
    

## 8.3 Mobile shell

Mobile layout should include:

- compact top bar
    
- horizontal section navigation or bottom nav
    
- single-column content
    
- sticky Today action if useful
    
- reduced decorative detail
    
- no overlapping cards
    
- no cramped text
    

## 8.4 Navigation labels

Suggested nav labels:

- Dashboard
    
- Itinerary
    
- Today
    
- Ports
    
- Ship
    
- Plans
    
- Family
    
- Memories
    
- Enrichment
    

The prototype does not need full navigation behaviour. Anchor links are enough.

---

# 9. Page structure

The prototype should be a single-page experience with anchored sections.

Recommended order:

1. Header and navigation
    
2. Dashboard hero
    
3. Voyage intelligence cards
    
4. Itinerary route timeline
    
5. Today ashore
    
6. Port guide
    
7. Ship guide
    
8. Shore plans
    
9. Seb discovery
    
10. Memories
    
11. Enrichment readiness
    
12. Footer
    

This order should tell the product story clearly.

---

# 10. Header specification

## 10.1 Purpose

The header should establish product identity and provide quick navigation.

## 10.2 Required content

- Complete Cruising wordmark
    
- short tagline
    
- active sailing indicator
    
- navigation links
    

## 10.3 Suggested copy

```text
Complete Cruising
Your sailing, fully understood.

Active sailing: Sun Princess Mediterranean 2026
```

## 10.4 Visual treatment

- translucent navy glass panel
    
- subtle border
    
- compass or route-dot motif
    
- sticky or near-sticky behaviour on desktop if simple
    
- mobile-friendly wrapping
    

## 10.5 Acceptance criteria

The header should not obscure content or become crowded on small screens.

---

# 11. Dashboard hero specification

## 11.1 Purpose

The dashboard hero should create the premium first impression.

It should immediately communicate:

- the sailing
    
- the ship
    
- the route
    
- the countdown
    
- the cruise mood
    
- the app’s usefulness
    

## 11.2 Required content

- Sailing name
    
- Ship name
    
- Cruise line
    
- Route
    
- Dates
    
- Countdown
    
- Number of nights
    
- Number of ports
    
- Number of sea days
    
- Primary action buttons
    

## 11.3 Suggested hero copy

```text
Sun Princess Mediterranean 2026
Rome to Barcelona
14 nights | 9 ports | 4 sea days

58 days to embarkation
A personalised guide to every port, plan and possibility.
```

## 11.4 Primary actions

- View today
    
- Explore itinerary
    
- Open ship guide
    

## 11.5 Visual treatment

- large ocean gradient card
    
- abstract route line
    
- glowing port dots
    
- subtle ship silhouette
    
- champagne accent border
    
- horizon glow
    
- glass metric cards
    

## 11.6 Hero metric cards

Include:

- Days to embarkation
    
- Ports enriched
    
- Ship guide status
    
- Documents readiness
    

Example:

```text
58
days to embarkation
```

```text
6 / 10
port guides started
```

```text
Ship guide
identity enriched
```

```text
Documents
82% ready
```

## 11.7 Acceptance criteria

The hero should be the most visually striking part of the prototype.

It should not feel like a plain dashboard banner.

---

# 12. Voyage intelligence cards

## 12.1 Purpose

These cards should summarise the operational readiness of the sailing.

## 12.2 Required cards

1. Next port to review
    
2. Weather refresh window
    
3. Documents readiness
    
4. Enrichment confidence
    
5. Family focus
    
6. Memory capture readiness
    

## 12.3 Example content

### Next port to review

```text
Next port to review
Naples, Italy
Cruise logistics complete. Shore plan needs family review.
```

### Weather refresh window

```text
Weather refresh
Forecasts pending
Initial forecasts become useful inside the 16-day window.
```

### Documents readiness

```text
Documents
82% ready
Passports, insurance and cruise documents tracked. Luggage tags pending.
```

### Family focus

```text
Family focus
Seb discovery enabled
Flags, phrases, geography facts and port questions are active for each port day.
```

## 12.4 Visual treatment

- card grid
    
- glass or ivory card surfaces
    
- icon and status chip
    
- concise body text
    
- no dense paragraphs
    

---

# 13. Itinerary route timeline specification

## 13.1 Purpose

The itinerary should show the sailing as a voyage rather than a list.

## 13.2 Required content

Each day card should include:

- day number
    
- date label or relative label
    
- day type
    
- port name or sea day
    
- arrival time
    
- departure time
    
- all-aboard time where useful
    
- plan status
    
- enrichment status
    
- weather status
    

## 13.3 Day type examples

- Embarkation
    
- Port day
    
- Sea day
    
- Disembarkation
    

## 13.4 Sample cards

### Embarkation

```text
Day 1
Civitavecchia / Rome
Embarkation
Boarding day | Ship orientation | First family photo
```

### Port day

```text
Day 2
Naples, Italy
Arrive 07:00 | Depart 18:30 | All aboard 17:30
Plan: Historic centre and pizza
```

### Sea day

```text
Day 3
At sea
Pool strategy | Ship exploration | Evening show shortlist
```

### Disembarkation

```text
Day 15
Barcelona, Spain
Disembarkation
Memory export and onward travel notes
```

## 13.5 Visual treatment

- horizontal scroll route on desktop if feasible
    
- vertical route timeline on mobile
    
- route line connecting cards
    
- port dots
    
- sea days shown with wave treatment
    
- selected or active day highlighted
    
- confidence chips visible but small
    

## 13.6 Acceptance criteria

The itinerary should feel like a route through the Mediterranean, not a table.

---

# 14. Today ashore specification

## 14.1 Purpose

The Today section proves the operational value of Complete Cruising.

It should show how the app would be used onboard or shortly before going ashore.

## 14.2 Required content

- current day
    
- port
    
- arrival time
    
- all-aboard time
    
- departure time
    
- weather
    
- selected plan
    
- backup plan
    
- take ashore checklist
    
- return buffer advice
    
- local currency
    
- local language
    
- Seb discovery preview
    
- confidence notes
    

## 14.3 Suggested sample

Use Naples as the Today example.

```text
Today ashore
Naples, Italy

Arrive 07:00
All aboard 17:30
Depart 18:30

Likely plan:
Historic centre, harbour walk and proper Neapolitan pizza.

Plan B:
Shorter seafront walk and café stop if heat or tiredness becomes an issue.
```

## 14.4 Weather tile

Example:

```text
Warm and dry
29°C high
Rain 10%
Plan impact: shade and water important
```

## 14.5 Take ashore checklist

Include:

- cruise cards
    
- phone
    
- portable charger
    
- water
    
- sun cream
    
- hats
    
- comfortable shoes
    
- card or euros
    
- any required ID
    

## 14.6 Return buffer card

The all-aboard time should be highly visible.

Example:

```text
Back on board by 17:30
Suggested latest safe return to port area: 16:45
Risk level: medium
```

## 14.7 Visual treatment

- strong operational hierarchy
    
- large all-aboard display
    
- dark ocean card background
    
- coral or amber accent for return buffer
    
- teal accent for selected plan
    
- compact checklist chips
    
- Seb card nested or adjacent
    

## 14.8 Acceptance criteria

A user should be able to understand the day within five seconds.

---

# 15. Port guide preview specification

## 15.1 Purpose

The Port Guide section should prove the living guidebook concept.

## 15.2 Recommended sample port

Use **Naples, Italy** for the detailed port guide preview.

It has strong cruise relevance, clear family trade-offs, iconic attractions and practical return-buffer considerations.

## 15.3 Required content

- port postcard header
    
- flag
    
- country
    
- language
    
- currency
    
- port type
    
- one-line identity
    
- cruise logistics
    
- top highlights
    
- family lens
    
- food and culture
    
- photography prompt
    
- hints and watchouts
    
- confidence status
    

## 15.4 Port header sample

```text
Naples, Italy
Gateway to Vesuvius, Pompeii and proper Neapolitan pizza.

Language: Italian
Currency: Euro
Port type: city port
Family pace: moderate
```

## 15.5 Cruise logistics sample

```text
Cruise logistics
Naples is one of the stronger independent exploration ports because the city centre is close to the cruise area. Longer trips to Pompeii, Herculaneum or the Amalfi Coast require stronger time discipline.
```

## 15.6 Top highlights

Include a visually compact top highlights grid.

Suggested sample highlights:

1. Pompeii
    
2. Herculaneum
    
3. Naples historic centre
    
4. Castel dell’Ovo
    
5. Naples seafront
    
6. Mount Vesuvius views
    
7. Galleria Umberto I
    
8. Sansevero Chapel Museum
    
9. Neapolitan pizza stop
    
10. Ferry or harbour views
    

## 15.7 Family lens sample

```text
Best family balance:
Stay central, keep walking manageable, build in shade, and make pizza part of the experience.

Seb angle:
Vesuvius, Pompeii and Roman history are likely to land well if framed as a real-world geography and history challenge.
```

## 15.8 Photography prompt

```text
Capture Seb with the harbour behind him and Vesuvius visible if the sky is clear.
```

## 15.9 Visual treatment

- warm postcard-style panel
    
- map texture
    
- flag and chips
    
- guidebook cards
    
- attraction tags
    
- family lens highlighted
    
- photo prompt as a framed card
    

## 15.10 Acceptance criteria

The port guide should feel like a curated destination guide, not copied text.

---

# 16. Ship guide preview specification

## 16.1 Purpose

The Ship Guide section should prove the Berlitz-style cruise ship intelligence concept.

## 16.2 Recommended sample ship

Use **Sun Princess**.

## 16.3 Required content

- ship hero card
    
- ship at a glance
    
- identity and character
    
- layout and orientation
    
- dining preview
    
- family suitability
    
- pools and recreation
    
- tips and watchouts
    
- confidence status
    

## 16.4 Ship hero sample

```text
Sun Princess
Princess Cruises

A modern Princess ship designed around brighter public spaces, varied dining and a more contemporary resort-style onboard experience.
```

## 16.5 Ship guide cards

Suggested cards:

### Ship identity

```text
Ship identity
Large, modern, resort-style ship with a strong focus on open public spaces and varied dining.
```

### Dining

```text
Dining
Guide status: partial
Next enrichment: included dining versus speciality dining.
```

### Family fit

```text
Family fit
Likely strong for sea day variety, pools, casual dining and ship exploration.
```

### Watchouts

```text
Watchouts
Popular venues, dining times and sea day pool areas may need early planning.
```

## 16.6 Visual treatment

- dark navy glass cards
    
- deck-line motif
    
- gold section headings
    
- ship silhouette or abstract outline
    
- structured guide sections
    
- premium, restrained styling
    

## 16.7 Acceptance criteria

The ship section should feel like a personalised cruise ship handbook, not a brochure copy block.

---

# 17. Shore plan comparison specification

## 17.1 Purpose

The Shore Plans section should show how the app helps choose realistic port-day options.

## 17.2 Sample port

Use Naples.

## 17.3 Required plans

Show at least three plan cards:

1. Low-effort city plan
    
2. Family-balanced history and food plan
    
3. Ambitious Pompeii or Vesuvius plan
    

## 17.4 Plan card fields

Each plan should show:

- plan name
    
- type
    
- summary
    
- estimated duration
    
- transport
    
- family fit
    
- Seb fit
    
- weather dependency
    
- return risk
    
- status
    

## 17.5 Sample plan cards

### Plan A: Naples easy win

```text
Low-effort city plan
Historic centre, harbour walk and pizza stop.
Duration: 3 to 4 hours
Transport: walk / short taxi
Family fit: excellent
Return risk: low
```

### Plan B: Family-balanced history

```text
History and harbour plan
A short historic centre route with Vesuvius context and a flexible food stop.
Duration: 4 to 5 hours
Transport: mixed
Family fit: good
Return risk: medium
```

### Plan C: Pompeii ambition

```text
Pompeii focus
High-value historic visit, but hotter, longer and more time-sensitive.
Duration: 5 to 6 hours
Transport: organised or carefully planned
Family fit: mixed
Return risk: high
```

## 17.6 Visual treatment

- comparison card grid
    
- badges for risk and family fit
    
- selected plan highlighted
    
- return buffer strip
    
- weather dependency chip
    
- concise recommendation line
    

## 17.7 Acceptance criteria

The section should make decision support immediately obvious.

---

# 18. Seb discovery specification

## 18.1 Purpose

The Seb Discovery section should demonstrate how Complete Cruising makes the cruise educational and personal.

## 18.2 Required content

- flag
    
- local phrase
    
- geography fact
    
- thing to spot
    
- quiz question
    
- quiz answer
    
- memory prompt
    

## 18.3 Sample card

```text
Seb’s Discovery
🇮🇹 Italy

Phrase:
Ciao means hello.

Thing to spot:
Can you see Mount Vesuvius from the ship or harbour?

Question:
Which famous Roman town was buried when Vesuvius erupted?

Answer:
Pompeii.
```

## 18.4 Visual treatment

- premium but warmer card
    
- passport stamp motif
    
- flag tile
    
- quiz reveal interaction if simple JavaScript is used
    
- no childish cartoon styling
    

## 18.5 Acceptance criteria

The section should feel personalised and enjoyable while remaining visually consistent with the premium app.

---

# 19. Memories and Adventure Almanac preview specification

## 19.1 Purpose

This section should show the post-cruise value of Complete Cruising.

## 19.2 Required content

- memory card
    
- daily reflection preview
    
- Seb favourite
    
- best photo prompt
    
- would return indicator
    
- Adventure Almanac export readiness
    

## 19.3 Sample content

```text
Memory capture
Naples, Italy

Prompt:
What made today feel different from an ordinary city visit?

Seb favourite:
Spotting Vesuvius and learning why Pompeii matters.

Best photo:
Family harbour photo with the volcano in the distance.

Adventure Almanac:
Ready to export once the day is marked complete.
```

## 19.4 Visual treatment

- sunset warmth
    
- soft paper card
    
- port stamp motif
    
- photo placeholder frame
    
- export readiness badge
    

## 19.5 Acceptance criteria

The memories section should feel warm and rewarding, not administrative.

---

# 20. Enrichment readiness preview specification

## 20.1 Purpose

This section should show how targeted enrichment powers the app.

## 20.2 Required content

- ship enrichment status
    
- port enrichment status
    
- day guide status
    
- weather refresh status
    
- confidence legend
    
- suggested next enrichment action
    

## 20.3 Sample enrichment cards

### Ship enrichment

```text
Ship guide
3 of 8 packs started
Next: Dining and family facilities
```

### Port enrichment

```text
Naples port guide
7 of 10 packs started
Needs refresh: transport and opening hours
```

### Day guide

```text
Today ashore guide
Generated from itinerary, port logistics, family lens and weather expectation.
Review status: needs user review
```

## 20.4 Confidence legend

Show chips for:

- Confirmed
    
- High
    
- Medium
    
- Inferred
    
- Needs refresh
    

## 20.5 Visual treatment

- polished technical panel
    
- chart-line background
    
- progress bars
    
- confidence chips
    
- validation-style summary cards
    

## 20.6 Acceptance criteria

The user should understand that the app is powered by structured, reviewable enrichment, not loose notes.

---

# 21. Footer specification

## 21.1 Required content

- Complete Cruising name
    
- Lawrence Family Series reference
    
- prototype version
    
- caveat that data is illustrative
    

## 21.2 Suggested copy

```text
Complete Cruising v0.1 prototype
Part of the Lawrence Family Series.
Prototype data is illustrative and should be verified before travel.
```

## 21.3 Visual treatment

- understated
    
- ocean gradient continuation
    
- small text
    
- no clutter
    

---

# 22. Interactions

The prototype should include light interactions only where they improve the experience.

## 22.1 Recommended interactions

- anchor navigation
    
- active nav state on click if simple
    
- expand/collapse detail sections
    
- quiz answer reveal
    
- selected shore plan highlight
    
- basic “mark as reviewed” visual toggle if simple
    
- scroll-to-section behaviour
    

## 22.2 Avoid

- complex state management
    
- local storage
    
- drag and drop
    
- external libraries
    
- modal-heavy behaviour
    
- fake login
    
- complex import parsing
    
- live API calls
    

The prototype should remain easy to inspect and modify.

---

# 23. Responsive behaviour

## 23.1 Desktop, 1200px and above

Layout should use:

- wide hero
    
- multi-column card grids
    
- itinerary as horizontal or hybrid route
    
- dashboard cards in three or four columns
    
- Today section as two-column operational panel
    
- port and ship sections in two or three columns
    

## 23.2 Tablet, 768px to 1199px

Layout should use:

- two-column sections
    
- horizontal scroll where helpful
    
- reduced hero complexity
    
- stacked Today cards
    
- readable itinerary cards
    

## 23.3 Mobile, below 768px

Layout should use:

- single column
    
- simplified hero
    
- nav wrapping or horizontal scroll
    
- no overlapping cards
    
- itinerary as vertical timeline
    
- large all-aboard time
    
- collapsed long guide content
    
- hidden decorative background elements where necessary
    
- strong spacing between cards
    

## 23.4 Small mobile, below 420px

Layout must:

- avoid tiny text
    
- avoid multi-column chips that break badly
    
- use full-width buttons
    
- reduce long labels
    
- stack metrics vertically
    
- hide less important decorative motifs
    
- preserve Today readability
    

---

# 24. Accessibility requirements

The prototype should make reasonable accessibility provisions.

## 24.1 Contrast

Text over dark backgrounds must have strong contrast.

Cards over complex backgrounds should use overlays or solid surfaces.

## 24.2 Colour independence

Status should use text labels as well as colours.

## 24.3 Focus states

Buttons and links should have visible focus styles.

## 24.4 Touch targets

Clickable elements should be comfortably sized.

## 24.5 Motion

Any animation should be subtle. Avoid constant motion.

## 24.6 Semantic structure

Use appropriate headings, sections, buttons and labels.

---

# 25. CSS architecture

The standalone HTML should use clear CSS sections.

Recommended CSS organisation:

```text
1. CSS variables
2. Base reset
3. Typography
4. Backgrounds and visual effects
5. App shell
6. Navigation
7. Hero
8. Card system
9. Status chips
10. Section layouts
11. Timeline
12. Today view
13. Port guide
14. Ship guide
15. Plans
16. Seb discovery
17. Memories
18. Enrichment
19. Responsive rules
20. Accessibility and focus states
```

The CSS should be readable and maintainable.

---

# 26. JavaScript scope

JavaScript should be minimal.

Recommended JavaScript:

- smooth section navigation, if not using CSS-only behaviour
    
- quiz answer reveal
    
- shore plan selection toggle
    
- optional active nav state
    
- optional expand/collapse sections
    

Avoid any JavaScript that makes the prototype fragile.

---

# 27. Component list for the HTML prototype

The HTML should implement visual equivalents of these future components:

## App components

- AppHeader
    
- NavigationPills
    
- SectionHeader
    
- HeroPanel
    
- MetricCard
    
- StatusChip
    
- ConfidenceChip
    

## Cruise components

- SailingHero
    
- VoyageStatusGrid
    
- ItineraryTimeline
    
- ItineraryDayCard
    
- TodayAshorePanel
    
- AllAboardCard
    
- WeatherTile
    
- PortPostcard
    
- PortFactChips
    
- AttractionHighlightCard
    
- ShipGuideCard
    
- ShorePlanCard
    
- SebDiscoveryCard
    
- MemoryCard
    
- EnrichmentStatusCard
    

## Utility components

- ActionButton
    
- TagList
    
- ProgressBar
    
- WarningNote
    
- DataCaveat
    
- Footer
    

---

# 28. Content strategy

The prototype should use concise, polished copy.

## 28.1 Copy rules

Use:

- short labels
    
- guidebook-like summaries
    
- operational clarity
    
- family-specific details
    
- cruise-specific language
    

Avoid:

- long generic travel paragraphs
    
- filler
    
- excessive caveats
    
- marketing clichés
    
- plain database labels
    
- American spellings
    

## 28.2 Preferred phrases

- Today ashore
    
- Back on board
    
- Port guide
    
- Ship guide
    
- Family lens
    
- Seb’s discovery
    
- Weather impact
    
- Return buffer
    
- Guide status
    
- Needs refresh
    
- Ready for Adventure Almanac
    

---

# 29. Data status examples

The prototype should demonstrate data trust states.

Use confidence chips such as:

```text
Confirmed
High confidence
Medium confidence
Needs review
Needs refresh
Illustrative
```

Do not overuse them. They should add trust, not clutter.

---

# 30. Visual effects

## 30.1 Recommended effects

- soft shadows
    
- glassmorphism panels
    
- ocean gradient
    
- subtle wave curves
    
- route lines
    
- glowing port dots
    
- card hover lift
    
- gold highlight edges
    
- gentle reveal transitions
    

## 30.2 Avoid

- heavy animation
    
- spinning icons
    
- noisy backgrounds
    
- harsh neon
    
- excessive blur
    
- unreadable overlays
    
- decorative clutter on mobile
    

---

# 31. Prototype data object

Although persistence is not required, the HTML can include a small JavaScript data object for clarity.

Suggested object:

```javascript
const prototypeSailing = {
  name: "Sun Princess Mediterranean 2026",
  ship: "Sun Princess",
  cruiseLine: "Princess Cruises",
  route: "Rome to Barcelona",
  nights: 14,
  ports: 9,
  seaDays: 4,
  countdownDays: 58,
  itinerary: [
    { day: 1, type: "embarkation", port: "Civitavecchia / Rome" },
    { day: 2, type: "port", port: "Naples", arrive: "07:00", depart: "18:30", allAboard: "17:30" },
    { day: 3, type: "sea", port: "At sea" }
  ]
};
```

This is optional. Static HTML is acceptable if easier.

---

# 32. Prototype acceptance criteria

The standalone HTML prototype should be accepted if it meets the following criteria.

## 32.1 Visual criteria

- It immediately feels cruise-specific.
    
- It looks premium and polished.
    
- It uses ocean, port and voyage motifs.
    
- It is visually richer than a standard utility app.
    
- It avoids clutter and gimmickry.
    
- It has strong hierarchy and spacing.
    

## 32.2 Functional concept criteria

- It shows the sailing.
    
- It shows the route.
    
- It shows itinerary days.
    
- It shows Today ashore.
    
- It shows port guide content.
    
- It shows ship guide content.
    
- It shows shore plan comparison.
    
- It shows Seb discovery.
    
- It shows memory capture.
    
- It shows enrichment readiness.
    

## 32.3 Responsive criteria

- It works well at desktop width.
    
- It works well at tablet width.
    
- It works well on mobile.
    
- It avoids overlapping text.
    
- It avoids poor wrapping on small screens.
    
- It hides or simplifies decorative elements where needed.
    

## 32.4 Trust criteria

- It labels prototype data as illustrative.
    
- It demonstrates confidence chips.
    
- It shows refresh status.
    
- It avoids pretending sample data is final.
    

---

# 33. Known design risks

## Risk 1: Prototype becomes too plain

Mitigation:

Prioritise the cinematic hero, route visuals, postcard cards and ocean visual identity from the first build.

## Risk 2: Prototype becomes too decorative

Mitigation:

Keep Today and timing information operationally clear.

## Risk 3: Mobile layout becomes cramped

Mitigation:

Use single-column mobile design, hide decorative details and enlarge critical time fields.

## Risk 4: Too much sample content dilutes the experience

Mitigation:

Use representative depth, not exhaustive content.

## Risk 5: Prototype appears to depend on real APIs

Mitigation:

Use static sample weather and mark it as illustrative.

---

# 34. Implementation guidance

The first HTML build should prioritise:

1. Strong visual identity
    
2. Responsive layout
    
3. Cruise-specific component system
    
4. Representative sample content
    
5. Clear section hierarchy
    
6. Minimal but polished interactions
    
7. Maintainable code
    

The prototype should not attempt to solve full application architecture.

---

# 35. Recommended build prompt after this artefact

The next practical step should be to build:

**Complete Cruising Standalone HTML Prototype v0.1**

The build prompt should instruct the implementation to:

- produce a single standalone HTML file
    
- use no external dependencies
    
- implement the Ocean Luxe visual identity
    
- use the Sun Princess Mediterranean sample sailing
    
- include all required sections in this specification
    
- make the result responsive and visually polished
    
- avoid API calls
    
- mark data as illustrative
    
- include light interactions only where useful
    

---

# 36. v0.1 conclusion

The Complete Cruising HTML prototype should prove the product’s ambition.

It should show that the application can be much more than a cruise itinerary tracker. It should feel like a premium, personalised cruise companion that brings together route, ship, ports, plans, weather, family guidance and memories.

The prototype should make the sailing feel alive.

It should be beautiful enough to create anticipation, clear enough to be useful onboard, and structured enough to prove that the wider enrichment-led product can work.

**Complete Cruising v0.1 should open like a luxury guidebook, behave like a cruise command centre, and feel like it belongs to the Lawrence family.**