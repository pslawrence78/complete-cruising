import { z } from "zod";
import { AuditMetadataSchema, ConfidenceMetadataSchema, IdSchema, StructuredFactsSchema } from "./commonSchemas";

export const EnrichmentSectionSchema = z.object({
  id: IdSchema,
  entityType: z.enum(["cruise_line", "ship", "port", "attraction", "sailing", "itinerary_day", "day_guide"]),
  entityId: IdSchema,
  sectionType: z.string().trim().min(1),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1).optional(),
  structuredFacts: StructuredFactsSchema.optional(),
  practicalGuidance: z.array(z.string().trim().min(1)).optional(),
  familyRelevance: z.array(z.string().trim().min(1)).optional(),
  watchouts: z.array(z.string().trim().min(1)).optional(),
  suggestedNextActions: z.array(z.string().trim().min(1)).optional(),
  confidence: ConfidenceMetadataSchema,
  audit: AuditMetadataSchema,
}).strict();

export const EnrichmentRunSchema = z.object({
  id: IdSchema,
  name: z.string().trim().min(1).optional(),
  targetEntityType: z.string().trim().min(1),
  targetEntityId: IdSchema,
  status: z.enum(["draft", "generated", "staged", "reviewed", "accepted", "rejected"]),
  enrichmentPackType: z.string().trim().min(1).optional(),
  sourceTypesUsed: z.array(z.string().trim().min(1)).optional(),
  validationWarnings: z.array(z.string().trim().min(1)).optional(),
  notes: z.string().trim().min(1).optional(),
  sectionIds: z.array(IdSchema),
  schemaVersion: z.number().int().positive(),
  audit: AuditMetadataSchema,
}).strict();
