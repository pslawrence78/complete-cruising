export type AtlasPointKind =
  | "port"
  | "embarkation"
  | "disembarkation"
  | "sea-day"
  | "today";

export interface AtlasPoint {
  country?: string;
  geocodeConfidence?: "confirmed" | "high" | "medium" | "low" | "unknown";
  id: string;
  kind?: AtlasPointKind;
  label: string;
  latitude?: number | null;
  locationNotes?: string;
  longitude?: number | null;
  reviewStatus?: string;
  routePosition?: number;
}

export type AtlasMode = "single-port" | "route-strip" | "overview";
export type AtlasInteraction = "curated" | "explore";

export interface AtlasBounds {
  east: number;
  north: number;
  south: number;
  west: number;
}

export interface AtlasFallbackMetadata {
  country?: string;
  currency?: string;
  language?: string;
  locationNotes?: string;
  portType?: string;
  region?: string;
  reviewStatus?: string;
}
