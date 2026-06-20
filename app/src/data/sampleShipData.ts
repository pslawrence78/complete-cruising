import type { ConfidenceLevel } from "../components/status/ConfidenceChip";
import type { StatusTone } from "../components/status/StatusChip";

export type ShipSectionAccent = "aqua" | "coral" | "gold" | "mist";

export interface ShipGuideSection {
  accent: ShipSectionAccent;
  confidence: {
    label?: string;
    level: ConfidenceLevel;
  };
  id:
    | "identity"
    | "orientation"
    | "dining"
    | "family"
    | "recreation"
    | "entertainment"
    | "watchouts";
  index: string;
  nextStep: string;
  status: {
    label: string;
    tone: StatusTone;
  };
  summary: string;
  title: string;
  watchword: string;
}

export interface ShipGuideData {
  caveat: string;
  enrichment: {
    completed: number;
    nextPriority: string;
    summary: string;
    total: number;
  };
  facts: readonly {
    label: string;
    value: string;
  }[];
  hero: {
    character: string;
    cruiseLine: string;
    guideLabel: string;
    name: string;
  };
  metadata: {
    confidence: ConfidenceLevel;
    lastReviewed: string;
    recordScope: string;
    refreshStatus: string;
    reviewStatus: string;
  };
  sections: readonly ShipGuideSection[];
}

export const sampleShipData = {
  hero: {
    name: "Sun Princess",
    cruiseLine: "Princess Cruises",
    guideLabel: "Illustrative ship handbook · v0.1",
    character:
      "A bright, contemporary resort ship shaped around dramatic public spaces, varied dining and plenty of ways to make a sea day feel like an occasion.",
  },
  facts: [
    { label: "Ship family", value: "Sphere class" },
    { label: "Style", value: "Contemporary resort" },
    { label: "Guide lens", value: "Lawrence family" },
    { label: "Record type", value: "Reusable ship guide" },
  ],
  enrichment: {
    completed: 2,
    total: 7,
    summary:
      "Identity and family-fit notes have the strongest sample coverage. Venue detail remains intentionally light.",
    nextPriority: "Dining inclusions and deck-by-deck orientation",
  },
  metadata: {
    confidence: "medium",
    reviewStatus: "Needs user review",
    refreshStatus: "Refresh before sailing",
    lastReviewed: "Illustrative review · June 2026",
    recordScope: "Ship guidebook · not sailing-specific",
  },
  sections: [
    {
      id: "identity",
      index: "01",
      title: "Identity and character",
      watchword: "Light-filled",
      summary:
        "Large and modern, with a polished resort mood and a stronger sense of theatre than a traditional small-ship experience.",
      nextStep: "Verify the final venue mix for this sailing season.",
      status: { label: "Reviewed sample", tone: "confirmed" },
      confidence: { level: "medium" },
      accent: "gold",
    },
    {
      id: "orientation",
      index: "02",
      title: "Layout and orientation",
      watchword: "Learn the spine",
      summary:
        "Start by finding the main atrium, the open-deck routes and the lift banks nearest the cabin. A first-day family circuit should make the scale friendlier.",
      nextStep: "Add a verified deck-by-deck quick route.",
      status: { label: "Outline started", tone: "review" },
      confidence: { level: "inferred" },
      accent: "aqua",
    },
    {
      id: "dining",
      index: "03",
      title: "Dining",
      watchword: "Choice needs a map",
      summary:
        "Expect a broad mix of relaxed and occasion dining. The useful guide will distinguish included, casual-extra and speciality choices before embarkation.",
      nextStep: "Confirm inclusions, booking rules and family-friendly timings.",
      status: { label: "Needs enrichment", tone: "refresh" },
      confidence: { level: "low" },
      accent: "coral",
    },
    {
      id: "family",
      index: "04",
      title: "Family and Seb suitability",
      watchword: "Strong sea-day fit",
      summary:
        "Promising for ship exploration, flexible food, pools and choosing a daily family highlight. Seb may enjoy turning orientation into a deck-finding challenge.",
      nextStep: "Check age rules, family spaces and programme details.",
      status: { label: "Reviewed sample", tone: "confirmed" },
      confidence: { label: "Likely fit", level: "medium" },
      accent: "gold",
    },
    {
      id: "recreation",
      index: "05",
      title: "Pools and recreation",
      watchword: "Plan the quiet hour",
      summary:
        "Open-deck recreation should be a sea-day strength, but the best family rhythm may come from visiting outside the busiest middle-of-day window.",
      nextStep: "Verify pool access, opening hours and age restrictions.",
      status: { label: "Needs user review", tone: "review" },
      confidence: { level: "low" },
      accent: "aqua",
    },
    {
      id: "entertainment",
      index: "06",
      title: "Entertainment",
      watchword: "Pick one headline",
      summary:
        "Treat the programme as a menu, not a mission. Choose one headline event, then leave enough space for an unplanned discovery around the ship.",
      nextStep: "Add sailing-specific schedules only in a later itinerary layer.",
      status: { label: "Framework only", tone: "review" },
      confidence: { level: "inferred" },
      accent: "mist",
    },
    {
      id: "watchouts",
      index: "07",
      title: "Tips and watchouts",
      watchword: "Book, buffer, breathe",
      summary:
        "Popular dining, headline venues and sunny sea-day areas may reward early planning. Keep the first afternoon deliberately spacious while everyone finds their bearings.",
      nextStep: "Confirm reservation windows and identify quieter alternatives.",
      status: { label: "Refresh before sailing", tone: "refresh" },
      confidence: { level: "medium" },
      accent: "coral",
    },
  ],
  caveat:
    "Illustrative sample only. Ship features, venue access, programmes and operating arrangements must be checked against current Princess Cruises information before use.",
} as const satisfies ShipGuideData;
