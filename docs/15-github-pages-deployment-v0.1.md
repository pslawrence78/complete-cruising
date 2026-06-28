# Tranche 15: GitHub Pages Deployment v0.1

Date: 28 June 2026.

## Scope

This tranche prepares Complete Cruising for deployment to GitHub Pages at:

```text
https://pslawrence78.github.io/complete-cruising/
```

The app remains a static, local-first PWA. No backend, authentication, analytics, live APIs, cloud sync or third-party runtime integrations were added.

## Deployment Configuration

The Vite base path remains explicitly configured as:

```text
/complete-cruising/
```

This path is used by the production build for generated CSS and JavaScript assets. The HTML document links the manifest and icons through Vite's `%BASE_URL%` substitution so they resolve beneath `/complete-cruising/`.

Routing remains hash-based. Deep links such as these are static-host safe because GitHub Pages only serves `/complete-cruising/` and the route state lives after the hash:

```text
/complete-cruising/#/itinerary
/complete-cruising/#/today
/complete-cruising/#/ship
/complete-cruising/#/ports
/complete-cruising/#/import-export
```

No GitHub Pages 404 fallback is required for the current routing model.

## Workflow

The deployment workflow lives at:

```text
.github/workflows/deploy.yml
```

It runs on pushes to `main` and by manual dispatch. The workflow:

- checks out the repository;
- sets up Node using the lockfile under `app/`;
- configures GitHub Pages;
- runs `npm ci`, `npm run typecheck`, `npm run test` and `npm run build` from `app/`;
- uploads `app/dist` as the Pages artefact;
- deploys through the GitHub Pages Actions flow.

The repository Pages source should be set to **GitHub Actions** in the GitHub repository settings.

## PWA Publication Checks

The production build publishes:

- `index.html`;
- generated CSS and JavaScript under `assets/`;
- `manifest.webmanifest`;
- `sw.js`;
- `offline.html`;
- `icons/complete-cruising-icon.svg`;
- `icons/complete-cruising-maskable.svg`.

The manifest `start_url` and `scope` are `/complete-cruising/`. The service worker registers from `${import.meta.env.BASE_URL}sw.js` with the same base-path scope, and caches only same-origin static app-shell assets. It does not cache live API responses because none are in scope.

## Local Validation

From `app/`:

```text
npm run typecheck
npm run test
npm run build
npm run preview -- --host 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/complete-cruising/
```

Check the dashboard, navigation, hash routes, manifest link and offline readiness strip.

## Known Limitations

- GitHub repository settings still need Pages source set to GitHub Actions.
- The deployment has not been run against the live GitHub Pages environment in this tranche.
- Service-worker activation can vary in local preview and browser automation environments; final confirmation should happen against the deployed HTTPS Pages URL.
- Custom domain work for `lawnetcloud.uk` is deliberately deferred.
- Ocean Luxe SVG icons remain placeholders until final platform artwork is produced.

## Suggested Commit Message

```text
Configure GitHub Pages deployment for Complete Cruising
```
