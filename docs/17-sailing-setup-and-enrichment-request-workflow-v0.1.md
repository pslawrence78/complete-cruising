# Tranche 17: Sailing Setup and Enrichment Request Workflow v0.1

Date: 28 June 2026.

## Purpose

This tranche adds a local-first preparation workflow for creating a sailing shell and generating structured enrichment request artefacts. It is designed to make Complete Cruising easier to populate with real, verified cruise data while preserving the existing import preview and commit model.

The app still performs no live research, scraping, API calls, model calls, authentication, backend sync or cloud storage.

## User Flow

The new `#/sailing-setup` route guides the user through:

1. Sailing basics.
2. Ship and cruise line.
3. Dates and optional local-only voyage code.
4. Manual itinerary shell rows.
5. Review and create.
6. Next enrichment request guidance.

The setup service creates or reuses:

- cruise line records;
- ship records;
- reusable port records where port names are entered;
- country placeholders where needed;
- a sailing record;
- sailing-specific itinerary day records.

Manual entries are tagged as `user_entered`, carry confidence and review metadata, and default to reviewable rather than trusted unless the user marks an itinerary row as confirmed.

## Supported Prompt Types

The new `#/enrichment-requests` route supports six controlled request types:

- `sailing_shell_enrichment`
- `itinerary_verification`
- `ship_pack_enrichment`
- `port_pack_enrichment`
- `shore_plan_generation`
- `day_guide_generation`

Ship pack selectors cover identity, layout, dining, cabins/practical life, family/Seb suitability, entertainment, pools/recreation and tips/watchouts.

Port pack selectors cover fact file, cruise logistics, getting around, top highlights, family lens, food/culture, photography, hints/watchouts, weather/seasonality and suggested shore plans.

## Request JSON Contract

Generated requests use:

```text
complete-cruising-enrichment-request-v1
```

Each request includes:

- schema/version/source app;
- request ID, type and target;
- sailing, ship, cruise line, itinerary, port and existing enrichment context;
- Lawrence family context;
- task instructions, scope, exclusions and source guidance;
- expected return schema name.

Known sensitive fields are removed from request context before serialisation. Request JSON avoids carrying booking, cabin, private identity, insurance or payment values.

## Expected Return Schemas

The generated prompts embed exact expected return schema text for:

- `complete-cruising-sailing-shell-enrichment-v1`
- `complete-cruising-itinerary-verification-v1`
- `complete-cruising-ship-pack-enrichment-v1`
- `complete-cruising-port-pack-enrichment-v1`
- `complete-cruising-shore-plan-generation-v1`
- `complete-cruising-day-guide-generation-v1`

Every schema includes the shared confidence, review, source and refresh metadata shape.

## Import Preview Relationship

Generated prompts explicitly state that returned JSON must be pasted or uploaded through Import / Export for preview and commit.

This tranche recognises the new return schema names and maps them to the closest existing import areas, but it does not silently commit the new returned shapes. Unsupported return shapes produce a recognised-but-incomplete preview limitation until a safe field-level mapper is implemented.

## Data Origin Model

The UI and generated contracts continue to distinguish:

- user-entered data;
- confirmed data;
- researched data;
- inferred data;
- needs-review data;
- needs-refresh data.

The implementation reuses existing confidence, review, source and refresh metadata rather than creating a parallel trust system.

## Protected-Field Behaviour

Protected fields remain guarded by the existing Import / Export preview and commit flow. In this tranche, generated prompts instruct ChatGPT not to overwrite confirmed:

- sailing dates;
- ship;
- cruise line;
- itinerary date;
- port name;
- arrival time;
- departure time;
- all-aboard time;
- selected plans or completed memories.

Possible corrections must be returned as reviewable proposals with confidence metadata.

## Privacy and Sensitive-Data Exclusions

The setup flow does not request booking references, passport data, payment details, insurance policy numbers or cabin numbers. Voyage/cruise code is supported as optional local-only planning data.

Generated request JSON strips known sensitive keys and generated prompts repeat the sensitive-data exclusion.

## Validation Performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
```

Validation covered:

- sailing shell creation;
- manual itinerary day generation;
- nights/day count calculation;
- reuse of existing ship, cruise line and port records;
- request generation for all six prompt types;
- prompt generation for all six prompt types;
- expected return schema inclusion;
- JSON-only prompt guardrails;
- confidence/review/refresh metadata preservation;
- sensitive-data exclusion from generated requests;
- return schema recognition in import preview.

## Known Limitations

- No external research is performed by the app.
- No ChatGPT/OpenAI API integration exists.
- Prompt output must be copied manually.
- Returned enrichment must be pasted or uploaded manually through Import / Export.
- Recognised ChatGPT return shapes are not yet fully mapped into commit-ready imports.
- Generated prompts depend on the quality of the user-entered sailing shell.
- Real Sun Princess 2026 data is not populated until Tranche 18.
- Visual/content QA using realistic long-form content is deferred until after Tranche 18.

## Suggested Commit Message

```text
Add sailing setup and enrichment request workflow
```

## Recommended Next Tranche

Tranche 18: Real Sun Princess 2026 Data Onboarding v0.1
