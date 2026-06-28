import { ImportBatchSchema } from "../../schemas";
import { db, type CompleteCruisingDb, type ImportBatch } from "../../db/completeCruisingDb";
import type { ImportPreviewResult, ImportType } from "./importPreviewTypes";
import { getImportRecordCandidates, getImportTable, importDefinitions, parseImportPayload } from "./importRecordMapping";
import {
  findReviewedSectionConflict,
  getSailingShellEnrichmentCandidates,
  parseSailingShellEnrichmentPayload,
  sailingShellEnrichmentSchemaName,
} from "./sailingShellEnrichmentMapper";

export interface ImportCommitResult {
  status: "committed" | "blocked" | "failed";
  message: string;
  batch?: ImportBatch;
}

function normaliseImportedRecord(record: any, existing: any, now: string) {
  const incomingAudit = record.audit ?? {};
  return {
    ...record,
    audit: {
      createdAt: existing?.audit?.createdAt ?? incomingAudit.createdAt ?? now,
      createdBy: existing?.audit?.createdBy ?? incomingAudit.createdBy ?? "import",
      updatedAt: now,
      updatedBy: "import",
      archivedAt: existing?.audit?.archivedAt ?? incomingAudit.archivedAt,
    },
  };
}

function batchId(type: ImportType, now: string) {
  return `import-${type}-${now.replace(/[^0-9]/g, "")}`;
}

async function commitSailingShellEnrichmentImport(
  raw: unknown,
  preview: ImportPreviewResult,
  database: CompleteCruisingDb,
): Promise<ImportCommitResult> {
  let payload;
  try {
    payload = parseSailingShellEnrichmentPayload(raw);
  } catch {
    return { status: "blocked", message: "The sailing enrichment JSON no longer matches the validated return schema. Preview it again before committing." };
  }

  const targetSailing = await database.sailings.get(payload.target.sailingId);
  if (!targetSailing) {
    return { status: "blocked", message: "The target sailing is not in local storage. Create the sailing shell before committing its enrichment." };
  }

  const now = new Date().toISOString();
  const records = getSailingShellEnrichmentCandidates(payload, now);
  const protectedConflict = await findReviewedSectionConflict(database, records);
  if (protectedConflict) {
    return { status: "blocked", message: protectedConflict.message };
  }

  const unchanged = new Set(preview.recordsUnchanged);
  const protectedFieldWarnings = payload.importAdvice?.protectedFieldWarnings ?? [];
  const batch = ImportBatchSchema.parse({
    id: batchId("sailing_shell", now),
    schema: payload.schema,
    schemaVersion: payload.schemaVersion,
    kind: "sailing_shell",
    importType: "sailing_shell",
    status: "committed",
    receivedAt: payload.generatedAt,
    committedAt: now,
    sourceApp: payload.sourceApp,
    rawContent: payload,
    validationWarnings: preview.warnings.map((warning) => warning.message),
    recordsCreated: preview.recordsToCreate.length,
    recordsUpdated: preview.recordsToUpdate.length,
    recordsSkipped: preview.recordsUnchanged.length,
    warningCount: preview.warnings.length,
    protectedFieldWarningCount: protectedFieldWarnings.length,
    protectedFieldsConfirmed: false,
    validationSummary: preview.summary,
    targetSummary: `Sailing-level context enrichment: ${targetSailing.name}`,
    notes: "Committed from a Tranche 18A sailing shell enrichment mapper. No itinerary, port, timing or booking fields were changed.",
    audit: { createdAt: now, updatedAt: now, createdBy: "import", updatedBy: "import" },
  });

  try {
    await database.transaction("rw", database.tables, async () => {
      for (const record of records) {
        if (unchanged.has(record.value.id)) continue;
        const table = getImportTable(database, record.tableName);
        const existing = await table.get(record.value.id);
        await table.put(normaliseImportedRecord(record.value, existing, now));
      }
      await database.importBatches.put(batch);
    });
    return { status: "committed", message: "Sailing-level enrichment committed to local storage.", batch };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "The import transaction failed before it could be committed.",
    };
  }
}

export async function commitValidatedImport(
  json: string,
  selectedImportType: ImportType,
  preview: ImportPreviewResult,
  protectedFieldsConfirmed: boolean,
  database: CompleteCruisingDb = db,
): Promise<ImportCommitResult> {
  if (preview.status !== "valid" || preview.selectedImportType !== selectedImportType) {
    return { status: "blocked", message: "Commit unavailable until the current JSON has a valid preview." };
  }
  if (preview.protectedFieldImpacts.length > 0 && !protectedFieldsConfirmed) {
    return { status: "blocked", message: "Protected cruise data needs explicit confirmation before commit." };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { status: "blocked", message: "The JSON could not be read. Preview it again before committing." };
  }

  if (typeof (raw as { schema?: unknown })?.schema === "string" && (raw as { schema: string }).schema === sailingShellEnrichmentSchemaName) {
    return commitSailingShellEnrichmentImport(raw, preview, database);
  }

  let payload: any;
  try {
    payload = parseImportPayload(json, selectedImportType);
  } catch {
    return { status: "blocked", message: "The JSON no longer matches the validated import type. Preview it again before committing." };
  }

  if (payload.kind !== preview.detectedImportType) {
    return { status: "blocked", message: "The preview no longer matches the selected import type." };
  }

  const now = new Date().toISOString();
  const records = getImportRecordCandidates(selectedImportType, payload);
  const batch = ImportBatchSchema.parse({
    id: batchId(selectedImportType, now),
    schema: importDefinitions[selectedImportType].name,
    schemaVersion: payload.header.schemaVersion,
    kind: selectedImportType,
    importType: selectedImportType,
    status: "committed",
    receivedAt: payload.header.importedAt,
    committedAt: now,
    sourceApp: payload.header.sourceApp,
    rawContent: payload,
    validationWarnings: preview.warnings.map((warning) => warning.message),
    recordsCreated: preview.recordsToCreate.length,
    recordsUpdated: preview.recordsToUpdate.length,
    recordsSkipped: preview.recordsUnchanged.length,
    warningCount: preview.warnings.length,
    protectedFieldWarningCount: preview.protectedFieldImpacts.length,
    protectedFieldsConfirmed,
    validationSummary: preview.summary,
    targetSummary: [preview.targetType, preview.targetName ?? preview.targetId].filter(Boolean).join(": "),
    notes: "Committed from a Tranche 13 validated local preview.",
    audit: { createdAt: now, updatedAt: now, createdBy: "import", updatedBy: "import" },
  });

  try {
    await database.transaction("rw", database.tables, async () => {
      for (const record of records) {
        const table = getImportTable(database, record.tableName);
        const existing = await table.get(record.value.id);
        await table.put(normaliseImportedRecord(record.value, existing, now));
      }
      await database.importBatches.put(batch);
    });
    return { status: "committed", message: "Import committed to local storage.", batch };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "The import transaction failed before it could be committed.",
    };
  }
}
