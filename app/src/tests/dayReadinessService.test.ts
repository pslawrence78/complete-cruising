import { describe, expect, it } from "vitest";
import { assessDayReadiness } from "../features/conditions/dayReadinessService";
import {
  illustrativeConfidence,
  sampleDayGuideRecord,
  sampleItineraryDayRecord,
  samplePortRecord,
  sampleShorePlanRecords,
  sampleWeatherRecord,
} from "../data/sampleSchemaData";

describe("dayReadinessService", () => {
  it("returns ready_for_today for a port day with timings, plans and forecast guidance", () => {
    const readiness = assessDayReadiness({
      day: sampleItineraryDayRecord,
      weather: sampleWeatherRecord,
      guide: sampleDayGuideRecord,
      plans: sampleShorePlanRecords.map((plan) => ({
        ...plan,
        confidence: { ...plan.confidence, confidence: "low", reviewStatus: "needs_user_review", refreshRecommended: false },
      })),
      todayIso: "2026-08-01",
    });

    expect(readiness.status).toBe("ready_for_today");
    expect(readiness.timing.summary).toMatch(/All-aboard present/i);
    expect(readiness.plan.summary).toMatch(/backup present/i);
  });

  it("treats climate-only weather as usable with cautions", () => {
    const readiness = assessDayReadiness({
      day: { ...sampleItineraryDayRecord, weatherSnapshotId: undefined },
      weather: {
        ...sampleWeatherRecord,
        snapshotType: "climate",
        weatherState: "climate_expectation",
        refreshRecommended: false,
        confidence: { ...sampleWeatherRecord.confidence, refreshRecommended: false, reviewStatus: "reviewed" },
      },
      guide: { ...sampleDayGuideRecord, confidence: { ...sampleDayGuideRecord.confidence, refreshRecommended: false, reviewStatus: "reviewed" } },
      plans: sampleShorePlanRecords,
      todayIso: "2026-07-20",
    });

    expect(readiness.status).toBe("usable_with_cautions");
    expect(readiness.weather.status).toBe("climate_only");
    expect(readiness.weather.summary).toMatch(/Climate-only guidance/i);
  });

  it("surfaces timing caution when all-aboard or safe return guidance is missing", () => {
    const readiness = assessDayReadiness({
      day: { ...sampleItineraryDayRecord, allAboardTime: undefined },
      weather: sampleWeatherRecord,
      guide: { ...sampleDayGuideRecord, latestSafeReturnTime: undefined },
      plans: sampleShorePlanRecords.map((plan) => ({ ...plan, returnBufferMinutes: undefined })),
      todayIso: "2026-08-01",
    });

    expect(readiness.timing.status).toBe("review_needed");
    expect(readiness.nextActions).toContain("All-aboard missing");
  });

  it("surfaces plan review when no selected shore plan exists", () => {
    const readiness = assessDayReadiness({
      day: { ...sampleItineraryDayRecord, selectedShorePlanId: undefined, backupShorePlanId: undefined },
      weather: sampleWeatherRecord,
      guide: { ...sampleDayGuideRecord, confidence: { ...sampleDayGuideRecord.confidence, refreshRecommended: false, reviewStatus: "reviewed" } },
      plans: [],
      todayIso: "2026-08-01",
    });

    expect(readiness.plan.status).toBe("missing");
    expect(readiness.status).toBe("needs_review");
  });

  it("does not require an ashore return buffer for a sea day", () => {
    const readiness = assessDayReadiness({
      day: {
        ...sampleItineraryDayRecord,
        id: "day-sea",
        dayType: "sea",
        selectedShorePlanId: undefined,
        backupShorePlanId: undefined,
        portId: undefined,
      },
      weather: undefined,
      guide: undefined,
      plans: [],
      todayIso: "2026-08-01",
    });

    expect(readiness.timing.summary).toMatch(/no return buffer needed/i);
    expect(readiness.plan.summary).toMatch(/No ashore plan required/i);
  });

  it("surfaces stale weather as a refresh caution", () => {
    const readiness = assessDayReadiness({
      day: sampleItineraryDayRecord,
      weather: {
        ...sampleWeatherRecord,
        capturedAt: "2026-07-20T09:00:00.000Z",
        weatherState: "forecast_stale",
        refreshRecommended: true,
        confidence: { ...sampleWeatherRecord.confidence, refreshRecommended: true, reviewStatus: "needs_refresh" },
      },
      guide: sampleDayGuideRecord,
      plans: sampleShorePlanRecords,
      todayIso: "2026-08-01",
    });

    expect(readiness.weather.status).toBe("stale");
    expect(readiness.trust.status).toBe("stale");
  });

  it("does not present inferred guidance as confirmed", () => {
    const readiness = assessDayReadiness({
      day: {
        ...sampleItineraryDayRecord,
        confidence: { ...illustrativeConfidence, confidence: "inferred", reviewStatus: "needs_user_review", refreshRecommended: false },
      },
      weather: {
        ...sampleWeatherRecord,
        confidence: { ...sampleWeatherRecord.confidence, confidence: "low", reviewStatus: "needs_user_review", refreshRecommended: false },
        refreshRecommended: false,
      },
      guide: { ...sampleDayGuideRecord, confidence: { ...sampleDayGuideRecord.confidence, confidence: "inferred", reviewStatus: "needs_user_review", refreshRecommended: false } },
      plans: sampleShorePlanRecords.map((plan) => ({
        ...plan,
        confidence: { ...plan.confidence, confidence: "low", reviewStatus: "needs_user_review", refreshRecommended: false },
      })),
      todayIso: "2026-08-01",
    });

    expect(readiness.metadata.confidenceLevel).not.toBe("confirmed");
    expect(readiness.trust.summary).toMatch(/need review/i);
  });

  it("handles missing weather without crashing", () => {
    const readiness = assessDayReadiness({
      day: { ...sampleItineraryDayRecord, weatherSnapshotId: undefined },
      weather: undefined,
      guide: sampleDayGuideRecord,
      plans: sampleShorePlanRecords,
      todayIso: "2026-08-01",
    });

    expect(readiness.weather.status).toBe("missing");
    expect(readiness.summary).toBeTruthy();
  });

  it("does not treat observed past weather as a future forecast", () => {
    const readiness = assessDayReadiness({
      day: { ...sampleItineraryDayRecord, date: "2026-07-20" },
      weather: {
        ...sampleWeatherRecord,
        snapshotType: "observed",
      },
      guide: sampleDayGuideRecord,
      plans: sampleShorePlanRecords,
      todayIso: "2026-08-01",
    });

    expect(readiness.weather.status).toBe("same_day_check_needed");
    expect(readiness.weather.summary).toMatch(/Captured weather/i);
  });

  it("preserves confidence and refresh metadata in the output", () => {
    const readiness = assessDayReadiness({
      day: sampleItineraryDayRecord,
      weather: sampleWeatherRecord,
      guide: sampleDayGuideRecord,
      plans: sampleShorePlanRecords,
      todayIso: "2026-08-01",
    });

    expect(readiness.metadata.confidenceLevel).toBe(sampleWeatherRecord.confidence.confidence);
    expect(readiness.metadata.reviewStatus).toBe(sampleWeatherRecord.confidence.reviewStatus);
    expect(readiness.metadata.refreshRecommended).toBe(sampleWeatherRecord.confidence.refreshRecommended);
  });
});
