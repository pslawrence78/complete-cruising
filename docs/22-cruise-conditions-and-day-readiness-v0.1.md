# Complete Cruising

## Tranche 22: Cruise Conditions and Day Readiness v0.1

Date: 29 June 2026.

## Purpose of the tranche

Add a derived Cruise Conditions and Day Readiness layer that helps the family judge whether each sailing day is practically usable from the app without creating a new workflow or silently changing trusted records.

## Derived readiness approach

This tranche adds a small TypeScript-only readiness service and view-model layer.

Each itinerary day is assessed across five dimensions:

- timing
- weather
- plan
- family comfort
- trust and refresh metadata

Each dimension scores from 0 to 2. The combined score then maps to:

- `ready_for_today`
- `usable_with_cautions`
- `needs_review`
- `not_ready`

The service also adds compact condition badges, next-action cues and a dashboard summary, but it does not persist new readiness records.

## Weather interpretation rules

- Existing local `WeatherSnapshot` records are interpreted only as stored guidance.
- Climate snapshots are clearly shown as climate-only guidance rather than live forecasts.
- Forecast-pending, stale and same-day-check states stay visibly caveated.
- Existing confidence, review and refresh metadata flow through to the readiness output.
- Past or observed weather is not promoted to a future operational forecast.

## No-live-API decision

This tranche introduces no new live API, no key handling and no background refresh job.

It works entirely from existing local itinerary, guide, plan and weather records. The earlier weather tranche still exists, but Tranche 22 does not expand that integration surface.

## Affected screens

- Dashboard now includes a Cruise Conditions summary card.
- Today now includes a Day Readiness / Conditions Board panel ahead of the weather card.
- Itinerary day cards now show compact readiness and condition badges.

## Validation performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

All three commands passed.

Responsive smoke check performed against:

- `/#/`
- `/#/today`
- `/#/itinerary`
- `/#/ports`
- `/#/ship`

Checked at 390 px, 430 px, 768 px, 1024 px and 1440 px.

Observed results:

- no document-level horizontal overflow
- Today kept the all-aboard card visually dominant
- itinerary condition badges stayed within their container
- no new live weather fetch was added by this tranche

## Known limitations

- Readiness remains derived from whatever local records are present; it does not create missing plans or timings.
- The current dashboard summary is compact and does not yet expose per-dimension counts.
- Manual smoke validation focused on responsive clarity and overflow rather than exhaustive visual comparison screenshots.

## Suggested commit message

```text
Add cruise conditions and day readiness signals
```

## Recommended next tranche

Tranche 23: Weather Import and Forecast Window Preparation v0.1
