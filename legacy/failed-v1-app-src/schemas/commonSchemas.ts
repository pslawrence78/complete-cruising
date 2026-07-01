import { z } from "zod";

export const ConfidenceSchema = z.enum(["confirmed", "high", "medium", "low", "inferred", "unknown"]);
export const ReviewStatusSchema = z.enum(["not_reviewed", "needs_user_review", "reviewed", "verified", "needs_refresh", "stale", "rejected"]);
export const SourceTypeSchema = z.enum(["booking_confirmed", "cruise_line_confirmed", "official_port_source", "official_tourism_source", "official_attraction_source", "official_transport_source", "reputable_travel_source", "weather_service", "family_note", "user_entered", "researched", "inferred"]);
export const SailingStatusSchema = z.enum(["draft", "planned", "upcoming", "active", "completed", "archived"]);
export const DayTypeSchema = z.enum(["embarkation", "port", "sea", "disembarkation", "scenic_cruising", "overnight_port"]);
export const TenderStatusSchema = z.enum(["unknown", "likely", "confirmed", "not_applicable"]);
export const PortTypeSchema = z.enum(["city", "island", "resort", "industrial", "tender", "mixed", "unknown"]);
export const BookingRequiredSchema = z.enum(["required", "recommended", "optional", "not_required", "unknown"]);
export const CostLevelSchema = z.enum(["free", "low", "medium", "high", "unknown"]);
export const FamilySuitabilitySchema = z.enum(["excellent", "good", "mixed", "poor", "unknown"]);
export const RiskLevelSchema = z.enum(["low", "medium", "high", "unknown"]);
export const WeatherDependencySchema = z.enum(["low", "medium", "high", "unknown"]);
export const ShorePlanTypeSchema = z.enum(["booked_excursion", "diy", "private_tour", "low_effort", "backup", "onboard_only", "ambitious"]);
export const ShorePlanStatusSchema = z.enum(["idea", "shortlisted", "selected", "booked", "completed", "cancelled", "rejected"]);
export const WeatherSnapshotTypeSchema = z.enum(["climate", "forecast", "same_day", "observed", "manual"]);
export const WeatherStateSchema = z.enum(["climate_expectation", "forecast_pending", "forecast_available", "forecast_recent", "forecast_stale", "day_locked", "historical_lookup_available", "missing_coordinates"]);
export const WeatherContextSchema = z.enum(["visit_date_forecast", "weather_now_in_port", "same_day_check", "climate_context", "observed"]);
export const WeatherRefreshStateSchema = z.enum(["ready", "refreshing", "updated", "skipped", "failed"]);

const IsoDateTimeSchema = z.string().datetime({ offset: true });
const IsoDateSchema = z.string().date();
export const IdSchema = z.string().trim().min(1);

export const AuditMetadataSchema = z.object({
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  createdBy: z.string().trim().min(1),
  updatedBy: z.string().trim().min(1),
  archivedAt: IsoDateTimeSchema.optional(),
}).strict();

export const ConfidenceMetadataSchema = z.object({
  confidence: ConfidenceSchema,
  reviewStatus: ReviewStatusSchema,
  sourceType: SourceTypeSchema,
  sourceSummary: z.string().trim().min(1).optional(),
  lastReviewedAt: IsoDateTimeSchema.nullable().optional(),
  refreshRecommended: z.boolean(),
  refreshReason: z.string().trim().min(1).optional(),
  validFrom: IsoDateSchema.nullable().optional(),
  validUntil: IsoDateSchema.nullable().optional(),
}).strict().refine(({ validFrom, validUntil }) => !validFrom || !validUntil || validFrom <= validUntil, {
  message: "validUntil must not be earlier than validFrom",
  path: ["validUntil"],
});

export const VisualMetadataSchema = z.object({
  heroImageUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  icon: z.string().trim().min(1).optional(),
  colourTheme: z.string().trim().min(1).optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  featured: z.boolean(),
}).strict();

export const GeoMetadataSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  mapLabel: z.string().trim().min(1).optional(),
  geocodeConfidence: z.enum(["confirmed", "high", "medium", "low", "unknown"]),
  locationNotes: z.string().trim().min(1).optional(),
}).strict();

export const SampleCaveatSchema = z.object({
  sampleOnly: z.literal(true),
  dataCaveat: z.string().trim().min(1),
}).strict();

export const StructuredFactsSchema = z.union([
  z.record(z.string(), z.unknown()),
  z.array(z.record(z.string(), z.unknown())),
]);
