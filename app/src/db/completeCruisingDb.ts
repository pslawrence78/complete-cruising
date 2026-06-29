import Dexie, { type EntityTable } from "dexie";
import type {
  AdventureAlmanacExportPreview,
  AppSetting,
  Attraction,
  Cabin,
  Country,
  CruiseLine,
  DayGuide,
  DocumentItem,
  EnrichmentRun,
  EnrichmentSection,
  FamilyNote,
  ItineraryDayRecord,
  MemoryEntry,
  Port,
  Sailing,
  Ship,
  ShorePlanRecord,
  Traveller,
  WeatherSnapshotReviewEvent,
  WeatherSnapshot,
} from "../types";
import type { z } from "zod";
import type { ImportBatchSchema } from "../schemas";

export type ImportBatch = z.infer<typeof ImportBatchSchema>;

/** Versioned, local-only persistence. UI code should access this through repositories. */
export class CompleteCruisingDb extends Dexie {
  cruiseLines!: EntityTable<CruiseLine, "id">;
  ships!: EntityTable<Ship, "id">;
  sailings!: EntityTable<Sailing, "id">;
  countries!: EntityTable<Country, "id">;
  ports!: EntityTable<Port, "id">;
  itineraryDays!: EntityTable<ItineraryDayRecord, "id">;
  attractions!: EntityTable<Attraction, "id">;
  shorePlans!: EntityTable<ShorePlanRecord, "id">;
  dayGuides!: EntityTable<DayGuide, "id">;
  weatherSnapshots!: EntityTable<WeatherSnapshot, "id">;
  weatherSnapshotReviewEvents!: EntityTable<WeatherSnapshotReviewEvent, "id">;
  enrichmentSections!: EntityTable<EnrichmentSection, "id">;
  familyNotes!: EntityTable<FamilyNote, "id">;
  memoryEntries!: EntityTable<MemoryEntry, "id">;
  importBatches!: EntityTable<ImportBatch, "id">;
  appSettings!: EntityTable<AppSetting, "id">;
  cabins!: EntityTable<Cabin, "id">;
  travellers!: EntityTable<Traveller, "id">;
  enrichmentRuns!: EntityTable<EnrichmentRun, "id">;
  documentChecklists!: EntityTable<DocumentItem, "id">;
  adventureAlmanacExports!: EntityTable<AdventureAlmanacExportPreview, "id">;

  constructor(name = "completeCruisingDb") {
    super(name);

    this.version(1).stores({
      cruiseLines: "id, name",
      ships: "id, cruiseLineId, name",
      sailings: "id, status, departureDate, shipId, cruiseLineId",
      countries: "id, name, isoCode",
      ports: "id, countryId, name",
      itineraryDays: "id, sailingId, date, dayNumber, portId, [sailingId+dayNumber], [sailingId+date]",
      attractions: "id, portId, type",
      shorePlans: "id, itineraryDayId, sailingId, status, [itineraryDayId+status]",
      dayGuides: "id, itineraryDayId, sailingId",
      weatherSnapshots: "id, itineraryDayId, sailingId, capturedAt, snapshotType",
      enrichmentSections: "id, entityType, entityId, sectionType, [entityType+entityId]",
      familyNotes: "id, sailingId, itineraryDayId",
      memoryEntries: "id, sailingId, itineraryDayId, type",
      importBatches: "id, kind, status, receivedAt",
      appSettings: "id, &key",
      cabins: "id, sailingId",
      travellers: "id, *sailingIds",
      enrichmentRuns: "id, targetEntityType, targetEntityId, status",
      documentChecklists: "id, sailingId, status",
      adventureAlmanacExports: "id, sailingId, status",
    });

    this.version(2).stores({
      cruiseLines: "id, name",
      ships: "id, cruiseLineId, name",
      sailings: "id, status, departureDate, shipId, cruiseLineId",
      countries: "id, name, isoCode",
      ports: "id, countryId, name",
      itineraryDays: "id, sailingId, date, dayNumber, portId, [sailingId+dayNumber], [sailingId+date]",
      attractions: "id, portId, type",
      shorePlans: "id, itineraryDayId, sailingId, status, [itineraryDayId+status]",
      dayGuides: "id, itineraryDayId, sailingId",
      weatherSnapshots: "id, sailingId, itineraryDayId, portId, date, snapshotType, weatherState, refreshState, capturedAt, [itineraryDayId+capturedAt], [sailingId+date], [sailingId+itineraryDayId+capturedAt], [refreshState+capturedAt]",
      enrichmentSections: "id, entityType, entityId, sectionType, [entityType+entityId]",
      familyNotes: "id, sailingId, itineraryDayId",
      memoryEntries: "id, sailingId, itineraryDayId, type",
      importBatches: "id, kind, status, receivedAt",
      appSettings: "id, &key",
      cabins: "id, sailingId",
      travellers: "id, *sailingIds",
      enrichmentRuns: "id, targetEntityType, targetEntityId, status",
      documentChecklists: "id, sailingId, status",
      adventureAlmanacExports: "id, sailingId, status",
    });

    this.version(3).stores({
      cruiseLines: "id, name",
      ships: "id, cruiseLineId, name",
      sailings: "id, status, departureDate, shipId, cruiseLineId",
      countries: "id, name, isoCode",
      ports: "id, countryId, name",
      itineraryDays: "id, sailingId, date, dayNumber, portId, [sailingId+dayNumber], [sailingId+date]",
      attractions: "id, portId, type",
      shorePlans: "id, itineraryDayId, sailingId, status, [itineraryDayId+status]",
      dayGuides: "id, itineraryDayId, sailingId",
      weatherSnapshots: "id, sailingId, itineraryDayId, portId, date, snapshotType, weatherState, refreshState, capturedAt, [itineraryDayId+capturedAt], [sailingId+date], [sailingId+itineraryDayId+capturedAt], [refreshState+capturedAt]",
      weatherSnapshotReviewEvents: "id, sailingId, itineraryDayId, forecastDate, createdAt, action, [itineraryDayId+createdAt], [sailingId+forecastDate]",
      enrichmentSections: "id, entityType, entityId, sectionType, [entityType+entityId]",
      familyNotes: "id, sailingId, itineraryDayId",
      memoryEntries: "id, sailingId, itineraryDayId, type",
      importBatches: "id, kind, status, receivedAt",
      appSettings: "id, &key",
      cabins: "id, sailingId",
      travellers: "id, *sailingIds",
      enrichmentRuns: "id, targetEntityType, targetEntityId, status",
      documentChecklists: "id, sailingId, status",
      adventureAlmanacExports: "id, sailingId, status",
    });
  }
}

export const db = new CompleteCruisingDb();
