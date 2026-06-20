import type { z } from "zod";
import type { AuditMetadataSchema, ConfidenceMetadataSchema, GeoMetadataSchema, VisualMetadataSchema } from "../schemas";

export type AuditMetadata = z.infer<typeof AuditMetadataSchema>;
export type ConfidenceMetadata = z.infer<typeof ConfidenceMetadataSchema>;
export type VisualMetadata = z.infer<typeof VisualMetadataSchema>;
export type GeoMetadata = z.infer<typeof GeoMetadataSchema>;
export type Confidence = ConfidenceMetadata["confidence"];
export type ReviewStatus = ConfidenceMetadata["reviewStatus"];
export type SourceType = ConfidenceMetadata["sourceType"];
