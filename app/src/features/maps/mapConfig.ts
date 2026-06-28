export const mapProviderConfig = {
  providerName: "OpenFreeMap",
  styleUrl: "https://tiles.openfreemap.org/styles/liberty",
  attributionLabel: "OpenFreeMap and OpenStreetMap contributors",
  attributionHtml:
    '<a href="https://openfreemap.org/" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> | <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
  providerNotes:
    "No-key OpenFreeMap Liberty style. Tiles require network connectivity and are not cached by the app service worker.",
  requiresNetwork: true,
} as const;

export const defaultAtlasMapOptions = {
  defaultCentre: { latitude: 38.6, longitude: 18.4 },
  defaultZoom: 4.15,
  singlePortZoom: 9.1,
  maxZoom: 10.5,
  minZoom: 2.5,
  routePadding: 58,
} as const;
