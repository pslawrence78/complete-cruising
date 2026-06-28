export type DashboardAccent = "aqua" | "gold" | "coral" | "mist";
export type DashboardSurface = "glass" | "paper";
export type DashboardStatusTone = "confirmed" | "review" | "refresh";
export type DashboardConfidenceLevel =
  | "confirmed"
  | "high"
  | "medium"
  | "low"
  | "inferred"
  | "unknown";

export interface RouteStop {
  id: string;
  name: string;
  kind: "port" | "sea";
}

export interface DashboardMetric {
  accent: DashboardAccent;
  detail: string;
  id: string;
  label: string;
  value: string;
}

export interface DashboardStatusCard {
  confidence: {
    label?: string;
    level: DashboardConfidenceLevel;
  };
  description: string;
  id:
    | "next-port"
    | "weather"
    | "documents"
    | "enrichment"
    | "family"
    | "memories";
  label: string;
  status: {
    label: string;
    tone: DashboardStatusTone;
  };
  surface: DashboardSurface;
  title: string;
}

export interface DashboardData {
  metrics: readonly DashboardMetric[];
  route: readonly RouteStop[];
  sailing: {
    cruiseLine: string;
    dateLabel: string;
    daysToEmbarkation: number;
    departureLabel: string;
    returnLabel: string;
    name: string;
    nights: number;
    ports: number;
    routeEnd: string;
    routeStart: string;
    seaDays: number;
    ship: string;
    status: "upcoming";
  };
  statusCards: readonly DashboardStatusCard[];
}

export const sampleDashboardData = {
  sailing: {
    name: "Sun Princess Mediterranean 2026",
    cruiseLine: "Princess Cruises",
    ship: "Sun Princess",
    routeStart: "Rome",
    routeEnd: "Barcelona",
    dateLabel: "August 2026",
    nights: 14,
    departureLabel: "15 Aug 2026",
    returnLabel: "29 Aug 2026",
    ports: 9,
    seaDays: 4,
    daysToEmbarkation: 58,
    status: "upcoming",
  },
  route: [
    { id: "civitavecchia", name: "Civitavecchia / Rome", kind: "port" },
    { id: "naples", name: "Naples", kind: "port" },
    { id: "sea-1", name: "Sea Day", kind: "sea" },
    { id: "souda-bay", name: "Souda Bay / Chania", kind: "port" },
    { id: "sea-2", name: "Sea Day", kind: "sea" },
    { id: "kusadasi", name: "Kusadasi / Ephesus", kind: "port" },
    { id: "mykonos", name: "Mykonos", kind: "port" },
    { id: "piraeus", name: "Athens / Piraeus", kind: "port" },
    { id: "santorini", name: "Santorini", kind: "port" },
    { id: "sea-3", name: "Sea Day", kind: "sea" },
    { id: "bar", name: "Bar, Montenegro", kind: "port" },
    { id: "corfu", name: "Corfu", kind: "port" },
    { id: "messina", name: "Messina", kind: "port" },
    { id: "sea-4", name: "Sea Day", kind: "sea" },
    { id: "barcelona", name: "Barcelona", kind: "port" },
  ],
  metrics: [
    {
      id: "countdown",
      value: "58",
      label: "days to embarkation",
      detail: "Fixed illustrative countdown",
      accent: "gold",
    },
    {
      id: "nights",
      value: "14",
      label: "nights",
      detail: "Aboard Sun Princess",
      accent: "aqua",
    },
    {
      id: "ports",
      value: "9",
      label: "ports",
      detail: "Guidebook calls to curate",
      accent: "coral",
    },
    {
      id: "sea-days",
      value: "4",
      label: "sea days",
      detail: "Time for ship discovery",
      accent: "mist",
    },
    {
      id: "ship-guide",
      value: "3 / 8",
      label: "ship guide packs",
      detail: "Identity and essentials started",
      accent: "aqua",
    },
    {
      id: "documents",
      value: "Planning",
      label: "documents readiness",
      detail: "Sensitive identity details excluded",
      accent: "gold",
    },
  ],
  statusCards: [
    {
      id: "next-port",
      label: "Next port to review",
      title: "Naples, Italy",
      description:
        "Cruise logistics started. Shore plan needs family review before it can be trusted onboard.",
      surface: "paper",
      status: { label: "Needs family review", tone: "review" },
      confidence: { label: "Medium confidence", level: "medium" },
    },
    {
      id: "weather",
      label: "Weather refresh window",
      title: "Forecasts pending",
      description:
        "Initial forecasts become useful inside the practical pre-travel window, then operational inside 48 hours.",
      surface: "glass",
      status: { label: "Needs refresh", tone: "refresh" },
      confidence: { label: "Climate guidance only", level: "inferred" },
    },
    {
      id: "documents",
      label: "Documents readiness",
      title: "Readiness, without private data",
      description:
        "Cruise readiness is being tracked without storing sensitive identity details or booking references.",
      surface: "glass",
      status: { label: "Planning started", tone: "review" },
      confidence: { label: "Scope confirmed", level: "confirmed" },
    },
    {
      id: "enrichment",
      label: "Enrichment confidence",
      title: "Trust stays visible",
      description:
        "Guidebook sections retain their confidence, review and refresh states as richer content is prepared.",
      surface: "paper",
      status: { label: "Needs review", tone: "review" },
      confidence: { level: "medium" },
    },
    {
      id: "family",
      label: "Family focus",
      title: "Seb discovery prompts ready",
      description:
        "Flags, phrases, geography facts and things to spot are ready to make each port day more memorable.",
      surface: "glass",
      status: { label: "Prompts drafted", tone: "confirmed" },
      confidence: { label: "Illustrative prompts", level: "medium" },
    },
    {
      id: "memories",
      label: "Memory capture readiness",
      title: "Daily reflections prepared",
      description:
        "Gentle prompts will help prepare an Adventure Almanac export after the sailing without building that workflow yet.",
      surface: "glass",
      status: { label: "Ready to capture", tone: "confirmed" },
      confidence: { level: "high" },
    },
  ],
} satisfies DashboardData;
