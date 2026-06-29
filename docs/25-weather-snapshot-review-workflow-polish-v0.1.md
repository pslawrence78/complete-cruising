# Complete Cruising

## Tranche 25: Weather Snapshot Review Workflow Polish v0.1

Date: 29 June 2026.

## Tranche objective

Polish the local Weather Review workflow so it is clearer, calmer and easier to smoke-test across empty, stable, conflict, resolved and audit-heavy states without adding new automation or weather sources.

## What changed

Tranche 25 keeps the Tranche 24 preferred-snapshot model intact and focuses on usability, presentation and demoability.

The Weather Review route now adds:

- an illustrative demo toggle that loads deterministic review scenarios into the sample sailing and can also restore a calm sample state;
- distinct page sections for snapshots needing review, already-resolved days and stable single-snapshot days;
- calmer empty-state copy that does not imply every future forecast is final;
- a guided "why this needs review" summary for competing snapshot cards;
- clearer snapshot metadata, including weather applicability, generated or refreshed timing, source, confidence, review and refresh status;
- richer audit-trail wording with selected and previous snapshot summaries;
- a sea-day guardrail card that keeps weather wording neutral instead of implying port-weather review;
- tighter mobile card layouts for 390 px and 430 px widths.

## Weather Review access

Open:

```text
/#/weather-review
```

The route now includes two local-only controls:

- `Load illustrative review scenarios`
- `Restore calm illustrative state`

These controls only touch the illustrative sample sailing. They do not add automation, new providers, alerts or background refresh behaviour.

## Demo scenarios covered

The illustrative review mode covers:

- Empty state: use `Restore calm illustrative state` to return the sample sailing to a no-conflict review state.
- Single-snapshot state: Souda Bay / Chania shows one stable visit-date forecast.
- Conflict state: Naples shows competing snapshots that still need a preferred choice.
- Resolved state: Kusadasi / Ephesus shows a selected preferred same-day check with preserved history.
- Audit-trail state: Naples and Kusadasi / Ephesus both include readable review history.
- Sea-day guardrail state: an illustrative sea-day snapshot stays labelled as sea-day weather rather than port weather.

## Validation performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Results:

- typecheck passed
- tests passed: 24 files, 157 tests
- production build passed

Browser smoke checks were run against the built preview at `http://127.0.0.1:4179/complete-cruising/` for:

```text
/#/weather-review
/#/
/#/today
/#/itinerary
/#/ports
```

Widths checked:

```text
390 px
430 px
768 px
1024 px
1440 px
```

Observed:

- no document-level horizontal overflow on any checked route or width;
- the Weather Review route showed the expected needs-review, resolved and stable sections after loading illustrative review scenarios;
- sea-day wording remained neutral on the Weather Review route;
- Today and Ports continued to show Naples weather from the active preferred snapshot state;
- no new external weather source or background automation was introduced.

## Known limitations

- The route-level illustrative controls target the sample sailing only; switching back to the real sailing remains a deliberate user action through the existing sailing-selection flow.
- In-app browser automation was reliable for state and responsive verification, but the manual preferred-snapshot button interaction remained primarily covered by automated tests rather than a browser-driven click during this tranche.
- The Weather Review route now explains current states well, but cross-surface review cues in Dashboard, Today, Itinerary and Ports remain intentionally light.
- The production build still emits the existing large-chunk warning from Vite, but the build succeeds.

## Suggested commit message

```text
Polish weather snapshot review workflow
```

## Recommended next tranche

Tranche 26: Weather Review Cross-Surface Status Cues v0.1
