import { z } from "zod";
import { AuditMetadataSchema, ConfidenceMetadataSchema, IdSchema, RiskLevelSchema } from "./commonSchemas";

export const DayGuideSchema = z.object({
  id: IdSchema, sailingId: IdSchema, itineraryDayId: IdSchema, title: z.string().min(1), operationalSummary: z.string().optional(), latestSafeReturnTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(), returnRisk: RiskLevelSchema.optional(), checklist: z.array(z.object({ id: IdSchema, label: z.string().min(1), note: z.string().optional() }).strict()).optional(), localContext: z.object({ language: z.string().optional(), currency: z.string().optional(), phrase: z.string().optional(), phraseMeaning: z.string().optional() }).strict().optional(), sebDiscovery: z.object({ prompt: z.string().min(1), fact: z.string().optional(), photoPrompt: z.string().optional() }).strict().optional(), confidence: ConfidenceMetadataSchema, audit: AuditMetadataSchema, sampleOnly: z.boolean().optional(), dataCaveat: z.string().min(1).optional(),
}).strict();
