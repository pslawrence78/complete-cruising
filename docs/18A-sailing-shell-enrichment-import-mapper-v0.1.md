# Tranche 18A: Sailing Shell Enrichment Import Mapper v0.1

Date: 28 June 2026.

## Purpose

This tranche bridges the Tranche 17 enrichment-request workflow and the Real Sun Princess 2026 onboarding work by adding a safe mapper for:

```text
complete-cruising-sailing-shell-enrichment-v1
```

The app still performs no live research, scraping, API calls, OpenAI calls, authentication, backend sync or cloud storage.

## Implemented Scope

- Import / Export now recognises the sailing shell enrichment return schema as committable when the target sailing already exists locally.
- The mapper creates or updates one `EnrichmentRun` plus the returned sailing-level `EnrichmentSection` records.
- Section content preserves `shortSummary`, `structuredFacts`, `practicalGuidance`, `familyRelevance`, `watchouts`, `suggestedNextActions` and confidence metadata.
- Run-level validation warnings and import-advice protected-field warnings are displayed in preview and recorded in the `ImportBatch`.
- Reviewed or verified existing enrichment sections are blocked from silent overwrite.
- Re-importing the same payload is idempotent and does not create duplicate sections.

## Safety Boundaries

The mapper does not update:

- protected sailing identity, dates, route, voyage, ship, cruise line, embarkation or disembarkation fields;
- itinerary days;
- port records;
- port times, all-aboard times or third-party timing data;
- day guides, shore plans, weather snapshots or reusable port/ship guidebook records.

The preview explicitly labels the import as sailing-level context, not operational timing confirmation.

## Validation Performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

The test suite passed with 79 tests. Coverage includes successful commit, missing target sailing, idempotent re-import, protected-field non-overwrite and reviewed-section overwrite blocking. The production build passed; Vite retained its existing large JavaScript chunk advisory.

## Known Limitations

- No external research integration.
- No ChatGPT/OpenAI API integration.
- No automatic Princess account/app ingestion.
- No protected itinerary, timing or booking-field overwrite.
- This mapper only commits sailing-level enrichment sections.
- Other Tranche 17 return schemas remain recognised but unmapped until their own safe field-level mappers exist.

## Suggested Commit Message

```text
Add sailing shell enrichment import mapper
```

## Recommended Next Tranche

Tranche 18: Real Sun Princess 2026 Data Onboarding v0.1. Use the new mapper to bring in reviewed sailing-level context first, then continue with targeted port, ship, itinerary verification and day-guide work in separate tranches.
