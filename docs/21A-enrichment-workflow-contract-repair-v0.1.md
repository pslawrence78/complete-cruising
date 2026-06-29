# Complete Cruising

## Tranche 21A: Enrichment Workflow Contract Repair v0.1

Date: 29 June 2026.

## Objective

Repair the end-to-end enrichment workflow so every supported request type can move through a governed prompt, an import-ready JSON return, preview validation and a safe local commit path where the current data model supports it.

## Purpose

Tranche 17 established the request workflow and Tranche 18A proved the sailing-shell return mapper. This repair tranche closes the remaining contract gaps so the app no longer offers six request types in one place and fewer import types in another, and so supported ChatGPT returns can be previewed and committed safely instead of failing on schema drift or missing routing.

The tranche remains local-first and static. It adds no backend, live model integration, authentication, paid API or cloud sync.

## Supported request and import types

The workflow now uses one typed catalogue for all six supported request/import pairs:

1. Sailing shell
   Return schema: `complete-cruising-sailing-shell-enrichment-v1`
2. Itinerary verification
   Return schema: `complete-cruising-itinerary-verification-v1`
3. Ship pack enrichment
   Return schema: `complete-cruising-ship-pack-enrichment-v1`
4. Port pack enrichment
   Return schema: `complete-cruising-port-pack-enrichment-v1`
5. Day guide enrichment
   Return schema: `complete-cruising-day-guide-generation-v1`
6. Shore plan enrichment
   Return schema: `complete-cruising-shore-plan-generation-v1`

This shared catalogue now drives:

- the Guidebook Tools request-type cards;
- Enrichment Request Settings filter relevance and labels;
- prompt generation and suggested import filenames;
- Import / Export type options;
- return-schema dispatch in preview and commit routing;
- preview labels and mapper routing.

## Sailing Setup management

`#/sailing-setup` is no longer add-only.

The route now shows existing sailings, supports shell editing, and provides guarded archive or delete actions with an explicit confirmation panel. Delete is only allowed for empty drafts with no linked itinerary, shore plan, day guide, weather, family-note, memory or enrichment records. Where linked records exist, the UI directs the user towards archive so trusted or reviewed local data is not lost silently.

Editing reuses the existing repository pattern and preserves linked itinerary day identity. Existing day rows remain in place during shell management so related local records are not orphaned by a casual row deletion.

## Prompt governance and return contract

All six prompt templates now instruct ChatGPT to:

- return one complete JSON object only;
- use the exact Complete Cruising return schema wrapper;
- avoid prose before or after the JSON;
- include the governed target metadata;
- use the suggested import filename pattern for the saved `.json` file.

The app can copy or export the request JSON and the companion prompt text. The prompt language now makes the manual step explicit: if ChatGPT returns JSON in chat, save it as a `.json` file before importing when needed.

## Import preview and mapper repair

Import Preview now recognises and validates all six governed return shapes against their exact schema names.

Safe routing is now in place for:

- sailing shell return mapping;
- itinerary verification mapping into itinerary-day updates with protected-field warnings preserved;
- ship pack returns into reusable ship enrichment runs and sections;
- port pack returns into reusable port enrichment runs and sections;
- day guide returns into day-guide records;
- shore plan returns into shore-plan records.

Preview blocks commit when required sailing, ship, port or itinerary-day targets cannot be matched locally. The repair continues to preserve confidence, review status, refresh status, validation warnings and protected-field warnings rather than flattening them away.

## Enrichment Request Settings simplification

The request-type choice now comes first. Advanced filters are collapsed by default, and each filter is marked required, optional or disabled from the shared catalogue.

The default flow is intentionally calmer:

- sailing shell keeps only optional sailing context;
- itinerary focuses on sailing first, with optional day and port narrowing;
- ship pack requires ship and pack;
- port pack requires port and pack;
- day guide requires sailing and day, with optional port and ship context;
- shore plan requires sailing and day, with optional port context.

## Validation performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

All three commands completed successfully. The Vite build still reports the existing large-chunk advisory, but the build completed.

Manual browser smoke checks were completed where practical:

- `#/sailing-setup` renders the sailing management surface with edit, archive and delete-empty-draft actions;
- `#/enrichment-requests` shows all six request types and the simplified filter flow;
- `#/import-export` shows all six import types, including Shore Plan.

Automated in-app browser interaction did not conclusively drive the preview action button for sample JSON even though the UI reflected other state changes, so full manual import-preview interaction remains a follow-up verification item rather than a known code failure.

## Known limitations

- Existing itinerary rows cannot be removed during shell editing; archive remains the safe path when the structure should be retired.
- Ship and port governed returns currently commit enrichment runs and sections only. Proposed ship/port field patches and attraction proposals remain review-led JSON content rather than automatic writes.
- Shore plan imports do not silently change the currently selected recommendation on an itinerary day.
- The browser smoke pass confirmed the presence of the repaired surfaces, but full click-through validation of every fixture in the in-app browser was only partial because of browser automation quirks.

## Suggested commit message

```text
Repair enrichment request and import contract
```

## Recommended next tranche

Tranche 22: Cruise Conditions and Day Readiness v0.1.
