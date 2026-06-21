import type { z } from "zod";
import { DayGuideImportSchema, ItineraryImportSchema, PortEnrichmentImportSchema, SailingShellImportSchema, ShipEnrichmentImportSchema } from "../../schemas";
import { db } from "../../db/completeCruisingDb";
import type { ImportPreviewResult, ImportType, PreviewNotice, ProtectedFieldImpact } from "./importPreviewTypes";

const definitions = {
  sailing_shell: { schema: SailingShellImportSchema, name: "complete-cruising-sailing-shell-v1", targetType: "Sailing", record: "sailing" },
  itinerary: { schema: ItineraryImportSchema, name: "complete-cruising-itinerary-v1", targetType: "Sailing itinerary", record: "days" },
  ship_enrichment: { schema: ShipEnrichmentImportSchema, name: "complete-cruising-ship-enrichment-v1", targetType: "Reusable ship guidebook", record: "ship" },
  port_enrichment: { schema: PortEnrichmentImportSchema, name: "complete-cruising-port-enrichment-v1", targetType: "Reusable port guidebook", record: "port" },
  day_guide: { schema: DayGuideImportSchema, name: "complete-cruising-day-guide-v1", targetType: "Sailing-specific itinerary day", record: "dayGuide" },
} as const satisfies Record<ImportType, { schema: z.ZodTypeAny; name: string; targetType: string; record: string }>;

const protectedFields: Partial<Record<ImportType, string[]>> = {
  sailing_shell: ["departureDate", "returnDate", "cruiseLineId", "shipId", "cabinId", "voyageCode", "bookingReference"],
  itinerary: ["date", "portId", "arrivalTime", "departureTime", "allAboardTime", "isTender", "tenderStatus"],
  ship_enrichment: ["name", "cruiseLineId"],
  port_enrichment: ["name", "countryId", "timezone", "cruiseLogisticsSummary"],
};

function blank(selectedImportType: ImportType): ImportPreviewResult {
  return { status: "idle", selectedImportType, summary: "Add a structured JSON file to begin a private, local preview.", recordsToCreate: [], recordsToUpdate: [], recordsUnchanged: [], protectedFieldImpacts: [], warnings: [], errors: [], previewOnly: true };
}

function recordSet(type: ImportType, payload: any) {
  if (type === "sailing_shell") return [{ table: db.sailings, value: payload.sailing }];
  if (type === "itinerary") return payload.days.map((value: unknown) => ({ table: db.itineraryDays, value }));
  if (type === "ship_enrichment") return [{ table: db.ships, value: payload.ship }, ...payload.sections.map((value: unknown) => ({ table: db.enrichmentSections, value }))];
  if (type === "port_enrichment") return [{ table: db.ports, value: payload.port }, ...payload.attractions.map((value: unknown) => ({ table: db.attractions, value })), ...payload.sections.map((value: unknown) => ({ table: db.enrichmentSections, value }))];
  return [{ table: db.dayGuides, value: payload.dayGuide }];
}

function metadataWarnings(records: any[]): PreviewNotice[] {
  const notices: PreviewNotice[] = [];
  for (const record of records) {
    const confidence = record.value?.confidence;
    if (!confidence) continue;
    if (["medium", "low", "inferred", "unknown"].includes(confidence.confidence)) notices.push({ id: `confidence-${record.value.id}`, severity: "caution", title: "Confidence needs attention", message: `${record.value.id} uses ${confidence.confidence} confidence and should be reviewed.`, recordId: record.value.id, fieldPath: "confidence.confidence" });
    if (confidence.reviewStatus !== "verified" && confidence.reviewStatus !== "reviewed") notices.push({ id: `review-${record.value.id}`, severity: "warning", title: "Review remains open", message: `${record.value.id} is marked ${confidence.reviewStatus.replaceAll("_", " ")}.`, recordId: record.value.id, fieldPath: "confidence.reviewStatus" });
    if (confidence.refreshRecommended) notices.push({ id: `refresh-${record.value.id}`, severity: "info", title: "Refreshable data included", message: confidence.refreshReason ?? `${record.value.id} is marked for refresh.`, recordId: record.value.id, fieldPath: "confidence.refreshRecommended" });
  }
  return notices;
}

export async function createImportPreview(json: string, selectedImportType: ImportType): Promise<ImportPreviewResult> {
  if (!json.trim()) return blank(selectedImportType);
  let raw: any;
  try { raw = JSON.parse(json); } catch (error) {
    return { ...blank(selectedImportType), status: "parse_error", summary: "The text is not valid JSON.", errors: [{ id: "parse", title: "JSON could not be read", message: error instanceof Error ? error.message : "Check brackets, commas and quotation marks.", code: "invalid_json" }] };
  }
  const detected = typeof raw?.kind === "string" && raw.kind in definitions ? raw.kind as ImportType : undefined;
  if (detected && detected !== selectedImportType) {
    return { ...blank(selectedImportType), status: "type_mismatch", detectedImportType: detected, schema: definitions[detected].name, schemaVersion: raw.header?.schemaVersion, summary: `This looks like ${detected.replaceAll("_", " ")} data, not the selected import type.`, errors: [{ id: "type-mismatch", title: "Import type mismatch", message: `Choose ${detected.replaceAll("_", " ")} or use a matching payload.`, fieldPath: "kind", code: "type_mismatch" }] };
  }
  const parsed = definitions[selectedImportType].schema.safeParse(raw);
  if (!parsed.success) {
    return { ...blank(selectedImportType), status: "invalid", detectedImportType: detected, schema: detected ? definitions[detected].name : undefined, schemaVersion: raw?.header?.schemaVersion, summary: "The JSON is readable, but its structure is not yet safe to preview.", errors: parsed.error.issues.map((issue, index) => ({ id: `validation-${index}`, title: "Validation issue", message: issue.message, fieldPath: issue.path.join(".") || "payload", code: issue.code })) };
  }
  const payload: any = parsed.data;
  const records = recordSet(selectedImportType, payload);
  const create: string[] = [], update: string[] = [], unchanged: string[] = [];
  const existing = new Map<string, any>();
  for (const item of records) {
    const current = await item.table.get(item.value.id);
    if (!current) create.push(item.value.id);
    else {
      existing.set(item.value.id, current);
      const comparable = (value: any) => JSON.stringify(value, (key, entry) => key === "audit" ? undefined : entry);
      if (comparable(current) === comparable(item.value)) unchanged.push(item.value.id); else update.push(item.value.id);
    }
  }
  const primary = records[0].value;
  const impacts: ProtectedFieldImpact[] = [];
  for (const item of selectedImportType === "itinerary" ? records : records.slice(0, 1)) {
    for (const field of protectedFields[selectedImportType] ?? []) {
      if (item.value[field] !== undefined) impacts.push({ recordId: item.value.id, fieldPath: field, currentValue: existing.get(item.value.id)?.[field], proposedValue: item.value[field] });
    }
  }
  const warnings = metadataWarnings(records);
  if (impacts.length) warnings.unshift({ id: "protected", severity: "caution", title: "Protected fields touched", message: `${impacts.length} protected field${impacts.length === 1 ? " is" : "s are"} present. No values will be changed in this preview.` });
  warnings.push({ id: "preview-only", severity: "info", title: "Preview only", message: "This valid import cannot be committed until Tranche 13." });
  const targetId = selectedImportType === "itinerary" ? payload.sailingId : selectedImportType === "day_guide" ? payload.dayGuide.itineraryDayId : primary.id;
  return { status: "valid", selectedImportType, detectedImportType: selectedImportType, schema: definitions[selectedImportType].name, schemaVersion: payload.header.schemaVersion, sourceApp: payload.header.sourceApp, targetType: definitions[selectedImportType].targetType, targetId, targetName: primary.name ?? primary.title ?? targetId, summary: `${records.length} record${records.length === 1 ? "" : "s"} checked against local data. Nothing has been written.`, recordsToCreate: create, recordsToUpdate: update, recordsUnchanged: unchanged, protectedFieldImpacts: impacts, warnings, errors: [], previewOnly: true };
}

export const importTypeOptions: { value: ImportType; label: string; note: string }[] = [
  { value: "sailing_shell", label: "Sailing shell", note: "Dates, ship and voyage identity" },
  { value: "itinerary", label: "Itinerary", note: "Sailing-specific days and times" },
  { value: "ship_enrichment", label: "Ship enrichment", note: "Reusable ship guidebook" },
  { value: "port_enrichment", label: "Port enrichment", note: "Reusable port guidebook" },
  { value: "day_guide", label: "Day guide", note: "Operational guide for one itinerary day" },
];

