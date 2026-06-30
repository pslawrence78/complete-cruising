import { ImportBatchSchema } from "../../schemas";
import { db, type CompleteCruisingDb, type ImportBatch } from "../../db/completeCruisingDb";
import type {
  ConfidenceMetadata,
  DayGuide,
  EnrichmentSection,
  ItineraryDayRecord,
  Port,
  Sailing,
  Ship,
  ShorePlanRecord,
} from "../../types";
import { z } from "zod";

const GuideSectionTypeSchema = z.enum([
  "identity",
  "logistics",
  "getting_around",
  "highlights",
  "family_lens",
  "food_culture",
  "photography",
  "hints_watchouts",
  "weather_seasonality",
  "shore_plans",
  "dining",
  "layout",
  "entertainment",
  "pools_recreation",
  "practical_tips",
  "seb_discovery",
  "day_guide",
]);

const GuideFactSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
}).strict();

const GuideSectionSchema = z.object({
  sectionType: GuideSectionTypeSchema,
  title: z.string().trim().min(1),
  shortSummary: z.string().trim().min(1),
  facts: z.array(GuideFactSchema).optional(),
  guidance: z.array(z.string().trim().min(1)).optional(),
  familyRelevance: z.array(z.string().trim().min(1)).optional(),
  sebDiscovery: z.object({
    flag: z.string().trim().min(1).optional(),
    localPhrase: z.string().trim().min(1).optional(),
    geographyFact: z.string().trim().min(1).optional(),
    thingToSpot: z.string().trim().min(1).optional(),
    quizQuestion: z.string().trim().min(1).optional(),
    quizAnswer: z.string().trim().min(1).optional(),
  }).strict().optional(),
  watchouts: z.array(z.string().trim().min(1)).optional(),
  photoPrompts: z.array(z.string().trim().min(1)).optional(),
  nextActions: z.array(z.string().trim().min(1)).optional(),
}).strict();

const GuidePackSchema = z.object({
  schema: z.literal("complete-cruising-guide-pack-v1"),
  schemaVersion: z.literal(1),
  createdAt: z.string().datetime({ offset: true }),
  source: z.string().trim().min(1),
  target: z.object({
    type: z.enum(["ship", "port", "itinerary_day", "sailing", "shore_plan"]),
    name: z.string().trim().min(1),
    id: z.string().trim().min(1).optional(),
    sailingName: z.string().trim().min(1).optional(),
    portName: z.string().trim().min(1).optional(),
    dayNumber: z.number().int().positive().optional(),
  }).strict(),
  guide: z.object({
    title: z.string().trim().min(1),
    shortSummary: z.string().trim().min(1),
    sections: z.array(GuideSectionSchema).min(1),
  }).strict(),
  metadata: z.object({
    confidence: z.enum(["confirmed", "high", "medium", "low", "inferred", "unknown"]),
    reviewStatus: z.enum(["not_reviewed", "needs_user_review", "reviewed", "verified"]),
    refreshRecommended: z.boolean(),
    refreshReason: z.string().trim().min(1).optional(),
    sourceTypesUsed: z.array(z.enum([
      "official_source",
      "reputable_travel_source",
      "cruise_line_source",
      "family_note",
      "generated",
      "other",
    ])).min(1),
  }).strict(),
}).strict();

export type GuidePack = z.infer<typeof GuidePackSchema>;
export type GuideLoaderKind = "ship" | "port" | "day_guide" | "shore_plan" | "sailing";

export interface GuideLoaderTargetRef {
  kind: GuideLoaderKind;
  id: string;
}

interface ResolvedGuideTarget {
  label: string;
  entityId: string;
  entityName: string;
  entityType: EnrichmentSection["entityType"];
  kind: GuideLoaderKind;
  importKind: ImportBatch["kind"];
  affectedAreas: string[];
  existing?: Ship | Port | DayGuide | ShorePlanRecord | Sailing;
  port?: Port;
  day?: ItineraryDayRecord;
  sailing?: Sailing;
  ship?: Ship;
}

export interface GuideLoaderPreviewResult {
  status: "idle" | "parse_error" | "invalid" | "valid";
  summary: string;
  targetLabel?: string;
  targetKind?: string;
  affectedAreas: string[];
  sections: Array<{
    id: string;
    title: string;
    sectionType: string;
    destination: string;
    action: "add" | "update";
  }>;
  protectedFieldWarnings: string[];
  technicalDetails: string[];
  errors: string[];
  commitPlan?: GuideLoaderCommitPlan;
}

interface GuideLoaderCommitPlan {
  importKind: ImportBatch["kind"];
  payload: GuidePack;
  target: ResolvedGuideTarget;
  records: Array<{ tableName: "ships" | "ports" | "dayGuides" | "shorePlans" | "sailings" | "enrichmentSections"; value: any }>;
  createdCount: number;
  updatedCount: number;
  protectedFieldWarnings: string[];
}

export interface GuideLoaderCommitResult {
  status: "committed" | "blocked" | "failed";
  message: string;
  visibleAreas: string[];
  batch?: ImportBatch;
}

function toTitleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function factKey(label: string) {
  const words = label
    .trim()
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

function factsObject(facts: GuidePack["guide"]["sections"][number]["facts"]) {
  return Object.fromEntries((facts ?? []).map((fact) => [factKey(fact.label), fact.value]));
}

function buildConfidence(payload: GuidePack): ConfidenceMetadata {
  return {
    confidence: payload.metadata.confidence,
    reviewStatus: payload.metadata.reviewStatus,
    sourceType: payload.metadata.sourceTypesUsed.includes("family_note")
      ? "family_note"
      : payload.metadata.sourceTypesUsed.includes("cruise_line_source")
        ? "cruise_line_confirmed"
        : payload.metadata.sourceTypesUsed.includes("official_source")
          ? "researched"
          : payload.metadata.sourceTypesUsed.includes("reputable_travel_source")
            ? "researched"
            : "inferred",
    sourceSummary: `${payload.source} guide pack`,
    lastReviewedAt:
      payload.metadata.reviewStatus === "reviewed" || payload.metadata.reviewStatus === "verified"
        ? payload.createdAt
        : null,
    refreshRecommended: payload.metadata.refreshRecommended,
    refreshReason: payload.metadata.refreshReason,
  };
}

function normaliseShipSectionType(sectionType: GuidePack["guide"]["sections"][number]["sectionType"]) {
  switch (sectionType) {
    case "layout":
      return "orientation";
    case "family_lens":
    case "seb_discovery":
      return "family";
    case "pools_recreation":
      return "recreation";
    case "practical_tips":
    case "hints_watchouts":
      return "watchouts";
    default:
      return sectionType;
  }
}

function normalisePortSectionType(sectionType: GuidePack["guide"]["sections"][number]["sectionType"]) {
  switch (sectionType) {
    case "logistics":
      return "logistics";
    case "getting_around":
      return "getting-around";
    case "family_lens":
    case "seb_discovery":
      return "family-discovery";
    case "food_culture":
      return "food-culture";
    case "hints_watchouts":
      return "hints-watchouts";
    case "weather_seasonality":
      return "weather-seasonality";
    case "shore_plans":
      return "shore-plans";
    default:
      return sectionType;
  }
}

function buildSectionSummary(section: GuidePack["guide"]["sections"][number]) {
  return [
    section.shortSummary,
    ...(section.guidance ?? []),
    ...(section.familyRelevance ?? []),
    ...(section.watchouts ?? []),
    ...(section.nextActions ?? []),
  ].join(" ");
}

function buildSectionRecord(
  payload: GuidePack,
  target: ResolvedGuideTarget,
  section: GuidePack["guide"]["sections"][number],
  sectionIndex: number,
): EnrichmentSection {
  const now = new Date().toISOString();
  return {
    id: `${target.entityType}-${target.entityId}-${slugify(section.sectionType)}-${String(sectionIndex + 1).padStart(2, "0")}`,
    entityType: target.entityType,
    entityId: target.entityId,
    sectionType:
      target.kind === "ship"
        ? normaliseShipSectionType(section.sectionType)
        : target.kind === "port"
          ? normalisePortSectionType(section.sectionType)
          : section.sectionType,
    title: section.title,
    summary: section.shortSummary,
    structuredFacts: {
      ...factsObject(section.facts),
      ...(section.sebDiscovery?.thingToSpot ? { thingToSpot: section.sebDiscovery.thingToSpot } : {}),
      ...(section.photoPrompts?.[0] ? { caption: section.photoPrompts[0] } : {}),
    },
    practicalGuidance: section.guidance,
    familyRelevance: section.familyRelevance,
    watchouts: section.watchouts,
    suggestedNextActions: section.nextActions,
    confidence: buildConfidence(payload),
    audit: {
      createdAt: now,
      updatedAt: now,
      createdBy: "guide-loader",
      updatedBy: "guide-loader",
    },
  };
}

function isProtectedRecord(confidence?: ConfidenceMetadata) {
  return confidence?.reviewStatus === "reviewed" || confidence?.reviewStatus === "verified";
}

function protectedWarning(label: string, field: string) {
  return `${label}: kept existing ${field} because the local value is already trusted.`;
}

async function resolveTarget(
  payload: GuidePack,
  targetRef: GuideLoaderTargetRef | undefined,
  database: CompleteCruisingDb,
): Promise<ResolvedGuideTarget | undefined> {
  const selectedKind = targetRef?.kind
    ?? (payload.target.type === "itinerary_day" ? "day_guide" : payload.target.type);

  if (selectedKind === "ship") {
    const ship = targetRef?.id
      ? await database.ships.get(targetRef.id)
      : payload.target.id
        ? await database.ships.get(payload.target.id)
        : await database.ships
          .filter((candidate) => candidate.name.toLowerCase() === payload.target.name.toLowerCase())
          .first();
    if (!ship) return undefined;
    return {
      kind: "ship",
      entityId: ship.id,
      entityName: ship.name,
      entityType: "ship",
      importKind: "ship_enrichment",
      label: ship.name,
      ship,
      existing: ship,
      affectedAreas: ["Ship"],
    };
  }

  if (selectedKind === "sailing") {
    const sailing = targetRef?.id
      ? await database.sailings.get(targetRef.id)
      : payload.target.id
        ? await database.sailings.get(payload.target.id)
        : await database.sailings
          .filter((candidate) => candidate.name.toLowerCase() === payload.target.name.toLowerCase())
          .first();
    if (!sailing) return undefined;
    return {
      kind: "sailing",
      entityId: sailing.id,
      entityName: sailing.name,
      entityType: "sailing",
      importKind: "sailing_shell",
      label: sailing.name,
      sailing,
      existing: sailing,
      affectedAreas: ["Dashboard", "More"],
    };
  }

  if (selectedKind === "port") {
    const port = targetRef?.id
      ? await database.ports.get(targetRef.id)
      : payload.target.id
        ? await database.ports.get(payload.target.id)
        : await database.ports
          .filter((candidate) => candidate.name.toLowerCase() === (payload.target.portName ?? payload.target.name).toLowerCase())
          .first();
    if (!port) return undefined;
    return {
      kind: "port",
      entityId: port.id,
      entityName: port.name,
      entityType: "port",
      importKind: "port_enrichment",
      label: port.name,
      port,
      existing: port,
      affectedAreas: ["Ports", "Port detail"],
    };
  }

  const day = targetRef?.id
    ? await database.itineraryDays.get(targetRef.id)
    : payload.target.id
      ? await database.itineraryDays.get(payload.target.id)
      : payload.target.dayNumber
        ? await database.itineraryDays
          .filter((candidate) => candidate.dayNumber === payload.target.dayNumber)
          .first()
        : undefined;

  if (!day) return undefined;

  const [port, sailing] = await Promise.all([
    day.portId ? database.ports.get(day.portId) : undefined,
    database.sailings.get(day.sailingId),
  ]);

  if (selectedKind === "shore_plan") {
    return {
      kind: "shore_plan",
      entityId: day.id,
      entityName: `Day ${day.dayNumber}`,
      entityType: "itinerary_day",
      importKind: "shore_plan",
      label: `Day ${day.dayNumber}${port ? ` · ${port.name}` : ""}`,
      day,
      port,
      sailing,
      affectedAreas: ["Plans", "Today", "Itinerary"],
    };
  }

  const existingGuide = day.dayGuideId
    ? await database.dayGuides.get(day.dayGuideId)
    : await database.dayGuides.where("itineraryDayId").equals(day.id).first();

  return {
    kind: "day_guide",
    entityId: day.id,
    entityName: `Day ${day.dayNumber}`,
    entityType: "itinerary_day",
    importKind: "day_guide",
    label: `Day ${day.dayNumber}${port ? ` · ${port.name}` : ""}`,
    day,
    port,
    sailing,
    existing: existingGuide,
    affectedAreas: ["Today", "Itinerary"],
  };
}

function buildPatchedShip(
  existing: Ship,
  payload: GuidePack,
  warnings: string[],
) {
  const next = { ...existing };
  const confidence = buildConfidence(payload);
  if (!next.shipOverview || !isProtectedRecord(existing.confidence)) {
    next.shipOverview = payload.guide.shortSummary;
  } else if (next.shipOverview !== payload.guide.shortSummary) {
    warnings.push(protectedWarning(existing.name, "ship overview"));
  }

  const familySection = payload.guide.sections.find((section) =>
    section.sectionType === "family_lens" || section.sectionType === "seb_discovery",
  );
  if (familySection) {
    if (!next.familySuitabilitySummary || !isProtectedRecord(existing.confidence)) {
      next.familySuitabilitySummary = familySection.shortSummary;
    } else if (next.familySuitabilitySummary !== familySection.shortSummary) {
      warnings.push(protectedWarning(existing.name, "family summary"));
    }
  }

  const watchouts = payload.guide.sections.find((section) =>
    section.sectionType === "practical_tips" || section.sectionType === "hints_watchouts",
  );
  if (watchouts) {
    if (!next.watchoutsSummary || !isProtectedRecord(existing.confidence)) {
      next.watchoutsSummary = watchouts.shortSummary;
    } else if (next.watchoutsSummary !== watchouts.shortSummary) {
      warnings.push(protectedWarning(existing.name, "watchouts summary"));
    }
  }

  if (!isProtectedRecord(existing.confidence)) {
    next.confidence = confidence;
  }

  next.audit = {
    ...existing.audit,
    updatedAt: payload.createdAt,
    updatedBy: "guide-loader",
  };
  return next;
}

function buildPatchedPort(
  existing: Port,
  payload: GuidePack,
  warnings: string[],
) {
  const next = { ...existing };
  const confidence = buildConfidence(payload);
  const protectedRecord = isProtectedRecord(existing.confidence);
  const assign = (field: keyof Port, value: string | undefined, label: string) => {
    if (!value) return;
    if (!next[field] || !protectedRecord) {
      (next[field] as string | undefined) = value;
      return;
    }
    if (next[field] !== value) warnings.push(protectedWarning(existing.name, label));
  };

  assign("overview", payload.guide.shortSummary, "overview");
  assign("cruiseLogisticsSummary", payload.guide.sections.find((section) => section.sectionType === "logistics")?.shortSummary, "logistics summary");
  assign("gettingAroundSummary", payload.guide.sections.find((section) => section.sectionType === "getting_around")?.shortSummary, "getting around summary");
  assign("familySuitabilitySummary", payload.guide.sections.find((section) => section.sectionType === "family_lens" || section.sectionType === "seb_discovery")?.shortSummary, "family summary");
  assign("foodCultureSummary", payload.guide.sections.find((section) => section.sectionType === "food_culture")?.shortSummary, "food and culture summary");
  assign("photographySummary", payload.guide.sections.find((section) => section.sectionType === "photography")?.shortSummary, "photography summary");
  assign("hintsTipsSummary", payload.guide.sections.find((section) => section.sectionType === "hints_watchouts")?.shortSummary, "hints summary");
  assign("weatherSeasonalitySummary", payload.guide.sections.find((section) => section.sectionType === "weather_seasonality")?.shortSummary, "weather summary");

  if (!protectedRecord) next.confidence = confidence;
  next.audit = {
    ...existing.audit,
    updatedAt: payload.createdAt,
    updatedBy: "guide-loader",
  };
  return next;
}

function buildDayGuideRecord(
  target: ResolvedGuideTarget,
  payload: GuidePack,
  warnings: string[],
): DayGuide {
  const existing = target.existing as DayGuide | undefined;
  const confidence = buildConfidence(payload);
  const protectedRecord = isProtectedRecord(existing?.confidence);
  const checklist = payload.guide.sections.flatMap((section) =>
    (section.nextActions ?? []).map((action, index) => ({
      id: `${slugify(action) || "action"}-${index + 1}`,
      label: action,
    })),
  );
  const sebSection = payload.guide.sections.find((section) => section.sebDiscovery);

  const base: DayGuide = existing ?? {
    id: `day-guide-${target.day!.id}`,
    sailingId: target.day!.sailingId,
    itineraryDayId: target.day!.id,
    title: payload.guide.title,
    confidence,
    audit: {
      createdAt: payload.createdAt,
      updatedAt: payload.createdAt,
      createdBy: "guide-loader",
      updatedBy: "guide-loader",
    },
  };

  if (!existing || !protectedRecord) {
    base.title = payload.guide.title;
    base.operationalSummary = [
      payload.guide.shortSummary,
      ...payload.guide.sections.map((section) => section.shortSummary),
    ].join(" ");
    base.checklist = checklist.length ? checklist : base.checklist;
    base.localContext = {
      language: base.localContext?.language,
      currency: base.localContext?.currency,
      phrase: sebSection?.sebDiscovery?.localPhrase ?? base.localContext?.phrase,
      phraseMeaning: sebSection?.sebDiscovery?.quizQuestion ?? base.localContext?.phraseMeaning,
    };
    base.sebDiscovery = sebSection?.sebDiscovery ? {
      prompt: sebSection.sebDiscovery.thingToSpot ?? sebSection.shortSummary,
      fact: sebSection.sebDiscovery.geographyFact ?? sebSection.sebDiscovery.quizAnswer,
      photoPrompt: sebSection.photoPrompts?.[0],
    } : base.sebDiscovery;
    base.confidence = confidence;
  } else if (existing.title !== payload.guide.title || existing.operationalSummary !== payload.guide.shortSummary) {
    warnings.push(protectedWarning(target.label, "day guide"));
  }

  base.audit = {
    ...base.audit,
    updatedAt: payload.createdAt,
    updatedBy: "guide-loader",
  };
  return base;
}

function buildShorePlanRecord(
  target: ResolvedGuideTarget,
  payload: GuidePack,
  warnings: string[],
): ShorePlanRecord {
  const confidence = buildConfidence(payload);
  const existing = target.existing as ShorePlanRecord | undefined;
  const protectedRecord = isProtectedRecord(existing?.confidence);
  const base: ShorePlanRecord = existing ?? {
    id: `shore-plan-${target.day!.id}-${slugify(payload.guide.title)}`,
    sailingId: target.day!.sailingId,
    itineraryDayId: target.day!.id,
    name: payload.guide.title,
    type: "diy",
    status: "shortlisted",
    returnRisk: "medium",
    weatherDependency: "medium",
    confidence,
    audit: {
      createdAt: payload.createdAt,
      updatedAt: payload.createdAt,
      createdBy: "guide-loader",
      updatedBy: "guide-loader",
    },
  };

  if (!existing || !protectedRecord) {
    base.name = payload.guide.title;
    base.summary = [
      payload.guide.shortSummary,
      ...payload.guide.sections.map((section) => buildSectionSummary(section)),
    ].join(" ");
    base.transportSummary = payload.guide.sections.find((section) => section.sectionType === "logistics" || section.sectionType === "getting_around")?.shortSummary ?? base.transportSummary;
    base.sebFitSummary = payload.guide.sections.find((section) => section.sectionType === "family_lens" || section.sectionType === "seb_discovery")?.shortSummary ?? base.sebFitSummary;
    base.confidence = confidence;
  } else if (existing.summary !== payload.guide.shortSummary) {
    warnings.push(protectedWarning(target.label, "shore plan summary"));
  }

  base.audit = {
    ...base.audit,
    updatedAt: payload.createdAt,
    updatedBy: "guide-loader",
  };
  return base;
}

function buildSailingRecord(
  target: ResolvedGuideTarget,
  payload: GuidePack,
  warnings: string[],
): Sailing {
  const existing = target.existing as Sailing;
  const next = { ...existing };
  if (!next.planningSummary || !isProtectedRecord(existing.confidence)) {
    next.planningSummary = payload.guide.shortSummary;
  } else if (next.planningSummary !== payload.guide.shortSummary) {
    warnings.push(protectedWarning(existing.name, "planning summary"));
  }

  if (!isProtectedRecord(existing.confidence)) {
    next.confidence = buildConfidence(payload);
  }

  next.audit = {
    ...existing.audit,
    updatedAt: payload.createdAt,
    updatedBy: "guide-loader",
  };
  return next;
}

function batchId(kind: ImportBatch["kind"], timestamp: string) {
  return `guide-loader-${kind}-${timestamp.replace(/[^0-9]/g, "")}`;
}

function buildCommitPlan(payload: GuidePack, target: ResolvedGuideTarget): GuideLoaderCommitPlan {
  const protectedFieldWarnings: string[] = [];
  const sections = payload.guide.sections.map((section, index) => buildSectionRecord(payload, target, section, index));
  const records: GuideLoaderCommitPlan["records"] = sections.map((section) => ({
    tableName: "enrichmentSections",
    value: section,
  }));

  if (target.kind === "ship" && target.ship) {
    records.unshift({
      tableName: "ships",
      value: buildPatchedShip(target.ship, payload, protectedFieldWarnings),
    });
  } else if (target.kind === "port" && target.port) {
    records.unshift({
      tableName: "ports",
      value: buildPatchedPort(target.port, payload, protectedFieldWarnings),
    });
  } else if (target.kind === "day_guide") {
    records.unshift({
      tableName: "dayGuides",
      value: buildDayGuideRecord(target, payload, protectedFieldWarnings),
    });
  } else if (target.kind === "shore_plan") {
    records.unshift({
      tableName: "shorePlans",
      value: buildShorePlanRecord(target, payload, protectedFieldWarnings),
    });
  } else if (target.kind === "sailing") {
    records.unshift({
      tableName: "sailings",
      value: buildSailingRecord(target, payload, protectedFieldWarnings),
    });
  }

  return {
    importKind: target.importKind,
    payload,
    target,
    records,
    createdCount: 0,
    updatedCount: 0,
    protectedFieldWarnings,
  };
}

async function classifyGuidePlanRecords(
  plan: GuideLoaderCommitPlan,
  database: CompleteCruisingDb,
) {
  let createdCount = 0;
  let updatedCount = 0;

  for (const record of plan.records) {
    const existing = await database.table(record.tableName).get(record.value.id);
    if (existing) updatedCount += 1;
    else createdCount += 1;
  }

  return {
    ...plan,
    createdCount,
    updatedCount,
  };
}

export async function createGuidePackPreview(
  json: string,
  targetRef?: GuideLoaderTargetRef,
  database: CompleteCruisingDb = db,
): Promise<GuideLoaderPreviewResult> {
  if (!json.trim()) {
    return {
      status: "idle",
      summary: "Paste a guide pack to begin.",
      affectedAreas: [],
      sections: [],
      protectedFieldWarnings: [],
      technicalDetails: [],
      errors: [],
    };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (error) {
    return {
      status: "parse_error",
      summary: "The pasted text is not valid JSON.",
      affectedAreas: [],
      sections: [],
      protectedFieldWarnings: [],
      technicalDetails: [],
      errors: [error instanceof Error ? error.message : "Check brackets, commas and quotation marks."],
    };
  }

  const parsed = GuidePackSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "invalid",
      summary: "The guide pack shape is incomplete or invalid.",
      affectedAreas: [],
      sections: [],
      protectedFieldWarnings: [],
      technicalDetails: parsed.error.issues.map((issue) => `${issue.path.join(".") || "payload"}: ${issue.message}`),
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const payload = parsed.data;
  const resolvedTarget = await resolveTarget(payload, targetRef, database);
  if (!resolvedTarget) {
    return {
      status: "invalid",
      summary: "Complete Cruising could not match that target safely.",
      affectedAreas: [],
      sections: [],
      protectedFieldWarnings: [],
      technicalDetails: [
        `Requested target type: ${payload.target.type}`,
        `Requested target name: ${payload.target.name}`,
      ],
      errors: ["Select a local target that already exists in the active sailing."],
    };
  }

  const plan = await classifyGuidePlanRecords(
    buildCommitPlan(payload, resolvedTarget),
    database,
  );
  return {
    status: "valid",
    summary: `${payload.guide.sections.length} section${payload.guide.sections.length === 1 ? "" : "s"} ready for ${resolvedTarget.label}.`,
    targetLabel: resolvedTarget.label,
    targetKind: toTitleCase(resolvedTarget.kind),
    affectedAreas: resolvedTarget.affectedAreas,
    sections: payload.guide.sections.map((section, index) => ({
      id: `${section.sectionType}-${index}`,
      title: section.title,
      sectionType: toTitleCase(section.sectionType),
      destination: resolvedTarget.affectedAreas.join(" · "),
      action: "add",
    })),
    protectedFieldWarnings: plan.protectedFieldWarnings,
    technicalDetails: [
      `Schema: ${payload.schema} v${payload.schemaVersion}`,
      `Target entity: ${resolvedTarget.entityType}:${resolvedTarget.entityId}`,
      `Source: ${payload.source}`,
      `Confidence: ${payload.metadata.confidence}`,
      `Review: ${payload.metadata.reviewStatus}`,
    ],
    errors: [],
    commitPlan: plan,
  };
}

export async function commitGuidePack(
  preview: GuideLoaderPreviewResult,
  database: CompleteCruisingDb = db,
): Promise<GuideLoaderCommitResult> {
  if (preview.status !== "valid" || !preview.commitPlan) {
    return {
      status: "blocked",
      message: "A valid guide-pack preview is required before anything is applied.",
      visibleAreas: [],
    };
  }

  const now = new Date().toISOString();
  const plan = preview.commitPlan;
  const batch = ImportBatchSchema.parse({
    id: batchId(plan.importKind, now),
    schema: plan.payload.schema,
    schemaVersion: plan.payload.schemaVersion,
    kind: plan.importKind,
    importType: plan.importKind,
    status: "committed",
    receivedAt: plan.payload.createdAt,
    committedAt: now,
    sourceApp: plan.payload.source,
    rawContent: plan.payload,
    validationWarnings: preview.protectedFieldWarnings,
    recordsCreated: plan.createdCount,
    recordsUpdated: plan.updatedCount,
    recordsSkipped: 0,
    warningCount: preview.protectedFieldWarnings.length,
    protectedFieldWarningCount: preview.protectedFieldWarnings.length,
    protectedFieldsConfirmed: true,
    validationSummary: preview.summary,
    targetSummary: `${preview.targetKind}: ${preview.targetLabel}`,
    notes: "Committed from the simplified Guide Loader.",
    audit: {
      createdAt: now,
      updatedAt: now,
      createdBy: "guide-loader",
      updatedBy: "guide-loader",
    },
  });

  try {
    await database.transaction("rw", database.tables, async () => {
      for (const record of plan.records) {
        await database.table(record.tableName).put(record.value);
      }
      await database.importBatches.put(batch);
    });
    return {
      status: "committed",
      message: `Guide applied. It now feeds ${preview.affectedAreas.join(", ")}.`,
      visibleAreas: preview.affectedAreas,
      batch,
    };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "The guide pack could not be applied.",
      visibleAreas: [],
    };
  }
}
