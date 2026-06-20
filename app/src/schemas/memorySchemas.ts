import { z } from "zod";
import { AuditMetadataSchema, ConfidenceMetadataSchema, IdSchema } from "./commonSchemas";

export const MemoryEntrySchema = z.object({
  id: IdSchema, sailingId: IdSchema, itineraryDayId: IdSchema.optional(), type: z.enum(["reflection", "seb_favourite", "family_highlight", "photo", "food", "other"]), prompt: z.string().optional(), content: z.string().min(1), capturedAt: z.string().datetime({ offset: true }).optional(), confidence: ConfidenceMetadataSchema.optional(), audit: AuditMetadataSchema, sampleOnly: z.boolean().optional(), dataCaveat: z.string().min(1).optional(),
}).strict();

export const AdventureAlmanacExportPreviewSchema = z.object({
  id: IdSchema, sailingId: IdSchema, schemaVersion: z.number().int().positive(), status: z.literal("draft"), sailingName: z.string().min(1), shipName: z.string().optional(), dayOrPort: z.string().optional(), country: z.string().optional(), memorySummary: z.string().optional(), sebLearningMoment: z.string().optional(), bestPhotoPrompt: z.string().optional(), readiness: z.string().min(1), memoryEntryIds: z.array(IdSchema), sampleOnly: z.boolean().optional(), dataCaveat: z.string().min(1).optional(), audit: AuditMetadataSchema,
}).strict();
