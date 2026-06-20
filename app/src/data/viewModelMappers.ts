import type { DashboardData, DashboardStatusCard } from "./sampleDashboardData";
import type { ItineraryData, ItineraryDay } from "./sampleItineraryData";
import type { TodayData, TodayConfidenceNote } from "./sampleTodayData";
import type { ShipGuideData, ShipGuideSection } from "./sampleShipData";
import type { PortGuideData, PortAttraction, PortGuideSectionData } from "./samplePortData";
import type { MemoryPrompt, ShorePlan, TrustMetadata } from "./sampleExperienceData";
import type { ConfidenceMetadata, DayGuide, EnrichmentSection, MemoryEntry, ShorePlanRecord } from "../types";
import type {
  getActivePortGuideBundle,
  getActiveSailingMemoriesBundle,
  getActiveShipGuideBundle,
  getDashboardBundle,
  getTodayGuideBundle,
} from "../db/repositories";

type Resolved<T extends (...args: never[]) => unknown> = NonNullable<Awaited<ReturnType<T>>>;

const titleCase = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const dateLabel = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));
const longDateLabel = (value: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
const reviewedLabel = (value?: string) => value ? `Illustrative review · ${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(value))}` : "Not yet reviewed";

function statusFromConfidence(confidence?: ConfidenceMetadata) {
  if (!confidence) return { label: "Not yet reviewed", tone: "review" as const };
  if (confidence.refreshRecommended || confidence.reviewStatus === "needs_refresh" || confidence.reviewStatus === "stale") return { label: "Needs refresh", tone: "refresh" as const };
  if (confidence.reviewStatus === "reviewed" || confidence.reviewStatus === "verified") return { label: "Reviewed", tone: "confirmed" as const };
  return { label: "Needs user review", tone: "review" as const };
}

function trustFromConfidence(confidence?: ConfidenceMetadata): TrustMetadata {
  const status = statusFromConfidence(confidence);
  return {
    confidence: { level: confidence?.confidence ?? "unknown", label: confidence ? `${titleCase(confidence.confidence)} confidence` : "Confidence unknown" },
    review: { label: titleCase(confidence?.reviewStatus ?? "not_reviewed"), tone: status.tone },
    refresh: { label: confidence?.refreshRecommended ? "Refresh before sailing" : "No refresh requested", tone: confidence?.refreshRecommended ? "refresh" : "confirmed" },
  };
}

export function mapDashboard(bundle: Resolved<typeof getDashboardBundle>): DashboardData {
  const { sailing, ship, cruiseLine, itinerary } = bundle;
  const portDays = itinerary.filter(({ day }) => day.dayType === "port");
  const seaDays = itinerary.filter(({ day }) => day.dayType === "sea");
  const route = itinerary.map(({ day, port }) => ({ id: day.id, name: port?.name ?? (day.dayType === "sea" ? "Sea Day" : day.title ?? titleCase(day.dayType)), kind: day.dayType === "sea" ? "sea" as const : "port" as const }));
  const departure = new Date(`${sailing.departureDate}T12:00:00`);
  const daysToEmbarkation = Math.max(0, Math.ceil((departure.getTime() - Date.now()) / 86_400_000));
  const nights = Math.max(0, itinerary.length - 1);
  const shipSections = bundle.enrichment.filter((section) => section.entityType === "ship" && section.entityId === ship?.id);
  const nextPort = portDays.find(({ day }) => day.dayNumber > 1) ?? portDays[0];
  const weather = bundle.weather[0];
  const confidence = sailing.confidence;
  const cards: DashboardStatusCard[] = [
    { id: "next-port", label: "Next port to review", title: nextPort?.port?.name ?? "Port guide pending", description: nextPort?.port?.overview ?? "The next local port guide has not yet been enriched.", surface: "paper", status: statusFromConfidence(nextPort?.day.confidence), confidence: { level: nextPort?.day.confidence?.confidence ?? "unknown" } },
    { id: "weather", label: "Weather refresh window", title: weather?.condition ?? "Forecasts pending", description: weather?.dataCaveat ?? "No local weather snapshot is stored for this sailing yet.", surface: "glass", status: statusFromConfidence(weather?.confidence), confidence: { level: weather?.confidence.confidence ?? "unknown", label: weather?.snapshotType === "climate" ? "Climate guidance only" : undefined } },
    { id: "documents", label: "Documents readiness", title: bundle.documents.length ? `${bundle.documents.length} readiness items` : "Readiness, without private data", description: "Cruise readiness is tracked locally without storing sensitive identity details.", surface: "glass", status: { label: bundle.documents.length ? "Planning started" : "No checklist yet", tone: "review" }, confidence: { level: "confirmed", label: "Scope confirmed" } },
    { id: "enrichment", label: "Enrichment confidence", title: "Trust stays visible", description: `${shipSections.length} of 7 ship guide sections are held locally with their review and refresh states.`, surface: "paper", status: statusFromConfidence(shipSections[0]?.confidence), confidence: { level: shipSections[0]?.confidence.confidence ?? confidence?.confidence ?? "unknown" } },
    { id: "family", label: "Family focus", title: "Seb discovery prompts ready", description: "Local day-guide records carry phrases, geography clues and things to spot.", surface: "glass", status: { label: "Prompts drafted", tone: "confirmed" }, confidence: { level: "medium", label: "Illustrative prompts" } },
    { id: "memories", label: "Memory capture readiness", title: bundle.memories.length ? `${bundle.memories.length} local prompts prepared` : "Daily reflections waiting", description: "Local prompts support reflection without implying that illustrative travel has already happened.", surface: "glass", status: { label: bundle.memories.length ? "Ready to capture" : "No memories yet", tone: "confirmed" }, confidence: { level: "high" } },
  ];
  return {
    sailing: { name: sailing.name, cruiseLine: cruiseLine?.name ?? "Cruise line not recorded", ship: ship?.name ?? "Ship not recorded", routeStart: itinerary[0]?.port?.name ?? itinerary[0]?.day.title ?? "Embarkation", routeEnd: itinerary.at(-1)?.port?.name ?? itinerary.at(-1)?.day.title ?? "Disembarkation", dateLabel: new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(departure), nights, ports: portDays.length, seaDays: seaDays.length, daysToEmbarkation, status: "upcoming" },
    route,
    metrics: [
      { id: "countdown", value: String(daysToEmbarkation), label: "days to embarkation", detail: "Calculated from the local sailing date", accent: "gold" },
      { id: "nights", value: String(nights), label: "nights", detail: `Aboard ${ship?.name ?? "the ship"}`, accent: "aqua" },
      { id: "ports", value: String(portDays.length), label: "ports", detail: "Local guidebook calls", accent: "coral" },
      { id: "sea-days", value: String(seaDays.length), label: "sea days", detail: "Time for ship discovery", accent: "mist" },
      { id: "ship-guide", value: `${shipSections.length} / 7`, label: "ship guide packs", detail: "Local enrichment sections", accent: "aqua" },
      { id: "documents", value: bundle.documents.length ? String(bundle.documents.length) : "Planning", label: "documents readiness", detail: "Sensitive identity details excluded", accent: "gold" },
    ],
    statusCards: cards,
  };
}

export function mapItinerary(bundle: Resolved<typeof getDashboardBundle>): ItineraryData {
  const days: ItineraryDay[] = bundle.itinerary.map(({ day, port }, index) => {
    const metadataStatus = statusFromConfidence(day.confidence);
    const accent = day.dayType === "sea" ? "aqua" : day.dayType === "embarkation" || day.dayType === "disembarkation" ? "gold" : index % 2 ? "coral" : "mist";
    return {
      id: day.id, dayNumber: day.dayNumber, dateLabel: dateLabel(day.date), dayType: day.dayType as ItineraryDay["dayType"],
      title: port?.name ?? day.title ?? titleCase(day.dayType), portName: port?.name, country: undefined,
      arrivalTime: day.arrivalTime, departureTime: day.departureTime, allAboardTime: day.allAboardTime,
      planSummary: day.selectedShorePlanId ? "Selected shore plan held locally" : day.dayType === "port" ? "Shore plan not selected" : "A day for the ship and horizon",
      enrichmentStatus: port?.overview ? "Guide started" : "Not yet enriched", isHighlighted: Boolean(day.dayGuideId), accent,
      confidence: { level: day.confidence?.confidence ?? "unknown" }, reviewStatus: metadataStatus,
      refreshStatus: { label: day.confidence?.refreshRecommended ? "Refresh before travel" : "Current local record", tone: day.confidence?.refreshRecommended ? "refresh" : "confirmed" },
    };
  });
  const portDays = days.filter((day) => day.dayType === "port");
  return { sailingName: bundle.sailing.name, days, summary: { days: days.length, nights: Math.max(0, days.length - 1), ports: portDays.length, seaDays: days.filter((day) => day.dayType === "sea").length, embarkation: days[0]?.title ?? "Not recorded", disembarkation: days.at(-1)?.title ?? "Not recorded" } };
}

export function mapToday(bundle: Resolved<typeof getTodayGuideBundle>): TodayData | undefined {
  if (!("day" in bundle) || !bundle.day) return undefined;
  const { day, port, country, guide, weather, plans } = bundle;
  const selected = plans.find((plan) => plan.id === day.selectedShorePlanId || plan.status === "selected" || plan.status === "booked");
  const backup = plans.find((plan) => plan.id === day.backupShorePlanId) ?? plans.find((plan) => plan.id !== selected?.id);
  const planStatus = statusFromConfidence(selected?.confidence);
  const notes: TodayConfidenceNote[] = [
    { id: "times", label: "Port times", description: day.confidence?.sourceSummary ?? "Times are held in the local itinerary record.", status: statusFromConfidence(day.confidence), confidence: { level: day.confidence?.confidence ?? "unknown" } },
    { id: "weather", label: "Weather", description: weather?.dataCaveat ?? "No local weather snapshot is available.", status: statusFromConfidence(weather?.confidence), confidence: { level: weather?.confidence.confidence ?? "unknown", label: weather?.sampleOnly ? "Illustrative only" : undefined } },
    { id: "plan", label: "Likely plan", description: selected?.dataCaveat ?? "No shore plan is selected.", status: planStatus, confidence: { level: selected?.confidence.confidence ?? "unknown" } },
    { id: "terminal", label: "Terminal details", description: port?.geo?.locationNotes ?? port?.cruiseLogisticsSummary ?? "Terminal detail has not been enriched.", status: statusFromConfidence(port?.confidence), confidence: { level: port?.confidence?.confidence ?? "unknown" } },
  ];
  return {
    currentDay: { dayNumber: day.dayNumber, dateLabel: longDateLabel(day.date), port: port?.name ?? day.title ?? "Port not recorded", country: country?.name ?? "Country not recorded", portSummary: port?.overview ?? guide?.operationalSummary ?? "Local guide detail has not yet been enriched.", arrivalTime: day.arrivalTime ?? "—", allAboardTime: day.allAboardTime ?? "—", departureTime: day.departureTime ?? "—" },
    returnPlan: { latestSafeReturn: guide?.latestSafeReturnTime ?? "Not set", riskLevel: "medium", note: guide?.latestSafeReturnTime && day.allAboardTime ? `Aim to return by ${guide.latestSafeReturnTime}, ahead of the ${day.allAboardTime} all-aboard time.` : "Set a safe local return time before leaving the ship." },
    weather: { condition: weather?.condition ?? "No snapshot", highTemperature: weather?.highTemperatureC === undefined ? "—" : `${weather.highTemperatureC}°C`, rainChance: weather?.rainChancePercent === undefined ? "—" : `${weather.rainChancePercent}%`, planImpact: weather?.planImpact ?? "No local weather impact note is available.", refreshLabel: weather?.dataCaveat ?? "Weather snapshot not available", confidence: weather?.confidence.confidence ?? "unknown" },
    plans: { likely: selected?.summary ?? guide?.operationalSummary ?? "No likely shore plan selected.", backup: backup?.summary ?? "No backup shore plan selected.", status: planStatus },
    checklist: guide?.checklist ?? [],
    local: { language: guide?.localContext?.language ?? country?.primaryLanguage ?? "Not recorded", currency: guide?.localContext?.currency ?? country?.currencyName ?? "Not recorded", phrase: guide?.localContext?.phrase ?? "Not recorded", phraseMeaning: guide?.localContext?.phraseMeaning ?? "Local phrase not yet enriched" },
    sebDiscovery: { prompt: guide?.sebDiscovery?.prompt ?? "No discovery prompt has been added yet.", fact: guide?.sebDiscovery?.fact ?? country?.sebFact ?? "No local geography fact has been added yet.", photoPrompt: guide?.sebDiscovery?.photoPrompt ?? "Choose one detail that tells the story of the day." },
    confidenceNotes: notes,
  };
}

const shipSectionPresentation: Record<string, { id: ShipGuideSection["id"]; accent: ShipGuideSection["accent"]; nextStep: string }> = {
  identity: { id: "identity", accent: "gold", nextStep: "Verify the final venue mix for this sailing season." },
  orientation: { id: "orientation", accent: "aqua", nextStep: "Add a verified deck-by-deck quick route." },
  dining: { id: "dining", accent: "coral", nextStep: "Confirm inclusions, booking rules and family-friendly timings." },
  family: { id: "family", accent: "gold", nextStep: "Check age rules, family spaces and programme details." },
  recreation: { id: "recreation", accent: "aqua", nextStep: "Verify pool access, opening hours and age restrictions." },
  entertainment: { id: "entertainment", accent: "mist", nextStep: "Add sailing-specific schedules only in the itinerary layer." },
  watchouts: { id: "watchouts", accent: "coral", nextStep: "Confirm reservation windows and quieter alternatives." },
};

export function mapShipGuide(bundle: Resolved<typeof getActiveShipGuideBundle>): ShipGuideData | undefined {
  if (!("ship" in bundle) || !bundle.ship) return undefined;
  const { ship, cruiseLine, sections } = bundle;
  const mapped = sections.map((section, index) => {
    const presentation = shipSectionPresentation[section.sectionType] ?? { id: "identity" as const, accent: "mist" as const, nextStep: "Complete and review this guidebook section." };
    const status = statusFromConfidence(section.confidence);
    return { id: presentation.id, index: String(index + 1).padStart(2, "0"), title: section.title, watchword: String(section.structuredFacts?.watchword ?? "Guide in progress"), summary: section.summary ?? "This local section has not yet been enriched.", nextStep: String(section.structuredFacts?.nextStep ?? presentation.nextStep), status, confidence: { level: section.confidence.confidence }, accent: presentation.accent };
  });
  const confidence = ship.confidence;
  return {
    hero: { name: ship.name, cruiseLine: cruiseLine?.name ?? "Cruise line not recorded", guideLabel: "Illustrative ship handbook · local edition", character: ship.shipOverview ?? "Ship overview not yet enriched." },
    facts: [{ label: "Ship family", value: ship.shipClass ?? "Not recorded" }, { label: "Style", value: String(sections.find((s) => s.sectionType === "identity")?.structuredFacts?.style ?? "Guide in progress") }, { label: "Guide lens", value: "Lawrence family" }, { label: "Record type", value: "Reusable ship guide" }],
    enrichment: { completed: sections.length, total: 7, summary: `${sections.length} locally stored guidebook sections retain their own trust metadata.`, nextPriority: sections.find((section) => section.confidence.refreshRecommended)?.title ?? "Review complete" },
    metadata: { confidence: confidence?.confidence ?? "unknown", reviewStatus: titleCase(confidence?.reviewStatus ?? "not_reviewed"), refreshStatus: confidence?.refreshRecommended ? "Refresh before sailing" : "No refresh requested", lastReviewed: reviewedLabel(confidence?.lastReviewedAt), recordScope: "Ship guidebook · not sailing-specific" },
    sections: mapped,
    caveat: ship.dataCaveat ?? "Local ship guide details should be checked before sailing.",
  };
}

function mapPortSection(section: EnrichmentSection | undefined, fallback: { id: PortGuideSectionData["id"]; eyebrow: string; title: string; body?: string }): PortGuideSectionData {
  return { id: fallback.id, eyebrow: fallback.eyebrow, title: section?.title ?? fallback.title, body: section?.summary ?? fallback.body ?? "This guidebook section is not yet enriched.", note: String(section?.structuredFacts?.note ?? "Review current practical detail before travel."), status: statusFromConfidence(section?.confidence), confidence: { level: section?.confidence.confidence ?? "unknown" } };
}

export function mapPortGuide(bundle: Resolved<typeof getActivePortGuideBundle>): PortGuideData | undefined {
  if (!("guide" in bundle) || !bundle.guide) return undefined;
  const { port, country, attractions, enrichmentSections } = bundle.guide;
  const confidence = port.confidence;
  const section = (type: string) => enrichmentSections.find((item) => item.sectionType === type);
  const mappedAttractions: PortAttraction[] = attractions.map((attraction) => ({ id: attraction.id, name: attraction.name, category: titleCase(attraction.type ?? "possible story"), description: attraction.shortDescription ?? "Local attraction detail is not yet enriched.", familyNote: attraction.accessibilityNotes ?? `Family suitability: ${titleCase(attraction.familySuitability ?? "unknown")}.`, sebAngle: attraction.sebInterestSummary, status: { label: attraction.bookingRequired === "unknown" ? "Requirements unknown" : titleCase(attraction.bookingRequired ?? "needs review"), tone: attraction.bookingRequired === "unknown" ? "refresh" : "review" }, confidence: { level: attraction.confidence?.confidence ?? "unknown" } }));
  return {
    identity: { name: port.name, country: country?.name ?? "Country not recorded", region: port.region ?? "Region not recorded", flag: country?.flagEmoji ?? "🌍", guideLabel: "Illustrative port guidebook · local edition", overview: port.overview ?? "Port overview not yet enriched." },
    facts: [{ label: "Language", value: country?.primaryLanguage ?? "Not recorded" }, { label: "Currency", value: country?.currencyName ? `${country.currencyName}${country.currencyCode ? ` (${country.currencyCode})` : ""}` : "Not recorded" }, { label: "Port character", value: titleCase(port.portType ?? "unknown") }, { label: "Family pace", value: titleCase(port.returnRiskDefault ?? "unknown") }],
    metadata: { confidence: confidence?.confidence ?? "unknown", reviewStatus: titleCase(confidence?.reviewStatus ?? "not_reviewed"), refreshStatus: confidence?.refreshRecommended ? "Refresh before travel" : "No refresh requested", lastReviewed: reviewedLabel(confidence?.lastReviewedAt), recordScope: "Reusable port guidebook · not an itinerary day" },
    sections: [mapPortSection(section("logistics"), { id: "logistics", eyebrow: "Practical arrival", title: "Cruise logistics", body: port.cruiseLogisticsSummary }), mapPortSection(section("getting-around"), { id: "getting-around", eyebrow: "Finding a rhythm", title: "Getting around", body: port.gettingAroundSummary }), mapPortSection(section("food-culture"), { id: "food-culture", eyebrow: "A city with appetite", title: "Food and culture", body: port.foodCultureSummary })],
    attractions: mappedAttractions,
    familyLens: { title: "A family day with room to breathe", bestBalance: port.familySuitabilitySummary ?? "Choose one strong story and preserve a generous return margin.", sebDiscovery: String(section("family-discovery")?.structuredFacts?.thingToSpot ?? "Look for one landscape clue that explains the port."), status: statusFromConfidence(section("family-discovery")?.confidence ?? confidence), confidence: { level: section("family-discovery")?.confidence.confidence ?? confidence?.confidence ?? "unknown", label: "Family lens" } },
    photoPrompt: { prompt: port.photographySummary ?? "Choose a safe frame that captures the character of the port day.", caption: String(section("photography")?.structuredFacts?.caption ?? "A local story in one frame."), status: statusFromConfidence(section("photography")?.confidence ?? confidence), confidence: { level: section("photography")?.confidence.confidence ?? confidence?.confidence ?? "unknown" } },
    hints: { items: (port.hintsTipsSummary ?? "Keep a clear turnaround point. Verify transport and opening details. Use Today for sailing-specific times.").split("|").map((item) => item.trim()), status: statusFromConfidence(confidence), confidence: { level: confidence?.confidence ?? "unknown" } },
    caveat: port.dataCaveat ?? "Local guidebook details should be reviewed before travel.",
  };
}

export function mapShorePlans(plans: readonly ShorePlanRecord[]): ShorePlan[] {
  return plans.map((plan) => ({ id: plan.id, name: plan.name, type: `${titleCase(plan.type)} · local shore plan`, summary: plan.summary ?? "Plan summary not yet enriched.", duration: plan.durationMinutes ? `About ${Math.round(plan.durationMinutes / 30) / 2} hours` : "Duration not set", transport: plan.transportSummary ?? "Transport not set", familyFit: titleCase(plan.familySuitability ?? "unknown"), sebFit: plan.sebFitSummary ?? "Seb suitability not yet reviewed", weatherDependency: `${titleCase(plan.weatherDependency)} weather dependency`, returnRisk: plan.returnRisk === "low" ? "Lower" : plan.returnRisk === "high" ? "Higher" : "Medium", returnBuffer: plan.returnBufferMinutes === undefined ? "Not set" : `${plan.returnBufferMinutes} minutes`, status: plan.status === "selected" ? "Selected recommendation" : titleCase(plan.status), selected: plan.status === "selected" || plan.status === "booked", trust: trustFromConfidence(plan.confidence) }));
}

export interface FamilyGuideViewModel {
  place: string; flag: string; phrase: { local: string; meaning: string }; geographyFact: string; thingToSpot: string;
  quiz: { question: string; answer: string }; memoryPrompt: string; comfortNotes: string[]; sebChallenge: string; trust: TrustMetadata;
}

export function mapFamilyGuide(bundle: Resolved<typeof getTodayGuideBundle>): FamilyGuideViewModel | undefined {
  if (!("day" in bundle) || !bundle.day) return undefined;
  const familySection = bundle.port ? undefined : undefined;
  void familySection;
  const guide = bundle.guide;
  return { place: `${bundle.port?.name ?? bundle.day.title ?? "Port"}, ${bundle.country?.name ?? "country not recorded"}`, flag: bundle.country?.flagEmoji ?? "🌍", phrase: { local: guide?.localContext?.phrase ?? "Not recorded", meaning: guide?.localContext?.phraseMeaning ?? "Phrase meaning not yet enriched" }, geographyFact: guide?.sebDiscovery?.fact ?? bundle.country?.sebFact ?? "Geography fact not yet enriched.", thingToSpot: guide?.sebDiscovery?.prompt ?? "Choose one local detail to spot.", quiz: { question: "Which ancient Roman town lies beneath Vesuvius?", answer: "Pompeii." }, memoryPrompt: "What made this port feel different from the others?", comfortNotes: [bundle.port?.familySuitabilitySummary ?? "Leave room for the day to breathe.", bundle.weather?.planImpact ?? "Check the local weather snapshot before leaving.", "Keep a generous return margin."], sebChallenge: guide?.sebDiscovery?.photoPrompt ?? "Explain one way the landscape shaped the city.", trust: trustFromConfidence(guide?.confidence ?? bundle.day.confidence) };
}

const memoryTone: Record<MemoryEntry["type"], MemoryPrompt["tone"]> = { reflection: "paper", seb_favourite: "aqua", family_highlight: "gold", photo: "coral", food: "paper", other: "paper" };
export function mapMemories(bundle: Resolved<typeof getActiveSailingMemoriesBundle>) {
  const entries = bundle.entries;
  const prompts: MemoryPrompt[] = entries.map((entry) => ({ id: entry.id, label: titleCase(entry.type), prompt: entry.prompt ?? "A local memory prompt", response: entry.content, tone: memoryTone[entry.type] }));
  return { place: `${bundle.port?.name ?? "Voyage"}${bundle.country?.name ? `, ${bundle.country.name}` : ""}`, day: bundle.day ? `Day ${bundle.day.dayNumber} · ${titleCase(bundle.day.dayType)}` : "Sailing journal", status: entries.length ? `${entries.length} local ${entries.every((entry) => entry.sampleOnly) ? "illustrative prompts" : "memories"}` : "No memories captured yet", wouldReturn: "Undecided", almanacReadiness: bundle.preview?.readiness ?? "Memories required", prompts, trust: trustFromConfidence(entries[0]?.confidence), exportPreview: { sailingName: bundle.preview?.sailingName ?? bundle.sailing.name, dayOrPort: bundle.preview?.dayOrPort ?? bundle.port?.name ?? "Not set", country: bundle.preview?.country ?? bundle.country?.name ?? "Not set", ship: bundle.preview?.shipName ?? "Not set", memorySummary: bundle.preview?.memorySummary ?? "Waiting for a family reflection.", sebLearningMoment: bundle.preview?.sebLearningMoment ?? "Waiting for a discovery note.", bestPhotoPrompt: bundle.preview?.bestPhotoPrompt ?? "Choose the frame that best holds the day.", readiness: bundle.preview?.readiness ?? "Draft · memories required" } };
}
