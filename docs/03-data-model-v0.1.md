# Complete Cruising

## Data Model v0.1

### Product context

**Complete Cruising** is a Lawrence Family Series application designed to act as a personalised, visually rich cruise companion.

The product will hold cruise-specific intelligence for upcoming, active and completed sailings. It will combine itinerary planning, ship intelligence, port guidebook content, shore planning, daily onboard guidance, enrichment imports, weather refreshes and family memory capture.

This document defines the first-pass conceptual data model.

---

## 1. Purpose of this data model

The purpose of this data model is to define what Complete Cruising needs to store, how the main entities relate to each other, and how enriched content can be imported, reviewed, refreshed and reused.

The model must support:

1. Cruise sailings as primary records.
    
2. Ships as reusable guidebook objects.
    
3. Ports as reusable guidebook objects.
    
4. Itinerary days as the sailing-specific spine.
    
5. Attractions and shore plans as structured decision support.
    
6. Weather and refreshable intelligence.
    
7. Confidence and review metadata.
    
8. Family-specific notes and Seb-focused discovery content.
    
9. Memories and completed-trip records.
    
10. Export to Adventure Almanac.
    
11. Future integration with Properly Packed and Officially Organised.
    

The model should support a beautiful user experience, but it must not be shaped only around screens. It should preserve structured intelligence that can be reused, enriched and trusted.

---

## 2. Data model principles

### 2.1 Sailing-specific and reusable data must be separated

A port such as Barcelona may appear across multiple cruises. The core port record should be reusable.

A specific visit to Barcelona on a specific sailing is represented by an itinerary day.

This distinction matters because port guidance may be reused, while port times, weather, plans and memories are sailing-specific.

### 2.2 Confirmed data must be protected

Confirmed booking data, itinerary dates, port times, cabin details and traveller details should not be overwritten casually by enrichment imports.

Enrichment may suggest corrections, but the app should warn before replacing confirmed data.

### 2.3 Enrichment must be modular

Ship, port, attraction and day guide enrichment should be stored as structured sections rather than large blended text fields.

Each enrichment section should have its own:

- confidence level
    
- review status
    
- source type
    
- refresh status
    
- last reviewed date
    

### 2.4 The model should support rich visual presentation

The data model should allow the interface to create:

- sailing hero cards
    
- port postcard cards
    
- ship guide sections
    
- day-by-day itinerary ribbons
    
- weather tiles
    
- Seb discovery cards
    
- shore plan comparison cards
    
- return buffer warnings
    
- memory cards
    
- Adventure Almanac export summaries
    

### 2.5 The model should support offline-first use

Cruise holidays may involve poor signal, expensive Wi-Fi or unreliable roaming.

The model should work well in a local-first PWA where core cruise data is available offline once loaded.

### 2.6 Every time-sensitive field should be refreshable

Weather, terminal details, tender status, shuttle details, opening hours, local disruption and operational notes should have refresh metadata.

---

## 3. High-level entity map

```text
CompleteCruisingApp
  -> Sailings
       -> CruiseLine
       -> Ship
       -> Cabin
       -> Travellers
       -> ItineraryDays
            -> Port
            -> WeatherSnapshot
            -> ShorePlans
            -> DayGuide
            -> MemoryEntries
       -> DocumentChecklist
       -> FamilyNotes
       -> EnrichmentRuns
       -> AdventureAlmanacExport
  -> ReusableGuidebook
       -> CruiseLines
       -> Ships
       -> Ports
       -> Countries
       -> Attractions
       -> SourceReferences
  -> ImportExport
       -> ImportBatch
       -> ExportBatch
       -> ValidationWarnings
```

---

## 4. Core relationship summary

|Relationship|Meaning|
|---|---|
|CruiseLine has many Ships|A cruise line operates multiple ships|
|Ship belongs to CruiseLine|A ship has a primary operating cruise line|
|Sailing uses one Ship|A specific cruise booking takes place on a ship|
|Sailing has many ItineraryDays|The itinerary is the spine of the cruise|
|ItineraryDay may reference one Port|Port days reference reusable port records|
|Port has many Attractions|Attractions are linked to ports|
|ItineraryDay has many ShorePlans|A port day may have several possible plans|
|ItineraryDay may have one selected ShorePlan|The chosen family plan for that day|
|ItineraryDay may have WeatherSnapshots|Weather may be refreshed multiple times|
|Sailing has many DocumentItems|Documents and admin readiness are tracked|
|Sailing has many MemoryEntries|Memories may be captured during or after travel|
|EnrichmentSection can attach to many entity types|Ship, Port, Attraction, Sailing or ItineraryDay|
|SourceReference can support EnrichmentSections|Sources should be traceable|
|AdventureAlmanacExport belongs to Sailing|Completed cruise data can be exported|

---

## 5. Shared metadata objects

Several metadata structures should be reused across the model.

### 5.1 AuditMetadata

Used on most records.

|Field|Type|Notes|
|---|---|---|
|createdAt|datetime|Local creation timestamp|
|updatedAt|datetime|Last local update timestamp|
|createdBy|string|Usually user, import, enrichment or system|
|updatedBy|string|Usually user, import, enrichment or system|
|archivedAt|datetime, optional|Used if records are soft-archived|

### 5.2 ConfidenceMetadata

Used on enriched or externally sourced records.

|Field|Type|Notes|
|---|---|---|
|confidence|enum|confirmed, high, medium, low, inferred, unknown|
|reviewStatus|enum|not_reviewed, needs_user_review, reviewed, verified, needs_refresh, stale, rejected|
|sourceType|enum|booking_confirmed, cruise_line_confirmed, official_port_source, official_tourism_source, official_attraction_source, official_transport_source, reputable_travel_source, family_note, user_entered, researched, inferred|
|sourceSummary|string, optional|Short human-readable note|
|lastReviewedAt|datetime, optional|Last manual review date|
|refreshRecommended|boolean|Whether this data should be refreshed|
|refreshReason|string, optional|Why refresh is recommended|
|validFrom|date, optional|Useful for seasonal or time-sensitive data|
|validUntil|date, optional|Useful for forecasts or temporary guidance|

### 5.3 VisualMetadata

Used where the app needs rich presentation.

|Field|Type|Notes|
|---|---|---|
|heroImageUrl|string, optional|Future image support|
|thumbnailUrl|string, optional|Future image support|
|icon|string, optional|UI icon key|
|colourTheme|string, optional|Suggested visual theme|
|displayOrder|number, optional|Manual order control|
|featured|boolean|Whether to highlight on dashboard or guide pages|

### 5.4 GeoMetadata

Used for ports, attractions and route planning.

|Field|Type|Notes|
|---|---|---|
|latitude|number, optional|Decimal coordinate|
|longitude|number, optional|Decimal coordinate|
|mapLabel|string, optional|Short map label|
|geocodeConfidence|enum|confirmed, high, medium, low, unknown|
|locationNotes|string, optional|Caveats or terminal-specific notes|

---

## 6. Entity: CruiseLine

### Purpose

Represents the cruise operator.

CruiseLine is reusable across multiple ships and sailings.

### Example records

- Princess Cruises
    
- P&O Cruises
    
- Royal Caribbean International
    
- Disney Cruise Line
    
- Celebrity Cruises
    

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|name|string|yes|Cruise line name|
|shortName|string|no|Display abbreviation|
|websiteUrl|string|no|Official website|
|loyaltyProgrammeName|string|no|Future use|
|appName|string|no|Official app name|
|customerServiceNotes|string|no|Family notes|
|overview|string|no|Short guidebook summary|
|audit|AuditMetadata|yes|Shared metadata|
|confidence|ConfidenceMetadata|no|Useful if enriched|

### Notes

CruiseLine should not become too detailed in MVP. Most ship and sailing-specific value will sit elsewhere.

---

## 7. Entity: Ship

### Purpose

Represents a cruise ship as a reusable guidebook object.

A Ship may appear across multiple sailings. The ship profile can be enriched once and reused, with refreshes after refits or major changes.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|cruiseLineId|string|yes|Links to CruiseLine|
|name|string|yes|Ship name|
|shipClass|string|no|Ship class|
|yearBuilt|number|no|Year built|
|yearLaunched|number|no|If different from year built|
|yearRefitted|number|no|Latest major refit if known|
|grossTonnage|number|no|Enriched fact|
|passengerCapacity|number|no|May vary by occupancy basis|
|crewCapacity|number|no|Approximate|
|deckCount|number|no|Public/passenger decks if known|
|cabinCount|number|no|Optional|
|shipOverview|string|no|Curated summary|
|designCharacter|string|no|Style and atmosphere|
|familySuitabilitySummary|string|no|Short family lens|
|watchoutsSummary|string|no|Short caution summary|
|enrichmentSectionIds|string[]|no|Linked enrichment sections|
|visual|VisualMetadata|no|Hero and presentation metadata|
|audit|AuditMetadata|yes|Shared metadata|
|confidence|ConfidenceMetadata|no|Shared metadata|

### Key relationships

|Relationship|Type|
|---|---|
|Ship belongs to CruiseLine|many-to-one|
|Ship has many Sailings|one-to-many|
|Ship has many EnrichmentSections|one-to-many|

### MVP notes

The MVP should store enough ship metadata to support a rich ship hero page and segmented ship guide sections. Detailed deck plans should not be recreated in v0.1.

---

## 8. Entity: Cabin

### Purpose

Represents cabin or stateroom information for a specific sailing.

Cabin belongs to Sailing because cabin number and type are booking-specific.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|sailingId|string|yes|Parent sailing|
|cabinNumber|string|no|May be unknown until assigned|
|cabinType|string|no|Balcony, suite, inside, oceanview, etc.|
|deck|string|no|Deck number or label|
|locationDescriptor|string|no|Forward, midship, aft|
|bedConfiguration|string|no|Optional|
|balcony|boolean|no|Optional|
|connectingCabin|boolean|no|Optional|
|cabinNotes|string|no|Family notes|
|convenienceNotes|string|no|Lift/stair proximity, route notes|
|noiseNotes|string|no|If known or experienced|
|audit|AuditMetadata|yes|Shared metadata|
|confidence|ConfidenceMetadata|no|Useful if enriched|

### Notes

Cabin should be separated from Ship because the same ship can have many different cabin experiences.

---

## 9. Entity: Traveller

### Purpose

Represents a person travelling on a sailing.

Traveller records can be light-touch in Complete Cruising. The app does not need to become a passport database.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|displayName|string|yes|Phil, Rebecca, Seb, etc.|
|travellerType|enum|yes|adult, child, family_member, guest|
|sailingIds|string[]|no|Sailings this traveller is linked to|
|preferences|object|no|Light-touch preferences|
|notes|string|no|Travel notes|
|audit|AuditMetadata|yes|Shared metadata|

### Privacy rule

Sensitive document details such as passport numbers should not be stored in MVP unless explicitly required. A checklist saying “passport packed” is safer than storing passport identity data.

---

## 10. Entity: Sailing

### Purpose

Represents a specific cruise booking.

Sailing is the central object of Complete Cruising.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|name|string|yes|Display name, e.g. Sun Princess Mediterranean 2026|
|cruiseLineId|string|yes|Links to CruiseLine|
|shipId|string|yes|Links to Ship|
|status|enum|yes|draft, planned, upcoming, active, completed, archived|
|bookingReference|string|no|User-entered|
|voyageCode|string|no|Cruise line voyage code if known|
|departureDate|date|yes|First cruise date|
|returnDate|date|yes|Final cruise date|
|embarkationPortId|string|no|Links to Port|
|disembarkationPortId|string|no|Links to Port|
|cabinId|string|no|Links to Cabin|
|travellerIds|string[]|no|Linked travellers|
|packageNotes|string|no|Drinks, Wi-Fi, dining, etc.|
|diningNotes|string|no|Dining arrangements|
|insuranceNotes|string|no|Checklist-style notes|
|transferNotes|string|no|Flights, hotels, taxis, parking|
|planningSummary|string|no|Curated planning overview|
|enrichmentStatus|enum|no|not_started, partial, enriched, needs_refresh, complete|
|activeDayId|string|no|Used while sailing is active|
|visual|VisualMetadata|no|Hero card metadata|
|audit|AuditMetadata|yes|Shared metadata|
|confidence|ConfidenceMetadata|no|Shared metadata|

### Key relationships

|Relationship|Type|
|---|---|
|Sailing belongs to CruiseLine|many-to-one|
|Sailing uses Ship|many-to-one|
|Sailing has one Cabin|one-to-one|
|Sailing has many Travellers|many-to-many|
|Sailing has many ItineraryDays|one-to-many|
|Sailing has many DocumentItems|one-to-many|
|Sailing has many FamilyNotes|one-to-many|
|Sailing has many MemoryEntries|one-to-many|
|Sailing has many EnrichmentRuns|one-to-many|

### Status values

|Value|Meaning|
|---|---|
|draft|Early concept or incomplete sailing|
|planned|Confirmed sailing, not close to departure|
|upcoming|Close enough to need active preparation|
|active|Currently onboard or within cruise dates|
|completed|Cruise finished|
|archived|Hidden from primary views|

---

## 11. Entity: ItineraryDay

### Purpose

Represents one day of a specific sailing.

ItineraryDay is the operational spine of the app.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|sailingId|string|yes|Parent sailing|
|dayNumber|number|yes|Day 1, Day 2, etc.|
|date|date|yes|Calendar date|
|dayType|enum|yes|embarkation, port, sea, disembarkation, scenic_cruising, overnight_port|
|title|string|no|Display title|
|portId|string|no|Required for port days where known|
|arrivalTime|time|no|Local time where relevant|
|departureTime|time|no|Local time where relevant|
|allAboardTime|time|no|Often manually entered|
|isTender|boolean|no|If tendering is known|
|tenderStatus|enum|no|unknown, likely, confirmed, not_applicable|
|timezone|string|no|Local timezone|
|selectedShorePlanId|string|no|Chosen plan|
|backupShorePlanId|string|no|Backup plan|
|weatherSnapshotId|string|no|Current preferred weather snapshot|
|dayGuideId|string|no|Curated day guide|
|familyNotes|string|no|Day-specific notes|
|operationalWarnings|string[]|no|Short warning strings|
|confidence|ConfidenceMetadata|no|Shared metadata|
|audit|AuditMetadata|yes|Shared metadata|

### Key relationships

|Relationship|Type|
|---|---|
|ItineraryDay belongs to Sailing|many-to-one|
|ItineraryDay may reference Port|many-to-one|
|ItineraryDay has many ShorePlans|one-to-many|
|ItineraryDay has many WeatherSnapshots|one-to-many|
|ItineraryDay has one DayGuide|one-to-one|
|ItineraryDay has many MemoryEntries|one-to-many|

### Day type values

|Value|Meaning|
|---|---|
|embarkation|Boarding day|
|port|Standard port call|
|sea|Sea day|
|disembarkation|Final day|
|scenic_cruising|Scenic sailing day without standard port call|
|overnight_port|Ship remains in port overnight|

---

## 12. Entity: Country

### Purpose

Represents reusable country-level information.

Country records help support flags, languages, currencies and educational content.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|name|string|yes|Country name|
|isoCode|string|no|ISO code where known|
|flagEmoji|string|no|UI display|
|primaryLanguage|string|no|Simplified display|
|additionalLanguages|string[]|no|Optional|
|currencyCode|string|no|GBP, EUR, USD, etc.|
|currencyName|string|no|Euro, Pound Sterling, etc.|
|timezoneNotes|string|no|Useful where multiple timezones exist|
|sebFact|string|no|Child-friendly geography fact|
|confidence|ConfidenceMetadata|no|Shared metadata|
|audit|AuditMetadata|yes|Shared metadata|

### Notes

Country records are useful but should not become a full geopolitical database.

---

## 13. Entity: Port

### Purpose

Represents a reusable cruise port guidebook record.

Port contains reusable intelligence, while ItineraryDay contains sailing-specific timing and plans.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|name|string|yes|Port display name|
|localName|string|no|Optional|
|countryId|string|yes|Links to Country|
|region|string|no|Region, island or province|
|portType|enum|no|city, island, resort, industrial, tender, mixed|
|latitude|number|no|Decimal coordinate|
|longitude|number|no|Decimal coordinate|
|timezone|string|no|Local timezone|
|overview|string|no|Short guidebook summary|
|cruiseLogisticsSummary|string|no|Docking, terminal, centre distance|
|gettingAroundSummary|string|no|Walk, taxi, shuttle, transport|
|familySuitabilitySummary|string|no|Family lens|
|foodCultureSummary|string|no|Local flavour|
|photographySummary|string|no|Photo and view guidance|
|hintsTipsSummary|string|no|Practical guidance|
|weatherSeasonalitySummary|string|no|Typical weather|
|returnRiskDefault|enum|no|low, medium, high, unknown|
|enrichmentSectionIds|string[]|no|Linked enrichment sections|
|visual|VisualMetadata|no|Postcard card metadata|
|geo|GeoMetadata|no|Map metadata|
|confidence|ConfidenceMetadata|no|Shared metadata|
|audit|AuditMetadata|yes|Shared metadata|

### Key relationships

|Relationship|Type|
|---|---|
|Port belongs to Country|many-to-one|
|Port has many Attractions|one-to-many|
|Port has many ItineraryDays|one-to-many|
|Port has many EnrichmentSections|one-to-many|

### Port type values

|Value|Meaning|
|---|---|
|city|Port directly associated with a city|
|island|Island port or island tender point|
|resort|Resort-style port call|
|industrial|Industrial or less walkable port|
|tender|Usually tender-based port|
|mixed|Several possible arrival experiences|
|unknown|Not yet established|

---

## 14. Entity: Attraction

### Purpose

Represents a point of interest linked to a port.

Attractions are separated from Port so that the port record does not become bloated.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|portId|string|yes|Parent port|
|name|string|yes|Attraction name|
|type|enum|no|landmark, museum, beach, viewpoint, historic_site, food_market, nature, shopping, family_activity, other|
|shortDescription|string|no|Concise guidebook summary|
|whyItMatters|string|no|Cultural, historic or experiential value|
|distanceFromPortText|string|no|Human-readable distance|
|distanceFromPortKm|number|no|Approximate|
|travelTimeFromPortText|string|no|Human-readable travel time|
|typicalVisitDuration|string|no|e.g. 45 to 90 minutes|
|bookingRequired|enum|no|required, recommended, optional, not_required, unknown|
|costLevel|enum|no|free, low, medium, high, unknown|
|familySuitability|enum|no|excellent, good, mixed, poor, unknown|
|sebInterestScore|number|no|1 to 5|
|parentInterestScore|number|no|1 to 5|
|weatherSensitivity|enum|no|low, medium, high, indoor, unknown|
|accessibilityNotes|string|no|Walking, steps, terrain|
|photoPrompt|string|no|Suggested photo|
|confidence|ConfidenceMetadata|no|Shared metadata|
|geo|GeoMetadata|no|Map metadata|
|visual|VisualMetadata|no|Card metadata|
|audit|AuditMetadata|yes|Shared metadata|

### Attraction type values

|Value|Meaning|
|---|---|
|landmark|Famous landmark|
|museum|Museum or gallery|
|beach|Beach or bathing area|
|viewpoint|Viewpoint or scenic spot|
|historic_site|Historic site|
|food_market|Market or food destination|
|nature|Nature, park or wildlife|
|shopping|Shopping area|
|family_activity|Child-friendly activity|
|transport_experience|Cable car, funicular, scenic train, boat|
|religious_site|Church, cathedral, mosque, temple, etc.|
|other|Other|

---

## 15. Entity: ShorePlan

### Purpose

Represents a possible or confirmed plan for a port day.

A ShorePlan is sailing-specific because the same port may be approached differently depending on timings, weather, family energy, previous visits and booked excursions.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|itineraryDayId|string|yes|Parent itinerary day|
|portId|string|no|Usually same as itinerary day port|
|name|string|yes|Plan title|
|planType|enum|yes|booked_excursion, diy, private_tour, low_effort, backup, onboard_only|
|status|enum|yes|idea, shortlisted, selected, booked, completed, cancelled|
|summary|string|no|Short plan summary|
|startTime|time|no|Suggested or confirmed start|
|endTime|time|no|Suggested or confirmed end|
|latestSafeReturnTime|time|no|Return buffer guidance|
|transportMode|enum|no|walk, taxi, shuttle, public_transport, private_transfer, cruise_excursion, mixed, unknown|
|attractionIds|string[]|no|Linked attractions|
|estimatedTravelTimeText|string|no|Human-readable|
|returnBufferMinutes|number|no|Suggested buffer|
|riskLevel|enum|no|low, medium, high, unknown|
|weatherDependency|enum|no|low, medium, high, unknown|
|familySuitability|enum|no|excellent, good, mixed, poor, unknown|
|sebSuitabilityNotes|string|no|Child lens|
|costNotes|string|no|Approximate or confirmed|
|bookingReference|string|no|If booked|
|whatToTake|string[]|no|Ashore checklist|
|watchouts|string[]|no|Operational warnings|
|confidence|ConfidenceMetadata|no|Shared metadata|
|audit|AuditMetadata|yes|Shared metadata|

### Plan type values

|Value|Meaning|
|---|---|
|booked_excursion|Cruise line or third-party excursion already booked|
|diy|Independent family plan|
|private_tour|Private guide or driver|
|low_effort|Easy local option|
|backup|Weather, tiredness or disruption alternative|
|onboard_only|Stay onboard or partial day onboard|
|ambitious|High-value but time-sensitive plan|

### Plan status values

|Value|Meaning|
|---|---|
|idea|Early suggestion|
|shortlisted|Worth considering|
|selected|Family’s preferred plan|
|booked|Confirmed booking|
|completed|Actually done|
|cancelled|Cancelled|
|rejected|Decided against|

---

## 16. Entity: DayGuide

### Purpose

Represents the curated daily guide used by the family during the cruise.

DayGuide is generated from Sailing, ItineraryDay, Port, Ship, ShorePlan, WeatherSnapshot and family context.

It should be concise enough to use onboard.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|itineraryDayId|string|yes|Parent itinerary day|
|title|string|yes|Display title|
|todayAtAGlance|object|no|Key times, location, weather|
|whatMattersToday|string[]|no|Main opportunities and constraints|
|likelyPlanSummary|string|no|Selected plan summary|
|backupPlanSummary|string|no|Backup guidance|
|takeAshore|string[]|no|Practical checklist|
|sebDiscovery|object|no|Flag, phrase, fact, quiz|
|photoPrompt|string|no|One key photo idea|
|returnBufferAdvice|string|no|Back-to-ship guidance|
|confidenceNotes|string[]|no|What is confirmed or uncertain|
|generatedFrom|string[]|no|Source entity IDs|
|confidence|ConfidenceMetadata|no|Shared metadata|
|audit|AuditMetadata|yes|Shared metadata|

### SebDiscovery object

|Field|Type|Notes|
|---|---|---|
|flag|string|Flag emoji or label|
|localPhrase|string|Short phrase|
|pronunciationHint|string|Optional|
|geographyFact|string|Map or country fact|
|thingToSpot|string|Something to notice ashore|
|quizQuestion|string|Child-friendly question|
|quizAnswer|string|Answer|

---

## 17. Entity: WeatherSnapshot

### Purpose

Represents weather intelligence for a specific itinerary day and location.

Weather should be treated as refreshable intelligence, not permanent fact.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|itineraryDayId|string|yes|Parent itinerary day|
|portId|string|no|Port if relevant|
|snapshotType|enum|yes|climate, forecast, same_day, observed|
|forecastDate|date|yes|Date weather applies to|
|generatedAt|datetime|yes|When snapshot was created|
|sourceName|string|no|e.g. Open-Meteo, Met Office, manual|
|temperatureHighC|number|no|Celsius|
|temperatureLowC|number|no|Celsius|
|conditionSummary|string|no|Human-readable|
|precipitationChance|number|no|Percentage|
|windSpeedKph|number|no|Optional|
|windDirection|string|no|Optional|
|humidity|number|no|Optional|
|uvIndex|number|no|Optional|
|sunrise|time|no|Optional|
|sunset|time|no|Optional|
|seaConditionSummary|string|no|Optional future marine data|
|clothingGuidance|string|no|Practical guidance|
|planImpact|string|no|How weather affects plans|
|confidence|ConfidenceMetadata|no|Shared metadata|
|audit|AuditMetadata|yes|Shared metadata|

### Snapshot type values

|Value|Meaning|
|---|---|
|climate|Seasonal expectation|
|forecast|Forecast before the visit|
|same_day|Same-day check|
|observed|What actually happened|
|manual|User-entered note|

---

## 18. Entity: EnrichmentRun

### Purpose

Represents one enrichment activity.

An EnrichmentRun may import one or more EnrichmentSections.

This is important for traceability, validation and rollback.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|name|string|yes|Human-readable name|
|targetType|enum|yes|sailing, ship, port, attraction, itinerary_day, shore_plan|
|targetId|string|no|Existing target where known|
|targetName|string|no|Useful before record creation|
|enrichmentPackType|string|yes|e.g. port_fact_file|
|status|enum|yes|generated, imported, reviewed, partially_accepted, rejected|
|generatedAt|datetime|no|When enrichment was generated|
|importedAt|datetime|no|When imported into app|
|reviewedAt|datetime|no|When reviewed|
|sourceTypesUsed|string[]|no|Source type summary|
|validationWarnings|string[]|no|Import validation warnings|
|notes|string|no|User or system notes|
|audit|AuditMetadata|yes|Shared metadata|

### Status values

|Value|Meaning|
|---|---|
|generated|Created outside the app but not imported|
|imported|Imported but not fully reviewed|
|reviewed|Reviewed and accepted|
|partially_accepted|Some sections accepted|
|rejected|Not accepted|
|superseded|Replaced by newer enrichment|

---

## 19. Entity: EnrichmentSection

### Purpose

Represents a targeted content section attached to a parent object.

This is the core unit of modular enrichment.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|enrichmentRunId|string|no|Parent enrichment run|
|parentType|enum|yes|sailing, ship, port, attraction, itinerary_day, shore_plan|
|parentId|string|yes|Target object ID|
|sectionType|string|yes|e.g. ship_dining, port_logistics|
|title|string|yes|Display title|
|shortSummary|string|no|Concise overview|
|structuredFacts|object[]|no|Importable facts|
|practicalGuidance|string[]|no|Actionable guidance|
|familyRelevance|string[]|no|Lawrence family lens|
|sebDiscovery|object|no|Optional child-specific content|
|watchouts|string[]|no|Cautions|
|photoPrompts|string[]|no|Optional|
|suggestedNextActions|string[]|no|Planning actions|
|rawContent|string|no|Optional markdown backup|
|confidence|ConfidenceMetadata|yes|Shared metadata|
|visual|VisualMetadata|no|Presentation metadata|
|audit|AuditMetadata|yes|Shared metadata|

### Common section types

#### Ship section types

- ship_identity
    
- ship_layout
    
- ship_dining
    
- ship_cabins
    
- ship_family
    
- ship_entertainment
    
- ship_pools_recreation
    
- ship_tips_watchouts
    

#### Port section types

- port_fact_file
    
- port_cruise_logistics
    
- port_getting_around
    
- port_top_10
    
- port_family_lens
    
- port_food_culture
    
- port_photography
    
- port_hints_watchouts
    
- port_weather_seasonality
    
- port_shore_plans
    

#### Day section types

- day_summary
    
- today_ashore
    
- sea_day_guide
    
- embarkation_guide
    
- disembarkation_guide
    
- seb_discovery
    

---

## 20. Entity: SourceReference

### Purpose

Represents a source used to support enriched content.

MVP may use source summaries rather than detailed citation management, but the model should allow proper source tracking.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|title|string|yes|Source title or label|
|url|string|no|Source URL where available|
|sourceType|enum|yes|Official, reputable, user-entered, etc.|
|publisher|string|no|Organisation or website|
|accessedAt|datetime|no|When checked|
|appliesToType|enum|no|ship, port, attraction, etc.|
|appliesToId|string|no|Linked object|
|notes|string|no|Caveats|
|confidence|enum|no|high, medium, low|
|audit|AuditMetadata|yes|Shared metadata|

### Notes

The app does not need academic-style citations in the interface, but it should preserve enough source context to support trust and refresh decisions.

---

## 21. Entity: DocumentChecklist

### Purpose

Represents readiness groups for cruise documents and admin.

This could be modelled as a checklist container plus checklist items.

### DocumentChecklist fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|sailingId|string|yes|Parent sailing|
|title|string|yes|e.g. Cruise documents|
|completionStatus|enum|yes|not_started, partial, complete|
|items|DocumentItem[]|yes|Child items|
|audit|AuditMetadata|yes|Shared metadata|

### DocumentItem fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|checklistId|string|yes|Parent checklist|
|label|string|yes|e.g. Passports packed|
|category|enum|no|identity, booking, insurance, travel, health, luggage, other|
|status|enum|yes|not_started, needed, ready, packed, not_applicable|
|dueDate|date|no|Useful for pre-cruise tasks|
|notes|string|no|Light-touch notes|
|sensitive|boolean|no|Flags privacy-sensitive items|
|audit|AuditMetadata|yes|Shared metadata|

### Privacy rule

The app should track readiness, not store sensitive identity values by default.

---

## 22. Entity: FamilyNote

### Purpose

Represents family-authored notes that enrich or override generic guidance.

FamilyNote should be lightweight, searchable and attachable to different objects.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|parentType|enum|yes|sailing, ship, port, attraction, itinerary_day, shore_plan|
|parentId|string|yes|Linked target|
|author|string|no|Phil, Rebecca, Seb, etc.|
|noteType|enum|yes|preference, caution, memory_seed, planning, correction, idea|
|content|string|yes|Note text|
|priority|enum|no|low, normal, high|
|audit|AuditMetadata|yes|Shared metadata|

### Example uses

- “Seb may prefer the cable car over a long museum visit.”
    
- “Rebecca likely wants a low-stress lunch option here.”
    
- “Check whether this port needs passports ashore.”
    
- “Good candidate for a family photo.”
    

---

## 23. Entity: MemoryEntry

### Purpose

Represents what actually happened during or after a cruise.

MemoryEntry supports family reflection and Adventure Almanac export.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|sailingId|string|yes|Parent sailing|
|itineraryDayId|string|no|Optional day link|
|portId|string|no|Optional port link|
|title|string|yes|Memory title|
|summary|string|no|What happened|
|sebFavourite|string|no|Seb’s favourite part|
|familyHighlight|string|no|Family highlight|
|foodTried|string|no|Optional|
|bestPhotoPrompt|string|no|Photo to attach later|
|rating|number|no|Optional 1 to 5|
|wouldReturn|enum|no|yes, no, maybe, unknown|
|tags|string[]|no|e.g. beach, food, history|
|adventureAlmanacReady|boolean|no|Ready for export|
|audit|AuditMetadata|yes|Shared metadata|

### Notes

MemoryEntry should remain enjoyable and light. It should not feel like an admin burden.

---

## 24. Entity: AdventureAlmanacExport

### Purpose

Represents a structured export from Complete Cruising into Adventure Almanac.

The export should convert cruise planning and memory records into confirmed travel chronology and educational history.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|sailingId|string|yes|Parent sailing|
|exportStatus|enum|yes|draft, ready, exported, superseded|
|generatedAt|datetime|no|When export was prepared|
|exportedAt|datetime|no|When exported|
|summary|string|no|Human-readable summary|
|countriesVisited|string[]|no|Confirmed countries|
|portsVisited|string[]|no|Confirmed ports|
|shipName|string|no|Ship|
|cruiseLineName|string|no|Cruise line|
|dateRange|string|no|Display date range|
|travellers|string[]|no|Travellers|
|memoryEntryIds|string[]|no|Linked memories|
|educationalNotes|string[]|no|Seb learning content|
|exportJson|object|no|Structured payload|
|audit|AuditMetadata|yes|Shared metadata|

### Export status values

|Value|Meaning|
|---|---|
|draft|Export being prepared|
|ready|Ready for manual transfer/import|
|exported|Export completed|
|superseded|Replaced by a later export|

---

## 25. Entity: ImportBatch

### Purpose

Represents a batch import into Complete Cruising.

This supports preview, validation, conflict detection and rollback.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|importType|enum|yes|sailing, itinerary, ship_enrichment, port_enrichment, full_backup, etc.|
|fileName|string|no|If file import|
|pastedJsonHash|string|no|If paste import|
|status|enum|yes|previewed, committed, partially_committed, rejected, failed|
|importedAt|datetime|no|Commit time|
|validationWarnings|string[]|no|Human-readable warnings|
|recordsCreated|number|no|Summary|
|recordsUpdated|number|no|Summary|
|recordsSkipped|number|no|Summary|
|conflictCount|number|no|Summary|
|audit|AuditMetadata|yes|Shared metadata|

### Import type values

- sailing
    
- itinerary
    
- ship
    
- port
    
- attraction
    
- shore_plan
    
- ship_enrichment
    
- port_enrichment
    
- day_guide
    
- weather
    
- memories
    
- full_backup
    

---

## 26. Entity: AppSetting

### Purpose

Stores local app preferences and simple master settings.

### Key fields

|Field|Type|Required|Notes|
|---|---|---|---|
|id|string|yes|Stable internal ID|
|key|string|yes|Setting key|
|value|string or object|yes|Setting value|
|category|string|no|e.g. visual, import, family, weather|
|audit|AuditMetadata|yes|Shared metadata|

### Possible settings

- defaultTemperatureUnit: celsius
    
- defaultDistanceUnit: kilometres
    
- preferredCurrency: GBP
    
- defaultFamilyLensEnabled: true
    
- sebDiscoveryEnabled: true
    
- visualTheme: ocean_luxury
    
- weatherRefreshWindowDays: 16
    

---

## 27. Key enumerations

### ConfidenceLevel

```text
confirmed
high
medium
low
inferred
unknown
```

### ReviewStatus

```text
not_reviewed
needs_user_review
reviewed
verified
needs_refresh
stale
rejected
```

### SourceType

```text
booking_confirmed
cruise_line_confirmed
official_port_source
official_tourism_source
official_attraction_source
official_transport_source
reputable_travel_source
family_note
user_entered
researched
inferred
unknown
```

### SailingStatus

```text
draft
planned
upcoming
active
completed
archived
```

### EnrichmentStatus

```text
not_started
partial
enriched
needs_refresh
complete
```

### RiskLevel

```text
low
medium
high
unknown
```

### SuitabilityLevel

```text
excellent
good
mixed
poor
unknown
```

### WeatherDependency

```text
low
medium
high
unknown
```

---

## 28. MVP data stores

A local-first PWA implementation could eventually use separate stores similar to the following.

|Store|Purpose|
|---|---|
|cruiseLines|Cruise operators|
|ships|Reusable ship records|
|sailings|Cruise bookings|
|cabins|Sailing-specific cabin records|
|travellers|People linked to sailings|
|countries|Reusable country records|
|ports|Reusable port records|
|itineraryDays|Sailing itinerary spine|
|attractions|Port-linked attractions|
|shorePlans|Port-day plans|
|dayGuides|Curated daily guides|
|weatherSnapshots|Weather records|
|enrichmentRuns|Enrichment activity records|
|enrichmentSections|Modular enrichment content|
|sourceReferences|Source tracking|
|documentChecklists|Document readiness|
|familyNotes|Family-authored notes|
|memoryEntries|Cruise memories|
|adventureAlmanacExports|Export payloads|
|importBatches|Import tracking|
|appSettings|App configuration|

### MVP simplification option

For early prototype speed, some stores can be merged temporarily.

Possible simplifications:

- DocumentChecklist and DocumentItem can be stored together.
    
- EnrichmentRun can be delayed if EnrichmentSection stores import metadata.
    
- SourceReference can begin as sourceSummary text before full source management.
    
- Traveller can be stored as names on Sailing before becoming reusable records.
    

The full model should still remain the target.

---

## 29. Suggested MVP minimum entity set

The first working MVP should include at least:

1. Sailing
    
2. Ship
    
3. Port
    
4. ItineraryDay
    
5. Attraction
    
6. ShorePlan
    
7. DayGuide
    
8. WeatherSnapshot
    
9. EnrichmentSection
    
10. DocumentChecklist
    
11. FamilyNote
    
12. MemoryEntry
    
13. ImportBatch
    
14. AdventureAlmanacExport
    

CruiseLine, Country, SourceReference and Traveller are highly useful, but can be simplified if build complexity needs controlling.

---

## 30. Import and export implications

The data model should support several import/export workflows.

### 30.1 Sailing shell import

Creates or updates:

- Sailing
    
- CruiseLine
    
- Ship
    
- Cabin
    
- Travellers
    
- ItineraryDays
    
- Ports, if referenced
    

### 30.2 Itinerary import

Creates or updates:

- ItineraryDays
    
- Port links
    
- arrival and departure times
    
- day type
    
- tender status
    
- all-aboard time, if known
    

### 30.3 Ship enrichment import

Creates or updates:

- Ship
    
- EnrichmentSections
    
- SourceReferences, if supported
    
- confidence metadata
    

### 30.4 Port enrichment import

Creates or updates:

- Port
    
- Country
    
- Attractions
    
- EnrichmentSections
    
- SourceReferences, if supported
    
- confidence metadata
    

### 30.5 Day guide import

Creates or updates:

- DayGuide
    
- ShorePlan references
    
- take-ashore checklist
    
- Seb discovery content
    
- confidence notes
    

### 30.6 Weather import

Creates:

- WeatherSnapshot
    

Weather import should usually add a new snapshot rather than overwrite history.

### 30.7 Adventure Almanac export

Creates:

- structured export payload containing confirmed trip facts and selected memories
    

---

## 31. Conflict handling rules

Imports should not blindly overwrite trusted content.

### Protected fields

The following should require explicit confirmation before overwrite:

- Sailing.bookingReference
    
- Sailing.departureDate
    
- Sailing.returnDate
    
- Sailing.shipId
    
- Sailing.cruiseLineId
    
- Cabin.cabinNumber
    
- ItineraryDay.date
    
- ItineraryDay.portId
    
- ItineraryDay.arrivalTime
    
- ItineraryDay.departureTime
    
- ItineraryDay.allAboardTime
    
- Traveller names
    
- completed MemoryEntries
    

### Conflict examples

|Conflict|Behaviour|
|---|---|
|Imported port time differs from confirmed time|Warn and require explicit choice|
|Imported terminal differs from existing researched terminal|Allow side-by-side review|
|Imported currency differs from country record|Warn|
|Imported attraction already exists with similar name|Suggest merge|
|Imported day guide references missing shore plan|Warn but allow draft import|
|Weather import is older than current snapshot|Warn and keep both unless user rejects|

---

## 32. Data quality rules

### 32.1 Required for a valid sailing

A sailing should have:

- name
    
- cruise line
    
- ship
    
- departure date
    
- return date
    
- at least one itinerary day
    

### 32.2 Required for a valid itinerary day

An itinerary day should have:

- sailing ID
    
- day number
    
- date
    
- day type
    

Port days should ideally have:

- port
    
- arrival time
    
- departure time
    
- confidence metadata
    

### 32.3 Required for a valid port

A port should have:

- name
    
- country
    
- at least one summary or enrichment section
    

### 32.4 Required for a valid day guide

A day guide should have:

- itinerary day
    
- title
    
- today at a glance
    
- what matters today
    
- confidence notes
    

### 32.5 Required for importable enrichment

An enrichment section should have:

- parent type
    
- parent identifier or resolvable parent name
    
- section type
    
- title
    
- confidence
    
- review status
    

---

## 33. Visual mapping

The data model should directly support the user interface.

### Dashboard

Uses:

- Sailing
    
- Ship
    
- ItineraryDay
    
- WeatherSnapshot
    
- DocumentChecklist
    
- EnrichmentStatus
    

### Sailing hero

Uses:

- Sailing
    
- Ship
    
- CruiseLine
    
- embarkation and disembarkation Ports
    
- VisualMetadata
    

### Itinerary ribbon

Uses:

- ItineraryDay
    
- Port
    
- WeatherSnapshot
    
- DayGuide
    
- ShorePlan
    

### Today view

Uses:

- ItineraryDay
    
- DayGuide
    
- Port
    
- ShorePlan
    
- WeatherSnapshot
    
- DocumentChecklist
    
- FamilyNote
    

### Ship guide

Uses:

- Ship
    
- EnrichmentSections
    
- VisualMetadata
    

### Port guide

Uses:

- Port
    
- Country
    
- Attractions
    
- EnrichmentSections
    
- ShorePlans
    
- VisualMetadata
    
- GeoMetadata
    

### Seb discovery card

Uses:

- DayGuide.sebDiscovery
    
- Port
    
- Country
    
- FamilyNote
    
- EnrichmentSections
    

### Memory page

Uses:

- Sailing
    
- ItineraryDay
    
- Port
    
- MemoryEntry
    
- AdventureAlmanacExport
    

---

## 34. Example conceptual record

The following simplified example shows how the model fits together.

```json
{
  "sailing": {
    "id": "sailing-sun-princess-med-2026",
    "name": "Sun Princess Mediterranean 2026",
    "cruiseLineId": "cruise-line-princess",
    "shipId": "ship-sun-princess",
    "status": "planned",
    "departureDate": "2026-08-15",
    "returnDate": "2026-08-29",
    "embarkationPortId": "port-civitavecchia",
    "disembarkationPortId": "port-barcelona",
    "enrichmentStatus": "partial"
  },
  "itineraryDay": {
    "id": "day-002-naples",
    "sailingId": "sailing-sun-princess-med-2026",
    "dayNumber": 2,
    "date": "2026-08-16",
    "dayType": "port",
    "portId": "port-naples",
    "arrivalTime": "07:00",
    "departureTime": "18:30",
    "tenderStatus": "not_applicable"
  },
  "port": {
    "id": "port-naples",
    "name": "Naples",
    "countryId": "country-italy",
    "returnRiskDefault": "medium"
  },
  "dayGuide": {
    "id": "day-guide-002-naples",
    "itineraryDayId": "day-002-naples",
    "title": "Naples: Vesuvius, pizza and a safe return buffer",
    "whatMattersToday": [
      "Naples offers major historic options, but the family plan must respect heat, traffic and return timing."
    ]
  }
}
```

This is illustrative only. Actual dates and times must be confirmed against the family’s booking record before use.

---

## 35. Data governance rules

### 35.1 Manual data wins over generic enrichment

User-confirmed data should take precedence over researched enrichment.

### 35.2 Booking data wins over researched data

Official booking details should be treated as highest authority.

### 35.3 Time-sensitive data should expire

Forecasts, terminal notes and opening-hour assumptions should not remain silently trusted.

### 35.4 Memories should not be overwritten

Post-travel memories are family-authored records and should be protected.

### 35.5 Enrichment should remain traceable

The app should preserve how and when an enrichment section was created.

---

## 36. MVP boundary

The v0.1 model is intentionally broad enough to support the long-term product, but the first build should stay disciplined.

### Build now

- Sailing
    
- Ship
    
- Port
    
- ItineraryDay
    
- Attraction
    
- ShorePlan
    
- DayGuide
    
- WeatherSnapshot
    
- EnrichmentSection
    
- DocumentChecklist
    
- FamilyNote
    
- MemoryEntry
    
- Import/export basics
    

### Build later

- Detailed SourceReference management
    
- Cruise line loyalty tracking
    
- Onboard spend tracking
    
- Rich media/photo attachment management
    
- Full document vault
    
- Calendar integrations
    
- Properly Packed integration
    
- Officially Organised reminders
    
- Advanced weather automation
    
- Live map routing
    
- Deck plan annotation
    

---

## 37. Recommended next artefact

The next artefact should be:

**Complete Cruising Visual Experience Brief v0.1**

Reason:

The product specification has defined ambition.  
The enrichment framework has defined content quality.  
This data model has defined structure.

The next step should define how the application should look and feel before any prototype is built.

That brief should cover:

- visual identity
    
- cruise/ocean design language
    
- premium interface motifs
    
- card system
    
- screen concepts
    
- responsive layout principles
    
- interaction design
    
- visual hierarchy
    
- sample prototype content
    
- accessibility and readability expectations
    

Only after that should the standalone HTML prototype be produced.

---

## 38. v0.1 conclusion

Complete Cruising requires a data model that respects the unique nature of cruise travel.

A cruise is a sailing, a ship, an itinerary, a set of ports, a family experience, a practical logistics challenge and a memory-making opportunity.

This data model separates reusable guidebook intelligence from sailing-specific operational detail. It supports modular enrichment, confidence tracking, refreshable data, family personalisation, daily guidance and post-travel memory export.

The result is a structure capable of supporting a visually rich and genuinely useful cruise companion.

**Complete Cruising should not merely store cruise information. It should organise the intelligence needed to make each sailing easier, richer and more memorable.**