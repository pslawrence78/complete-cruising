import { z } from "zod";
import { AuditMetadataSchema, ConfidenceMetadataSchema, IdSchema, WeatherSnapshotTypeSchema } from "./commonSchemas";

export const WeatherSnapshotSchema = z.object({
  id: IdSchema, sailingId: IdSchema, itineraryDayId: IdSchema, snapshotType: WeatherSnapshotTypeSchema, capturedAt: z.string().datetime({ offset: true }), condition: z.string().optional(), highTemperatureC: z.number().min(-100).max(70).optional(), lowTemperatureC: z.number().min(-100).max(70).optional(), rainChancePercent: z.number().min(0).max(100).optional(), planImpact: z.string().optional(), confidence: ConfidenceMetadataSchema, audit: AuditMetadataSchema, sampleOnly: z.boolean().optional(), dataCaveat: z.string().min(1).optional(),
}).strict();
