import type { Country, ItineraryDayRecord, Port } from "../../types";
import type { AtlasFallbackMetadata, AtlasPoint } from "../maps/mapTypes";

type ItineraryPortRow = {
  day: ItineraryDayRecord;
  port?: Port;
};

const titleCase = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function atlasPointFromPort(port: Port, day?: ItineraryDayRecord): AtlasPoint {
  return {
    geocodeConfidence: port.geo?.geocodeConfidence,
    id: day?.id ?? port.id,
    kind: day?.dayType === "embarkation" ? "embarkation" : day?.dayType === "disembarkation" ? "disembarkation" : "port",
    label: port.geo?.mapLabel ?? port.name,
    latitude: port.geo?.latitude,
    locationNotes: port.geo?.locationNotes,
    longitude: port.geo?.longitude,
    reviewStatus: port.confidence?.reviewStatus,
    routePosition: day?.dayNumber,
  };
}

export function buildVoyageAtlasPoints(itinerary: readonly ItineraryPortRow[]): AtlasPoint[] {
  return itinerary.map(({ day, port }) => {
    if (!port) {
      return {
        id: day.id,
        kind: "sea-day",
        label: day.title ?? "At sea",
        routePosition: day.dayNumber,
      };
    }
    return atlasPointFromPort(port, day);
  });
}

export function buildPortFallbackMetadata(port?: Port, country?: Country): AtlasFallbackMetadata {
  return {
    country: country?.name,
    currency: country?.currencyName ? `${country.currencyName}${country.currencyCode ? ` (${country.currencyCode})` : ""}` : undefined,
    language: country?.primaryLanguage,
    locationNotes: port?.geo?.locationNotes,
    portType: port?.portType ? titleCase(port.portType) : undefined,
    region: port?.region,
    reviewStatus: port?.confidence?.reviewStatus ? titleCase(port.confidence.reviewStatus) : undefined,
  };
}

export function buildAtlasCaption(missingCount: number) {
  const missing = missingCount
    ? `${missingCount} port${missingCount === 1 ? "" : "s"} pending reviewed coordinates.`
    : "Known port positions included.";
  return `Voyage context line - visual sequence, not navigational routing. ${missing}`;
}
