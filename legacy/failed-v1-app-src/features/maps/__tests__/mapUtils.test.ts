import { describe, expect, it } from "vitest";
import {
  deriveAtlasBounds,
  deriveAtlasCentre,
  getAtlasSummary,
  getMissingAtlasPoints,
  getOrderedRoutePoints,
  getValidAtlasPoints,
  hasAtlasFallback,
  hasValidCoordinates,
  isValidLatitude,
  isValidLongitude,
} from "../mapUtils";
import type { AtlasPoint } from "../mapTypes";

const points: AtlasPoint[] = [
  { id: "day-1", label: "Civitavecchia", latitude: 42.0933, longitude: 11.7967, routePosition: 1 },
  { id: "day-2", label: "Naples", latitude: 40.841, longitude: 14.263, routePosition: 2 },
  { id: "day-3", kind: "sea-day", label: "At sea", routePosition: 3 },
  { id: "day-4", label: "Missing", latitude: null, longitude: null, routePosition: 4 },
  { id: "day-5", label: "Barcelona", latitude: 41.352, longitude: 2.173, routePosition: 5 },
];

describe("map utilities", () => {
  it("accepts valid coordinates and rejects invalid latitude or longitude", () => {
    expect(isValidLatitude(51.5)).toBe(true);
    expect(isValidLongitude(-3.2)).toBe(true);
    expect(isValidLatitude(91)).toBe(false);
    expect(isValidLongitude(181)).toBe(false);
    expect(hasValidCoordinates({ id: "bad", label: "Bad", latitude: 40, longitude: undefined })).toBe(false);
  });

  it("filters valid route points while preserving itinerary order", () => {
    expect(getValidAtlasPoints(points).map((point) => point.label)).toEqual(["Civitavecchia", "Naples", "Barcelona"]);
    expect(getOrderedRoutePoints([...points].reverse()).map((point) => point.label)).toEqual(["Civitavecchia", "Naples", "Barcelona"]);
  });

  it("reports missing coordinate points without treating sea days as missing", () => {
    expect(getMissingAtlasPoints(points).map((point) => point.label)).toEqual(["Missing"]);
    expect(getAtlasSummary(points)).toMatchObject({ markerCount: 3, missingCount: 1, seaDays: 1, hasMap: true });
  });

  it("derives centre and bounds for zero, one and multiple valid points", () => {
    expect(hasAtlasFallback([])).toBe(true);
    expect(deriveAtlasCentre([], undefined)).toEqual({ latitude: 38.6, longitude: 18.4 });
    expect(deriveAtlasCentre([points[1]], undefined)).toEqual({ latitude: 40.841, longitude: 14.263 });
    expect(deriveAtlasCentre(points, "day-5")).toEqual({ latitude: 41.352, longitude: 2.173 });
    expect(deriveAtlasBounds(points)).toEqual({ east: 14.263, north: 42.0933, south: 40.841, west: 2.173 });
  });
});
