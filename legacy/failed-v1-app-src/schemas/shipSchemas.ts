import { z } from "zod";
import { AuditMetadataSchema, ConfidenceMetadataSchema, IdSchema, VisualMetadataSchema } from "./commonSchemas";

export const CruiseLineSchema = z.object({ id: IdSchema, name: z.string().min(1), shortName: z.string().optional(), websiteUrl: z.string().url().optional(), overview: z.string().optional(), audit: AuditMetadataSchema, confidence: ConfidenceMetadataSchema.optional() }).strict();

export const ShipSchema = z.object({
  id: IdSchema, cruiseLineId: IdSchema, name: z.string().min(1), shipClass: z.string().optional(), yearBuilt: z.number().int().min(1800).max(2200).optional(), grossTonnage: z.number().positive().optional(), passengerCapacity: z.number().int().positive().optional(), deckCount: z.number().int().positive().optional(), shipOverview: z.string().optional(), familySuitabilitySummary: z.string().optional(), watchoutsSummary: z.string().optional(), enrichmentSectionIds: z.array(IdSchema).optional(), visual: VisualMetadataSchema.optional(), audit: AuditMetadataSchema, confidence: ConfidenceMetadataSchema.optional(), sampleOnly: z.boolean().optional(), dataCaveat: z.string().min(1).optional(),
}).strict();
