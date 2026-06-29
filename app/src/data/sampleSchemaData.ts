import type { z } from "zod";
import type { AdventureAlmanacExportPreviewSchema, AttractionSchema, DayGuideSchema, EnrichmentSectionSchema, ItineraryDaySchema, MemoryEntrySchema, PortSchema, SailingSchema, ShipSchema, ShorePlanSchema, WeatherSnapshotSchema } from "../schemas";

export const sampleAudit = {
  createdAt: "2026-06-20T09:00:00.000Z",
  updatedAt: "2026-06-20T09:00:00.000Z",
  createdBy: "tranche-9-sample",
  updatedBy: "tranche-9-sample",
} as const;

export const illustrativeConfidence = {
  confidence: "medium",
  reviewStatus: "needs_user_review",
  sourceType: "inferred",
  sourceSummary: "Derived from the existing illustrative Tranche 8 presentation sample.",
  lastReviewedAt: "2026-06-20T09:00:00.000Z",
  refreshRecommended: true,
  refreshReason: "Confirm against current booking, cruise line or official local sources before travel.",
} as const;

const sampleCaveat = "Illustrative sample only. Details remain unconfirmed and must be reviewed before travel.";

export const sampleSailingRecord = {
  id: "sailing-sun-princess-med-2026",
  name: "Sun Princess Mediterranean 2026",
  cruiseLineId: "cruise-line-princess",
  shipId: "ship-sun-princess",
  status: "upcoming",
  departureDate: "2026-08-01",
  returnDate: "2026-08-15",
  embarkationPortId: "port-civitavecchia",
  disembarkationPortId: "port-barcelona",
  planningSummary: "Fourteen-night illustrative route from Rome to Barcelona.",
  enrichmentStatus: "partial",
  visual: { featured: true, colourTheme: "ocean-luxe" },
  audit: sampleAudit,
  confidence: illustrativeConfidence,
  sampleOnly: true,
  dataCaveat: sampleCaveat,
} as const satisfies z.infer<typeof SailingSchema>;

export const sampleItineraryDayRecord = {
  id: "day-02-naples",
  sailingId: sampleSailingRecord.id,
  dayNumber: 2,
  date: "2026-08-02",
  dayType: "port",
  title: "Naples, Italy",
  portId: "port-naples",
  arrivalTime: "07:00",
  departureTime: "18:30",
  allAboardTime: "17:30",
  isTender: false,
  tenderStatus: "not_applicable",
  selectedShorePlanId: "shore-plan-family-balance",
  backupShorePlanId: "shore-plan-easy-city",
  weatherSnapshotId: "weather-naples-illustrative",
  dayGuideId: "day-guide-naples",
  operationalWarnings: ["Representative times only; confirm before travel."],
  confidence: illustrativeConfidence,
  audit: sampleAudit,
  sampleOnly: true,
  dataCaveat: sampleCaveat,
} as const satisfies z.infer<typeof ItineraryDaySchema>;

export const sampleShipRecord = {
  id: "ship-sun-princess",
  cruiseLineId: "cruise-line-princess",
  name: "Sun Princess",
  shipClass: "Sphere class",
  shipOverview: "A bright contemporary resort ship with dramatic public spaces and varied dining.",
  familySuitabilitySummary: "Promising for ship exploration, flexible food and family sea days.",
  enrichmentSectionIds: ["ship-section-identity"],
  visual: { featured: true, colourTheme: "sunlit-aqua" },
  audit: sampleAudit,
  confidence: illustrativeConfidence,
  sampleOnly: true,
  dataCaveat: "Illustrative reusable ship guide. Features and operating arrangements require verification.",
} as const satisfies z.infer<typeof ShipSchema>;

export const samplePortRecord = {
  id: "port-naples",
  name: "Naples",
  countryId: "country-italy",
  region: "Campania",
  portType: "city",
  overview: "A Mediterranean gateway where volcanic landscapes, Roman history and Neapolitan life meet.",
  cruiseLogisticsSummary: "Berth, terminal route and walking access remain unconfirmed.",
  gettingAroundSummary: "Central exploration may suit a flexible walking day; Pompeii and coastal ideas need disciplined transport planning.",
  familySuitabilitySummary: "Choose one strong story and leave room for shade, food and a generous return margin.",
  foodCultureSummary: "Pizza, espresso and layers of Greek, Roman and Spanish history reward a curious, unhurried route.",
  photographySummary: "Frame the harbour and city with Vesuvius beyond, only where a safe stopping place allows it.",
  hintsTipsSummary: "Keep a clear turnaround point|Expect heat, crowds and uneven surfaces to change the pace|Verify attraction and transport details close to travel|Use Today for sailing-specific ship times",
  returnRiskDefault: "medium",
  geo: { geocodeConfidence: "unknown", mapLabel: "Naples cruise port", locationNotes: "Exact arrival point is not confirmed." },
  visual: { featured: true, colourTheme: "volcanic-coral" },
  confidence: illustrativeConfidence,
  audit: sampleAudit,
  sampleOnly: true,
  dataCaveat: "Illustrative reusable port guide. No terminal, transport or port-day timing is confirmed.",
} as const satisfies z.infer<typeof PortSchema>;

export const sampleAttractionRecords = [
  { id: "attraction-pompeii", portId: samplePortRecord.id, name: "Pompeii", type: "historic_site", shortDescription: "An illustrative research lead for Roman history beneath Vesuvius.", bookingRequired: "unknown", costLevel: "unknown", familySuitability: "mixed", sebInterestSummary: "Look for clues about Roman family life.", weatherDependency: "high", confidence: illustrativeConfidence, audit: sampleAudit },
  { id: "attraction-historic-centre", portId: samplePortRecord.id, name: "Historic centre", type: "landmark", shortDescription: "A flexible route through lively streets, churches and food culture.", bookingRequired: "not_required", costLevel: "free", familySuitability: "good", weatherDependency: "medium", confidence: illustrativeConfidence, audit: sampleAudit },
  { id: "attraction-herculaneum", portId: samplePortRecord.id, name: "Herculaneum", type: "historic_site", shortDescription: "A compact-feeling alternative within the same volcanic story.", bookingRequired: "unknown", costLevel: "unknown", familySuitability: "good", sebInterestSummary: "Compare its preservation with Pompeii.", weatherDependency: "high", confidence: illustrativeConfidence, audit: sampleAudit },
  { id: "attraction-seafront", portId: samplePortRecord.id, name: "Seafront and castle views", type: "viewpoint", shortDescription: "A slower option for sea air, broad views and a sense of Naples between bay and volcano.", bookingRequired: "not_required", costLevel: "free", familySuitability: "excellent", weatherDependency: "medium", confidence: illustrativeConfidence, audit: sampleAudit },
] as const satisfies readonly z.infer<typeof AttractionSchema>[];

const planBase = { sailingId: sampleSailingRecord.id, itineraryDayId: sampleItineraryDayRecord.id, confidence: illustrativeConfidence, audit: sampleAudit, sampleOnly: true, dataCaveat: sampleCaveat } as const;
export const sampleShorePlanRecords = [
  { ...planBase, id: "shore-plan-easy-city", name: "Naples at an easy pace", type: "low_effort", status: "shortlisted", summary: "A gentle historic-centre wander, harbour views and an unhurried pizza stop.", durationMinutes: 210, transportSummary: "Walk with optional taxi return", familySuitability: "excellent", sebFitSummary: "Pizza, street details and volcano spotting", returnRisk: "low", returnBufferMinutes: 150, weatherDependency: "medium" },
  { ...planBase, id: "shore-plan-family-balance", name: "Stories, volcanoes and pizza", type: "diy", status: "selected", summary: "A short historic route with Vesuvius context and a flexible food stop.", durationMinutes: 300, transportSummary: "Walk; metro only if useful", familySuitability: "excellent", sebFitSummary: "A Roman mystery, volcano challenge and lunch", returnRisk: "medium", returnBufferMinutes: 120, weatherDependency: "medium" },
  { ...planBase, id: "shore-plan-pompeii", name: "Pompeii, properly explored", type: "ambitious", status: "idea", summary: "A high-value visit with more travel, exposure and timing pressure.", durationMinutes: 420, transportSummary: "Rail or pre-arranged transfer", familySuitability: "mixed", sebFitSummary: "Exceptional Roman-world learning; pacing matters", returnRisk: "high", returnBufferMinutes: 120, weatherDependency: "high" },
] as const satisfies readonly z.infer<typeof ShorePlanSchema>[];

export const sampleDayGuideRecord = {
  id: "day-guide-naples", sailingId: sampleSailingRecord.id, itineraryDayId: sampleItineraryDayRecord.id, title: "Today in Naples", operationalSummary: "Historic centre, harbour walk and pizza, paced around shade and a calm return.", latestSafeReturnTime: "16:45", returnRisk: "medium", checklist: [{ id: "cruise-cards", label: "Cruise cards" }, { id: "phone", label: "Phone" }, { id: "charger", label: "Portable charger" }, { id: "water", label: "Water" }, { id: "sun-cream", label: "Sun cream" }, { id: "hats", label: "Hats" }, { id: "shoes", label: "Comfortable shoes" }, { id: "payment", label: "Card or euros" }, { id: "required-id", label: "Any required ID", note: "Confirm requirements before travel" }], localContext: { language: "Italian", currency: "Euro (EUR)", phrase: "Buongiorno", phraseMeaning: "Good morning" }, sebDiscovery: { prompt: "Look for Vesuvius above the city and trace its wide outline.", fact: "Naples is one of Europe's oldest continuously inhabited urban areas.", photoPrompt: "Capture the harbour with Vesuvius in the distance if visibility allows." }, confidence: illustrativeConfidence, audit: sampleAudit, sampleOnly: true, dataCaveat: sampleCaveat,
} as const satisfies z.infer<typeof DayGuideSchema>;

export const sampleWeatherRecord = {
  id: "weather-naples-illustrative",
  sailingId: sampleSailingRecord.id,
  itineraryDayId: sampleItineraryDayRecord.id,
  portId: samplePortRecord.id,
  date: "2026-08-02",
  latitude: 40.841,
  longitude: 14.263,
  sourceName: "Open-Meteo forecast",
  sourceUrl: "https://open-meteo.com/",
  sourceType: "weather_service",
  snapshotType: "forecast",
  weatherState: "forecast_recent",
  capturedAt: "2026-06-20T09:00:00.000Z",
  validFrom: "2026-08-02",
  validUntil: "2026-08-02",
  lastRefreshAttemptAt: "2026-06-20T09:00:00.000Z",
  refreshState: "updated",
  refreshRecommended: false,
  conditionSummary: "Warm and bright",
  temperatureHighC: 29,
  temperatureLowC: 22,
  precipitationChance: 10,
  precipitationMm: 0.4,
  windSpeedKph: 18,
  windGustKph: 28,
  uvIndex: 7,
  sunrise: "2026-08-02T05:49:00+02:00",
  sunset: "2026-08-02T20:03:00+02:00",
  comfortSummary: "Warm port day - hats, water and shade breaks likely matter.",
  clothingGuidance: "Hats, water and shade breaks are worth packing.",
  planImpact: "Shade, water and comfortable shoes are important.",
  confidence: {
    confidence: "high",
    reviewStatus: "needs_user_review",
    sourceType: "weather_service",
    sourceSummary: "Open-Meteo forecast",
    lastReviewedAt: "2026-06-20T09:00:00.000Z",
    refreshRecommended: false,
    refreshReason: "Forecast will need a nearer look closer to travel.",
  },
  audit: sampleAudit,
  sampleOnly: true,
  dataCaveat: "Illustrative forecast guidance, not a live weather source.",
} as const satisfies z.infer<typeof WeatherSnapshotSchema>;

export const sampleEnrichmentSection = {
  id: "ship-section-identity", entityType: "ship", entityId: sampleShipRecord.id, sectionType: "identity", title: "Identity and character", summary: "Large and modern, with a polished resort mood.", structuredFacts: { watchword: "Light-filled" }, confidence: illustrativeConfidence, audit: sampleAudit,
} as const satisfies z.infer<typeof EnrichmentSectionSchema>;

export const sampleEnrichmentSections = [
  sampleEnrichmentSection,
  { id: "ship-section-orientation", entityType: "ship", entityId: sampleShipRecord.id, sectionType: "orientation", title: "Layout and orientation", summary: "Find the atrium, open-deck routes and the lift bank nearest the cabin before the ship becomes busy.", structuredFacts: { watchword: "Learn the spine" }, confidence: { ...illustrativeConfidence, confidence: "inferred" }, audit: sampleAudit },
  { id: "ship-section-dining", entityType: "ship", entityId: sampleShipRecord.id, sectionType: "dining", title: "Dining", summary: "A broad mix of relaxed and occasion dining needs a clear local guide to inclusions and booking rules.", structuredFacts: { watchword: "Choice needs a map" }, confidence: { ...illustrativeConfidence, confidence: "low" }, audit: sampleAudit },
  { id: "ship-section-family", entityType: "ship", entityId: sampleShipRecord.id, sectionType: "family", title: "Family and Seb suitability", summary: "Promising for ship exploration, flexible food, pools and choosing one daily family highlight.", structuredFacts: { watchword: "Strong sea-day fit" }, confidence: illustrativeConfidence, audit: sampleAudit },
  { id: "ship-section-recreation", entityType: "ship", entityId: sampleShipRecord.id, sectionType: "recreation", title: "Pools and recreation", summary: "Open-deck recreation should be a sea-day strength, with quieter visits outside the busiest hours.", structuredFacts: { watchword: "Plan the quiet hour" }, confidence: { ...illustrativeConfidence, confidence: "low" }, audit: sampleAudit },
  { id: "ship-section-entertainment", entityType: "ship", entityId: sampleShipRecord.id, sectionType: "entertainment", title: "Entertainment", summary: "Treat the programme as a menu: choose one headline event and leave room for discovery.", structuredFacts: { watchword: "Pick one headline" }, confidence: { ...illustrativeConfidence, confidence: "inferred" }, audit: sampleAudit },
  { id: "ship-section-watchouts", entityType: "ship", entityId: sampleShipRecord.id, sectionType: "watchouts", title: "Tips and watchouts", summary: "Popular dining, headline venues and sunny sea-day areas may reward early planning.", structuredFacts: { watchword: "Book, buffer, breathe" }, confidence: illustrativeConfidence, audit: sampleAudit },
  { id: "port-section-logistics", entityType: "port", entityId: samplePortRecord.id, sectionType: "logistics", title: "Cruise logistics", summary: samplePortRecord.cruiseLogisticsSummary, structuredFacts: { note: "Confirm arrival point, terminal arrangements and all-aboard instructions." }, confidence: { ...illustrativeConfidence, confidence: "low" }, audit: sampleAudit },
  { id: "port-section-getting-around", entityType: "port", entityId: samplePortRecord.id, sectionType: "getting-around", title: "Getting around", summary: samplePortRecord.gettingAroundSummary, structuredFacts: { note: "No transport journey time or service frequency is confirmed." }, confidence: { ...illustrativeConfidence, confidence: "inferred" }, audit: sampleAudit },
  { id: "port-section-food", entityType: "port", entityId: samplePortRecord.id, sectionType: "food-culture", title: "Food and culture", summary: samplePortRecord.foodCultureSummary, structuredFacts: { note: "Venue availability and dietary suitability remain research prompts." }, confidence: illustrativeConfidence, audit: sampleAudit },
  { id: "port-section-family", entityType: "port", entityId: samplePortRecord.id, sectionType: "family-discovery", title: "Family discovery", summary: samplePortRecord.familySuitabilitySummary, structuredFacts: { thingToSpot: "Spot three ways Vesuvius has shaped the skyline, history and stone beneath the streets." }, confidence: illustrativeConfidence, audit: sampleAudit },
] as const satisfies readonly z.infer<typeof EnrichmentSectionSchema>[];

export const sampleMemoryEntry = {
  id: "memory-naples-preview", sailingId: sampleSailingRecord.id, itineraryDayId: sampleItineraryDayRecord.id, type: "reflection", prompt: "What surprised us most about Naples?", content: "Waiting for the family's reflection after the day.", confidence: illustrativeConfidence, audit: sampleAudit, sampleOnly: true, dataCaveat: "Illustrative prompt, not a recorded family memory.",
} as const satisfies z.infer<typeof MemoryEntrySchema>;

export const sampleMemoryEntries = [
  sampleMemoryEntry,
  { ...sampleMemoryEntry, id: "memory-naples-seb", type: "seb_favourite", prompt: "Which story, sight or taste would Seb tell someone about first?", content: "Illustrative prompt—not a recorded family answer." },
  { ...sampleMemoryEntry, id: "memory-naples-family", type: "family_highlight", prompt: "When did the day feel most like our adventure?", content: "Ready to capture one shared moment." },
  { ...sampleMemoryEntry, id: "memory-naples-photo", type: "photo", prompt: "Which frame carries the mood of Naples?", content: "Photo selection remains empty in this preview." },
  { ...sampleMemoryEntry, id: "memory-naples-food", type: "food", prompt: "What did we try, and what detail should we remember?", content: "Waiting for a real post-visit memory." },
] as const satisfies readonly z.infer<typeof MemoryEntrySchema>[];

export const sampleAlmanacPreview = {
  id: "almanac-preview-naples", sailingId: sampleSailingRecord.id, schemaVersion: 1, status: "draft", sailingName: sampleSailingRecord.name, shipName: sampleShipRecord.name, dayOrPort: "Day 2 · Naples", country: "Italy", memorySummary: "A future family reflection on Naples, its streets, food and volcanic horizon.", sebLearningMoment: "How Vesuvius shaped the history and landscape around Naples.", bestPhotoPrompt: "The chosen frame that best captures the port day.", readiness: "Draft preview · memories required", memoryEntryIds: [sampleMemoryEntry.id], sampleOnly: true, dataCaveat: sampleCaveat, audit: sampleAudit,
} as const satisfies z.infer<typeof AdventureAlmanacExportPreviewSchema>;
