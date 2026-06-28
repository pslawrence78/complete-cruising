# Complete Cruising

## Tranche 20: Cartographic Port Atlas and Map Context v0.1

### Objective

Add a constrained, premium map capability so Complete Cruising can show where ports sit and how the known sailing route moves across the Mediterranean, while preserving the local-first GitHub Pages architecture.

### Purpose

This tranche turns route and port coordinates into a curated Port Atlas experience. The goal is orientation and atmosphere, not navigation. Route lines are visual sequence only and must not be read as calculated sea routes, distances, timings or live ship position.

### Surfaces changed

- Ports now includes the primary Cartographic Port Atlas panel, plus a compact "where this port sits" atlas card for the active port guide.
- Itinerary now includes a lightweight voyage map context card above the timeline.
- Today now includes a pre-cruise port-orientation placeholder. Active-day map rendering is prepared for later without forcing an active sailing state.
- Dashboard was left unchanged so the map does not distract from the main voyage command centre.

### Files changed

- `app/package.json`
- `app/package-lock.json`
- `app/src/db/realSailingOnboarding.ts`
- `app/src/features/maps/*`
- `app/src/features/ports/PortGuidePage.tsx`
- `app/src/features/ports/PortGuidePage.css`
- `app/src/features/ports/portAtlasViewModel.ts`
- `app/src/features/itinerary/ItineraryPage.tsx`
- `app/src/features/today/TodayPage.tsx`
- `app/src/tests/setup.ts`
- `app/src/tests/App.test.tsx`
- `app/src/tests/pwaAssets.test.ts`
- `docs/README.md`
- `docs/build-plan/tranche-plan-v0.1.md`
- `README.md`
- `app/README.md`

### Dependency added

`maplibre-gl` was added to the app package.

The map renderer is kept inside `app/src/features/maps/PortAtlasMap.tsx`, with utilities and provider configuration separated from feature pages.

### Map provider and attribution

The first provider is OpenFreeMap using the no-key Liberty style:

```text
https://tiles.openfreemap.org/styles/liberty
```

The style URL, provider name, attribution HTML and provider notes are centralised in `app/src/features/maps/mapConfig.ts`.

Attribution is rendered through MapLibre's attribution control and repeated in the Ocean Luxe map-card attribution zone for fallback/summary clarity:

```text
OpenFreeMap | OpenStreetMap contributors
```

### Coordinate handling

The existing Port `geo` metadata is used. No Dexie migration, spatial model or new coordinate-management UI was added.

Coordinates follow the tranche rule:

- latitude must be finite and between -90 and 90;
- longitude must be finite and between -180 and 180;
- missing, null, undefined or partial coordinates are treated as fallback states;
- sea days do not require coordinates;
- route order follows itinerary day order.

The real Sun Princess 2026 onboarding shells now include approximate public port-area coordinates for visual orientation only. These are deliberately caveated and not presented as terminal, berth, tender-landing or navigation positions.

### Missing-coordinate behaviour

Missing coordinates render a branded fallback rather than a blank map:

- "Map position pending";
- reviewed-location-data copy;
- guidebook-available copy;
- known country, region, language, currency, port type and review metadata where available.

Missing ports are omitted from marker arrays but counted in atlas captions.

### Loading and error behaviour

Map loading shows "Preparing atlas view" over the Ocean Luxe chart panel. Map style/provider errors show "Atlas unavailable" with a connection/source availability explanation. Tests mock MapLibre and do not depend on external tiles or canvas rendering.

### Offline behaviour

The app shell remains offline-capable, and local guidebook data remains available. Remote map tiles require network connectivity. The service worker was not extended to cache OpenFreeMap or any other remote tile source.

### Non-goals

This tranche does not add:

- weather functionality or overlays;
- geocoding, place search or POI search;
- route calculation, optimisation, distances or durations;
- walking, driving or maritime navigation;
- offline tile downloads, MBTiles or tile packs;
- backend services, tile proxy, authentication, API keys or protected data;
- live ship position, AIS, Princess integration or user geolocation;
- marker dragging, map editing or coordinate-management UI.

### Validation performed

- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
- In-app browser responsive measurement attempted for `/#/`, `/#/today`, `/#/itinerary`, `/#/ports`, `/#/ship`, `/#/more` and `/#/data-management` at 390 px, 430 px, 768 px, 1024 px and 1440 px. The first preview port was affected by a stale local service-worker cache and the fresh-port retry was blocked by the execution environment, so final visual verification of live map tiles remains outstanding.

Additional validation still required before committing:

- manual responsive visual checks at 390 px, 430 px, 768 px, 1024 px and 1440 px for `/#/`, `/#/today`, `/#/itinerary`, `/#/ports`, `/#/ship`, `/#/more` and `/#/data-management`
- local map tile rendering check if network access allows OpenFreeMap tiles to load

### Known limitations

- Map tiles require network connectivity.
- No offline tile downloads or large tile caches are provided.
- No geocoding or route calculation is provided.
- No weather overlays, wind maps or precipitation layers are included.
- No live ship position is included.
- Coordinates are approximate visual-orientation points unless reviewed or confirmed otherwise.
- Existing local browser databases may preserve previously reviewed port records; onboarding only fills missing shell data and does not silently overwrite trusted port metadata.

### Next tranche recommendation

Tranche 21: Cruise Weather Intelligence v0.1.

### Suggested commit message

```text
Add Cartographic Port Atlas map experience
```
