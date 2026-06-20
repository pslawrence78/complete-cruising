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
  confidence: ConfidenceMetadataSchema,
  audit: AuditMetadataSchema,
}).strict();

export const EnrichmentRunSchema = z.object({
  id: IdSchema,
  targetEntityType: z.string().trim().min(1),
  targetEntityId: IdSchema,
  status: z.enum(["draft", "staged", "reviewed", "accepted", "rejected"]),
  sectionIds: z.array(IdSchema),
  schemaVersion: z.number().int().positive(),
  audit: AuditMetadataSchema,
}).strict();
