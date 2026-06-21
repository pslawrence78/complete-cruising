export type ImportType = "sailing_shell" | "itinerary" | "ship_enrichment" | "port_enrichment" | "day_guide";

export type PreviewStatus = "idle" | "valid" | "invalid" | "parse_error" | "type_mismatch";

export interface PreviewNotice {
  id: string;
  title: string;
  message: string;
  fieldPath?: string;
  recordId?: string;
  severity?: "info" | "warning" | "caution";
  code?: string;
}

export interface ProtectedFieldImpact {
  recordId: string;
  fieldPath: string;
  currentValue?: unknown;
  proposedValue: unknown;
}

export interface ImportPreviewResult {
  status: PreviewStatus;
  selectedImportType: ImportType;
  detectedImportType?: ImportType;
  schema?: string;
  schemaVersion?: number;
  sourceApp?: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  summary: string;
  recordsToCreate: string[];
  recordsToUpdate: string[];
  recordsUnchanged: string[];
  protectedFieldImpacts: ProtectedFieldImpact[];
  warnings: PreviewNotice[];
  errors: PreviewNotice[];
  previewOnly: true;
}

