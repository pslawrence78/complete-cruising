import type { CompleteCruisingDb } from "../../db/completeCruisingDb";
import { db } from "../../db/completeCruisingDb";
import { getActiveSailing, getSailingOverview } from "../../db/repositories";
import type { ItineraryDayRecord } from "../../types";
import { buildPrompt } from "./promptTemplates";
import {
  EnrichmentRequestSchema,
  buildSuggestedImportFilename,
  returnSchemaByRequestType,
  requestDefinitionByType,
  type EnrichmentRequestContract,
  type EnrichmentRequestOptions,
  type EnrichmentRequestType,
} from "./enrichmentRequestTypes";

const familyContext = {
  travellers: ["Phil", "Rebecca", "Seb"],
  sebContext: "School-age child; interested in geography, flags, countries, maps, facts and practical discovery prompts.",
  preferences: [],
};

const protectedKeys = new Set(["bookingReference", "cabinNumber", "passport", "passportNumber", "insurancePolicyNumber", "paymentCard"]);

function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !protectedKeys.has(key))
        .map(([key, item]) => [key, clean(item)]),
    );
  }
  return value;
}

function taskFor(type: EnrichmentRequestType, packType?: string) {
  const commonExclusions = [
    "Do not include sensitive booking, cabin, identity, insurance or payment values.",
    "Do not overwrite protected fields; propose corrections only.",
  ];
  const sourceGuidance = [
    "Prioritise official cruise line, port, tourism, attraction and transport sources where relevant.",
    "Use reputable travel sources only for context and mark them as researched.",
    "Mark uncertain guidance as inferred or low confidence.",
  ];
  if (type === "itinerary_verification") return {
    instructions: ["Check the itinerary shell for likely inconsistencies, missing fields, date issues, port naming issues and fields needing official confirmation.", "Return corrections as proposals only."],
    scope: ["Sailing", "Itinerary days", "Port names", "Dates and times as reviewable proposals"],
    exclusions: [...commonExclusions, "Do not generate port guides, ship guides or day guides."],
    sourceGuidance,
  };
  if (type === "ship_pack_enrichment") return {
    instructions: [`Generate one targeted ship enrichment pack: ${packType}.`, "Keep the pack reusable across sailings unless a sailing caveat is explicit."],
    scope: ["Ship", "Cruise line", "Optional sailing context"],
    exclusions: [...commonExclusions, "Do not create itinerary-specific day guidance."],
    sourceGuidance,
  };
  if (type === "port_pack_enrichment") return {
    instructions: [`Generate one targeted reusable port enrichment pack: ${packType}.`, "Keep reusable port knowledge separate from sailing-specific timing."],
    scope: ["Reusable port record", "Optional sailing and itinerary context"],
    exclusions: [...commonExclusions, "Do not select a shore plan for the family."],
    sourceGuidance,
  };
  if (type === "shore_plan_generation") return {
    instructions: ["Generate sailing-specific shore plan options for one itinerary day.", "Include risk, timing, family suitability, return buffer and confidence metadata."],
    scope: ["Sailing", "Itinerary day", "Port", "Relevant port pack summaries", "Family context"],
    exclusions: commonExclusions,
    sourceGuidance,
  };
  if (type === "day_guide_generation") return {
    instructions: ["Generate a sailing-specific day guide once context is mature enough.", "Keep it practical, concise and useful onboard or ashore."],
    scope: ["Sailing", "Itinerary day", "Selected shore plan", "Backup shore plan", "Weather or climate context if supplied", "Family context"],
    exclusions: commonExclusions,
    sourceGuidance,
  };
  return {
    instructions: ["Enrich the sailing shell with planning summary, cruise line context, route context, readiness prompts and areas needing verification."],
    scope: ["Sailing", "Cruise line", "Ship", "Itinerary summary"],
    exclusions: [...commonExclusions, "Do not generate detailed port guides, ship packs or day guides."],
    sourceGuidance,
  };
}

async function loadContext(options: EnrichmentRequestOptions, database: CompleteCruisingDb) {
  const active = options.sailingId ? await database.sailings.get(options.sailingId) : await getActiveSailing(database);
  if (!active) throw new Error("No sailing is available for enrichment request generation.");
  const overview = await getSailingOverview(active.id, database);
  const selectedShip = options.shipId
    ? await database.ships.get(options.shipId)
    : overview?.ship;
  const itineraryDays = await database.itineraryDays.where("sailingId").equals(active.id).sortBy("dayNumber");
  const portIds = Array.from(new Set(itineraryDays.map((day) => day.portId).filter(Boolean) as string[]));
  const ports = await Promise.all(portIds.map((id) => database.ports.get(id)));
  const selectedDay = options.itineraryDayId ? itineraryDays.find((day) => day.id === options.itineraryDayId) : itineraryDays.find((day) => day.portId) ?? itineraryDays[0];
  const selectedPortId = options.portId ?? selectedDay?.portId ?? portIds[0];
  const selectedPort = selectedPortId ? await database.ports.get(selectedPortId) : undefined;
  const existingEnrichment = await database.enrichmentSections.toArray();
  return {
    sailing: active,
    cruiseLine: overview?.cruiseLine,
    ship: selectedShip,
    itineraryDays,
    ports: ports.filter(Boolean),
    selectedDay,
    selectedPort,
    existingEnrichment,
  };
}

function targetName(type: EnrichmentRequestType, context: Awaited<ReturnType<typeof loadContext>>) {
  if (type === "ship_pack_enrichment") return context.ship?.name ?? "Ship to confirm";
  if (type === "port_pack_enrichment") return context.selectedPort?.name ?? "Port to confirm";
  if (type === "shore_plan_generation" || type === "day_guide_generation") {
    const day = context.selectedDay as ItineraryDayRecord | undefined;
    return day ? `Day ${day.dayNumber}: ${day.title ?? context.selectedPort?.name ?? day.dayType}` : context.sailing.name;
  }
  return context.sailing.name;
}

export async function createEnrichmentRequest(options: EnrichmentRequestOptions, database: CompleteCruisingDb = db): Promise<EnrichmentRequestContract> {
  const context = await loadContext(options, database);
  const returnSchemaName = returnSchemaByRequestType[options.requestType];
  const definition = requestDefinitionByType[options.requestType];
  const task = taskFor(options.requestType, options.shipPackType ?? options.portPackType);
  const createdAt = (options.now ?? new Date()).toISOString();
  const targetType = definition.targetType;
  const targetId = targetType === "ship"
    ? context.ship?.id
    : targetType === "port"
      ? context.selectedPort?.id
      : targetType === "itinerary_day"
        ? context.selectedDay?.id
        : context.sailing.id;

  const request = {
    schema: "complete-cruising-enrichment-request-v1" as const,
    schemaVersion: 1 as const,
    sourceApp: "Complete Cruising" as const,
    createdAt,
    requestId: `request-${options.requestType}-${createdAt.replace(/[^0-9]/g, "").slice(0, 14)}`,
    requestType: options.requestType,
    target: {
      targetType,
      targetId: targetId ?? null,
      targetName: targetName(options.requestType, context),
    },
    context: {
      sailing: clean(context.sailing) as Record<string, unknown>,
      cruiseLine: clean(context.cruiseLine ?? {}) as Record<string, unknown>,
      ship: clean(context.ship ?? {}) as Record<string, unknown>,
      itineraryDays: clean(context.itineraryDays) as Record<string, unknown>[],
      ports: clean(context.ports) as Record<string, unknown>[],
      existingEnrichment: clean(context.existingEnrichment) as Record<string, unknown>[],
      familyContext,
    },
    task: {
      title: definition.requestLabel,
      suggestedImportFilename: buildSuggestedImportFilename(options.requestType, options.now),
      ...task,
      returnSchemaName,
      packType: options.shipPackType ?? options.portPackType,
    },
    expectedReturn: {
      schema: returnSchemaName,
      schemaVersion: 1 as const,
    },
  };
  return EnrichmentRequestSchema.parse(request);
}

export async function createPrompt(options: EnrichmentRequestOptions, database: CompleteCruisingDb = db) {
  return buildPrompt(await createEnrichmentRequest(options, database));
}
