import type { DashboardData, DashboardStatusCard } from "./sampleDashboardData";
import type { ItineraryData, ItineraryDay } from "./sampleItineraryData";
import type { TodayData, TodayConfidenceNote } from "./sampleTodayData";
import type { ShipGuideData, ShipGuideSection } from "./sampleShipData";
import type { PortGuideData, PortAttraction, PortGuideSectionData } from "./samplePortData";
import type { MemoryPrompt, ShorePlan, TrustMetadata } from "./sampleExperienceData";
import type { ConfidenceMetadata, DayGuide, EnrichmentSection, MemoryEntry, ShorePlanRecord } from "../types";
import { buildWeatherCardModelFromSnapshot } from "../features/weather/weatherStateService";
import type { WeatherSnapshot } from "../types";
import { assessDayReadiness, summariseCruiseConditions } from "../features/conditions/dayReadinessService";
import { buildWeatherSnapshotConflicts } from "../features/weather/weatherSnapshotConflictService";
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
const reviewedLabel = (value?: string | null) => value ? `Illustrative review · ${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(value))}` : "Not yet reviewed";
const factsObject = (facts: EnrichmentSection["structuredFacts"]) => facts && !Array.isArray(facts) ? facts : undefined;

function preferredWeatherByDay(
  itinerary: readonly { day: { id: string; weatherSnapshotId?: string } }[],
  weather: readonly WeatherSnapshot[] | undefined,
) {
  const snapshots = weather ?? [];
  const snapshotsById = new Map(snapshots.map((snapshot) => [snapshot.id, snapshot]));
  const latest = new Map<string, WeatherSnapshot>();
  for (const snapshot of snapshots) {
    const current = latest.get(snapshot.itineraryDayId);
    if (!current || current.capturedAt < snapshot.capturedAt) latest.set(snapshot.itineraryDayId, snapshot);
  }

  const preferred = new Map<string, WeatherSnapshot>();
  for (const { day } of itinerary) {
    const snapshot = (day.weatherSnapshotId ? snapshotsById.get(day.weatherSnapshotId) : undefined) ?? latest.get(day.id);
    if (snapshot) preferred.set(day.id, snapshot);
  }
  return preferred;
}

function plansByDay(plans: readonly ShorePlanRecord[] | undefined) {
  const lookup = new Map<string, ShorePlanRecord[]>();
  for (const plan of plans ?? []) {
    lookup.set(plan.itineraryDayId, [...(lookup.get(plan.itineraryDayId) ?? []), plan]);
  }
  return lookup;
}

function guidesByDay(guides: readonly DayGuide[] | undefined) {
  return new Map((guides ?? []).map((guide) => [guide.itineraryDayId, guide]));
}

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
  const weatherByDay = preferredWeatherByDay(itinerary, bundle.weather);
  const shorePlansByDay = plansByDay(bundle.shorePlans);
  const dayGuidesByDay = guidesByDay(bundle.dayGuides);
  const weatherConflicts = buildWeatherSnapshotConflicts({
    itineraryDays: itinerary.map(({ day, port }) => ({ day, port })),
    snapshots: bundle.weather ?? [],
    reviewEvents: bundle.weatherReviewEvents ?? [],
  });
  const unresolvedConflictCount = weatherConflicts.filter((conflict) => conflict.recommendedReviewState === "review_recommended" || conflict.recommendedReviewState === "stale_preferred").length;
  const readinessByDay = itinerary.map(({ day, port }) => ({
    day,
    title: port?.name ?? day.title ?? titleCase(day.dayType),
    readiness: assessDayReadiness({
      day,
      weather: weatherByDay.get(day.id),
      guide: dayGuidesByDay.get(day.id),
      plans: shorePlansByDay.get(day.id) ?? [],
    }),
  }));
  const conditionsSummary = summariseCruiseConditions({
    days: readinessByDay,
    activeDayId: sailing.activeDayId ?? itinerary[0]?.day.id,
  });
  const route = itinerary.map(({ day, port }) => {
    const weather = buildWeatherCardModelFromSnapshot({ day, port, snapshot: weatherByDay.get(day.id) });
    return {
      id: day.id,
      name: port?.name ?? (day.dayType === "sea" ? "Sea Day" : day.title ?? titleCase(day.dayType)),
      kind: day.dayType === "sea" ? "sea" as const : "port" as const,
      weatherBadge: weather.badgeLabel,
      weatherTone: weather.badgeTone,
    };
  });
  const departure = new Date(`${sailing.departureDate}T12:00:00`);
  const daysToEmbarkation = Math.max(0, Math.ceil((departure.getTime() - Date.now()) / 86_400_000));
  const nights = Math.max(0, itinerary.length - 1);
  const shipSections = bundle.enrichment.filter((section) => section.entityType === "ship" && section.entityId === ship?.id);
  const nextPort = portDays.find(({ day }) => day.dayNumber > 1) ?? portDays[0];
  const featuredWeatherDay = nextPort ?? portDays[0] ?? itinerary[0];
  const featuredWeather = featuredWeatherDay ? buildWeatherCardModelFromSnapshot({
    day: featuredWeatherDay.day,
    port: featuredWeatherDay.port,
    snapshot: weatherByDay.get(featuredWeatherDay.day.id),
  }) : undefined;
  const confidence = sailing.confidence;
  const nextMilestone = daysToEmbarkation > 0 ? "Embarkation is the next voyage milestone" : "The sailing is active in the local guidebook";
  const weatherStateLabel = featuredWeather?.stateLabel ?? "Forecast pending";
  const cards: DashboardStatusCard[] = [
    { id: "next-port", label: "Next voyage milestone", title: nextPort?.port?.name ?? "Port guide pending", description: nextPort?.port?.overview ?? nextMilestone, surface: "paper", status: statusFromConfidence(nextPort?.day.confidence), confidence: { level: nextPort?.day.confidence?.confidence ?? "unknown" } },
    { id: "weather", label: "Operational caveat", title: featuredWeather?.summary ?? "Weather will wake up later", description: featuredWeather?.comfortSummary ?? "Weather and port operations remain pending until closer to travel; no forecast is being invented here.", surface: "glass", status: { label: weatherStateLabel, tone: featuredWeather?.badgeTone ?? "review" }, confidence: { level: featuredWeather?.refreshState === "updated" ? "high" : featuredWeather?.state === "climate_expectation" ? "inferred" : "unknown", label: featuredWeather?.state === "climate_expectation" ? "Climate guidance only" : undefined } },
    { id: "documents", label: "Travel readiness", title: bundle.documents.length ? `${bundle.documents.length} readiness items` : "Private details stay out", description: "Cruise readiness can be prepared locally without storing passports, booking references or identity details.", surface: "glass", status: { label: bundle.documents.length ? "Planning started" : "Guide pending", tone: "review" }, confidence: { level: "confirmed", label: "Scope confirmed" } },
    { id: "enrichment", label: "Guidebook readiness", title: shipSections.length ? "Ship guide started" : "Guide pending", description: `${shipSections.length} of 7 ship handbook sections are held locally with their confidence, review and refresh states.`, surface: "paper", status: statusFromConfidence(shipSections[0]?.confidence), confidence: { level: shipSections[0]?.confidence.confidence ?? confidence?.confidence ?? "unknown" } },
    { id: "family", label: "Family layer", title: "Seb discovery is ready to grow", description: "Port-day prompts can carry phrases, geography clues and things to spot once each guide is reviewed.", surface: "glass", status: { label: "Guide ready", tone: "confirmed" }, confidence: { level: "medium", label: "Review before travel" } },
    { id: "memories", label: "Almanac readiness", title: bundle.memories.length ? `${bundle.memories.length} reflections prepared` : "Memories waiting for the voyage", description: "The journal is quiet until the sailing begins, then each day can become an Adventure Almanac note.", surface: "glass", status: { label: bundle.memories.length ? "Ready to capture" : "No memories yet", tone: "confirmed" }, confidence: { level: "high" } },
  ];
  return {
    conditionsSummary: {
      readyDays: conditionsSummary.readyDays,
      usableDays: conditionsSummary.usableDays,
      totalDays: itinerary.length,
      forecastPendingDays: conditionsSummary.forecastPendingDays,
      climateOnlyDays: conditionsSummary.climateOnlyDays,
      nextReview: conditionsSummary.nextAttentionDay ? `${conditionsSummary.nextAttentionDay.title} - ${conditionsSummary.nextAttentionDay.reason}` : undefined,
      activeDayLabel: conditionsSummary.activeDay?.statusLabel,
    },
    sailing: { name: sailing.name, cruiseLine: cruiseLine?.name ?? "Cruise line not recorded", ship: ship?.name ?? "Ship not recorded", routeStart: itinerary[0]?.port?.name ?? itinerary[0]?.day.title ?? "Embarkation", routeEnd: itinerary.at(-1)?.port?.name ?? itinerary.at(-1)?.day.title ?? "Disembarkation", dateLabel: new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(departure), departureLabel: longDateLabel(sailing.departureDate), returnLabel: longDateLabel(sailing.returnDate), nights, ports: portDays.length, seaDays: seaDays.length, daysToEmbarkation, status: "upcoming" },
    route,
    weatherOutlook: {
      canRefresh: Boolean(portDays.length),
      conflictCount: unresolvedConflictCount || undefined,
      conflictHref: unresolvedConflictCount ? "#/weather-review" : undefined,
      conflictSummary: unresolvedConflictCount ? `${unresolvedConflictCount} weather snapshot review ${unresolvedConflictCount === 1 ? "item is" : "items are"} waiting.` : undefined,
      lastUpdated: featuredWeather?.updatedLabel ?? "Not refreshed yet",
      privacyNote: "Weather refresh sends port coordinates and dates to Open-Meteo. It does not send family identity, booking details, cabin information or traveller details.",
      refreshLabel: featuredWeather?.refreshLabel ?? "Refresh cruise weather",
      refreshTone: featuredWeather?.badgeTone ?? "review",
      refreshButtonState: featuredWeather?.buttonState ?? "idle",
      source: featuredWeather?.sourceLabel ?? "Open-Meteo",
      attributionLabel: featuredWeather?.attributionLabel ?? "Weather data by Open-Meteo",
      stateLabel: weatherStateLabel,
      summary: featuredWeather?.summary ?? "Seasonal expectations and forecast windows are visible across the route.",
      portName: featuredWeather?.portName ?? (featuredWeatherDay?.port?.name ?? "Next port"),
      visitDateLabel: featuredWeather?.visitDateLabel ?? "Not set",
      weatherDateLabel: featuredWeather?.weatherDateLabel ?? "Not refreshed yet",
      weatherTypeLabel: featuredWeather?.weatherTypeLabel ?? "Weather context",
      readinessLabel: featuredWeather?.readinessLabel ?? "Forecast pending",
      expectedForecastFromLabel: featuredWeather?.forecastExpectedFromLabel,
      contextMessage: featuredWeather?.contextMessage ?? "Weather context stays advisory until the visit-date forecast arrives.",
    },
    metrics: [
      { id: "countdown", value: String(daysToEmbarkation), label: "days to embarkation", detail: "Live countdown from the local sailing date", accent: "gold" },
      { id: "nights", value: String(nights), label: "nights", detail: `Aboard ${ship?.name ?? "the ship"}`, accent: "aqua" },
      { id: "ports", value: String(portDays.length), label: "ports", detail: "Local guidebook calls", accent: "coral" },
      { id: "sea-days", value: String(seaDays.length), label: "sea days", detail: "Time for ship discovery", accent: "mist" },
      { id: "ship-guide", value: `${shipSections.length} / 7`, label: "ship guide sections", detail: "Handbook readiness", accent: "aqua" },
      { id: "documents", value: bundle.documents.length ? String(bundle.documents.length) : "Planning", label: "documents readiness", detail: "Sensitive identity details excluded", accent: "gold" },
    ],
    statusCards: cards,
  };
}

export function mapItinerary(bundle: Resolved<typeof getDashboardBundle>): ItineraryData {
  const todayIso = new Date().toISOString().slice(0, 10);
  const weatherByDay = preferredWeatherByDay(bundle.itinerary, bundle.weather);
  const shorePlansByDay = plansByDay(bundle.shorePlans);
  const dayGuidesByDay = guidesByDay(bundle.dayGuides);
  const days: ItineraryDay[] = bundle.itinerary.map(({ day, port }, index) => {
    const metadataStatus = statusFromConfidence(day.confidence);
    const accent = day.dayType === "sea" ? "aqua" : day.dayType === "embarkation" || day.dayType === "disembarkation" ? "gold" : index % 2 ? "coral" : "mist";
    const isOperationalTimesPending = day.dayType === "port" && !day.arrivalTime && !day.departureTime && !day.allAboardTime;
    const guideStatus = port?.overview ? "Guide ready" : "Guide pending";
    const weather = buildWeatherCardModelFromSnapshot({ day, port, snapshot: weatherByDay.get(day.id) });
    const readiness = assessDayReadiness({
      day,
      weather: weatherByDay.get(day.id),
      guide: dayGuidesByDay.get(day.id),
      plans: shorePlansByDay.get(day.id) ?? [],
      todayIso,
    });
    return {
      id: day.id, dayNumber: day.dayNumber, dateLabel: dateLabel(day.date), dayType: day.dayType as ItineraryDay["dayType"],
      title: port?.name ?? day.title ?? titleCase(day.dayType), portName: port?.name, country: undefined,
      arrivalTime: day.arrivalTime, departureTime: day.departureTime, allAboardTime: day.allAboardTime,
      planSummary: day.selectedShorePlanId ? "Selected shore plan held locally" : day.dayType === "port" ? "No shore plan selected yet" : day.dayType === "embarkation" ? "Embarkation, ship orientation and first bearings" : day.dayType === "disembarkation" ? "Disembarkation and onward travel notes" : "A day for the ship and horizon",
      enrichmentStatus: isOperationalTimesPending ? `${guideStatus} - Times need review` : guideStatus, isHighlighted: day.date >= todayIso && !bundle.itinerary.some(({ day: candidate }) => candidate.date >= todayIso && candidate.dayNumber < day.dayNumber), accent,
      confidence: { level: day.confidence?.confidence ?? "unknown" }, reviewStatus: metadataStatus,
      refreshStatus: { label: weather.readinessLabel, tone: weather.badgeTone },
      weather,
      readiness,
    };
  });
  const portDays = days.filter((day) => day.dayType === "port");
  return { sailingName: bundle.sailing.name, days, summary: { days: days.length, nights: Math.max(0, days.length - 1), ports: portDays.length, seaDays: days.filter((day) => day.dayType === "sea").length, embarkation: days[0]?.title ?? "Not recorded", disembarkation: days.at(-1)?.title ?? "Not recorded" } };
}

export function mapToday(bundle: Resolved<typeof getTodayGuideBundle>): TodayData | undefined {
  if (!("day" in bundle) || !bundle.day) return undefined;
  const { day, port, country, guide, weather, plans } = bundle;
  const isPreCruise = new Date(`${bundle.sailing.departureDate}T00:00:00`).getTime() > Date.now();
  const selected = plans.find((plan) => plan.id === day.selectedShorePlanId || plan.status === "selected" || plan.status === "booked");
  const backup = plans.find((plan) => plan.id === day.backupShorePlanId) ?? plans.find((plan) => plan.id !== selected?.id);
  const planStatus = statusFromConfidence(selected?.confidence);
  const weatherCard = buildWeatherCardModelFromSnapshot({ day, port, snapshot: weather });
  const readiness = assessDayReadiness({ day, weather, guide, plans });
  const notes: TodayConfidenceNote[] = [
    { id: "times", label: "Operational times", description: day.confidence?.sourceSummary ?? "Arrival, departure and all-aboard times need review before travel.", status: statusFromConfidence(day.confidence), confidence: { level: day.confidence?.confidence ?? "unknown" } },
    { id: "weather", label: "Weather", description: `${weatherCard.weatherTypeLabel}. ${weatherCard.contextMessage}`, status: { label: weatherCard.readinessLabel, tone: weatherCard.badgeTone }, confidence: { level: weatherCard.isVisitDateForecast ? "high" : weatherCard.weatherContext === "weather_now_in_port" ? "low" : "unknown", label: weatherCard.sourceLabel } },
    { id: "plan", label: "Shore plan", description: selected?.dataCaveat ?? "No shore plan selected yet.", status: planStatus, confidence: { level: selected?.confidence.confidence ?? "unknown" } },
    { id: "terminal", label: "Embarkation and terminal", description: port?.geo?.locationNotes ?? port?.cruiseLogisticsSummary ?? "Terminal and boarding detail remain pending.", status: statusFromConfidence(port?.confidence), confidence: { level: port?.confidence?.confidence ?? "unknown" } },
  ];
  const preCruiseChecklist: TodayData["checklist"] = [
    { id: "princess-material", label: "Check Princess material", note: "Use current booking and cruise line sources before travel" },
    { id: "terminal", label: "Confirm terminal", note: "Embarkation details are not confirmed here" },
    { id: "port-times", label: "Review port times", note: "Arrival, departure and all-aboard remain pending" },
    { id: "ship-guide", label: "Open ship guide", note: "Get first-day bearings before boarding" },
  ];
  return {
    currentDay: { dayNumber: day.dayNumber, dateLabel: longDateLabel(day.date), port: port?.name ?? day.title ?? "Port not recorded", country: country?.name ?? "Country not recorded", portSummary: isPreCruise ? `Your cruise day companion is preparing for embarkation on ${longDateLabel(bundle.sailing.departureDate)}. Guidebook areas are available now; operational details still need checking before travel.` : port?.overview ?? guide?.operationalSummary ?? "Local guide detail has not yet been enriched.", arrivalTime: day.arrivalTime ?? "Pending", allAboardTime: day.allAboardTime ?? "Pending", departureTime: day.departureTime ?? "Pending" },
    mode: isPreCruise ? "pre-cruise" : "cruise-day",
    nextStep: isPreCruise ? { label: "Worth opening next", title: "Explore the voyage route", body: "Scan every port call, sea day and review note before the sailing begins.", href: "#/itinerary" } : { label: "Worth opening next", title: "Open port guide", body: "Use the reusable guidebook for context, then rely on Today for sailing-specific timings.", href: "#/ports" },
    returnPlan: { latestSafeReturn: guide?.latestSafeReturnTime ?? "Not set", riskLevel: "medium", note: guide?.latestSafeReturnTime && day.allAboardTime ? `Aim to return by ${guide.latestSafeReturnTime}, ahead of the ${day.allAboardTime} all-aboard time.` : isPreCruise ? "Return-buffer advice becomes useful once port times and shore plans are reviewed." : "Set a safe local return time before leaving the ship." },
    readiness,
    weather: weatherCard,
    plans: { likely: selected?.summary ?? guide?.operationalSummary ?? (isPreCruise ? "Review guidebook readiness, port times, terminal arrangements and family priorities before travel." : "No likely shore plan selected."), backup: backup?.summary ?? (isPreCruise ? "Today becomes a live day companion once the sailing is active and a day plan exists." : "No backup shore plan selected."), status: planStatus },
    checklist: guide?.checklist?.length ? guide.checklist : isPreCruise ? preCruiseChecklist : [],
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
    const facts = factsObject(section.structuredFacts);
    return { id: presentation.id, index: String(index + 1).padStart(2, "0"), title: section.title, watchword: String(facts?.watchword ?? "Guide in progress"), summary: section.summary ?? "This local section has not yet been enriched.", nextStep: String(facts?.nextStep ?? presentation.nextStep), status, confidence: { level: section.confidence.confidence }, accent: presentation.accent };
  });
  const confidence = ship.confidence;
  const identityFacts = factsObject(sections.find((s) => s.sectionType === "identity")?.structuredFacts);
  return {
    hero: { name: ship.name, cruiseLine: cruiseLine?.name ?? "Cruise line not recorded", guideLabel: "Local ship handbook", character: ship.shipOverview ?? "Ship character guide pending. Start with orientation, dining, family fit and watchouts." },
    facts: [{ label: "Ship family", value: ship.shipClass ?? "Guide pending" }, { label: "Style", value: String(identityFacts?.style ?? "Guide in progress") }, { label: "Guide lens", value: "Lawrence family" }, { label: "Scope", value: "Reusable ship guide" }],
    enrichment: { completed: sections.length, total: 7, summary: `${sections.length} ship handbook sections are available, each with its own review and refresh state.`, nextPriority: sections.find((section) => section.confidence.refreshRecommended)?.title ?? "Review complete" },
    metadata: { confidence: confidence?.confidence ?? "unknown", reviewStatus: titleCase(confidence?.reviewStatus ?? "not_reviewed"), refreshStatus: confidence?.refreshRecommended ? "Refresh before sailing" : "No refresh requested", lastReviewed: reviewedLabel(confidence?.lastReviewedAt), recordScope: "Ship guidebook · not sailing-specific" },
    sections: mapped,
    caveat: ship.dataCaveat ?? "Local ship guide details should be checked before sailing.",
  };
}

function mapPortSection(section: EnrichmentSection | undefined, fallback: { id: PortGuideSectionData["id"]; eyebrow: string; title: string; body?: string }): PortGuideSectionData {
  const facts = factsObject(section?.structuredFacts);
  return { id: fallback.id, eyebrow: fallback.eyebrow, title: section?.title ?? fallback.title, body: section?.summary ?? fallback.body ?? "Guide pending. This port is ready for a concise cruise-relevant guidebook layer.", note: String(facts?.note ?? "Review current practical detail before travel."), status: statusFromConfidence(section?.confidence), confidence: { level: section?.confidence.confidence ?? "unknown" } };
}

export function mapPortGuide(bundle: Resolved<typeof getActivePortGuideBundle>): PortGuideData | undefined {
  if (!("guide" in bundle) || !bundle.guide) return undefined;
  const { port, country, attractions, enrichmentSections } = bundle.guide;
  const confidence = port.confidence;
  const section = (type: string) => enrichmentSections.find((item) => item.sectionType === type);
  const mappedAttractions: PortAttraction[] = attractions.map((attraction) => ({ id: attraction.id, name: attraction.name, category: titleCase(attraction.type ?? "possible story"), description: attraction.shortDescription ?? "Guide pending. Add a short family-relevant reason to consider this place.", familyNote: attraction.accessibilityNotes ?? `Family suitability: ${titleCase(attraction.familySuitability ?? "unknown")}.`, sebAngle: attraction.sebInterestSummary, status: { label: attraction.bookingRequired === "unknown" ? "Requirements unknown" : titleCase(attraction.bookingRequired ?? "needs review"), tone: attraction.bookingRequired === "unknown" ? "refresh" : "review" }, confidence: { level: attraction.confidence?.confidence ?? "unknown" } }));
  return {
    identity: { name: port.name, country: country?.name ?? "Country not recorded", region: port.region ?? "Region not recorded", flag: country?.flagEmoji ?? "🌍", guideLabel: "Illustrative port guidebook · local edition", overview: port.overview ?? "Port overview not yet enriched." },
    facts: [{ label: "Language", value: country?.primaryLanguage ?? "Not recorded" }, { label: "Currency", value: country?.currencyName ? `${country.currencyName}${country.currencyCode ? ` (${country.currencyCode})` : ""}` : "Not recorded" }, { label: "Port character", value: titleCase(port.portType ?? "unknown") }, { label: "Family pace", value: titleCase(port.returnRiskDefault ?? "unknown") }],
    metadata: { confidence: confidence?.confidence ?? "unknown", reviewStatus: titleCase(confidence?.reviewStatus ?? "not_reviewed"), refreshStatus: confidence?.refreshRecommended ? "Refresh before travel" : "No refresh requested", lastReviewed: reviewedLabel(confidence?.lastReviewedAt), recordScope: "Reusable port guidebook · not an itinerary day" },
    sections: [mapPortSection(section("logistics"), { id: "logistics", eyebrow: "Practical arrival", title: "Cruise logistics", body: port.cruiseLogisticsSummary }), mapPortSection(section("getting-around"), { id: "getting-around", eyebrow: "Finding a rhythm", title: "Getting around", body: port.gettingAroundSummary }), mapPortSection(section("food-culture"), { id: "food-culture", eyebrow: "A city with appetite", title: "Food and culture", body: port.foodCultureSummary })],
    attractions: mappedAttractions,
    familyLens: { title: "A family day with room to breathe", bestBalance: port.familySuitabilitySummary ?? "Choose one strong story and preserve a generous return margin.", sebDiscovery: String(factsObject(section("family-discovery")?.structuredFacts)?.thingToSpot ?? "Look for one landscape clue that explains the port."), status: statusFromConfidence(section("family-discovery")?.confidence ?? confidence), confidence: { level: section("family-discovery")?.confidence.confidence ?? confidence?.confidence ?? "unknown", label: "Family lens" } },
    photoPrompt: { prompt: port.photographySummary ?? "Choose a safe frame that captures the character of the port day.", caption: String(factsObject(section("photography")?.structuredFacts)?.caption ?? "A local story in one frame."), status: statusFromConfidence(section("photography")?.confidence ?? confidence), confidence: { level: section("photography")?.confidence.confidence ?? confidence?.confidence ?? "unknown" } },
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
