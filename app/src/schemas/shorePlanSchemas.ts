import { z } from "zod";
import { AuditMetadataSchema, ConfidenceMetadataSchema, CostLevelSchema, FamilySuitabilitySchema, IdSchema, RiskLevelSchema, ShorePlanStatusSchema, ShorePlanTypeSchema, WeatherDependencySchema } from "./commonSchemas";

export const ShorePlanSchema = z.object({
  id: IdSchema, sailingId: IdSchema, itineraryDayId: IdSchema, name: z.string().min(1), type: ShorePlanTypeSchema, status: ShorePlanStatusSchema, summary: z.string().optional(), durationMinutes: z.number().int().positive().optional(), transportSummary: z.string().optional(), attractionIds: z.array(IdSchema).optional(), bookingRequired: z.enum(["required", "recommended", "optional", "not_required", "unknown"]).optional(), costLevel: CostLevelSchema.optional(), familySuitability: FamilySuitabilitySchema.optional(), sebFitSummary: z.string().optional(), returnRisk: RiskLevelSchema, returnBufferMinutes: z.number().int().nonnegative().optional(), weatherDependency: WeatherDependencySchema, confidence: ConfidenceMetadataSchema, audit: AuditMetadataSchema, sampleOnly: z.boolean().optional(), dataCaveat: z.string().min(1).optional(),
}).strict();
