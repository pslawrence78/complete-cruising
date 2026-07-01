# Fresh-Base Reset

Date: 1 July 2026

## Why the failed app line was frozen

The previous Complete Cruising implementation no longer met the practical needs of the upcoming Sun Princess cruise. It had accumulated local database state, import workflows, backstage controls and review tooling without producing a stable, beautiful, cruise-first companion.

## What this reset changes

- freezes the failed implementation for reference
- makes a new static React + TypeScript + Vite base the active app
- narrows scope to one real cruise only
- removes admin-first product posture from the live runtime

## What the fresh base removes

- Dexie-dependent runtime flows
- import/export workbenches
- sailing setup and multi-sailing state
- weather review tooling
- backstage and data-management surfaces
- reset and rescue behaviour inside the product

## Cruise-stable principle

This branch is intended to remain deployable and stable through the real August 2026 cruise. Reliability, readability and confidence cues now take priority over platform flexibility.

## Known limitations

- the fresh base starts with static content and lightweight caveats only
- weather remains deferred from the runtime in this tranche
- memory capture is prompt-led rather than a persistent journal

## Suggested next tranche

Convert the first group of verified source-corpus notes into richer typed static port, ship and day-guide content while preserving the fresh architecture boundary.
