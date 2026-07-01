import type { z } from "zod";
import type { AuditMetadataSchema, ConfidenceMetadataSchema, GeoMetadataSchema, VisualMetadataSchema, WeatherContextSchema, WeatherRefreshStateSchema, WeatherSnapshotTypeSchema, WeatherStateSchema } from "../schemas";

export type AuditMetadata = z.infer<typeof AuditMetadataSchema>;
export type ConfidenceMetadata = z.infer<typeof ConfidenceMetadataSchema>;
export type VisualMetadata = z.infer<typeof VisualMetadataSchema>;
export type GeoMetadata = z.infer<typeof GeoMetadataSchema>;
export type Confidence = ConfidenceMetadata["confidence"];
export type ReviewStatus = ConfidenceMetadata["reviewStatus"];
export type SourceType = ConfidenceMetadata["sourceType"];
export type WeatherSnapshotType = z.infer<typeof WeatherSnapshotTypeSchema>;
export type WeatherState = z.infer<typeof WeatherStateSchema>;
export type WeatherContext = z.infer<typeof WeatherContextSchema>;
export type WeatherRefreshState = z.infer<typeof WeatherRefreshStateSchema>;
