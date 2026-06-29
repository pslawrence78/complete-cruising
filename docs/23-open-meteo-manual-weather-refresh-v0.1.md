# Complete Cruising

## Tranche 23: Open-Meteo Manual Weather Refresh v0.1

Date: 29 June 2026.

## Tranche objective

Add a manual-only Open-Meteo weather refresh workflow that keeps Complete Cruising local-first, trust-aware and visually polished while clearly separating visit-date forecasts from current destination context.

## Manual-only weather refresh principle

Weather refresh now happens only after an explicit user action from weather surfaces in Dashboard, Today, Itinerary and Ports.

No automatic refresh was added for:

- app load
- route changes
- background jobs
- scheduled refreshes
- notifications
- service-worker sync

When offline, the app preserves the existing local snapshot and explains that refresh requires a connection.

## Open-Meteo no-key integration

The client still calls Open-Meteo directly from the browser with no key, no proxy and no backend.

The integration now requests only a compact field set:

- daily: `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `precipitation_probability_max`, `wind_speed_10m_max`, `sunrise`, `sunset`, `uv_index_max`
- current: `temperature_2m`, `apparent_temperature`, `weather_code`, `precipitation`, `wind_speed_10m`, `relative_humidity_2m`

The response mapper normalises current and daily payloads into local snapshot fields and keeps source attribution separate from UI components.

## Attribution approach

New Open-Meteo snapshots now store:

- `sourceName: "Open-Meteo"`
- `sourceAttribution: "Weather data by Open-Meteo"`
- `sourceUrl: "https://open-meteo.com/en/docs"`

Updated weather surfaces now render source name, attribution and last refresh time.

## Forecast-window behaviour

The tranche adds deterministic forecast-window helpers with a 16-day Open-Meteo horizon constant.

Refresh mode is now classified as:

- `same_day_check` when the itinerary day is today
- `visit_date_forecast` when the itinerary day falls inside the forecast window
- `weather_now_in_port` when the itinerary day is still outside the forecast window
- no live refresh for past days

For out-of-window future calls, the UI shows the expected visit-date forecast availability date instead of pretending current weather is the future forecast.

## Weather-now versus visit-date forecast

Weather snapshots now carry context and readiness distinctions so the UI can present:

- `Visit-date forecast`
- `Weather now in port`
- `Same-day check`
- `Climate context`
- `Observed weather`

`Weather now in port` never satisfies visit-date forecast readiness.

## WeatherSnapshot and local cache changes

The existing weather snapshot model was extended rather than replaced.

New weather fields include:

- `weatherContext`
- `sourceAttribution`
- `generatedAt`
- `observedAt`
- `visitDate`
- `forecastDate`
- `forecastExpectedFrom`
- `temperatureCurrentC`
- `apparentTemperatureC`
- `humidity`
- `isVisitDateForecast`
- `satisfiesVisitForecastReadiness`

Weather presentation now uses dedicated helpers for:

- refresh-mode classification
- readiness-state mapping
- trust-aware copy
- Open-Meteo field mapping
- refresh button state labels

## Protected overwrite rules

Manual refresh no longer overwrites trusted weather silently.

The service now:

- updates an existing Open-Meteo snapshot only when it is still unreviewed and replaceable
- blocks refresh when the latest snapshot is reviewed, verified, confirmed, manually observed or user-entered
- preserves observed and family-authored weather records
- returns explicit blocked, offline and failed button states for the UI

## UI surfaces updated

The tranche updates the existing Ocean Luxe weather touchpoints instead of adding a generic weather centre.

Updated surfaces:

- Dashboard cruise weather outlook
- Today weather tile
- Itinerary day weather strip
- Port weather and seasonality panel

Each surface now shows, where relevant:

- port name
- visit date
- weather data date
- weather type label
- readiness state
- source and attribution
- last refreshed time
- expected visit-forecast availability date
- a manual refresh control with explicit state labels

## Validation performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Results:

- typecheck passed
- tests passed: 19 files, 139 tests
- production build passed
- manual browser smoke check passed for `/#/`, `/#/today`, `/#/itinerary` and `/#/ports` at 390 px, 430 px and 1024 px widths with no document-level horizontal overflow

The existing Vite large-chunk warning remains present, but the build completed successfully.

## Known limitations

- Manual refresh currently focuses on port-like itinerary days; sea-day weather remains intentionally conservative.
- The tranche blocks trusted observed or reviewed snapshots rather than introducing a full compare-and-merge review workflow.
- Manual browser smoke checks covered route loading and overflow only; offline, failed-refresh and missing-coordinate browser flows still rely primarily on automated validation in this tranche.
- Open-Meteo remains an external dependency for the moment of refresh, even though the stored result remains local afterwards.

## Suggested commit message

```text
Add manual Open-Meteo weather refresh
```

## Recommended next tranche

Tranche 24: Weather Snapshot Review and Conflict Resolution v0.1
