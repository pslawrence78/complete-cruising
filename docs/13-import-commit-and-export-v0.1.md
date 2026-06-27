# Tranche 13: Import Commit and Export v0.1

## Objective

Turn the Tranche 12 import preview into a safe, auditable local commit and JSON export workflow without adding live services, sync, authentication or a merge wizard.

## Implemented Scope

- Validated imports can be committed for the same five Tranche 12 import types: sailing shell, itinerary, ship enrichment, port enrichment and day guide.
- Commits run through a Dexie transaction and write only after a valid preview has been generated.
- Successful commits record an ImportBatch audit record with schema, source app, target summary, counts, warning totals and protected-field confirmation state.
- The Import / Export screen now includes a protected-field confirmation control, commit status and a compact last-commit panel.
- Three local JSON exports are available: full backup, active sailing export and Adventure Almanac cruise draft.
- Export downloads use browser-native Blob and object URL APIs only.

## Import Commit Behaviour

The commit service parses the same JSON shape used by the preview, revalidates it against the selected import schema, maps records through the shared preview record mapping and writes them in a single transaction. Records are matched by stable ID only.

Created records receive import audit metadata. Updated records preserve existing `audit.createdAt` and `audit.createdBy`, then set `audit.updatedAt` and `audit.updatedBy` to reflect the import. Existing records not included in the payload are not touched.

## Protected-Field Confirmation

Protected-field impacts remain visible from the preview. If any protected fields are present, the commit button stays disabled until the user explicitly confirms:

```text
I understand this import will overwrite protected cruise data.
```

No field-by-field merge editor is implemented in this tranche.

## ImportBatch Behaviour

Successful commits create an ImportBatch record with:

- schema and schema version
- import type
- committed status
- received and committed timestamps
- source app where supplied
- create, update and skipped counts
- warning and protected-field counts
- protected confirmation state
- validation and target summaries

Failed commits are reported in the UI but are not persisted as successful batches.

## Export Types

### Full backup

Exports all current local tables from IndexedDB into a `complete-cruising-full-backup` payload.

### Sailing export

Exports the active or requested sailing with linked cruise line, ship, cabin, travellers, itinerary days, ports, countries, shore plans, day guides, weather snapshots, family notes, memory entries and relevant enrichment sections.

### Adventure Almanac draft

Exports a draft `adventure-almanac-cruise-draft` payload for later review. It derives daily entries from itinerary days and non-sample memories where present. It does not fabricate missing memories and does not write to Adventure Almanac.

## Validation Performed

- `npm.cmd run typecheck`
- `npm.cmd run test` - 50 tests passed
- `npm.cmd run build`

## Known Limitations

- Import conflict matching remains ID-based.
- No rich merge resolution.
- No drag-and-drop import tooling.
- No full-backup restore.
- No direct Adventure Almanac integration.
- Adventure Almanac export is draft-only.
- No live APIs.
- No Supabase.
- No sync.
- Data remains local to the browser/device.
- Browser visual QA was not run in this tranche.

## Out of Scope

- Restore workflow
- Merge wizard or conflict resolver
- Cloud backup
- Account system
- Backend services
- Enrichment authoring or AI generation
- Image, photo, PDF or calendar export
- Deployment automation

## Suggested Commit Message

Add safe import commit and JSON export workflows

## Recommended Next Tranche

Tranche 14: PWA and Offline Readiness
