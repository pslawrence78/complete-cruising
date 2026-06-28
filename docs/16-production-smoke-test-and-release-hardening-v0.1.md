# Tranche 16: Production Smoke Test and Release Hardening v0.1

Date: 28 June 2026.

## Purpose

This tranche verifies the existing Complete Cruising production build and GitHub Pages readiness without adding product capability. The focus is release confidence for the local-first, static Vite React TypeScript PWA under the documented GitHub Pages path:

```text
/complete-cruising/
```

The deployed output remains:

```text
app/dist
```

No screens, live APIs, authentication, backend services, cloud sync, Supabase integration or new cruise content were added.

## Release Hardening Change

The service worker now deduplicates its pre-cache URL list before calling `cache.addAll()`. This prevents duplicate manifest/icon references from causing service-worker installation failure in production preview while keeping the cache conservative and static-only.

The static shell cache version was bumped to:

```text
complete-cruising-shell-v2-static
```

## Commands Run

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

`npm run ...` through PowerShell was blocked by the local execution policy for `npm.ps1`, so `npm.cmd` was used for validation. The underlying package scripts were unchanged.

## GitHub Pages Workflow Summary

The workflow at `.github/workflows/deploy.yml` was reviewed. It:

- runs on pushes to `main` and manual dispatch;
- grants `contents: read`, `pages: write` and `id-token: write`;
- checks out the repository;
- sets up Node with `app/package-lock.json` as the npm cache dependency path;
- configures GitHub Pages;
- runs `npm ci`, `npm run typecheck`, `npm run test` and `npm run build` from `app/`;
- uploads `app/dist`;
- deploys through the GitHub Pages Actions deployment flow.

No secrets, API keys, backend services or live integrations are required.

## Production Smoke Checklist

- Production build completed successfully.
- `app/dist` contains `index.html`, generated CSS and JavaScript, `manifest.webmanifest`, `sw.js`, `offline.html` and both icon SVGs.
- Built HTML references CSS, JavaScript, manifest and icons beneath `/complete-cruising/`.
- Production preview responded at `http://127.0.0.1:4173/complete-cruising/`.
- Browser smoke checks confirmed the core hash routes rendered without blank pages:
  - `#/dashboard`
  - `#/itinerary`
  - `#/today`
  - `#/ship`
  - `#/ports`
  - `#/plans`
  - `#/family`
  - `#/memories`
  - `#/import-export`
- Captured browser logs showed no errors or warnings during the route smoke pass.

## Manifest Checks

The production HTML references:

```text
/complete-cruising/manifest.webmanifest
```

The manifest remains appropriate for path deployment:

- `name`: `Complete Cruising`
- `short_name`: `Complete Cruising`
- `start_url`: `/complete-cruising/`
- `scope`: `/complete-cruising/`
- `display`: `standalone`
- `theme_color`: `#082b43`
- `background_color`: `#03111d`
- icons are relative to the manifest and available under `/complete-cruising/icons/`

The manifest does not use a root `/` scope.

## Service Worker and Offline Checks

The production preview confirmed:

- `sw.js` is reachable under `/complete-cruising/sw.js`;
- service-worker registration scope is `http://127.0.0.1:4173/complete-cruising/`;
- active script URL is `http://127.0.0.1:4173/complete-cruising/sw.js`;
- `complete-cruising-shell-v2-static` caches the app shell, built CSS, built JavaScript, manifest, offline fallback and icon SVGs;
- offline emulation after first online load kept `#/today` presentable, with the Today headings still rendered and `navigator.onLine` reporting `false`;
- the worker caches same-origin static shell assets only and does not cache live API responses.

The offline fallback document is present at:

```text
/complete-cruising/offline.html
```

## PWA Installability Basics

The basic installability foundation was checked:

- manifest is valid JSON and path-scoped;
- service worker exists and activates in production preview;
- GitHub Pages provides the required HTTPS environment for deployment;
- app name and theme colour are present;
- icon files are reachable.

Ocean Luxe SVG icons remain placeholder assets, as previously documented.

## Responsive Visual Sanity Checks

Production preview was checked at:

```text
390px
430px
768px
1024px
1440px
```

Dashboard, Today and Import / Export remained rendered and scannable. No document-level horizontal overflow was detected. Observed offscreen elements were limited to intentional decorative or scrollable treatments, including route motifs, the dashboard route ribbon and mobile navigation scroll items.

The Ocean Luxe presentation remains intact; no redesign was performed.

## Known Limitations

- Live GitHub Pages deployment was not reachable from this local environment, so final deployed checks should still be repeated at `https://pslawrence78.github.io/complete-cruising/` after the next Pages run.
- `git` is not available on this machine's PATH, so `git status` could not be run locally.
- PowerShell blocked `npm.ps1`; validation used `npm.cmd` instead.
- Vite still reports a non-blocking warning that the single JavaScript chunk is slightly larger than 500 kB after minification.
- Browser install prompts were not manually accepted; installability was checked through manifest, service-worker, HTTPS deployment assumption and asset availability.
- Icons remain established SVG placeholders rather than final platform PNG artwork.

## Release Readiness Judgement

Complete Cruising is release-hardened for the current GitHub Pages static PWA target. The production build, path-scoped assets, hash routing, manifest, service-worker scope and offline app-shell behaviour were verified locally against the production preview.

## Manual Checks Recommended After Deploy

- Open `https://pslawrence78.github.io/complete-cruising/`.
- Refresh each core hash route under `/complete-cruising/`.
- Confirm the manifest and icon requests return HTTP 200 in browser dev tools.
- Confirm the service worker is active with `/complete-cruising/` scope.
- Use browser dev tools offline mode after first load and reopen `#/today`.
- Check the browser installability panel for any platform-specific icon warnings.
- Perform one visual pass on a real phone and a desktop browser.

## Validation Notes

- Typecheck passed.
- Tests passed: 8 files, 57 tests.
- Production build passed.
- Production preview passed at the configured base path.
- Service-worker duplicate pre-cache failure was fixed and verified.

## Suggested Commit Message

```text
Harden Complete Cruising production release
```

## Recommended Next Tranche

Tranche 17: Post-Release Visual QA and Content Accuracy Review
