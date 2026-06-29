# Complete Cruising

## Tranche 21: Cruise Weather Intelligence v0.1

Date: 29 June 2026.

## Objective

Add a local-first weather intelligence layer for active sailing, using Open-Meteo as a no-key forecast and archive source, while preserving the premium Ocean Luxe experience and the separation between reusable guidebook records and sailing-specific itinerary records.

## Purpose

This tranche turns weather from a passive placeholder into a reviewed, refreshable voyage aid. The app now shows weather intelligence in the Dashboard route ribbon, the Today weather card, itinerary day cards and the port guide seasonality panel.

Weather remains advisory rather than authoritative. The UI preserves confidence, review and refresh metadata, avoids silent overwrites and keeps seasonal expectation separate from live forecast data.

## Surfaces changed

- Dashboard now shows a cruise weather outlook card and route-strip weather badges.
- Today now shows a weather and comfort card with refresh support.
- Itinerary now shows per-day weather chips, guidance text and refresh controls.
- Ports now shows a weather and seasonality panel for the active port guide.
- Local repositories now persist weather snapshots with versioned indexes and refresh state.

## Files changed

- `app/src/schemas/commonSchemas.ts`
- `app/src/schemas/weatherSchemas.ts`
- `app/src/types/common.ts`
- `app/src/db/completeCruisingDb.ts`
- `app/src/db/repositories/weatherRepository.ts`
- `app/src/db/repositories/screenRepository.ts`
- `app/src/features/weather/openMeteoClient.ts`
- `app/src/features/weather/weatherPresentation.ts`
- `app/src/features/weather/weatherRefreshService.ts`
- `app/src/features/weather/weatherStateService.ts`
- `app/src/features/weather/weatherTypes.ts`
- `app/src/features/weather/components/WeatherSeasonalityPanel.tsx`
- `app/src/features/dashboard/DashboardPage.tsx`
- `app/src/features/dashboard/DashboardPage.css`
- `app/src/features/dashboard/components/CruiseWeatherOutlookCard.tsx`
- `app/src/features/dashboard/components/RouteRibbon.tsx`
- `app/src/features/today/TodayPage.tsx`
- `app/src/features/today/TodayPage.css`
- `app/src/features/today/components/WeatherTile.tsx`
- `app/src/features/itinerary/ItineraryPage.tsx`
- `app/src/features/itinerary/ItineraryPage.css`
- `app/src/features/itinerary/components/ItineraryDayCard.tsx`
- `app/src/features/ports/PortGuidePage.tsx`
- `app/src/features/ports/PortGuidePage.css`
- `app/src/data/sampleDashboardData.ts`
- `app/src/data/sampleTodayData.ts`
- `app/src/data/samplePortData.ts`
- `app/src/data/viewModelMappers.ts`
- `app/src/tests/App.test.tsx`
- `app/src/tests/database.test.ts`
- `docs/README.md`
- `docs/build-plan/tranche-plan-v0.1.md`
- `README.md`
- `app/README.md`

## Data model changes

Weather now has its own schema-backed snapshot record and supporting enums:

- `weatherState`: `climate_expectation`, `forecast_pending`, `forecast_available`, `forecast_recent`, `forecast_stale`, `day_locked`, `historical_lookup_available`, `missing_coordinates`
- `refreshState`: `ready`, `refreshing`, `updated`, `skipped`, `failed`
- `snapshotType`: climate, forecast, same-day, observed or manual

Weather snapshots now carry:

- port, sailing, itinerary-day and date linkage;
- latitude and longitude;
- source name and optional source URL;
- validity dates;
- refresh attempt timestamps and refresh recommendations;
- temperature, precipitation, wind, UV, sunrise and sunset fields;
- comfort, clothing and plan-impact guidance;
- confidence and audit metadata;
- sample-only and caveat markers where appropriate.

The Dexie weather snapshot store was updated to version 2 with indexes for sailing/day/date lookup and refresh-state retrieval.

## Weather states and behaviour

- `climate_expectation` is used when only seasonal guidance is useful.
- `forecast_pending` is used when a forecast window exists but a day has not yet been refreshed.
- `forecast_available` and `forecast_recent` describe fresh or recently captured forecasts.
- `forecast_stale` marks snapshots that still exist but should be refreshed.
- `day_locked` marks a past day whose weather has been captured for the sailing record.
- `historical_lookup_available` marks a past day that can still be looked up if historical refresh is explicitly allowed.
- `missing_coordinates` blocks refresh until usable coordinates exist.

Refreshes create new local snapshots rather than overwriting trusted records silently.

## External weather source

Open-Meteo is used directly as the weather source, without an API key or backend proxy.

Reference: https://open-meteo.com/en/docs

Forecast and archive requests are generated locally from the port coordinates and sailing date. If refresh is unavailable, the UI falls back to the local snapshot or seasonal guidance already held in IndexedDB.

## Validation performed

From `app/`:

```text
tsc -b --pretty false
vitest run --configLoader runner
vite build --configLoader runner
```

All three commands completed successfully. The Vite build still reports the existing large-chunk advisory for the generated JavaScript bundle, but the build completed.

## Known limitations

- Open-Meteo remains an external dependency for refreshes, even though no key is required.
- The tranche does not add hourly weather, wind layers, radar maps or live routing.
- Weather snapshots are local and illustrative; they are not a substitute for official cruise line or port instructions.
- Historical refresh is gated and only enabled explicitly for locked days.
- No automatic retry queue or background refresh scheduler was added.
- Existing trusted or confirmed data is never overwritten silently.

## Suggested commit message

```text
Add cruise weather intelligence and local refresh states
```

## Recommended next tranche

Tranche 22: Cruise Conditions and Day Readiness v0.1
