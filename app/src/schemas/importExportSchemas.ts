import { z } from "zod";
import { AuditMetadataSchema, IdSchema } from "./commonSchemas";
import { DayGuideSchema } from "./dayGuideSchemas";
import { EnrichmentRunSchema, EnrichmentSectionSchema } from "./enrichmentSchemas";
import { ItineraryDaySchema } from "./itinerarySchemas";
import { AdventureAlmanacExportPreviewSchema, MemoryEntrySchema } from "./memorySchemas";
import { AttractionSchema, PortSchema } from "./portSchemas";
import { SailingSchema } from "./sailingSchemas";
import { ShipSchema } from "./shipSchemas";
import { ShorePlanSchema } from "./shorePlanSchemas";

const ImportHeaderSchema = z.object({ schemaVersion: z.number().int().positive(), importedAt: z.string().datetime({ offset: true }), sourceApp: z.string().trim().min(1).optional(), sampleOnly: z.boolean() }).strict();
export const SailingShellImportSchema = z.object({ kind: z.literal("sailing_shell"), header: ImportHeaderSchema, sailing: SailingSchema }).strict();
export const ItineraryImportSchema = z.object({ kind: z.literal("itinerary"), header: ImportHeaderSchema, sailingId: IdSchema, days: z.array(ItineraryDaySchema).min(1) }).strict();
export const ShipEnrichmentImportSchema = z.object({ kind: z.literal("ship_enrichment"), header: ImportHeaderSchema, ship: ShipSchema, sections: z.array(EnrichmentSectionSchema), enrichmentRun: EnrichmentRunSchema.optional() }).strict();
export const PortEnrichmentImportSchema = z.object({ kind: z.literal("port_enrichment"), header: ImportHeaderSchema, port: PortSchema, attractions: z.array(AttractionSchema), sections: z.array(EnrichmentSectionSchema), enrichmentRun: EnrichmentRunSchema.optional() }).strict();
export const DayGuideImportSchema = z.object({ kind: z.literal("day_guide"), header: ImportHeaderSchema, dayGuide: DayGuideSchema }).strict();
export const ShorePlanImportSchema = z.object({ kind: z.literal("shore_plan"), header: ImportHeaderSchema, sailingId: IdSchema, itineraryDayId: IdSchema, shorePlans: z.array(ShorePlanSchema).min(1) }).strict();

export const ImportBatchSchema = z.object({
  id: IdSchema,
  schema: z.string().trim().min(1).optional(),
  schemaVersion: z.number().int().positive(),
  kind: z.enum(["sailing_shell", "itinerary", "ship_enrichment", "port_enrichment", "day_guide", "shore_plan"]),
  importType: z.enum(["sailing_shell", "itinerary", "ship_enrichment", "port_enrichment", "day_guide", "shore_plan"]).optional(),
  status: z.enum(["staged", "valid", "invalid", "reviewed", "committed", "rejected", "failed"]),
  receivedAt: z.string().datetime({ offset: true }),
  committedAt: z.string().datetime({ offset: true }).optional(),
  sourceApp: z.string().trim().min(1).optional(),
  rawContent: z.unknown(),
  validationWarnings: z.array(z.string()),
  recordsCreated: z.number().int().nonnegative().optional(),
  recordsUpdated: z.number().int().nonnegative().optional(),
  recordsSkipped: z.number().int().nonnegative().optional(),
  warningCount: z.number().int().nonnegative().optional(),
  protectedFieldWarningCount: z.number().int().nonnegative().optional(),
  protectedFieldsConfirmed: z.boolean().optional(),
  validationSummary: z.string().trim().min(1).optional(),
  targetSummary: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
  audit: AuditMetadataSchema,
}).strict();

export const FullBackupExportShellSchema = z.object({ kind: z.literal("full_backup"), schemaVersion: z.number().int().positive(), exportedAt: z.string().datetime({ offset: true }), sailings: z.array(SailingSchema), ships: z.array(ShipSchema), ports: z.array(PortSchema), itineraryDays: z.array(ItineraryDaySchema), memories: z.array(MemoryEntrySchema) }).strict();
export const AdventureAlmanacExportDraftSchema = z.object({ kind: z.literal("adventure_almanac"), schemaVersion: z.number().int().positive(), exportedAt: z.string().datetime({ offset: true }), preview: AdventureAlmanacExportPreviewSchema }).strict();
