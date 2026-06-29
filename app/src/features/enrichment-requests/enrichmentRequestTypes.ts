import { z } from "zod";

export const importTypes = [
  "sailing_shell",
  "itinerary",
  "ship_enrichment",
  "port_enrichment",
  "day_guide",
  "shore_plan",
] as const;

export type ImportType = (typeof importTypes)[number];

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

export type FilterRequirement = "required" | "optional" | "disabled";

export interface EnrichmentRequestDefinition {
  requestType: EnrichmentRequestType;
  importType: ImportType;
  label: string;
  requestLabel: string;
  targetType: "sailing" | "itinerary" | "ship" | "port" | "itinerary_day";
  returnSchemaName: string;
  suggestedFilenamePrefix: string;
  importNote: string;
  filterSummary: string;
  filters: {
    sailing: FilterRequirement;
    port: FilterRequirement;
    day: FilterRequirement;
    ship: FilterRequirement;
    pack: FilterRequirement;
  };
  packSelector?: "ship" | "port";
}

export const enrichmentRequestDefinitions = [
  {
    requestType: "sailing_shell_enrichment",
    importType: "sailing_shell",
    label: "Sailing shell",
    requestLabel: "Sailing shell enrichment",
    targetType: "sailing",
    returnSchemaName: "complete-cruising-sailing-shell-enrichment-v1",
    suggestedFilenamePrefix: "complete-cruising-sailing-shell-import",
    importNote: "Dates, ship and voyage identity",
    filterSummary: "Relevant filters: sailing context is optional. Port, day, ship and pack stay disabled for the calmest flow.",
    filters: {
      sailing: "optional",
      port: "disabled",
      day: "disabled",
      ship: "disabled",
      pack: "disabled",
    },
  },
  {
    requestType: "itinerary_verification",
    importType: "itinerary",
    label: "Itinerary verification",
    requestLabel: "Itinerary verification and enrichment",
    targetType: "itinerary",
    returnSchemaName: "complete-cruising-itinerary-verification-v1",
    suggestedFilenamePrefix: "complete-cruising-itinerary-import",
    importNote: "Sailing-specific days, ports and timings",
    filterSummary: "Relevant filters: sailing is required. Day is optional for a narrower pass, and port can stay available when a single port day needs closer attention.",
    filters: {
      sailing: "required",
      port: "optional",
      day: "optional",
      ship: "disabled",
      pack: "disabled",
    },
  },
  {
    requestType: "ship_pack_enrichment",
    importType: "ship_enrichment",
    label: "Ship pack enrichment",
    requestLabel: "Ship pack enrichment",
    targetType: "ship",
    returnSchemaName: "complete-cruising-ship-pack-enrichment-v1",
    suggestedFilenamePrefix: "complete-cruising-ship-pack-import",
    importNote: "Reusable ship guidebook sections",
    filterSummary: "Relevant filters: ship and pack are required. Sailing remains optional context; port and day stay disabled.",
    filters: {
      sailing: "optional",
      port: "disabled",
      day: "disabled",
      ship: "required",
      pack: "required",
    },
    packSelector: "ship",
  },
  {
    requestType: "port_pack_enrichment",
    importType: "port_enrichment",
    label: "Port pack enrichment",
    requestLabel: "Port pack enrichment",
    targetType: "port",
    returnSchemaName: "complete-cruising-port-pack-enrichment-v1",
    suggestedFilenamePrefix: "complete-cruising-port-pack-import",
    importNote: "Reusable port guidebook sections",
    filterSummary: "Relevant filters: port and pack are required. Sailing stays optional context, while ship and day remain disabled.",
    filters: {
      sailing: "optional",
      port: "required",
      day: "disabled",
      ship: "disabled",
      pack: "required",
    },
    packSelector: "port",
  },
  {
    requestType: "day_guide_generation",
    importType: "day_guide",
    label: "Day guide enrichment",
    requestLabel: "Day guide enrichment",
    targetType: "itinerary_day",
    returnSchemaName: "complete-cruising-day-guide-generation-v1",
    suggestedFilenamePrefix: "complete-cruising-day-guide-import",
    importNote: "Operational guidance for one itinerary day",
    filterSummary: "Relevant filters: sailing and day are required. Port can stay available where the day has a port, and ship can add onboard context.",
    filters: {
      sailing: "required",
      port: "optional",
      day: "required",
      ship: "optional",
      pack: "disabled",
    },
  },
  {
    requestType: "shore_plan_generation",
    importType: "shore_plan",
    label: "Shore plan enrichment",
    requestLabel: "Shore plan enrichment",
    targetType: "itinerary_day",
    returnSchemaName: "complete-cruising-shore-plan-generation-v1",
    suggestedFilenamePrefix: "complete-cruising-shore-plan-import",
    importNote: "Sailing-specific shore plan options",
    filterSummary: "Relevant filters: sailing and day are required. Port remains available for port-day context, while ship and pack stay disabled.",
    filters: {
      sailing: "required",
      port: "optional",
      day: "required",
      ship: "disabled",
      pack: "disabled",
    },
  },
] as const satisfies readonly EnrichmentRequestDefinition[];

export const requestDefinitionByType = Object.fromEntries(
  enrichmentRequestDefinitions.map((definition) => [definition.requestType, definition]),
) as Record<EnrichmentRequestType, EnrichmentRequestDefinition>;

export const returnSchemaByRequestType: Record<EnrichmentRequestType, string> = {
  sailing_shell_enrichment: requestDefinitionByType.sailing_shell_enrichment.returnSchemaName,
  itinerary_verification: requestDefinitionByType.itinerary_verification.returnSchemaName,
  ship_pack_enrichment: requestDefinitionByType.ship_pack_enrichment.returnSchemaName,
  port_pack_enrichment: requestDefinitionByType.port_pack_enrichment.returnSchemaName,
  shore_plan_generation: requestDefinitionByType.shore_plan_generation.returnSchemaName,
  day_guide_generation: requestDefinitionByType.day_guide_generation.returnSchemaName,
};

export const importTypeByRequestType: Record<EnrichmentRequestType, ImportType> = {
  sailing_shell_enrichment: requestDefinitionByType.sailing_shell_enrichment.importType,
  itinerary_verification: requestDefinitionByType.itinerary_verification.importType,
  ship_pack_enrichment: requestDefinitionByType.ship_pack_enrichment.importType,
  port_pack_enrichment: requestDefinitionByType.port_pack_enrichment.importType,
  shore_plan_generation: requestDefinitionByType.shore_plan_generation.importType,
  day_guide_generation: requestDefinitionByType.day_guide_generation.importType,
};

export const requestTypeByReturnSchema = Object.fromEntries(
  enrichmentRequestDefinitions.map((definition) => [definition.returnSchemaName, definition.requestType]),
) as Record<string, EnrichmentRequestType>;

export function buildSuggestedImportFilename(requestType: EnrichmentRequestType, now: Date = new Date()) {
  const definition = requestDefinitionByType[requestType];
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${definition.suggestedFilenamePrefix}-${year}${month}${day}.json`;
}

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
    suggestedImportFilename: z.string().min(1),
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
  shipId?: string;
  portId?: string;
  itineraryDayId?: string;
  shipPackType?: ShipPackType;
  portPackType?: PortPackType;
  now?: Date;
}
