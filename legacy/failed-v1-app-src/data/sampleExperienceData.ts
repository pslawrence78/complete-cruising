import type { ConfidenceLevel } from "../components/status/ConfidenceChip";
import type { StatusTone } from "../components/status/StatusChip";

export interface TrustMetadata {
  confidence: { label?: string; level: ConfidenceLevel };
  review: { label: string; tone: StatusTone };
  refresh: { label: string; tone: StatusTone };
}

export interface ShorePlan {
  duration: string;
  familyFit: string;
  id: string;
  name: string;
  returnBuffer: string;
  returnRisk: "Lower" | "Medium" | "Higher";
  sebFit: string;
  selected: boolean;
  status: string;
  summary: string;
  transport: string;
  trust: TrustMetadata;
  type: string;
  weatherDependency: string;
}

const illustrativeTrust: TrustMetadata = {
  confidence: { label: "Illustrative guidance", level: "medium" },
  review: { label: "Needs family review", tone: "review" },
  refresh: { label: "Refresh before sailing", tone: "refresh" },
};

// Sailing-specific sample decision support, deliberately separate from the
// reusable Naples guidebook record in samplePortData.ts.
export const sampleShorePlans: readonly ShorePlan[] = [
  {
    id: "easy-city",
    name: "Naples at an easy pace",
    type: "Easy win · DIY city plan",
    summary: "A gentle historic-centre wander, harbour views and an unhurried pizza stop, with room to turn back early.",
    duration: "About 3½ hours",
    transport: "Walk · optional taxi return",
    familyFit: "Low effort with flexible pauses",
    sebFit: "Pizza, street details and volcano spotting",
    weatherDependency: "Comfortable in mild, dry weather",
    returnRisk: "Lower",
    returnBuffer: "Aim for 2½ hours",
    status: "Shortlisted backup",
    selected: false,
    trust: illustrativeTrust,
  },
  {
    id: "family-balance",
    name: "Stories, volcanoes & pizza",
    type: "Best family balance · Flexible city plan",
    summary: "A short historic route with Vesuvius context, lively streets and a flexible food stop—the richest day without overfilling it.",
    duration: "About 5 hours",
    transport: "Walk · metro only if useful",
    familyFit: "Variety, breaks and an easy exit route",
    sebFit: "A Roman mystery, a volcano challenge and lunch",
    weatherDependency: "Adapt route for heat or showers",
    returnRisk: "Medium",
    returnBuffer: "Aim for 2 hours",
    status: "Selected recommendation",
    selected: true,
    trust: illustrativeTrust,
  },
  {
    id: "pompeii",
    name: "Pompeii, properly explored",
    type: "Ambitious · Independent historic visit",
    summary: "A high-value visit to Pompeii with more travel, heat exposure and timing pressure than the city options.",
    duration: "About 7 hours",
    transport: "Rail or pre-arranged transfer",
    familyFit: "Rewarding, but long and exposed",
    sebFit: "Exceptional Roman-world learning; pacing matters",
    weatherDependency: "Strong heat and rain dependency",
    returnRisk: "Higher",
    returnBuffer: "Minimum 2 hours",
    status: "Ambitious alternative",
    selected: false,
    trust: { ...illustrativeTrust, confidence: { label: "Timing unconfirmed", level: "low" } },
  },
];

// Family-specific presentation using reusable Naples context; no private data.
export const sampleFamilyGuide = {
  place: "Naples, Italy",
  flag: "🇮🇹",
  phrase: { local: "Ciao", meaning: "Hello—or goodbye, depending on the moment." },
  geographyFact: "Naples curves around a broad bay in southern Italy, with Mount Vesuvius rising beyond the city.",
  thingToSpot: "Look for Vesuvius from the ship or harbour and trace its wide double-peaked outline.",
  quiz: { question: "Which famous Roman town was buried when Vesuvius erupted?", answer: "Pompeii." },
  memoryPrompt: "What made Naples feel different from the other ports on this sailing?",
  comfortNotes: [
    "Plan shade and water breaks in warm weather.",
    "Keep the route flexible if busy streets feel intense.",
    "Choose one strong story rather than trying to collect every sight.",
  ],
  sebChallenge: "Explain how a volcano can be both dangerous and useful to the landscape. Bonus: sketch Vesuvius from memory.",
  trust: illustrativeTrust,
};

export interface MemoryPrompt {
  id: string;
  label: string;
  prompt: string;
  response: string;
  tone: "aqua" | "coral" | "gold" | "paper";
}

// Sailing-specific illustrative prompts, not real family entries.
export const sampleMemories = {
  place: "Naples, Italy",
  day: "Day 2 · Port day",
  status: "Prompts ready · no memories captured",
  wouldReturn: "Undecided",
  almanacReadiness: "Preview ready · reflection incomplete",
  prompts: [
    { id: "reflection", label: "Daily reflection", prompt: "What surprised us most about Naples?", response: "Waiting for the family’s reflection after the day.", tone: "paper" },
    { id: "seb-favourite", label: "Seb favourite", prompt: "Which story, sight or taste would Seb tell someone about first?", response: "Illustrative prompt—not a recorded family answer.", tone: "aqua" },
    { id: "family-highlight", label: "Family highlight", prompt: "When did the day feel most like our adventure?", response: "Ready to capture one shared moment.", tone: "gold" },
    { id: "best-photo", label: "Best photo", prompt: "Choose the frame that carries the mood of Naples, not simply the biggest landmark.", response: "Photo selection remains empty in this preview.", tone: "coral" },
    { id: "food-memory", label: "Food memory", prompt: "What did we try, and what detail do we want to remember about it?", response: "Waiting for a real post-visit memory.", tone: "paper" },
  ] satisfies readonly MemoryPrompt[],
  trust: illustrativeTrust,
  exportPreview: {
    sailingName: "Sun Princess Mediterranean 2026",
    dayOrPort: "Day 2 · Naples",
    country: "Italy",
    ship: "Sun Princess",
    memorySummary: "A future family reflection on Naples, its streets, food and volcanic horizon.",
    sebLearningMoment: "How Vesuvius shaped the history and landscape around Naples.",
    bestPhotoPrompt: "The family’s chosen frame that best captures the character of the port day.",
    readiness: "Draft preview · memories required",
  },
};
