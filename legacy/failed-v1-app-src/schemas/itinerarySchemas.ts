import { z } from "zod";
import { AuditMetadataSchema, ConfidenceMetadataSchema, DayTypeSchema, IdSchema, TenderStatusSchema } from "./commonSchemas";

const LocalTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use local 24-hour HH:MM time");

export const ItineraryDaySchema = z.object({
  id: IdSchema, sailingId: IdSchema, dayNumber: z.number().int().positive(), date: z.string().date(), dayType: DayTypeSchema, title: z.string().optional(), portId: IdSchema.optional(), arrivalTime: LocalTimeSchema.optional(), departureTime: LocalTimeSchema.optional(), allAboardTime: LocalTimeSchema.optional(), isTender: z.boolean().optional(), tenderStatus: TenderStatusSchema.optional(), timezone: z.string().optional(), selectedShorePlanId: IdSchema.optional(), backupShorePlanId: IdSchema.optional(), weatherSnapshotId: IdSchema.optional(), dayGuideId: IdSchema.optional(), familyNotes: z.string().optional(), operationalWarnings: z.array(z.string().min(1)).optional(), confidence: ConfidenceMetadataSchema.optional(), audit: AuditMetadataSchema, sampleOnly: z.boolean().optional(), dataCaveat: z.string().min(1).optional(),
}).strict().superRefine((day, context) => {
  if ((day.dayType === "port" || day.dayType === "overnight_port") && !day.portId) {
    context.addIssue({ code: "custom", message: "Port days require a reusable port reference", path: ["portId"] });
  }
});
