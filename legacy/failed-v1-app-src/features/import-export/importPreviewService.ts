import type { CompleteCruisingDb } from "../../db/completeCruisingDb";
import { db } from "../../db/completeCruisingDb";
import { enrichmentRequestDefinitions, type ImportType } from "../enrichment-requests/enrichmentRequestTypes";
import type { ImportPreviewResult, PreviewNotice, ProtectedFieldImpact } from "./importPreviewTypes";
import { convertEnrichmentReturnToImportPayload } from "./enrichmentReturnConverters";
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

export const enrichmentReturnSchemaImportMap = Object.fromEntries(
  enrichmentRequestDefinitions.map((definition) => [definition.returnSchemaName, definition.importType]),
) as Record<string, ImportType>;

const comparable = (value: unknown) => JSON.stringify(value, (key, entry) => key === "audit" ? undefined : entry);

function blank(selectedImportType: ImportType): ImportPreviewResult {
  return {
    status: "idle",
    selectedImportType,
    summary: "Add a structured JSON file to begin a private, local preview.",
    recordsToCreate: [],
    recordsToUpdate: [],
    recordsUnchanged: [],
    protectedFieldImpacts: [],
    warnings: [],
    errors: [],
    previewOnly: true,
  };
}

function metadataWarnings(records: Array<{ value: any }>): PreviewNotice[] {
  const notices: PreviewNotice[] = [];
  for (const record of records) {
    const confidence = record.value?.confidence;
    if (!confidence) continue;
    if (["medium", "low", "inferred", "unknown"].includes(confidence.confidence)) {
      notices.push({
        id: `confidence-${record.value.id}`,
        severity: "caution",
        title: "Confidence needs attention",
        message: `${record.value.id} uses ${confidence.confidence} confidence and should be reviewed.`,
        recordId: record.value.id,
        fieldPath: "confidence.confidence",
      });
    }
    if (confidence.reviewStatus !== "verified" && confidence.reviewStatus !== "reviewed") {
      notices.push({
        id: `review-${record.value.id}`,
        severity: "warning",
        title: "Review remains open",
        message: `${record.value.id} is marked ${confidence.reviewStatus.replaceAll("_", " ")}.`,
        recordId: record.value.id,
        fieldPath: "confidence.reviewStatus",
      });
    }
    if (confidence.refreshRecommended) {
      notices.push({
        id: `refresh-${record.value.id}`,
        severity: "info",
        title: "Refreshable data included",
        message: confidence.refreshReason ?? `${record.value.id} is marked for refresh.`,
        recordId: record.value.id,
        fieldPath: "confidence.refreshRecommended",
      });
    }
  }
  return notices;
}

async function classifyRecords(
  records: Array<{ tableName: any; value: any }>,
  database: CompleteCruisingDb,
) {
  const create: string[] = [];
  const update: string[] = [];
  const unchanged: string[] = [];
  const existing = new Map<string, any>();

  for (const item of records) {
    const current = await getImportTable(database, item.tableName).get(item.value.id);
    if (!current) {
      create.push(item.value.id);
      continue;
    }
    existing.set(item.value.id, current);
    if (comparable(current) === comparable(item.value)) unchanged.push(item.value.id);
    else update.push(item.value.id);
  }

  return { create, update, unchanged, existing };
}

function targetIdForPayload(type: ImportType, payload: any, primaryRecordId: string) {
  if (type === "itinerary") return payload.sailingId;
  if (type === "day_guide") return payload.dayGuide.itineraryDayId;
  if (type === "shore_plan") return payload.itineraryDayId;
  return primaryRecordId;
}

function protectedFieldImpactsForPayload(
  type: ImportType,
  records: Array<{ value: any }>,
  existing: Map<string, any>,
): ProtectedFieldImpact[] {
  const impacts: ProtectedFieldImpact[] = [];
  const scope = type === "itinerary" || type === "shore_plan" ? records : records.slice(0, 1);
  for (const item of scope) {
    for (const field of protectedFields[type] ?? []) {
      if (item.value[field] !== undefined) {
        impacts.push({
          recordId: item.value.id,
          fieldPath: field,
          currentValue: existing.get(item.value.id)?.[field],
          proposedValue: item.value[field],
        });
      }
    }
  }
  return impacts;
}

async function buildPreviewFromCanonicalPayload(
  canonicalPayload: any,
  selectedImportType: ImportType,
  database: CompleteCruisingDb,
  options?: {
    schema?: string;
    schemaVersion?: number;
    sourceApp?: string;
    targetType?: string;
    targetId?: string;
    targetName?: string;
    warnings?: PreviewNotice[];
    ignoreProtectedFieldImpacts?: boolean;
  },
): Promise<ImportPreviewResult> {
  const records = getImportRecordCandidates(selectedImportType, canonicalPayload);
  const { create, update, unchanged, existing } = await classifyRecords(records, database);
  const primary = records[0]?.value;
  const impacts = options?.ignoreProtectedFieldImpacts ? [] : protectedFieldImpactsForPayload(selectedImportType, records, existing);
  const warnings = [...(options?.warnings ?? []), ...metadataWarnings(records)];

  if (impacts.length) {
    warnings.unshift({
      id: "protected",
      severity: "caution",
      title: "Protected fields touched",
      message: `${impacts.length} protected field${impacts.length === 1 ? " is" : "s are"} present. No values will be changed in this preview.`,
    });
  }

  warnings.push({
    id: "commit-gate",
    severity: "info",
    title: "Commit gate",
    message: "Only this validated preview can be committed. Protected overwrites need explicit confirmation.",
  });

  const targetId = options?.targetId ?? targetIdForPayload(selectedImportType, canonicalPayload, primary.id);
  const targetName = options?.targetName ?? primary.name ?? primary.title ?? targetId;

  return {
    status: "valid",
    selectedImportType,
    detectedImportType: selectedImportType,
    schema: options?.schema ?? importDefinitions[selectedImportType].name,
    schemaVersion: options?.schemaVersion ?? canonicalPayload.header.schemaVersion,
    sourceApp: options?.sourceApp ?? canonicalPayload.header.sourceApp,
    targetType: options?.targetType ?? importDefinitions[selectedImportType].targetType,
    targetId,
    targetName,
    summary: `${records.length} record${records.length === 1 ? "" : "s"} checked against local data. Nothing has been written yet.`,
    recordsToCreate: create,
    recordsToUpdate: update,
    recordsUnchanged: unchanged,
    protectedFieldImpacts: impacts,
    warnings,
    errors: [],
    previewOnly: true,
  };
}

async function createSailingShellEnrichmentPreview(
  raw: unknown,
  selectedImportType: ImportType,
  database: CompleteCruisingDb,
): Promise<ImportPreviewResult> {
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
      errors: error instanceof Error
        ? [{
          id: "sailing-enrichment-schema",
          title: "Sailing enrichment shape mismatch",
          message: error.message,
          fieldPath: "schema",
          code: "invalid_return_schema",
        }]
        : [{
          id: "sailing-enrichment-schema",
          title: "Sailing enrichment shape mismatch",
          message: "Check the returned schema fields.",
          fieldPath: "schema",
          code: "invalid_return_schema",
        }],
    };
  }

  const targetSailing = payload.target.sailingId
    ? await database.sailings.get(payload.target.sailingId)
    : undefined;
  if (!targetSailing) {
    return {
      ...blank(selectedImportType),
      status: "invalid",
      detectedImportType: "sailing_shell",
      schema: payload.schema,
      schemaVersion: payload.schemaVersion,
      sourceApp: payload.sourceApp,
      targetType: "Sailing-level context enrichment",
      targetId: payload.target.sailingId ?? undefined,
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
  const { create, update, unchanged } = await classifyRecords(records, database);

  const warnings = [
    ...sailingShellEnrichmentWarnings(payload),
    ...metadataWarnings(records),
    {
      id: "commit-gate",
      severity: "info" as const,
      title: "Commit gate",
      message: "Only the enrichment run and sailing-level enrichment sections from this validated preview can be committed.",
    },
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

export async function createImportPreview(
  json: string,
  selectedImportType: ImportType,
  database: CompleteCruisingDb = db,
): Promise<ImportPreviewResult> {
  if (!json.trim()) return blank(selectedImportType);

  let raw: any;
  try {
    raw = JSON.parse(json);
  } catch (error) {
    return {
      ...blank(selectedImportType),
      status: "parse_error",
      summary: "The text is not valid JSON.",
      errors: [{
        id: "parse",
        title: "JSON could not be read",
        message: error instanceof Error ? error.message : "Check brackets, commas and quotation marks.",
        code: "invalid_json",
      }],
    };
  }

  const schemaName = typeof raw?.schema === "string" ? raw.schema : undefined;
  const detectedFromReturnSchema = schemaName ? enrichmentReturnSchemaImportMap[schemaName] : undefined;
  const detectedFromKind = typeof raw?.kind === "string" && raw.kind in importDefinitions
    ? (raw.kind as ImportType)
    : undefined;
  const detected = detectedFromKind ?? detectedFromReturnSchema;

  if (detected && detected !== selectedImportType) {
    return {
      ...blank(selectedImportType),
      status: "type_mismatch",
      detectedImportType: detected,
      schema: schemaName ?? importDefinitions[detected].name,
      schemaVersion: raw.schemaVersion ?? raw.header?.schemaVersion,
      summary: `This looks like ${detected.replaceAll("_", " ")} data, not the selected import type.`,
      errors: [{
        id: "type-mismatch",
        title: "Import type mismatch",
        message: `Choose ${detected.replaceAll("_", " ")} or use a matching payload.`,
        fieldPath: detectedFromKind ? "kind" : "schema",
        code: "type_mismatch",
      }],
    };
  }

  if (schemaName === sailingShellEnrichmentSchemaName) {
    return createSailingShellEnrichmentPreview(raw, selectedImportType, database);
  }

  let convertedReturn;
  try {
    convertedReturn = detectedFromReturnSchema
      ? await convertEnrichmentReturnToImportPayload(raw, database)
      : undefined;
  } catch (error) {
    const issues = error instanceof Error && "issues" in error
      ? (error as { issues?: Array<{ path: Array<string | number>; message: string; code: string }> }).issues ?? []
      : [];
    return {
      ...blank(selectedImportType),
      status: "invalid",
      detectedImportType: detectedFromReturnSchema,
      schema: schemaName,
      schemaVersion: raw?.schemaVersion,
      sourceApp: raw?.sourceApp,
      summary: "The enrichment return shape is incomplete or inconsistent.",
      errors: issues.length
        ? issues.map((issue, index) => ({
          id: `validation-${index}`,
          title: "Validation issue",
          message: issue.message,
          fieldPath: issue.path.join("."),
          code: issue.code,
        }))
        : [{
          id: "return-schema-validation",
          title: "Validation issue",
          message: error instanceof Error ? error.message : "The enrichment return schema could not be validated.",
          fieldPath: "schema",
          code: "invalid_return_schema",
        }],
    };
  }
  if (convertedReturn) {
    if (convertedReturn.errors.length > 0 || !convertedReturn.payload) {
      return {
        ...blank(selectedImportType),
        status: "invalid",
        detectedImportType: convertedReturn.importType,
        schema: convertedReturn.schema,
        schemaVersion: convertedReturn.schemaVersion,
        sourceApp: convertedReturn.sourceApp,
        targetType: convertedReturn.targetType,
        targetId: convertedReturn.targetId,
        targetName: convertedReturn.targetName,
        summary: "The enrichment return was recognised, but it still needs attention before it is safe to commit.",
        warnings: convertedReturn.warnings,
        errors: convertedReturn.errors,
      };
    }

    const parsedConverted = importDefinitions[selectedImportType].schema.safeParse(convertedReturn.payload);
    if (!parsedConverted.success) {
      return {
        ...blank(selectedImportType),
        status: "invalid",
        detectedImportType: convertedReturn.importType,
        schema: convertedReturn.schema,
        schemaVersion: convertedReturn.schemaVersion,
        sourceApp: convertedReturn.sourceApp,
        summary: "The enrichment return was recognised, but its mapped local payload is still invalid.",
        warnings: convertedReturn.warnings,
        errors: parsedConverted.error.issues.map((issue, index) => ({
          id: `validation-${index}`,
          title: "Validation issue",
          message: issue.message,
          fieldPath: issue.path.join(".") || "payload",
          code: issue.code,
        })),
      };
    }

    return buildPreviewFromCanonicalPayload(parsedConverted.data, selectedImportType, database, {
      schema: convertedReturn.schema,
      schemaVersion: convertedReturn.schemaVersion,
      sourceApp: convertedReturn.sourceApp,
      targetType: convertedReturn.targetType,
      targetId: convertedReturn.targetId,
      targetName: convertedReturn.targetName,
      warnings: convertedReturn.warnings,
      ignoreProtectedFieldImpacts: convertedReturn.ignoreProtectedFieldImpacts,
    });
  }

  if (schemaName && !detectedFromReturnSchema && !detectedFromKind) {
    return {
      ...blank(selectedImportType),
      status: "invalid",
      schema: schemaName,
      schemaVersion: raw.schemaVersion,
      summary: "The schema name is not recognised by this repair contract.",
      errors: [{
        id: "invalid-schema-name",
        title: "Schema name not recognised",
        message: "Choose one of the supported Complete Cruising import or enrichment return schemas.",
        fieldPath: "schema",
        code: "invalid_schema_name",
      }],
    };
  }

  const parsed = importDefinitions[selectedImportType].schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ...blank(selectedImportType),
      status: "invalid",
      detectedImportType: detected,
      schema: detected ? importDefinitions[detected].name : undefined,
      schemaVersion: raw?.header?.schemaVersion,
      summary: "The JSON is readable, but its structure is not yet safe to preview.",
      errors: parsed.error.issues.map((issue, index) => ({
        id: `validation-${index}`,
        title: "Validation issue",
        message: issue.message,
        fieldPath: issue.path.join(".") || "payload",
        code: issue.code,
      })),
    };
  }

  return buildPreviewFromCanonicalPayload(parsed.data, selectedImportType, database);
}

export const importTypeOptions: { value: ImportType; label: string; note: string }[] = enrichmentRequestDefinitions.map((definition) => ({
  value: definition.importType,
  label: definition.label,
  note: definition.importNote,
}));
