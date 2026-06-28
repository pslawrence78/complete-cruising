import { z } from "zod";

export const enrichmentRequestTypes = [
  "sailing_shell_enrichment",
  "itinerary_verification",
  "ship_pack_enrichment",
  "port_pack_enrichment",
  "shore_plan_generation",
  "day_guide_generation",
] as const;

export type EnrichmentRequestType = (typeof enrichmentRequestTypes)[number];

export const shipPackTypes = [
  "ship_identity_character",
  "ship_layout_orientation",
  "ship_dining",
  "ship_cabins_practical_life",
  "ship_family_seb_suitability",
  "ship_entertainment_venues",
  "ship_pools_recreation_relaxation",
  "ship_tips_watchouts_best_experiences",
] as const;

export const portPackTypes = [
  "port_fact_file",
  "port_cruise_logistics",
  "port_getting_around",
  "port_top_10_highlights",
  "port_family_lens",
  "port_food_culture_local_experience",
  "port_photography_views",
  "port_hints_tips_watchouts",
  "port_weather_seasonality",
  "port_suggested_shore_plans",
] as const;

export type ShipPackType = (typeof shipPackTypes)[number];
export type PortPackType = (typeof portPackTypes)[number];

export const returnSchemaByRequestType: Record<EnrichmentRequestType, string> = {
  sailing_shell_enrichment: "complete-cruising-sailing-shell-enrichment-v1",
  itinerary_verification: "complete-cruising-itinerary-verification-v1",
  ship_pack_enrichment: "complete-cruising-ship-pack-enrichment-v1",
  port_pack_enrichment: "complete-cruising-port-pack-enrichment-v1",
  shore_plan_generation: "complete-cruising-shore-plan-generation-v1",
  day_guide_generation: "complete-cruising-day-guide-generation-v1",
};

export const EnrichmentRequestSchema = z.object({
  schema: z.literal("complete-cruising-enrichment-request-v1"),
  schemaVersion: z.literal(1),
  sourceApp: z.literal("Complete Cruising"),
  createdAt: z.string().datetime({ offset: true }),
  requestId: z.string().min(1),
  requestType: z.enum(enrichmentRequestTypes),
  target: z.object({
    targetType: z.enum(["sailing", "itinerary", "ship", "port", "itinerary_day"]),
    targetId: z.string().min(1).nullable(),
    targetName: z.string().min(1),
  }).strict(),
  context: z.object({
    sailing: z.record(z.string(), z.unknown()),
    cruiseLine: z.record(z.string(), z.unknown()),
    ship: z.record(z.string(), z.unknown()),
    itineraryDays: z.array(z.record(z.string(), z.unknown())),
    ports: z.array(z.record(z.string(), z.unknown())),
    existingEnrichment: z.array(z.record(z.string(), z.unknown())),
    familyContext: z.object({
      travellers: z.array(z.string()),
      sebContext: z.string(),
      preferences: z.array(z.string()),
    }).strict(),
  }).strict(),
  task: z.object({
    title: z.string().min(1),
    instructions: z.array(z.string().min(1)),
    scope: z.array(z.string().min(1)),
    exclusions: z.array(z.string().min(1)),
    sourceGuidance: z.array(z.string().min(1)),
    returnSchemaName: z.string().min(1),
    packType: z.string().min(1).optional(),
  }).strict(),
  expectedReturn: z.object({
    schema: z.string().min(1),
    schemaVersion: z.literal(1),
  }).strict(),
}).strict();

export type EnrichmentRequestContract = z.infer<typeof EnrichmentRequestSchema>;

export interface EnrichmentRequestOptions {
  requestType: EnrichmentRequestType;
  sailingId?: string;
  portId?: string;
  itineraryDayId?: string;
  shipPackType?: ShipPackType;
  portPackType?: PortPackType;
  now?: Date;
}
