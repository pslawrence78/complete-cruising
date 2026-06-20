import type { z } from "zod";
import type { AdventureAlmanacExportDraftSchema, DayGuideImportSchema, FullBackupExportShellSchema, ImportBatchSchema, ItineraryImportSchema, PortEnrichmentImportSchema, SailingShellImportSchema, ShipEnrichmentImportSchema } from "../schemas";

export type ImportBatch = z.infer<typeof ImportBatchSchema>;
export type SailingShellImport = z.infer<typeof SailingShellImportSchema>;
export type ItineraryImport = z.infer<typeof ItineraryImportSchema>;
export type ShipEnrichmentImport = z.infer<typeof ShipEnrichmentImportSchema>;
export type PortEnrichmentImport = z.infer<typeof PortEnrichmentImportSchema>;
export type DayGuideImport = z.infer<typeof DayGuideImportSchema>;
export type FullBackupExportShell = z.infer<typeof FullBackupExportShellSchema>;
export type AdventureAlmanacExportDraft = z.infer<typeof AdventureAlmanacExportDraftSchema>;
