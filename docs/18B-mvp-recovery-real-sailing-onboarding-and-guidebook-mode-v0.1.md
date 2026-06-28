# Tranche 18B: MVP Recovery, Real Sailing Onboarding and Guidebook Mode v0.1

Date: 28 June 2026.

## Purpose

This tranche recovers the MVP flow around the Lawrence family's real Sun Princess August 2026 sailing. The app now opens around the real local sailing shell, keeps sample data demoted, provides guarded local data-management controls and moves setup/build tools behind a guidebook-style More area.

The app remains local-first, static, offline-capable and suitable for GitHub Pages. No backend, authentication, Princess integration, live research, OpenAI integration or paid API was added.

## Real Sailing Onboarded

The active/default sailing is:

- Sailing name: Eastern Mediterranean Cruise.
- Ship: Sun Princess.
- Cruise line: Princess Cruises.
- Route summary: Rome/Civitavecchia to Barcelona.
- Departure date: 2026-08-15.
- Return date: 2026-08-29.
- Local sailing id: `sailing-eastern-mediterranean-cruise-mqxo1afu`.

The onboarding path creates or selects this sailing without duplication. It generates a 15-day itinerary spine from Day 1 on 2026-08-15 to Day 15 on 2026-08-29. Port labels use the existing project/sample route structure, but operational arrival times, departure times and all-aboard times are deliberately left empty.

The voyage code `U632A` is not seeded. If it already exists in local user-entered data, onboarding preserves it.

## Data Management

A new `#/data-management` route adds Ocean Luxe-aligned local data controls under More:

- export full local backup;
- reset active sailing;
- remove sample data;
- clear all local Complete Cruising data;
- reseed curated sample data;
- seed/onboard the real Sun Princess 2026 sailing.

Destructive actions require a backup acknowledgement plus exact confirmation phrases:

- `RESET ACTIVE SAILING`
- `CLEAR COMPLETE CRUISING DATA`
- `REMOVE SAMPLE DATA`

Reseed/onboarding actions use:

- `SEED SUN PRINCESS 2026`
- `RESEED SAMPLE DATA`

The guardrails are implemented in service code and covered by tests, not only in the UI.

## Sailing Setup Date Generation

The setup flow now generates itinerary rows from departure and return dates. For 2026-08-15 to 2026-08-29 it produces Day 1 through Day 15, with dates populated and operational time fields empty.

Generated rows remain editable before saving. A paste helper applies one port label or sea-day label per row, allowing the user to enter the day spine without manually typing every date.

## Guidebook Navigation

Primary desktop navigation now prioritises:

- Dashboard
- Today
- Itinerary
- Ports
- Ship
- More

Mobile prioritises Dashboard, Today, Itinerary, Ports and More. Setup, Enrichment Requests, Import / Export, Data Management, Plans, Family Guide, Memories, Documents and Settings sit behind More/Manage-style navigation while route deep links remain available for implemented routes.

## Data Safety

The onboarding code does not overwrite an existing real sailing. It sets the real sailing active and adds missing itinerary rows only where dates are absent. Existing protected fields, including voyage code, route summary, itinerary tender status and all-aboard time, are preserved.

No booking reference, cabin number, passport details, insurance details, private address or traveller identity data was introduced.

## Unverified Items

Operational port times, tendering, terminal arrangements, port changes, all-aboard times, shore plans, weather and Princess operational decisions remain unverified. They are not fabricated. Records created by this tranche use `needs_user_review` and refresh metadata where appropriate.

Taranto/Corfu uncertainty and Santorini/Mykonos tender status should remain review-visible if introduced by local user data or later imports; this tranche does not assert them as confirmed.

## Validation Performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

All three commands completed successfully. The production build emitted Vite's large chunk advisory for the generated JavaScript bundle; no build failure occurred.

## Known Limitations

- No external research integration.
- No Princess account/app ingestion.
- No live port-time verification.
- No weather integration.
- No OpenAI/ChatGPT API integration.
- No Supabase or cloud sync.
- Real sailing data remains locally stored and reviewable.
- Operational cruise decisions must still be checked against Princess material.
- The app remains an MVP cruise companion, not a replacement for Princess materials.

## Suggested Commit Message

```text
Recover MVP flow for real Sun Princess sailing
```

## Recommended Next Tranche

Tranche 19: MVP Cruise Usability and Visual Polish v0.1
