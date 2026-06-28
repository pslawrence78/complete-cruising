import { z } from "zod";
import { ConfidenceMetadataSchema, IdSchema, StructuredFactsSchema } from "../../schemas";
import type { CompleteCruisingDb } from "../../db/completeCruisingDb";
import type { ImportRecordCandidate } from "./importRecordMapping";
import type { PreviewNotice } from "./importPreviewTypes";

export const sailingShellEnrichmentSchemaName = "complete-cruising-sailing-shell-enrichment-v1";

const StringArraySchema = z.array(z.string().trim().min(1));

const SailingShellEnrichmentSectionReturnSchema = z.object({
  id: IdSchema,
  parentType: z.literal("sailing"),
  parentId: IdSchema,
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

export const SailingShellEnrichmentReturnSchema = z.object({
  schema: z.literal(sailingShellEnrichmentSchemaName),
  schemaVersion: z.number().int().positive(),
  sourceApp: z.string().trim().min(1).optional(),
  generatedAt: z.string().datetime({ offset: true }),
  target: z.object({
    sailingId: IdSchema,
    sailingName: z.string().trim().min(1).optional(),
    shipName: z.string().trim().min(1).optional(),
    cruiseLineName: z.string().trim().min(1).optional(),
  }).strict(),
  provenance: z.unknown().optional(),
  enrichmentRun: z.object({
    id: IdSchema,
    name: z.string().trim().min(1).optional(),
    targetType: z.literal("sailing"),
    targetName: z.string().trim().min(1).optional(),
    enrichmentPackType: z.string().trim().min(1).optional(),
    status: z.enum(["draft", "generated", "staged", "reviewed", "accepted", "rejected"]),
    sourceTypesUsed: StringArraySchema.optional(),
    validationWarnings: StringArraySchema.optional(),
    notes: z.string().trim().min(1).optional(),
  }).strict(),
  sailingEnrichment: z.unknown().optional(),
  sections: z.array(SailingShellEnrichmentSectionReturnSchema).min(1),
  importAdvice: z.object({
    safeToImport: z.boolean().optional(),
    requiresUserReview: z.boolean().optional(),
    protectedFieldWarnings: StringArraySchema.optional(),
    recommendedImportType: z.string().trim().min(1).optional(),
  }).strict().optional(),
}).strict();

export type SailingShellEnrichmentPayload = z.infer<typeof SailingShellEnrichmentReturnSchema>;

export function parseSailingShellEnrichmentPayload(raw: unknown): SailingShellEnrichmentPayload {
  return SailingShellEnrichmentReturnSchema.parse(raw);
}

export function getSailingShellEnrichmentCandidates(
  payload: SailingShellEnrichmentPayload,
  now: string,
): ImportRecordCandidate[] {
  const sectionIds = payload.sections.map((section) => section.id);
  const audit = { createdAt: now, updatedAt: now, createdBy: "import", updatedBy: "import" };

  return [
    {
      tableName: "enrichmentRuns",
      value: {
        id: payload.enrichmentRun.id,
        name: payload.enrichmentRun.name,
        targetEntityType: "sailing",
        targetEntityId: payload.target.sailingId,
        status: payload.enrichmentRun.status,
        enrichmentPackType: payload.enrichmentRun.enrichmentPackType,
        sourceTypesUsed: payload.enrichmentRun.sourceTypesUsed,
        validationWarnings: payload.enrichmentRun.validationWarnings,
        notes: payload.enrichmentRun.notes,
        sectionIds,
        schemaVersion: payload.schemaVersion,
        audit,
      },
    },
    ...payload.sections.map((section) => ({
      tableName: "enrichmentSections" as const,
      value: {
        id: section.id,
        entityType: "sailing",
        entityId: section.parentId,
        sectionType: section.sectionType,
        title: section.title,
        summary: section.shortSummary,
        structuredFacts: section.structuredFacts,
        practicalGuidance: section.practicalGuidance,
        familyRelevance: section.familyRelevance,
        watchouts: section.watchouts,
        suggestedNextActions: section.suggestedNextActions,
        confidence: section.confidence,
        audit,
      },
    })),
  ];
}

export function sailingShellEnrichmentWarnings(payload: SailingShellEnrichmentPayload): PreviewNotice[] {
  const validationWarnings = payload.enrichmentRun.validationWarnings ?? [];
  const protectedFieldWarnings = payload.importAdvice?.protectedFieldWarnings ?? [];

  return [
    ...validationWarnings.map((message, index) => ({
      id: `sailing-enrichment-validation-${index}`,
      severity: "warning" as const,
      title: "Validation warning from enrichment run",
      message,
      fieldPath: `enrichmentRun.validationWarnings.${index}`,
    })),
    ...protectedFieldWarnings.map((message, index) => ({
      id: `sailing-enrichment-protected-${index}`,
      severity: "caution" as const,
      title: "Protected field warning from import advice",
      message,
      fieldPath: `importAdvice.protectedFieldWarnings.${index}`,
      code: "protected_field_warning",
    })),
    {
      id: "sailing-level-context-only",
      severity: "info" as const,
      title: "Sailing-level context only",
      message: "This mapper imports context sections for the sailing. It does not confirm port times, itinerary days, booking data or operational deadlines.",
    },
  ];
}

export async function findReviewedSectionConflict(
  database: CompleteCruisingDb,
  candidates: ImportRecordCandidate[],
): Promise<PreviewNotice | undefined> {
  for (const candidate of candidates) {
    if (candidate.tableName !== "enrichmentSections") continue;
    const existing = await database.enrichmentSections.get(candidate.value.id);
    if (!existing || !["reviewed", "verified"].includes(existing.confidence.reviewStatus)) continue;

    const comparable = (value: unknown) => JSON.stringify(value, (key, entry) => key === "audit" ? undefined : entry);
    if (comparable(existing) !== comparable(candidate.value)) {
      return {
        id: `reviewed-section-conflict-${candidate.value.id}`,
        severity: "caution",
        title: "Reviewed enrichment is protected",
        message: `${candidate.value.id} is already ${existing.confidence.reviewStatus.replaceAll("_", " ")} locally. This tranche blocks silent enrichment overwrites; review that section manually before re-importing.`,
        recordId: candidate.value.id,
        fieldPath: "confidence.reviewStatus",
        code: "reviewed_section_conflict",
      };
    }
  }

  return undefined;
}
