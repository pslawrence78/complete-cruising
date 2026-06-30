# Complete Cruising

## Tranche 24A: More Navigation Menu Repair v0.1

Date: 30 June 2026.

## Issue summary

The More navigation menu was unreliable across the shell:

- on mobile, tapping `More` changed the background state but did not surface a usable menu above the glass shell;
- on desktop, selecting a More destination left the menu stranded open until `More` was clicked again.

This corrective tranche repairs the interaction without redesigning the shell, routes or broader weather and import/export flows.

## Root cause

Two related implementation choices caused the defect:

- both More menus relied on native `<details>` elements whose open state was implicitly driven by the active route, so route transitions did not consistently close the menu after selection;
- the mobile More sheet was rendered inside the fixed mobile navigation container, which also used `overflow: hidden`, making the opened sheet effectively clipped behind the shell treatment.

## Changes made

- replaced both More menus with explicit local React state so the trigger exposes reliable expanded and collapsed state;
- added shared close behaviour for route changes, Escape, outside click or tap, and focus moving away from the menu;
- closed the menu immediately before navigating from any More item, including keyboard activation;
- moved the mobile More sheet outside the clipped navigation surface so it can layer above the shell and remain touchable;
- added a restrained mobile scrim and preserved the Ocean Luxe deep-ocean and glass styling for the sheet surface;
- added behavioural tests covering menu opening, close-on-select, Escape, outside click, route-change close behaviour and mobile menu reachability.

## Validation performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Results:

- typecheck passed
- tests passed: 24 files, 163 tests
- production build passed

Responsive browser smoke was run against the local preview build at `http://127.0.0.1:4173/complete-cruising/`.

## Manual responsive smoke results

Widths checked:

```text
390 px
430 px
768 px
1024 px
1440 px
```

Routes checked:

```text
/#/
/#/today
/#/itinerary
/#/ports
/#/ship
/#/weather-review
```

Observed at every checked width:

- More opened visibly in the active navigation mode;
- More items remained reachable and navigated correctly;
- selecting `Weather Review` from More closed the menu immediately;
- reopening and closing the menu again worked without leaving the shell stuck behind an overlay;
- `Today` remained reachable afterwards from the same navigation surface;
- no document-level horizontal overflow was detected.

Mode split:

- 390 px, 430 px and 768 px used the mobile bottom navigation and More sheet;
- 1024 px and 1440 px used the desktop top navigation and dropdown menu.

## Known limitations

- the manual smoke focused on the primary More flow and route recovery, while the finer keyboard interactions remain primarily protected by automated tests;
- the production build still emits the existing Vite large-chunk warning, but the build succeeds and this corrective tranche does not change chunking behaviour;
- `git` was not available in the current PowerShell environment, so a live `git status` result could not be recorded from this session.

## Suggested commit message

```text
Repair More navigation menu behaviour
```
