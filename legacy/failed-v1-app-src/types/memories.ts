import type { z } from "zod";
import type { AdventureAlmanacExportPreviewSchema, MemoryEntrySchema } from "../schemas";

export type MemoryEntry = z.infer<typeof MemoryEntrySchema>;
export type AdventureAlmanacExportPreview = z.infer<typeof AdventureAlmanacExportPreviewSchema>;
