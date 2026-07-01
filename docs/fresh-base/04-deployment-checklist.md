# Fresh Base Deployment Checklist

This checklist is for the fresh cruise-stable base on branch `fresh-base/sun-princess-2026`.

## Before build

- Confirm the active app is the fresh base under `app/src`.
- Confirm the failed runtime remains archived under `legacy/` and is not being restored into the live app path.
- Confirm the production public assets come from `app/public/`, not from `legacy/failed-v1-public/`.
- Confirm Vite base-path configuration remains `/complete-cruising/`.
- Confirm hash routing remains the active navigation strategy.

## Active route contract

The deployed fresh base supports only these routes:

- `/#/`
- `/#/today`
- `/#/itinerary`
- `/#/ports`
- `/#/ship`
- `/#/plans`
- `/#/memories`
- `/#/about`

Expected fallback:

- `/#/guide-loader` falls back to the dashboard because that route has been intentionally removed from the fresh base.

## Build validation

Run from `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Confirm the production build:

- completes without TypeScript or Vitest failures;
- emits a static `dist/` output suitable for GitHub Pages;
- includes the fresh manifest and icon files;
- does not reintroduce removed routes in active app metadata or navigation.

## Manual smoke test

Preview and verify:

- `/#/`
- `/#/today`
- `/#/itinerary`
- `/#/ports`
- `/#/ship`
- `/#/plans`
- `/#/memories`
- `/#/about`

Recommended widths:

- `390`
- `430`
- `768`
- `1024`
- `1440`

Check for:

- correct page heading on each route;
- no horizontal overflow;
- stable navigation between active routes;
- title, manifest, icon and Apple touch metadata matching the fresh base;
- no visible trace of Guide Loader, Backstage, weather review or enrichment workflows.

## Release reminder

- GitHub Pages deployment should come from `fresh-base/sun-princess-2026`.
- If an old deployed page still appears after a successful build and push, verify the published Pages source and then force a fresh deployment from the current branch rather than restoring the archived runtime.
