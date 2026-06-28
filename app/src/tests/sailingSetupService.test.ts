import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { calculateNights, createSailingShell, summariseSetup, type SailingSetupInput } from "../features/sailing-setup/sailingSetupService";

const setupInput: SailingSetupInput = {
  sailingName: "Test Mediterranean Sailing",
  routeSummary: "Rome to Barcelona",
  status: "draft",
  notes: "Skeleton only.",
  cruiseLineName: "Princess Cruises",
  shipName: "Sun Princess",
  departureDate: "2026-08-15",
  returnDate: "2026-08-22",
  voyageCode: "X123",
  embarkationPortName: "Civitavecchia",
  disembarkationPortName: "Barcelona",
  itineraryDays: [
    { dayNumber: 1, date: "2026-08-15", dayType: "embarkation", portName: "Civitavecchia", countryName: "Italy", tenderStatus: "not_applicable", userConfirmed: true },
    { dayNumber: 2, date: "2026-08-16", dayType: "port", portName: "Naples", countryName: "Italy", arrivalTime: "07:00", departureTime: "18:00", allAboardTime: "17:30", tenderStatus: "not_applicable" },
    { dayNumber: 3, date: "2026-08-17", dayType: "sea", tenderStatus: "not_applicable" },
  ],
};

describe("sailing setup service", () => {
  let database: CompleteCruisingDb;

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-setup-${crypto.randomUUID()}`);
    await seedSampleData(database);
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("calculates nights and setup review counts", () => {
    expect(calculateNights("2026-08-15", "2026-08-22")).toBe(7);
    expect(summariseSetup(setupInput)).toMatchObject({ nights: 7, itineraryDayCount: 3, portDays: 1, seaDays: 1 });
  });

  it("creates a sailing shell with manual itinerary days", async () => {
    const result = await createSailingShell(setupInput, database);
    expect(result.sailing.voyageCode).toBe("X123");
    expect(result.sailing.confidence?.sourceType).toBe("user_entered");
    expect(result.itineraryDays).toHaveLength(3);
    expect(result.itineraryDays[0].confidence?.confidence).toBe("confirmed");
    expect(result.itineraryDays[1].confidence?.reviewStatus).toBe("needs_user_review");
  });

  it("reuses existing cruise line, ship and port records where practical", async () => {
    const result = await createSailingShell(setupInput, database);
    expect(result.reused.cruiseLine).toBe(true);
    expect(result.reused.ship).toBe(true);
    expect(result.reused.ports).toContain("Naples");
    expect(await database.cruiseLines.count()).toBe(1);
    expect(await database.ships.count()).toBe(1);
  });
});
