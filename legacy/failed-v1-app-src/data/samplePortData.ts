import type { WeatherCardModel } from "../features/weather/weatherTypes";
import type { ConfidenceLevel } from "../components/status/ConfidenceChip";
import type { StatusTone } from "../components/status/StatusChip";

export interface PortTrustMetadata {
  confidence: {
    label?: string;
    level: ConfidenceLevel;
  };
  status: {
    label: string;
    tone: StatusTone;
  };
}

export interface PortGuideSectionData extends PortTrustMetadata {
  body: string;
  eyebrow: string;
  id: string;
  note: string;
  title: string;
}

export interface PortAttraction extends PortTrustMetadata {
  category: string;
  description: string;
  familyNote: string;
  id: string;
  name: string;
  sebAngle?: string;
}

export interface PortGuideData {
  attractions: readonly PortAttraction[];
  caveat: string;
  facts: readonly {
    label: string;
    value: string;
  }[];
  familyLens: PortTrustMetadata & {
    bestBalance: string;
    sebDiscovery: string;
    title: string;
  };
  hints: PortTrustMetadata & {
    items: readonly string[];
  };
  identity: {
    country: string;
    flag: string;
    guideLabel: string;
    name: string;
    overview: string;
    region: string;
  };
  metadata: {
    confidence: ConfidenceLevel;
    lastReviewed: string;
    recordScope: string;
    refreshStatus: string;
    reviewStatus: string;
  };
  weather?: WeatherCardModel & {
    coordinatesLabel: string;
    seasonalitySummary: string;
  };
  photoPrompt: PortTrustMetadata & {
    caption: string;
    prompt: string;
  };
  sections: readonly PortGuideSectionData[];
}

export const samplePortData = {
  identity: {
    name: "Naples",
    country: "Italy",
    region: "Campania",
    flag: "IT",
    guideLabel: "Illustrative port guidebook v0.1",
    overview:
      "A vivid Mediterranean gateway where volcanic landscapes, Roman history and everyday Neapolitan life sit remarkably close together.",
  },
  facts: [
    { label: "Language", value: "Italian" },
    { label: "Currency", value: "Euro" },
    { label: "Port character", value: "City gateway" },
    { label: "Family pace", value: "Moderate" },
  ],
  metadata: {
    confidence: "medium",
    reviewStatus: "Needs user review",
    refreshStatus: "Refresh before travel",
    lastReviewed: "Illustrative review · June 2026",
    recordScope: "Reusable port guidebook · not an itinerary day",
  },
  weather: {
    confidenceLabel: "Inferred confidence",
    confidenceLevel: "inferred",
    state: "climate_expectation",
    stateLabel: "Context only",
    readinessState: "forecast_pending",
    readinessLabel: "Forecast pending",
    badgeLabel: "Climate context",
    badgeTone: "review",
    summary: "Seasonal expectation only",
    contextMessage: "Seasonal guidance is visible for Naples while live visit-date weather is still pending.",
    portName: "Naples",
    visitDate: "2026-08-16",
    visitDateLabel: "16 August 2026",
    weatherDateLabel: "Not refreshed yet",
    weatherTypeLabel: "Climate context",
    weatherContext: "climate_context",
    sourceName: "Local seasonality notes",
    temperatureLabel: "Pending / Pending",
    rainLabel: "Rain pending",
    windLabel: "Wind pending",
    comfortSummary: "Seasonal notes help set the tone, but a live forecast will be better later.",
    clothingGuidance: "Pack flexible layers for the weather window.",
    planImpact: "Seasonal notes only for now.",
    sourceLabel: "Local seasonality notes",
    attributionLabel: "Weather data by Open-Meteo",
    updatedLabel: "Not refreshed yet",
    refreshLabel: "Refresh weather",
    refreshState: "ready",
    canRefresh: false,
    buttonState: "unavailable",
    isVisitDateForecast: false,
    satisfiesVisitForecastReadiness: false,
    coordinatesLabel: "Approximate port area only",
    seasonalitySummary: "Typical Mediterranean warmth, with stronger sun and a sensible shade plan in the warmer months.",
  },
  sections: [
    {
      id: "logistics",
      eyebrow: "Practical arrival",
      title: "Cruise logistics",
      body:
        "The sample guide treats Naples as a potentially convenient city port, while deliberately leaving the berth, terminal route and walking access unconfirmed.",
      note:
        "Confirm the arrival point, terminal arrangements and all-aboard instructions from current sailing information.",
      status: { label: "Needs refresh", tone: "refresh" },
      confidence: { level: "low" },
    },
    {
      id: "getting-around",
      eyebrow: "Finding a rhythm",
      title: "Getting around",
      body:
        "Central exploration may suit a flexible walking day; Pompeii, Herculaneum and coastal ideas would need a more disciplined transport plan and return buffer.",
      note:
        "No transport mode, journey time, ticket or service frequency is confirmed in this preview.",
      status: { label: "Transport unverified", tone: "refresh" },
      confidence: { level: "inferred" },
    },
    {
      id: "food-culture",
      eyebrow: "A city with appetite",
      title: "Food and culture",
      body:
        "Pizza, espresso, street-level energy and layers of Greek, Roman and Spanish history offer a rich cultural thread without needing an overfilled schedule.",
      note:
        "Treat venue names, availability, queues and dietary suitability as research prompts rather than recommendations.",
      status: { label: "Editorial sample", tone: "review" },
      confidence: { level: "medium" },
    },
  ],
  attractions: [
    {
      id: "pompeii",
      name: "Pompeii",
      category: "Roman history",
      description:
        "A possible headline choice for seeing an ancient city in the shadow of Vesuvius; it would require careful independent verification and time planning.",
      familyNote: "Potentially rewarding, but substantial walking and exposure should be considered.",
      sebAngle: "Look for clues about how Roman families lived day to day.",
      status: { label: "Requirements unknown", tone: "refresh" },
      confidence: { level: "medium" },
    },
    {
      id: "herculaneum",
      name: "Herculaneum",
      category: "Archaeology",
      description:
        "A compact-feeling alternative in the same volcanic story, presented here only as an illustrative research lead.",
      familyNote: "Could offer a focused history visit if access and transport prove suitable.",
      sebAngle: "Compare what volcanic material preserved here with Pompeii.",
      status: { label: "Requirements unknown", tone: "refresh" },
      confidence: { level: "inferred" },
    },
    {
      id: "historic-centre",
      name: "Historic centre",
      category: "City character",
      description:
        "A possible route through lively streets, churches, courtyards and food culture, with the day shaped by curiosity rather than a rigid checklist.",
      familyNote: "Build in shade, pauses and a simple turnaround point.",
      status: { label: "Needs route review", tone: "review" },
      confidence: { level: "medium" },
    },
    {
      id: "seafront",
      name: "Seafront and castle views",
      category: "Harbour atmosphere",
      description:
        "A slower illustrative option for sea air, broad views and a sense of Naples between the bay and Vesuvius.",
      familyNote: "Potentially well suited to a lower-pressure city day.",
      status: { label: "Access unverified", tone: "review" },
      confidence: { level: "inferred" },
    },
  ],
  familyLens: {
    title: "A family day with room to breathe",
    bestBalance:
      "Choose one main story - Roman history or central Naples - then add shade, food and an intentionally generous return margin.",
    sebDiscovery:
      "Can Seb spot three ways the volcano has shaped the city: its skyline, its history and the stone beneath the streets?",
    status: { label: "Family lens reviewed", tone: "confirmed" },
    confidence: { label: "Likely fit", level: "medium" },
  },
  photoPrompt: {
    prompt:
      "Frame Seb against the harbour with Vesuvius in the distance - only if visibility and a safe stopping place make the composition possible.",
    caption: "Bay, city, volcano: three layers in one family photograph.",
    status: { label: "Creative prompt", tone: "review" },
    confidence: { level: "inferred" },
  },
  hints: {
    items: [
      "Keep a clear turnaround point; no sample journey time should set the return plan.",
      "Expect heat, uneven surfaces, crowds or closures to change the family pace.",
      "Verify attraction entry requirements and transport arrangements close to travel.",
      "Use the sailing-specific Today view, not this reusable guide, for confirmed ship times.",
    ],
    status: { label: "Refresh all practical detail", tone: "refresh" },
    confidence: { level: "low" },
  },
  caveat:
    "Illustrative sample only. No berth, terminal, transport, journey time, opening time, ticket, attraction requirement or port-day timing is confirmed.",
} as const satisfies PortGuideData;
