# Complete Cruising

## Tranche 24: Weather Snapshot Review and Conflict Resolution v0.1

Date: 29 June 2026.

## Tranche objective

Add a local-first review layer for competing weather snapshots, fix the sea-day weather wording regression and preserve weather selection history without destructive replacement.

## Sea-day wording fix

The shared weather presentation layer no longer defaults sea or scenic-cruising days to `weather_now_in_port`.

The fix now:

- keeps sea-day cards out of port-specific wording paths
- uses a neutral `Sea-day weather` label instead of fabricating a port context
- suppresses the old `weather now in port` caption on sea-day itinerary cards
- leaves port-day wording unchanged where real port weather context still applies

This was implemented in shared weather copy and model helpers rather than as a dashboard-only string patch.

## Preferred snapshot behaviour

Primary weather surfaces now resolve from the itinerary day's preferred weather snapshot pointer first and only fall back to the newest snapshot when no preferred pointer exists.

That change now affects:

- Dashboard
- Today
- Itinerary
- Ports

Manual refresh no longer silently advances the preferred pointer when a day already has a selected snapshot.

Instead:

- the refreshed snapshot is stored as a new competing record
- the existing preferred pointer remains in place
- the user can later review and explicitly select a different preferred snapshot

## Conflict detection rules

Tranche 24 adds a deterministic weather snapshot comparison service that groups snapshots by itinerary day and compares the preferred snapshot with stored competitors.

The comparison currently checks:

- high temperature
- low temperature
- precipitation probability
- wind speed
- condition summary
- weather context
- source name
- confidence level
- review status
- refresh status
- capture timing

Recommended review states are:

- `no_conflict`
- `review_recommended`
- `preferred_selected`
- `stale_preferred`

## Material difference thresholds

Thresholds are centralised in one helper so they can be tested and tuned later.

Initial thresholds:

- high temperature: 2 C
- low temperature: 2 C
- precipitation probability: 15 percentage points
- wind speed: 10 km/h

Context, confidence, review and refresh changes are also treated as meaningful differences.

## Audit trail behaviour

A new version 3 Dexie table stores `WeatherSnapshotReviewEvent` records.

Events currently record:

- preferred snapshot selection
- conflict acknowledgement

Each event preserves:

- sailing and itinerary day
- forecast date
- from and to snapshot IDs where relevant
- candidate snapshot IDs
- notes and reason fields
- created-at timestamp
- created-by source

Competing weather snapshots remain stored after selection.

## Review UI

The app now includes a dedicated `#/weather-review` route with an Ocean Luxe comparison surface.

The route shows:

- unresolved review count
- itinerary day identity
- sea-day-safe labels
- preferred and competing snapshot cards
- material difference summaries
- confidence, review and refresh chips
- selection action
- conflict acknowledgement action
- audit trail entries

Dashboard weather now links into the review route when unresolved conflicts exist.

## Deliberately not automated

This tranche still does not add:

- scheduled refresh
- background polling
- alerts
- notifications
- marine weather
- sea-state integration
- sync
- backend services
- destructive snapshot replacement

## Validation performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Results:

- typecheck passed
- tests passed: 22 files, 150 tests
- production build passed

Responsive browser smoke checks were completed on:

- `/#/`
- `/#/today`
- `/#/itinerary`
- `/#/ports`
- `/#/weather-review`

Widths checked:

- 390 px
- 430 px
- 768 px
- 1024 px
- 1440 px

Observed:

- no document-level horizontal overflow on the checked routes
- itinerary sea days no longer surfaced `weather now in port`
- port-facing routes still showed valid port-weather wording
- the Weather Review route empty state remained readable on mobile

## Known limitations

- The default browser-seeded sailing state did not contain competing weather snapshots, so the manual browser smoke check could verify the empty-state review route but not live review-card selection or audit-trail rendering from browser interaction alone.
- Automated coverage now verifies preferred-pointer updates, review-event creation, conflict detection and sea-day wording regression handling.
- Weather review currently compares against all stored snapshots for a day rather than introducing narrower grouping by advanced future context buckets.
- The build still emits the existing large-chunk warning from Vite, but the production build succeeds.

## Suggested commit message

```text
Add weather snapshot review and conflict resolution
```

## Recommended next tranche

Tranche 25: Weather Snapshot Review Workflow Polish v0.1
