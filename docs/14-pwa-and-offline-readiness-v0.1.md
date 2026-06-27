# Tranche 14: PWA and Offline Readiness v0.1

Date: 27 June 2026.

## Scope

This tranche makes Complete Cruising installable and offline-capable at app-shell level while preserving the local-first, static GitHub Pages architecture.

Implemented:

- web app manifest with Ocean Luxe theme and background colours;
- SVG app icon placeholders for standard and maskable purposes;
- production service-worker registration from the React entry point;
- static app-shell caching for the Vite-built `index.html`, discovered script and style assets, manifest, icons and offline fallback;
- navigation fallback to the cached app shell after first successful service-worker installation;
- compact shell-level offline readiness status showing connection state, offline shell state and last local sailing update.

## Architecture Notes

The service worker is deliberately conservative. It caches same-origin static shell assets and does not add live API calls, remote data fetching, authentication, sync or external services.

Core sailing, itinerary, guidebook and experience data remains in the existing Dexie/IndexedDB local repositories. The new readiness indicator reads local sailing audit metadata without changing trusted, confirmed or reviewable records.

The app continues to use the documented `/complete-cruising/` base path and hash routing for static hosting compatibility.

## Validation Notes

- `npm run typecheck`
- `npm run build`
- `npm run test`

Additional automated coverage checks that the manifest is install-oriented, the GitHub Pages base path is represented, the service worker includes app-shell fallback logic, and the shell displays offline readiness plus last local update metadata.

## Known Limitations

- Icons are Ocean Luxe SVG placeholders, not final platform-specific PNG artwork.
- The service worker is registered only in production builds, so local Vite development avoids stale worker behaviour.
- A page may need one successful online production visit for the app shell and built assets to be cached.
- Offline behaviour is app-shell level; future weather refreshes and any later live integrations will need their own timestamped caching and expiry rules.
- No GitHub Pages deployment workflow is included in this tranche; that remains Tranche 15.

## Suggested Commit Message

```text
Add PWA manifest and offline app shell
```
