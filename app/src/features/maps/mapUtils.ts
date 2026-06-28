import type { AtlasBounds, AtlasPoint } from "./mapTypes";
import { defaultAtlasMapOptions } from "./mapConfig";

export function isValidLatitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -180 && value <= 180;
}

export function hasValidCoordinates(point: AtlasPoint): point is AtlasPoint & { latitude: number; longitude: number } {
  return isValidLatitude(point.latitude) && isValidLongitude(point.longitude);
}

export function getValidAtlasPoints(points: readonly AtlasPoint[]) {
  return points.filter(hasValidCoordinates);
}

export function getMissingAtlasPoints(points: readonly AtlasPoint[]) {
  return points.filter((point) => point.kind !== "sea-day" && !hasValidCoordinates(point));
}

export function hasAtlasFallback(points: readonly AtlasPoint[]) {
  return getValidAtlasPoints(points).length === 0;
}

export function deriveAtlasCentre(points: readonly AtlasPoint[], selectedPointId?: string) {
  const valid = getValidAtlasPoints(points);
  const selected = selectedPointId ? valid.find((point) => point.id === selectedPointId) : undefined;
  if (selected) return { latitude: selected.latitude, longitude: selected.longitude };
  if (valid.length === 1) return { latitude: valid[0].latitude, longitude: valid[0].longitude };
  if (!valid.length) return defaultAtlasMapOptions.defaultCentre;
  const totals = valid.reduce(
    (sum, point) => ({ latitude: sum.latitude + point.latitude, longitude: sum.longitude + point.longitude }),
    { latitude: 0, longitude: 0 },
  );
  return { latitude: totals.latitude / valid.length, longitude: totals.longitude / valid.length };
}

export function deriveAtlasBounds(points: readonly AtlasPoint[]): AtlasBounds | undefined {
  const valid = getValidAtlasPoints(points);
  if (valid.length < 2) return undefined;
  return valid.reduce<AtlasBounds>(
    (bounds, point) => ({
      east: Math.max(bounds.east, point.longitude),
      north: Math.max(bounds.north, point.latitude),
      south: Math.min(bounds.south, point.latitude),
      west: Math.min(bounds.west, point.longitude),
    }),
    { east: valid[0].longitude, north: valid[0].latitude, south: valid[0].latitude, west: valid[0].longitude },
  );
}

export function getOrderedRoutePoints(points: readonly AtlasPoint[]) {
  return getValidAtlasPoints(points).sort((left, right) => (left.routePosition ?? 0) - (right.routePosition ?? 0));
}

export function getSelectedAtlasPoint(points: readonly AtlasPoint[], selectedPointId?: string) {
  return selectedPointId ? points.find((point) => point.id === selectedPointId) : undefined;
}

export function getAtlasSummary(points: readonly AtlasPoint[]) {
  const valid = getValidAtlasPoints(points);
  const missing = getMissingAtlasPoints(points);
  const seaDays = points.filter((point) => point.kind === "sea-day").length;
  return {
    hasMap: valid.length > 0,
    markerCount: valid.length,
    missingCount: missing.length,
    seaDays,
  };
}
