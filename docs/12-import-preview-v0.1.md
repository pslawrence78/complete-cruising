# Tranche 12: Import Preview v0.1

## Objective

Provide a polished, local-only Import / Export screen that parses, validates and previews structured Complete Cruising JSON before any data can change.

## Supported imports

- Sailing shell
- Itinerary
- Ship enrichment
- Port enrichment
- Day guide

The route is `#/import-export`. Users can paste JSON, upload a `.json` file or load a non-sensitive illustrative sample for the selected import type.

## Validation approach

The preview service safely parses JSON and then validates it against the existing strict Zod import envelopes and core record schemas. It detects a recognisable `kind` mismatch before structural validation, normalises Zod issues into field-level errors, and performs read-only ID comparisons against the relevant IndexedDB tables.

Valid previews report likely target, generated schema identifier, schema version, record creates, updates and unchanged records. Confidence, review and refresh metadata produce visible warnings. Reusable ship and port guidebook targets remain distinct from sailing-specific itinerary and day-guide targets.

## Protected fields

Protected sailing, itinerary, ship and port fields are detected conservatively when present in a valid payload. The preview displays the record and field path, with existing and proposed values retained in the typed result for a future conflict workflow. Their presence does not invalidate an otherwise valid payload.

No import repository, transaction or IndexedDB write is called. Preview state remains transient in React and the commit button is disabled.

## Files changed

- `app/src/features/import-export/` — screen, Ocean Luxe responsive styling, preview service, types and illustrative samples.
- `app/src/schemas/importExportSchemas.ts` — optional source-app provenance in import headers.
- `app/src/App.tsx` and `app/src/routes/routeConfig.ts` — implemented route.
- `app/src/tests/importPreviewService.test.ts` and `app/src/tests/App.test.tsx` — service safety and screen behaviour.
- `README.md`, `docs/README.md` and the tranche tracker — project status and knowledge index.

## Testing performed

- `npm.cmd run typecheck`
- `npm.cmd run test` — 40 tests passed
- `npm.cmd run build`
- Responsive CSS reviewed for 1440px, 1024px, 768px, 430px and 390px layouts.

## Known limitations

- Conflict detection is ID-based and deliberately conservative; it does not offer resolution or partial acceptance.
- Protected-field detection reports field presence, including valid creates, rather than making trust decisions.
- Schema identifiers are normalised from the existing `kind` plus schema version rather than required as a duplicate payload field.
- Export and import commit remain unavailable.
- Automated visual regression is not configured.

## Recommended next tranche

Tranche 13: Import Commit and Export v0.1. Add explicit overwrite consent, protected-field safeguards, atomic commits and local export downloads without weakening the preview gate.

