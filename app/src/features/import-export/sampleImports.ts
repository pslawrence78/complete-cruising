import { sampleAttractionRecords, sampleDayGuideRecord, sampleEnrichmentSections, sampleItineraryDayRecord, samplePortRecord, sampleSailingRecord, sampleShipRecord, sampleShorePlanRecords } from "../../data/sampleSchemaData";
import type { ImportType } from "./importPreviewTypes";

const header = { schemaVersion: 1, importedAt: "2026-06-21T09:00:00.000Z", sourceApp: "Complete Cruising illustrative sample", sampleOnly: true } as const;

const samples: Record<ImportType, unknown> = {
  sailing_shell: { kind: "sailing_shell", header, sailing: sampleSailingRecord },
  itinerary: { kind: "itinerary", header, sailingId: sampleSailingRecord.id, days: [sampleItineraryDayRecord] },
  ship_enrichment: { kind: "ship_enrichment", header, ship: sampleShipRecord, sections: sampleEnrichmentSections.filter((section) => section.entityType === "ship") },
  port_enrichment: { kind: "port_enrichment", header, port: samplePortRecord, attractions: sampleAttractionRecords, sections: sampleEnrichmentSections.filter((section) => section.entityType === "port") },
  day_guide: { kind: "day_guide", header, dayGuide: sampleDayGuideRecord },
  shore_plan: { kind: "shore_plan", header, sailingId: sampleSailingRecord.id, itineraryDayId: sampleItineraryDayRecord.id, shorePlans: sampleShorePlanRecords },
};

export function getSampleImport(type: ImportType) {
  return JSON.stringify(samples[type], null, 2);
}
