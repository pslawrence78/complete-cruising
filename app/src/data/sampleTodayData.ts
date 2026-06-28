export type TodayStatusTone = "confirmed" | "review" | "refresh";
export type TodayConfidenceLevel =
  | "confirmed"
  | "high"
  | "medium"
  | "low"
  | "inferred"
  | "unknown";

export interface TodayChecklistItem {
  id: string;
  label: string;
  note?: string;
}

export interface TodayConfidenceNote {
  confidence: {
    label?: string;
    level: TodayConfidenceLevel;
  };
  description: string;
  id: string;
  label: string;
  status: {
    label: string;
    tone: TodayStatusTone;
  };
}

export interface TodayData {
  checklist: readonly TodayChecklistItem[];
  confidenceNotes: readonly TodayConfidenceNote[];
  currentDay: {
    allAboardTime: string;
    arrivalTime: string;
    country: string;
    dateLabel: string;
    dayNumber: number;
    departureTime: string;
    port: string;
    portSummary: string;
  };
  mode: "pre-cruise" | "cruise-day";
  nextStep: {
    label: string;
    title: string;
    body: string;
    href: string;
  };
  local: {
    currency: string;
    language: string;
    phrase: string;
    phraseMeaning: string;
  };
  plans: {
    backup: string;
    likely: string;
    status: {
      label: string;
      tone: TodayStatusTone;
    };
  };
  returnPlan: {
    latestSafeReturn: string;
    note: string;
    riskLevel: "medium";
  };
  sebDiscovery: {
    fact: string;
    photoPrompt: string;
    prompt: string;
  };
  weather: {
    condition: string;
    confidence: TodayConfidenceLevel;
    highTemperature: string;
    planImpact: string;
    rainChance: string;
    refreshLabel: string;
  };
}

export const sampleTodayData = {
  currentDay: {
    dayNumber: 2,
    dateLabel: "August 2026 - date TBC",
    port: "Naples",
    country: "Italy",
    portSummary:
      "Gateway to Vesuvius, Roman history and proper Neapolitan pizza.",
    arrivalTime: "07:00",
    allAboardTime: "17:30",
    departureTime: "18:30",
  },
  mode: "cruise-day",
  nextStep: {
    label: "Open next",
    title: "Explore itinerary",
    body: "See the route shape and day-by-day review notes.",
    href: "#/itinerary",
  },
  returnPlan: {
    latestSafeReturn: "16:45",
    riskLevel: "medium",
    note: "Aim to be back in the port area with a calm 45-minute buffer before all aboard.",
  },
  weather: {
    condition: "Warm and dry",
    highTemperature: "29°C",
    rainChance: "10%",
    planImpact: "Shade, water and comfortable shoes are important.",
    refreshLabel: "Illustrative forecast - refresh closer to travel",
    confidence: "inferred",
  },
  plans: {
    likely:
      "Historic centre, harbour walk and a proper Neapolitan pizza stop, paced around shade and a comfortable return.",
    backup:
      "Shorter seafront walk and café stop if heat, tiredness or timing makes the city plan feel too ambitious.",
    status: { label: "Needs family review", tone: "review" },
  },
  checklist: [
    { id: "cruise-cards", label: "Cruise cards" },
    { id: "phone", label: "Phone" },
    { id: "charger", label: "Portable charger" },
    { id: "water", label: "Water" },
    { id: "sun-cream", label: "Sun cream" },
    { id: "hats", label: "Hats" },
    { id: "shoes", label: "Comfortable shoes" },
    { id: "payment", label: "Card or euros" },
    {
      id: "required-id",
      label: "Any required ID",
      note: "Confirm requirements before travel",
    },
  ],
  local: {
    language: "Italian",
    currency: "Euro (€)",
    phrase: "Buongiorno",
    phraseMeaning: "Good morning",
  },
  sebDiscovery: {
    prompt:
      "Look for Vesuvius above the city and work out why its shape mattered to Roman Naples.",
    fact:
      "Naples is one of Europe's oldest continuously inhabited urban areas.",
    photoPrompt:
      "Capture the harbour with Vesuvius in the distance if visibility allows.",
  },
  confidenceNotes: [
    {
      id: "times",
      label: "Port times",
      description:
        "Representative itinerary times only; confirm against booking and cruise line sources before travel.",
      status: { label: "Confirmation required", tone: "refresh" },
      confidence: { level: "medium" },
    },
    {
      id: "weather",
      label: "Weather",
      description:
        "This is a design sample, not a live forecast. Refresh inside the practical pre-travel window.",
      status: { label: "Needs refresh", tone: "refresh" },
      confidence: { label: "Illustrative only", level: "inferred" },
    },
    {
      id: "plan",
      label: "Likely plan",
      description:
        "Family-balanced concept only. Walking tolerance, heat and transport still need review.",
      status: { label: "Needs family review", tone: "review" },
      confidence: { level: "medium" },
    },
    {
      id: "terminal",
      label: "Terminal details",
      description:
        "Terminal, gangway and local access details have not been confirmed in this static tranche.",
      status: { label: "Refresh before travel", tone: "refresh" },
      confidence: { level: "unknown" },
    },
  ],
} satisfies TodayData;
