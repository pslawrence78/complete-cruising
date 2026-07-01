import type { z } from "zod";
import {
  DayGuideImportSchema,
  ItineraryImportSchema,
  PortEnrichmentImportSchema,
  SailingShellImportSchema,
  ShorePlanImportSchema,
  ShipEnrichmentImportSchema,
} from "../../schemas";
import type { CompleteCruisingDb } from "../../db/completeCruisingDb";
import type { ImportType } from "./importPreviewTypes";

export const importDefinitions = {
  sailing_shell: { schema: SailingShellImportSchema, name: "complete-cruising-sailing-shell-v1", targetType: "Sailing" },
  itinerary: { schema: ItineraryImportSchema, name: "complete-cruising-itinerary-v1", targetType: "Sailing itinerary" },
  ship_enrichment: { schema: ShipEnrichmentImportSchema, name: "complete-cruising-ship-enrichment-v1", targetType: "Reusable ship guidebook" },
  port_enrichment: { schema: PortEnrichmentImportSchema, name: "complete-cruising-port-enrichment-v1", targetType: "Reusable port guidebook" },
  day_guide: { schema: DayGuideImportSchema, name: "complete-cruising-day-guide-v1", targetType: "Sailing-specific itinerary day" },
  shore_plan: { schema: ShorePlanImportSchema, name: "complete-cruising-shore-plan-v1", targetType: "Sailing-specific shore plan" },
} as const satisfies Record<ImportType, { schema: z.ZodTypeAny; name: string; targetType: string }>;

export type ImportTableName =
  | "sailings"
  | "itineraryDays"
  | "ships"
  | "ports"
  | "attractions"
  | "enrichmentSections"
  | "enrichmentRuns"
  | "dayGuides"
  | "shorePlans";

export interface ImportRecordCandidate {
  tableName: ImportTableName;
  value: any;
}

export function getImportRecordCandidates(type: ImportType, payload: any): ImportRecordCandidate[] {
  if (type === "sailing_shell") return [{ tableName: "sailings", value: payload.sailing }];
  if (type === "itinerary") return payload.days.map((value: ImportRecordCandidate["value"]) => ({ tableName: "itineraryDays", value }));
  if (type === "ship_enrichment") return [
    { tableName: "ships", value: payload.ship },
    ...(payload.enrichmentRun ? [{ tableName: "enrichmentRuns" as const, value: payload.enrichmentRun }] : []),
    ...payload.sections.map((value: ImportRecordCandidate["value"]) => ({ tableName: "enrichmentSections", value })),
  ];
  if (type === "port_enrichment") return [
    { tableName: "ports", value: payload.port },
    ...payload.attractions.map((value: ImportRecordCandidate["value"]) => ({ tableName: "attractions", value })),
    ...(payload.enrichmentRun ? [{ tableName: "enrichmentRuns" as const, value: payload.enrichmentRun }] : []),
    ...payload.sections.map((value: ImportRecordCandidate["value"]) => ({ tableName: "enrichmentSections", value })),
  ];
  if (type === "shore_plan") return payload.shorePlans.map((value: ImportRecordCandidate["value"]) => ({ tableName: "shorePlans", value }));
  return [{ tableName: "dayGuides", value: payload.dayGuide }];
}

export function getImportTable(database: CompleteCruisingDb, tableName: ImportTableName) {
  return database.table(tableName);
}

export function parseImportPayload(json: string, selectedImportType: ImportType) {
  const raw = JSON.parse(json);
  return importDefinitions[selectedImportType].schema.parse(raw);
}
