import { z } from "zod";
import type { CompleteCruisingDb } from "../../db/completeCruisingDb";
import type {
  DayGuideImport,
  ItineraryImport,
  PortEnrichmentImport,
  ShipEnrichmentImport,
  ShorePlanImport,
} from "../../types";
import {
  ConfidenceMetadataSchema,
  EnrichmentSectionSchema,
  IdSchema,
  StructuredFactsSchema,
} from "../../schemas";
import type { ImportType } from "../enrichment-requests/enrichmentRequestTypes";
import type { PreviewNotice } from "./importPreviewTypes";

const NullableIdSchema = IdSchema.nullable();
const OptionalTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().optional();
const StringArraySchema = z.array(z.string().trim().min(1));

const SourceReferenceSchema = z.object({
  title: z.string().trim().min(1),
  url: z.string().trim().min(1).nullable().optional(),
  sourceType: z.string().trim().min(1),
  notes: z.string().trim().min(1).optional(),
}).strict();

const ProvenanceSchema = z.object({
  userEnteredFieldsUsed: StringArraySchema.optional(),
  researchedFields: StringArraySchema.optional(),
  inferredFields: StringArraySchema.optional(),
  confirmedFields: StringArraySchema.optional(),
  sourcesConsulted: z.array(SourceReferenceSchema).optional(),
}).strict();

const EnrichmentRunReturnSchema = z.object({
  id: IdSchema,
  name: z.string().trim().min(1).optional(),
  targetType: z.string().trim().min(1),
  targetName: z.string().trim().min(1).optional(),
  enrichmentPackType: z.string().trim().min(1).optional(),
  status: z.enum(["draft", "generated", "staged", "reviewed", "accepted", "rejected"]),
  sourceTypesUsed: StringArraySchema.optional(),
  validationWarnings: StringArraySchema.optional(),
  notes: z.string().trim().min(1).optional(),
}).strict();

const SectionReturnSchema = z.object({
  id: IdSchema,
  parentType: z.string().trim().min(1),
  parentId: NullableIdSchema,
  sectionType: z.string().trim().min(1),
  title: z.string().trim().min(1),
  shortSummary: z.string().trim().min(1),
  structuredFacts: StructuredFactsSchema.optional(),
  practicalGuidance: StringArraySchema.optional(),
  familyRelevance: StringArraySchema.optional(),
  watchouts: StringArraySchema.optional(),
  suggestedNextActions: StringArraySchema.optional(),
  confidence: ConfidenceMetadataSchema,
}).strict();

const ImportAdviceSchema = z.object({
  safeToImport: z.boolean().optional(),
  requiresUserReview: z.boolean().optional(),
  protectedFieldWarnings: StringArraySchema.optional(),
  recommendedImportType: z.string().trim().min(1).optional(),
}).strict();

const ItineraryCorrectionSchema = z.object({
  field: z.string().trim().min(1),
  currentValue: z.unknown().nullable().optional(),
  suggestedValue: z.unknown().nullable().optional(),
  reason: z.string().trim().min(1),
  origin: z.enum(["researched", "inferred"]),
  confidence: ConfidenceMetadataSchema,
}).strict();

const ItineraryVerificationReturnSchema = z.object({
  schema: z.literal("complete-cruising-itinerary-verification-v1"),
  schemaVersion: z.number().int().positive(),
  sourceApp: z.string().trim().min(1).optional(),
  generatedAt: z.string().datetime({ offset: true }),
  target: z.object({
    sailingId: NullableIdSchema,
    sailingName: z.string().trim().min(1),
  }).strict(),
  provenance: ProvenanceSchema.optional(),
  verificationSummary: z.object({
    overallStatus: z.enum(["likely_valid", "needs_review", "inconsistent", "insufficient_information"]),
    summary: z.string().trim().min(1),
    majorWarnings: StringArraySchema.optional(),
    minorWarnings: StringArraySchema.optional(),
    missingInformation: StringArraySchema.optional(),
  }).strict(),
  dayFindings: z.array(z.object({
    dayNumber: z.number().int().positive(),
    date: z.string().date(),
    currentDayType: z.string().trim().min(1),
    currentPortName: z.string().trim().min(1).nullable().optional(),
    status: z.enum(["appears_valid", "needs_review", "likely_incorrect", "insufficient_information"]),
    findings: StringArraySchema.optional(),
    suggestedCorrections: z.array(ItineraryCorrectionSchema).optional(),
    refreshRecommended: z.boolean(),
    refreshReason: z.string().trim().min(1),
  }).strict()).min(1),
  proposedImport: z.object({
    updatesProtectedFields: z.boolean(),
    protectedFieldWarnings: StringArraySchema.optional(),
    recommendedAction: z.enum(["review_only", "import_non_protected", "import_after_confirmation"]),
    notes: z.string().trim().min(1),
  }).strict(),
}).strict();

const ShipPackEnrichmentReturnSchema = z.object({
  schema: z.literal("complete-cruising-ship-pack-enrichment-v1"),
  schemaVersion: z.number().int().positive(),
  sourceApp: z.string().trim().min(1).optional(),
  generatedAt: z.string().datetime({ offset: true }),
  target: z.object({
    shipId: NullableIdSchema,
    shipName: z.string().trim().min(1),
    cruiseLineName: z.string().trim().min(1).nullable().optional(),
    sailingId: NullableIdSchema.optional(),
  }).strict(),
  pack: z.object({
    packType: z.string().trim().min(1),
    title: z.string().trim().min(1),
    scope: StringArraySchema.optional(),
    exclusions: StringArraySchema.optional(),
  }).strict(),
  provenance: ProvenanceSchema.optional(),
  enrichmentRun: EnrichmentRunReturnSchema,
  section: SectionReturnSchema.extend({
    parentType: z.literal("ship"),
  }),
  shipPatchProposal: z.object({
    safeNonProtectedUpdates: z.record(z.string(), z.unknown()).optional(),
    protectedUpdates: z.record(z.string(), z.unknown()).optional(),
    protectedFieldWarnings: StringArraySchema.optional(),
    notes: z.string().trim().min(1).optional(),
  }).strict().optional(),
  importAdvice: ImportAdviceSchema,
}).strict();

const PortPackEnrichmentReturnSchema = z.object({
  schema: z.literal("complete-cruising-port-pack-enrichment-v1"),
  schemaVersion: z.number().int().positive(),
  sourceApp: z.string().trim().min(1).optional(),
  generatedAt: z.string().datetime({ offset: true }),
  target: z.object({
    portId: NullableIdSchema,
    portName: z.string().trim().min(1),
    countryName: z.string().trim().min(1).nullable().optional(),
    sailingId: NullableIdSchema.optional(),
    itineraryDayId: NullableIdSchema.optional(),
  }).strict(),
  pack: z.object({
    packType: z.string().trim().min(1),
    title: z.string().trim().min(1),
    scope: StringArraySchema.optional(),
    exclusions: StringArraySchema.optional(),
  }).strict(),
  provenance: ProvenanceSchema.optional(),
  enrichmentRun: EnrichmentRunReturnSchema,
  section: SectionReturnSchema.extend({
    parentType: z.literal("port"),
  }),
  attractionProposals: z.array(z.object({
    name: z.string().trim().min(1),
    type: z.string().trim().min(1),
    shortDescription: z.string().trim().min(1),
    whyItMatters: z.string().trim().min(1),
    distanceFromPortText: z.string().trim().min(1).nullable().optional(),
    travelTimeFromPortText: z.string().trim().min(1).nullable().optional(),
    typicalVisitDuration: z.string().trim().min(1).nullable().optional(),
    bookingRequired: z.enum(["required", "recommended", "optional", "not_required", "unknown"]),
    costLevel: z.enum(["free", "low", "medium", "high", "unknown"]),
    familySuitability: z.enum(["excellent", "good", "mixed", "poor", "unknown"]),
    sebInterestScore: z.number().int().min(1).max(5),
    parentInterestScore: z.number().int().min(1).max(5),
    weatherSensitivity: z.enum(["low", "medium", "high", "indoor", "unknown"]),
    accessibilityNotes: z.string().trim().min(1),
    photoPrompt: z.string().trim().min(1),
    confidence: ConfidenceMetadataSchema,
  }).strict()).optional(),
  portPatchProposal: z.object({
    safeNonProtectedUpdates: z.record(z.string(), z.unknown()).optional(),
    protectedUpdates: z.record(z.string(), z.unknown()).optional(),
    protectedFieldWarnings: StringArraySchema.optional(),
    notes: z.string().trim().min(1).optional(),
  }).strict().optional(),
  importAdvice: ImportAdviceSchema,
}).strict();

const DayGuideGenerationReturnSchema = z.object({
  schema: z.literal("complete-cruising-day-guide-generation-v1"),
  schemaVersion: z.number().int().positive(),
  sourceApp: z.string().trim().min(1).optional(),
  generatedAt: z.string().datetime({ offset: true }),
  target: z.object({
    sailingId: NullableIdSchema,
    sailingName: z.string().trim().min(1),
    itineraryDayId: NullableIdSchema,
    dayNumber: z.number().int().positive(),
    date: z.string().date(),
    dayType: z.enum(["embarkation", "port", "sea", "scenic_cruising", "overnight_port", "disembarkation"]),
    portName: z.string().trim().min(1).nullable().optional(),
  }).strict(),
  provenance: ProvenanceSchema.optional(),
  dayGuide: z.object({
    id: IdSchema,
    itineraryDayId: NullableIdSchema,
    title: z.string().trim().min(1),
    todayAtAGlance: z.object({
      location: z.string().trim().min(1),
      arrivalTime: OptionalTimeSchema,
      departureTime: OptionalTimeSchema,
      allAboardTime: OptionalTimeSchema,
      latestSafeReturnTime: OptionalTimeSchema,
      weatherSummary: z.string().trim().min(1).nullable().optional(),
      localLanguage: z.string().trim().min(1).nullable().optional(),
      localCurrency: z.string().trim().min(1).nullable().optional(),
    }).strict(),
    whatMattersToday: StringArraySchema.optional(),
    likelyPlanSummary: z.string().trim().min(1),
    backupPlanSummary: z.string().trim().min(1),
    takeAshore: StringArraySchema.optional(),
    sebDiscovery: z.object({
      flag: z.string().trim().min(1).nullable().optional(),
      localPhrase: z.string().trim().min(1).nullable().optional(),
      pronunciationHint: z.string().trim().min(1).nullable().optional(),
      geographyFact: z.string().trim().min(1).nullable().optional(),
      thingToSpot: z.string().trim().min(1).nullable().optional(),
      quizQuestion: z.string().trim().min(1).nullable().optional(),
      quizAnswer: z.string().trim().min(1).nullable().optional(),
    }).strict().optional(),
    photoPrompt: z.string().trim().min(1),
    returnBufferAdvice: z.string().trim().min(1),
    confidenceNotes: StringArraySchema.optional(),
    generatedFrom: StringArraySchema.optional(),
    confidence: ConfidenceMetadataSchema,
  }).strict(),
  operationalWarnings: StringArraySchema.optional(),
  memoryPrompt: z.object({
    prompt: z.string().trim().min(1),
    sebFavouritePrompt: z.string().trim().min(1),
    photoPrompt: z.string().trim().min(1),
    adventureAlmanacHint: z.string().trim().min(1),
  }).strict().optional(),
  importAdvice: ImportAdviceSchema,
}).strict();

const ShorePlanGenerationReturnSchema = z.object({
  schema: z.literal("complete-cruising-shore-plan-generation-v1"),
  schemaVersion: z.number().int().positive(),
  sourceApp: z.string().trim().min(1).optional(),
  generatedAt: z.string().datetime({ offset: true }),
  target: z.object({
    sailingId: NullableIdSchema,
    sailingName: z.string().trim().min(1),
    itineraryDayId: NullableIdSchema,
    dayNumber: z.number().int().positive(),
    date: z.string().date(),
    portId: NullableIdSchema,
    portName: z.string().trim().min(1),
  }).strict(),
  provenance: ProvenanceSchema.optional(),
  planningAssumptions: z.array(z.object({
    assumption: z.string().trim().min(1),
    origin: z.enum(["user_entered", "researched", "inferred", "confirmed"]),
    confidence: ConfidenceMetadataSchema,
  }).strict()).optional(),
  shorePlans: z.array(z.object({
    id: IdSchema,
    itineraryDayId: NullableIdSchema,
    portId: NullableIdSchema,
    name: z.string().trim().min(1),
    planType: z.enum(["booked_excursion", "diy", "private_tour", "low_effort", "backup", "onboard_only", "ambitious"]),
    status: z.enum(["idea", "shortlisted", "selected", "booked", "completed", "cancelled", "rejected"]),
    summary: z.string().trim().min(1),
    startTime: OptionalTimeSchema,
    endTime: OptionalTimeSchema,
    latestSafeReturnTime: OptionalTimeSchema,
    transportMode: z.enum(["walk", "taxi", "shuttle", "public_transport", "private_transfer", "cruise_excursion", "mixed", "unknown"]),
    attractionNames: StringArraySchema.optional(),
    estimatedTravelTimeText: z.string().trim().min(1),
    returnBufferMinutes: z.number().int().nonnegative(),
    riskLevel: z.enum(["low", "medium", "high", "unknown"]),
    weatherDependency: z.enum(["low", "medium", "high", "unknown"]),
    familySuitability: z.enum(["excellent", "good", "mixed", "poor", "unknown"]),
    sebSuitabilityNotes: z.string().trim().min(1),
    costNotes: z.string().trim().min(1),
    bookingReference: z.unknown().nullable().optional(),
    whatToTake: StringArraySchema.optional(),
    watchouts: StringArraySchema.optional(),
    confidence: ConfidenceMetadataSchema,
  }).strict()).min(1),
  recommendation: z.object({
    recommendedPlanId: IdSchema,
    reason: z.string().trim().min(1),
    backupPlanId: NullableIdSchema.optional(),
    returnToShipAdvice: z.string().trim().min(1),
  }).strict(),
  importAdvice: ImportAdviceSchema,
}).strict();

export type SupportedReturnSchema =
  | "complete-cruising-itinerary-verification-v1"
  | "complete-cruising-ship-pack-enrichment-v1"
  | "complete-cruising-port-pack-enrichment-v1"
  | "complete-cruising-day-guide-generation-v1"
  | "complete-cruising-shore-plan-generation-v1";

type SupportedReturnImportPayload =
  | ItineraryImport
  | ShipEnrichmentImport
  | PortEnrichmentImport
  | DayGuideImport
  | ShorePlanImport;

export interface ConvertedReturnImportPayload {
  importType: ImportType;
  payload?: SupportedReturnImportPayload;
  schema: SupportedReturnSchema;
  schemaVersion: number;
  sourceApp?: string;
  receivedAt: string;
  targetId?: string;
  targetName?: string;
  targetType: string;
  ignoreProtectedFieldImpacts?: boolean;
  skipUnchangedRecords?: boolean;
  warnings: PreviewNotice[];
  errors: PreviewNotice[];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function buildHeader(payload: { schemaVersion: number; generatedAt: string; sourceApp?: string }) {
  return {
    schemaVersion: payload.schemaVersion,
    importedAt: payload.generatedAt,
    sourceApp: payload.sourceApp ?? "ChatGPT",
    sampleOnly: false,
  };
}

function protectedWarnings(
  warnings: string[] | undefined,
  prefix: string,
  title: string,
): PreviewNotice[] {
  return (warnings ?? []).map((message, index) => ({
    id: `${prefix}-${index}`,
    severity: "caution" as const,
    title,
    message,
    fieldPath: `${prefix.replaceAll("-", ".")}.${index}`,
    code: "protected_field_warning",
  }));
}

function validationWarnings(
  warnings: string[] | undefined,
  prefix: string,
  title: string,
): PreviewNotice[] {
  return (warnings ?? []).map((message, index) => ({
    id: `${prefix}-${index}`,
    severity: "warning" as const,
    title,
    message,
    fieldPath: `${prefix.replaceAll("-", ".")}.${index}`,
  }));
}

function notFoundError(id: string, title: string, message: string, fieldPath: string): PreviewNotice {
  return {
    id,
    title,
    message,
    fieldPath,
    code: "missing_target",
  };
}

function convertSection(
  section: z.infer<typeof SectionReturnSchema>,
  entityType: z.infer<typeof EnrichmentSectionSchema>["entityType"],
  entityId: string,
  now: string,
) {
  return {
    id: section.id,
    entityType,
    entityId,
    sectionType: section.sectionType,
    title: section.title,
    summary: section.shortSummary,
    structuredFacts: section.structuredFacts,
    practicalGuidance: section.practicalGuidance,
    familyRelevance: section.familyRelevance,
    watchouts: section.watchouts,
    suggestedNextActions: section.suggestedNextActions,
    confidence: section.confidence,
    audit: {
      createdAt: now,
      updatedAt: now,
      createdBy: "import",
      updatedBy: "import",
    },
  };
}

function convertRun(
  run: z.infer<typeof EnrichmentRunReturnSchema>,
  targetEntityType: string,
  targetEntityId: string,
  sectionIds: string[],
  schemaVersion: number,
  now: string,
) {
  return {
    id: run.id,
    name: run.name,
    targetEntityType,
    targetEntityId,
    status: run.status,
    enrichmentPackType: run.enrichmentPackType,
    sourceTypesUsed: run.sourceTypesUsed,
    validationWarnings: run.validationWarnings,
    notes: run.notes,
    sectionIds,
    schemaVersion,
    audit: {
      createdAt: now,
      updatedAt: now,
      createdBy: "import",
      updatedBy: "import",
    },
  };
}

function mergeText(parts: Array<string | undefined>) {
  return parts.map((part) => part?.trim()).filter(Boolean).join(" ");
}

function buildChecklistIds(items: string[] | undefined) {
  return (items ?? []).map((label, index) => ({
    id: `day-guide-item-${slugify(label) || index + 1}`,
    label,
  }));
}

async function convertItineraryVerification(
  raw: unknown,
  database: CompleteCruisingDb,
): Promise<ConvertedReturnImportPayload> {
  const payload = ItineraryVerificationReturnSchema.parse(raw);
  const warnings: PreviewNotice[] = [
    ...validationWarnings(payload.verificationSummary.majorWarnings, "verificationSummary-majorWarnings", "Major itinerary warning"),
    ...validationWarnings(payload.verificationSummary.minorWarnings, "verificationSummary-minorWarnings", "Minor itinerary warning"),
    ...validationWarnings(payload.verificationSummary.missingInformation, "verificationSummary-missingInformation", "Missing itinerary information"),
    ...protectedWarnings(payload.proposedImport.protectedFieldWarnings, "proposedImport-protectedFieldWarnings", "Protected field warning"),
  ];

  if (!payload.target.sailingId) {
    return {
      importType: "itinerary",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetName: payload.target.sailingName,
      targetType: "Itinerary verification",
      warnings,
      errors: [notFoundError("missing-target-sailing", "Target sailing missing", "The returned JSON did not include a target sailing ID, so Complete Cruising cannot match the itinerary safely.", "target.sailingId")],
    };
  }

  const sailing = await database.sailings.get(payload.target.sailingId);
  if (!sailing) {
    return {
      importType: "itinerary",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetId: payload.target.sailingId,
      targetName: payload.target.sailingName,
      targetType: "Itinerary verification",
      warnings,
      errors: [notFoundError("missing-target-sailing", "Target sailing not found", "Create or select the matching sailing before importing itinerary corrections.", "target.sailingId")],
    };
  }

  const localDays = await database.itineraryDays.where("sailingId").equals(sailing.id).sortBy("dayNumber");
  const localPorts = await database.ports.toArray();
  const portByName = new Map(localPorts.map((port) => [port.name.trim().toLowerCase(), port]));
  const dayByNumber = new Map(localDays.map((day) => [day.dayNumber, day]));
  const errors: PreviewNotice[] = [];
  const convertedDays = payload.dayFindings.map((finding, findingIndex) => {
    const local = dayByNumber.get(finding.dayNumber);
    if (!local) {
      errors.push(notFoundError(
        `missing-day-${finding.dayNumber}`,
        "Itinerary day not found",
        `Day ${finding.dayNumber} is not present in the local sailing, so the correction cannot be committed safely.`,
        `dayFindings.${findingIndex}.dayNumber`,
      ));
      return undefined;
    }

    const nextDay = {
      ...local,
      confidence: finding.suggestedCorrections?.[0]?.confidence ?? local.confidence,
      operationalWarnings: Array.from(
        new Set([...(local.operationalWarnings ?? []), ...(finding.findings ?? [])]),
      ),
    };

    for (const correction of finding.suggestedCorrections ?? []) {
      const field = correction.field.trim();
      if (field === "date" && typeof correction.suggestedValue === "string") nextDay.date = correction.suggestedValue;
      if (field === "dayType" && typeof correction.suggestedValue === "string") nextDay.dayType = correction.suggestedValue as typeof nextDay.dayType;
      if (field === "arrivalTime" && typeof correction.suggestedValue === "string") nextDay.arrivalTime = correction.suggestedValue;
      if (field === "departureTime" && typeof correction.suggestedValue === "string") nextDay.departureTime = correction.suggestedValue;
      if (field === "allAboardTime" && typeof correction.suggestedValue === "string") nextDay.allAboardTime = correction.suggestedValue;
      if (field === "tenderStatus" && typeof correction.suggestedValue === "string") nextDay.tenderStatus = correction.suggestedValue as typeof nextDay.tenderStatus;
      if (field === "isTender" && typeof correction.suggestedValue === "boolean") nextDay.isTender = correction.suggestedValue;
      if (field === "title" && typeof correction.suggestedValue === "string") nextDay.title = correction.suggestedValue;
      if (field === "portName") {
        if (typeof correction.suggestedValue !== "string" || !correction.suggestedValue.trim()) {
          errors.push({
            id: `missing-port-name-${finding.dayNumber}`,
            title: "Suggested port name missing",
            message: `Day ${finding.dayNumber} includes a port correction without a usable port name.`,
            fieldPath: `dayFindings.${findingIndex}.suggestedCorrections`,
            code: "missing_target",
          });
          continue;
        }
        const matchedPort = portByName.get(correction.suggestedValue.trim().toLowerCase());
        if (!matchedPort) {
          errors.push({
            id: `missing-port-${finding.dayNumber}`,
            title: "Suggested port not found locally",
            message: `${correction.suggestedValue} is not in the reusable port guidebook yet, so Complete Cruising will not create a duplicate port silently.`,
            fieldPath: `dayFindings.${findingIndex}.suggestedCorrections`,
            code: "missing_target",
          });
          continue;
        }
        nextDay.portId = matchedPort.id;
        nextDay.title = matchedPort.name;
      }
    }

    return nextDay;
  }).filter(Boolean);

  if (errors.length > 0) {
    return {
      importType: "itinerary",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetId: sailing.id,
      targetName: sailing.name,
      targetType: "Itinerary verification",
      warnings,
      errors,
    };
  }

  return {
    importType: "itinerary",
    schema: payload.schema,
    schemaVersion: payload.schemaVersion,
    sourceApp: payload.sourceApp,
    receivedAt: payload.generatedAt,
    targetId: sailing.id,
    targetName: sailing.name,
    targetType: "Itinerary verification",
    warnings,
    errors: [],
    payload: {
      kind: "itinerary",
      header: buildHeader(payload),
      sailingId: sailing.id,
      days: convertedDays as ItineraryImport["days"],
    },
  };
}

async function convertShipPackEnrichment(
  raw: unknown,
  database: CompleteCruisingDb,
): Promise<ConvertedReturnImportPayload> {
  const payload = ShipPackEnrichmentReturnSchema.parse(raw);
  const warnings: PreviewNotice[] = [
    ...validationWarnings(payload.enrichmentRun.validationWarnings, "enrichmentRun-validationWarnings", "Validation warning from enrichment run"),
    ...protectedWarnings(payload.shipPatchProposal?.protectedFieldWarnings, "shipPatchProposal-protectedFieldWarnings", "Protected field warning"),
    ...protectedWarnings(payload.importAdvice.protectedFieldWarnings, "importAdvice-protectedFieldWarnings", "Protected field warning"),
    {
      id: "ship-patch-scope",
      severity: "info",
      title: "Ship identity remains protected",
      message: "This import commits the enrichment run and section only. Ship identity fields stay under local control.",
    },
  ];

  if (!payload.target.shipId) {
    return {
      importType: "ship_enrichment",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetName: payload.target.shipName,
      targetType: "Ship enrichment pack",
      warnings,
      errors: [notFoundError("missing-target-ship", "Target ship missing", "The returned JSON did not include a ship ID, so the enrichment cannot be attached safely.", "target.shipId")],
    };
  }

  const ship = await database.ships.get(payload.target.shipId);
  if (!ship) {
    return {
      importType: "ship_enrichment",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetId: payload.target.shipId,
      targetName: payload.target.shipName,
      targetType: "Ship enrichment pack",
      warnings,
      errors: [notFoundError("missing-target-ship", "Target ship not found", "Load or create the matching ship before importing this enrichment pack.", "target.shipId")],
    };
  }

  const now = new Date().toISOString();
  const section = convertSection(payload.section, "ship", ship.id, now);
  const enrichmentRun = convertRun(payload.enrichmentRun, "ship", ship.id, [section.id], payload.schemaVersion, now);

  return {
    importType: "ship_enrichment",
    schema: payload.schema,
    schemaVersion: payload.schemaVersion,
    sourceApp: payload.sourceApp,
    receivedAt: payload.generatedAt,
    targetId: ship.id,
    targetName: ship.name,
    targetType: "Ship enrichment pack",
    ignoreProtectedFieldImpacts: true,
    skipUnchangedRecords: true,
    warnings,
    errors: [],
    payload: {
      kind: "ship_enrichment",
      header: buildHeader(payload),
      ship,
      sections: [section],
      enrichmentRun,
    } as ShipEnrichmentImport & { enrichmentRun: typeof enrichmentRun },
  };
}

async function convertPortPackEnrichment(
  raw: unknown,
  database: CompleteCruisingDb,
): Promise<ConvertedReturnImportPayload> {
  const payload = PortPackEnrichmentReturnSchema.parse(raw);
  const warnings: PreviewNotice[] = [
    ...validationWarnings(payload.enrichmentRun.validationWarnings, "enrichmentRun-validationWarnings", "Validation warning from enrichment run"),
    ...protectedWarnings(payload.portPatchProposal?.protectedFieldWarnings, "portPatchProposal-protectedFieldWarnings", "Protected field warning"),
    ...protectedWarnings(payload.importAdvice.protectedFieldWarnings, "importAdvice-protectedFieldWarnings", "Protected field warning"),
    {
      id: "port-attractions-held",
      severity: "info",
      title: "Attraction proposals stay review-led",
      message: "This repair commits the reusable port enrichment run and section. Attraction proposals remain visible in the JSON for later targeted handling.",
    },
  ];

  if (!payload.target.portId) {
    return {
      importType: "port_enrichment",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetName: payload.target.portName,
      targetType: "Port enrichment pack",
      warnings,
      errors: [notFoundError("missing-target-port", "Target port missing", "The returned JSON did not include a port ID, so the enrichment cannot be attached safely.", "target.portId")],
    };
  }

  const port = await database.ports.get(payload.target.portId);
  if (!port) {
    return {
      importType: "port_enrichment",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetId: payload.target.portId,
      targetName: payload.target.portName,
      targetType: "Port enrichment pack",
      warnings,
      errors: [notFoundError("missing-target-port", "Target port not found", "Load or create the matching reusable port before importing this enrichment pack.", "target.portId")],
    };
  }

  const now = new Date().toISOString();
  const section = convertSection(payload.section, "port", port.id, now);
  const enrichmentRun = convertRun(payload.enrichmentRun, "port", port.id, [section.id], payload.schemaVersion, now);

  return {
    importType: "port_enrichment",
    schema: payload.schema,
    schemaVersion: payload.schemaVersion,
    sourceApp: payload.sourceApp,
    receivedAt: payload.generatedAt,
    targetId: port.id,
    targetName: port.name,
    targetType: "Port enrichment pack",
    ignoreProtectedFieldImpacts: true,
    skipUnchangedRecords: true,
    warnings,
    errors: [],
    payload: {
      kind: "port_enrichment",
      header: buildHeader(payload),
      port,
      attractions: [],
      sections: [section],
      enrichmentRun,
    } as PortEnrichmentImport & { enrichmentRun: typeof enrichmentRun },
  };
}

async function convertDayGuideGeneration(
  raw: unknown,
  database: CompleteCruisingDb,
): Promise<ConvertedReturnImportPayload> {
  const payload = DayGuideGenerationReturnSchema.parse(raw);
  const warnings: PreviewNotice[] = [
    ...protectedWarnings(payload.importAdvice.protectedFieldWarnings, "importAdvice-protectedFieldWarnings", "Protected field warning"),
  ];

  if (!payload.target.itineraryDayId) {
    return {
      importType: "day_guide",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetName: payload.target.sailingName,
      targetType: "Day guide enrichment",
      warnings,
      errors: [notFoundError("missing-target-day", "Target itinerary day missing", "The returned JSON did not include an itinerary day ID, so the day guide cannot be attached safely.", "target.itineraryDayId")],
    };
  }

  const itineraryDay = await database.itineraryDays.get(payload.target.itineraryDayId);
  if (!itineraryDay) {
    return {
      importType: "day_guide",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetId: payload.target.itineraryDayId,
      targetName: payload.dayGuide.title,
      targetType: "Day guide enrichment",
      warnings,
      errors: [notFoundError("missing-target-day", "Target itinerary day not found", "Load or create the matching itinerary day before importing this guide.", "target.itineraryDayId")],
    };
  }

  const dayGuide = {
    id: payload.dayGuide.id,
    sailingId: itineraryDay.sailingId,
    itineraryDayId: itineraryDay.id,
    title: payload.dayGuide.title,
    operationalSummary: mergeText([
      payload.dayGuide.likelyPlanSummary,
      payload.dayGuide.backupPlanSummary ? `Plan B: ${payload.dayGuide.backupPlanSummary}` : undefined,
      payload.dayGuide.returnBufferAdvice,
      (payload.dayGuide.whatMattersToday ?? []).join(" "),
      (payload.dayGuide.confidenceNotes ?? []).join(" "),
    ]),
    latestSafeReturnTime: payload.dayGuide.todayAtAGlance.latestSafeReturnTime ?? undefined,
    checklist: buildChecklistIds(payload.dayGuide.takeAshore),
    localContext: {
      language: payload.dayGuide.todayAtAGlance.localLanguage ?? undefined,
      currency: payload.dayGuide.todayAtAGlance.localCurrency ?? undefined,
      phrase: payload.dayGuide.sebDiscovery?.localPhrase ?? undefined,
      phraseMeaning: payload.dayGuide.sebDiscovery?.pronunciationHint ?? undefined,
    },
    sebDiscovery: payload.dayGuide.sebDiscovery
      ? {
        prompt: payload.dayGuide.sebDiscovery.thingToSpot
          ?? payload.dayGuide.sebDiscovery.quizQuestion
          ?? "Look for one detail that helps the place feel real.",
        fact: payload.dayGuide.sebDiscovery.geographyFact ?? payload.dayGuide.sebDiscovery.quizAnswer ?? undefined,
        photoPrompt: payload.dayGuide.photoPrompt,
      }
      : undefined,
    confidence: payload.dayGuide.confidence,
    audit: {
      createdAt: payload.generatedAt,
      updatedAt: payload.generatedAt,
      createdBy: "import",
      updatedBy: "import",
    },
  };

  return {
    importType: "day_guide",
    schema: payload.schema,
    schemaVersion: payload.schemaVersion,
    sourceApp: payload.sourceApp,
    receivedAt: payload.generatedAt,
    targetId: itineraryDay.id,
    targetName: payload.dayGuide.title,
    targetType: "Day guide enrichment",
    warnings,
    errors: [],
    payload: {
      kind: "day_guide",
      header: buildHeader(payload),
      dayGuide,
    },
  };
}

async function convertShorePlanGeneration(
  raw: unknown,
  database: CompleteCruisingDb,
): Promise<ConvertedReturnImportPayload> {
  const payload = ShorePlanGenerationReturnSchema.parse(raw);
  const warnings: PreviewNotice[] = [
    ...protectedWarnings(payload.importAdvice.protectedFieldWarnings, "importAdvice-protectedFieldWarnings", "Protected field warning"),
    {
      id: "shore-plan-recommendation-held",
      severity: "info",
      title: "Plan recommendation stays review-led",
      message: "Imported shore plans do not silently replace the currently selected or backup plan on the itinerary day.",
    },
  ];

  if (!payload.target.itineraryDayId) {
    return {
      importType: "shore_plan",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetName: payload.target.sailingName,
      targetType: "Shore plan enrichment",
      warnings,
      errors: [notFoundError("missing-target-day", "Target itinerary day missing", "The returned JSON did not include an itinerary day ID, so Complete Cruising cannot place these shore plans safely.", "target.itineraryDayId")],
    };
  }

  const itineraryDay = await database.itineraryDays.get(payload.target.itineraryDayId);
  if (!itineraryDay) {
    return {
      importType: "shore_plan",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetId: payload.target.itineraryDayId,
      targetName: payload.target.portName,
      targetType: "Shore plan enrichment",
      warnings,
      errors: [notFoundError("missing-target-day", "Target itinerary day not found", "Load or create the matching itinerary day before importing these shore plans.", "target.itineraryDayId")],
    };
  }

  const expectedPortId = payload.target.portId ?? itineraryDay.portId;
  if (!expectedPortId) {
    return {
      importType: "shore_plan",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetId: itineraryDay.id,
      targetName: payload.target.portName,
      targetType: "Shore plan enrichment",
      warnings,
      errors: [notFoundError("missing-target-port", "Target port missing", "This itinerary day does not carry a reusable port reference, so shore plans cannot be matched safely.", "target.portId")],
    };
  }

  const port = await database.ports.get(expectedPortId);
  if (!port) {
    return {
      importType: "shore_plan",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      receivedAt: payload.generatedAt,
      targetId: expectedPortId,
      targetName: payload.target.portName,
      targetType: "Shore plan enrichment",
      warnings,
      errors: [notFoundError("missing-target-port", "Target port not found", "Load or create the reusable port before importing these shore plans.", "target.portId")],
    };
  }

  const shorePlans = payload.shorePlans.map((plan) => ({
    id: plan.id,
    sailingId: itineraryDay.sailingId,
    itineraryDayId: itineraryDay.id,
    name: plan.name,
    type: plan.planType,
    status: plan.status,
    summary: mergeText([
      plan.summary,
      plan.estimatedTravelTimeText ? `Travel: ${plan.estimatedTravelTimeText}.` : undefined,
      plan.whatToTake?.length ? `Take: ${plan.whatToTake.join(", ")}.` : undefined,
      plan.watchouts?.length ? `Watchouts: ${plan.watchouts.join(" ")}` : undefined,
    ]),
    transportSummary: plan.transportMode === "unknown"
      ? plan.estimatedTravelTimeText
      : `${plan.transportMode.replaceAll("_", " ")}${plan.estimatedTravelTimeText ? ` · ${plan.estimatedTravelTimeText}` : ""}`,
    familySuitability: plan.familySuitability,
    sebFitSummary: plan.sebSuitabilityNotes,
    returnRisk: plan.riskLevel,
    returnBufferMinutes: plan.returnBufferMinutes,
    weatherDependency: plan.weatherDependency,
    confidence: plan.confidence,
    audit: {
      createdAt: payload.generatedAt,
      updatedAt: payload.generatedAt,
      createdBy: "import",
      updatedBy: "import",
    },
  }));

  return {
    importType: "shore_plan",
    schema: payload.schema,
    schemaVersion: payload.schemaVersion,
    sourceApp: payload.sourceApp,
    receivedAt: payload.generatedAt,
    targetId: itineraryDay.id,
    targetName: `${port.name} · Day ${itineraryDay.dayNumber}`,
    targetType: "Shore plan enrichment",
    warnings,
    errors: [],
    payload: {
      kind: "shore_plan",
      header: buildHeader(payload),
      sailingId: itineraryDay.sailingId,
      itineraryDayId: itineraryDay.id,
      shorePlans,
    },
  };
}

export async function convertEnrichmentReturnToImportPayload(
  raw: unknown,
  database: CompleteCruisingDb,
): Promise<ConvertedReturnImportPayload | undefined> {
  const schemaName = typeof (raw as { schema?: unknown })?.schema === "string" ? (raw as { schema: string }).schema : undefined;
  if (!schemaName) return undefined;

  if (schemaName === "complete-cruising-itinerary-verification-v1") return convertItineraryVerification(raw, database);
  if (schemaName === "complete-cruising-ship-pack-enrichment-v1") return convertShipPackEnrichment(raw, database);
  if (schemaName === "complete-cruising-port-pack-enrichment-v1") return convertPortPackEnrichment(raw, database);
  if (schemaName === "complete-cruising-day-guide-generation-v1") return convertDayGuideGeneration(raw, database);
  if (schemaName === "complete-cruising-shore-plan-generation-v1") return convertShorePlanGeneration(raw, database);

  return undefined;
}
