import type { ImportPreviewResult, ImportType, PreviewNotice, ProtectedFieldImpact } from "./importPreviewTypes";
import type { CompleteCruisingDb } from "../../db/completeCruisingDb";
import { db } from "../../db/completeCruisingDb";
import { getImportRecordCandidates, getImportTable, importDefinitions } from "./importRecordMapping";
import {
  findReviewedSectionConflict,
  getSailingShellEnrichmentCandidates,
  parseSailingShellEnrichmentPayload,
  sailingShellEnrichmentSchemaName,
  sailingShellEnrichmentWarnings,
} from "./sailingShellEnrichmentMapper";

const protectedFields: Partial<Record<ImportType, string[]>> = {
  sailing_shell: ["departureDate", "returnDate", "cruiseLineId", "shipId", "cabinId", "voyageCode", "bookingReference"],
  itinerary: ["date", "portId", "arrivalTime", "departureTime", "allAboardTime", "isTender", "tenderStatus"],
  ship_enrichment: ["name", "cruiseLineId"],
  port_enrichment: ["name", "countryId", "timezone", "cruiseLogisticsSummary"],
};

export const enrichmentReturnSchemaImportMap: Record<string, ImportType> = {
  "complete-cruising-sailing-shell-enrichment-v1": "sailing_shell",
  "complete-cruising-itinerary-verification-v1": "itinerary",
  "complete-cruising-ship-pack-enrichment-v1": "ship_enrichment",
  "complete-cruising-port-pack-enrichment-v1": "port_enrichment",
  "complete-cruising-shore-plan-generation-v1": "itinerary",
  "complete-cruising-day-guide-generation-v1": "day_guide",
};

const comparable = (value: any) => JSON.stringify(value, (key, entry) => key === "audit" ? undefined : entry);

function blank(selectedImportType: ImportType): ImportPreviewResult {
  return { status: "idle", selectedImportType, summary: "Add a structured JSON file to begin a private, local preview.", recordsToCreate: [], recordsToUpdate: [], recordsUnchanged: [], protectedFieldImpacts: [], warnings: [], errors: [], previewOnly: true };
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

async function createSailingShellEnrichmentPreview(raw: unknown, selectedImportType: ImportType, database: CompleteCruisingDb): Promise<ImportPreviewResult> {
  let payload;
  try {
    payload = parseSailingShellEnrichmentPayload(raw);
  } catch (error) {
    return {
      ...blank(selectedImportType),
      status: "invalid",
      detectedImportType: "sailing_shell",
      schema: sailingShellEnrichmentSchemaName,
      summary: "The sailing enrichment return is recognised, but its structure is not safe to map yet.",
      errors: error instanceof Error ? [{ id: "sailing-enrichment-schema", title: "Sailing enrichment shape mismatch", message: error.message, fieldPath: "schema", code: "invalid_return_schema" }] : [{ id: "sailing-enrichment-schema", title: "Sailing enrichment shape mismatch", message: "Check the returned schema fields.", fieldPath: "schema", code: "invalid_return_schema" }],
    };
  }

  const targetSailing = await database.sailings.get(payload.target.sailingId);
  if (!targetSailing) {
    return {
      ...blank(selectedImportType),
      status: "invalid",
      detectedImportType: "sailing_shell",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      targetType: "Sailing-level context enrichment",
      targetId: payload.target.sailingId,
      targetName: payload.target.sailingName,
      summary: "This enrichment needs its sailing shell before it can be committed.",
      warnings: sailingShellEnrichmentWarnings(payload),
      errors: [{
        id: "missing-target-sailing",
        title: "Target sailing not found",
        message: "Create or import the matching sailing shell first. Sailing-level enrichment must attach to an existing local sailing and will not create one for you.",
        fieldPath: "target.sailingId",
        code: "missing_target_sailing",
      }],
    };
  }

  const records = getSailingShellEnrichmentCandidates(payload, payload.generatedAt);
  const protectedConflict = await findReviewedSectionConflict(database, records);
  const create: string[] = [], update: string[] = [], unchanged: string[] = [];

  for (const item of records) {
    const current = await getImportTable(database, item.tableName).get(item.value.id);
    if (!current) create.push(item.value.id);
    else if (comparable(current) === comparable(item.value)) unchanged.push(item.value.id);
    else update.push(item.value.id);
  }

  const warnings = [
    ...sailingShellEnrichmentWarnings(payload),
    ...metadataWarnings(records),
    { id: "commit-gate", severity: "info" as const, title: "Commit gate", message: "Only the enrichment run and sailing-level enrichment sections from this validated preview can be committed." },
  ];

  if (protectedConflict) {
    return {
      status: "invalid",
      selectedImportType,
      detectedImportType: "sailing_shell",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      targetType: "Sailing-level context enrichment",
      targetId: targetSailing.id,
      targetName: targetSailing.name,
      summary: "A reviewed or verified local enrichment section would be overwritten.",
      recordsToCreate: create,
      recordsToUpdate: update,
      recordsUnchanged: unchanged,
      protectedFieldImpacts: [],
      warnings,
      errors: [protectedConflict],
      previewOnly: true,
    };
  }

  return {
    status: "valid",
    selectedImportType,
    detectedImportType: "sailing_shell",
    schema: payload.schema,
    schemaVersion: payload.schemaVersion,
    sourceApp: payload.sourceApp,
    targetType: "Sailing-level context enrichment",
    targetId: targetSailing.id,
    targetName: targetSailing.name,
    summary: `${records.length} sailing-level enrichment record${records.length === 1 ? "" : "s"} checked against local data. No itinerary, port, timing or booking fields will be changed.`,
    recordsToCreate: create,
    recordsToUpdate: update,
    recordsUnchanged: unchanged,
    protectedFieldImpacts: [],
    warnings,
    errors: [],
    previewOnly: true,
  };
}

export async function createImportPreview(json: string, selectedImportType: ImportType, database: CompleteCruisingDb = db): Promise<ImportPreviewResult> {
  if (!json.trim()) return blank(selectedImportType);
  let raw: any;
  try { raw = JSON.parse(json); } catch (error) {
    return { ...blank(selectedImportType), status: "parse_error", summary: "The text is not valid JSON.", errors: [{ id: "parse", title: "JSON could not be read", message: error instanceof Error ? error.message : "Check brackets, commas and quotation marks.", code: "invalid_json" }] };
  }
  const detectedFromReturnSchema = typeof raw?.schema === "string" ? enrichmentReturnSchemaImportMap[raw.schema] : undefined;
  const detected = typeof raw?.kind === "string" && raw.kind in importDefinitions ? raw.kind as ImportType : detectedFromReturnSchema;
  if (detected && detected !== selectedImportType) {
    return { ...blank(selectedImportType), status: "type_mismatch", detectedImportType: detected, schema: importDefinitions[detected].name, schemaVersion: raw.header?.schemaVersion, summary: `This looks like ${detected.replaceAll("_", " ")} data, not the selected import type.`, errors: [{ id: "type-mismatch", title: "Import type mismatch", message: `Choose ${detected.replaceAll("_", " ")} or use a matching payload.`, fieldPath: "kind", code: "type_mismatch" }] };
  }
  if (raw?.schema === sailingShellEnrichmentSchemaName) {
    return createSailingShellEnrichmentPreview(raw, selectedImportType, database);
  }
  if (detectedFromReturnSchema) {
    return {
      ...blank(selectedImportType),
      status: "invalid",
      detectedImportType: detectedFromReturnSchema,
      schema: raw.schema,
      schemaVersion: raw.schemaVersion,
      sourceApp: raw.sourceApp,
      summary: "This recognised enrichment return schema needs import mapping before it can be committed.",
      warnings: [{ id: "recognised-return-schema", severity: "info", title: "Recognised enrichment return", message: "Route this through Import / Export preview, but only sailing shell enrichment has a safe mapper in this tranche." }],
      errors: [{ id: "return-schema-limitation", title: "Preview mapping incomplete", message: "The returned ChatGPT shape is recognised, but a safe field-level mapper is not implemented in this tranche.", fieldPath: "schema", code: "unsupported_return_schema" }],
    };
  }
  const parsed = importDefinitions[selectedImportType].schema.safeParse(raw);
  if (!parsed.success) {
    return { ...blank(selectedImportType), status: "invalid", detectedImportType: detected, schema: detected ? importDefinitions[detected].name : undefined, schemaVersion: raw?.header?.schemaVersion, summary: "The JSON is readable, but its structure is not yet safe to preview.", errors: parsed.error.issues.map((issue, index) => ({ id: `validation-${index}`, title: "Validation issue", message: issue.message, fieldPath: issue.path.join(".") || "payload", code: issue.code })) };
  }
  const payload: any = parsed.data;
  const records = getImportRecordCandidates(selectedImportType, payload);
  const create: string[] = [], update: string[] = [], unchanged: string[] = [];
  const existing = new Map<string, any>();
  for (const item of records) {
    const current = await getImportTable(database, item.tableName).get(item.value.id);
    if (!current) create.push(item.value.id);
    else {
      existing.set(item.value.id, current);
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
  warnings.push({ id: "commit-gate", severity: "info", title: "Commit gate", message: "Only this validated preview can be committed. Protected overwrites need explicit confirmation." });
  const targetId = selectedImportType === "itinerary" ? payload.sailingId : selectedImportType === "day_guide" ? payload.dayGuide.itineraryDayId : primary.id;
  return { status: "valid", selectedImportType, detectedImportType: selectedImportType, schema: importDefinitions[selectedImportType].name, schemaVersion: payload.header.schemaVersion, sourceApp: payload.header.sourceApp, targetType: importDefinitions[selectedImportType].targetType, targetId, targetName: primary.name ?? primary.title ?? targetId, summary: `${records.length} record${records.length === 1 ? "" : "s"} checked against local data. Nothing has been written yet.`, recordsToCreate: create, recordsToUpdate: update, recordsUnchanged: unchanged, protectedFieldImpacts: impacts, warnings, errors: [], previewOnly: true };
}

export const importTypeOptions: { value: ImportType; label: string; note: string }[] = [
  { value: "sailing_shell", label: "Sailing shell", note: "Dates, ship and voyage identity" },
  { value: "itinerary", label: "Itinerary", note: "Sailing-specific days and times" },
  { value: "ship_enrichment", label: "Ship enrichment", note: "Reusable ship guidebook" },
  { value: "port_enrichment", label: "Port enrichment", note: "Reusable port guidebook" },
  { value: "day_guide", label: "Day guide", note: "Operational guide for one itinerary day" },
];
