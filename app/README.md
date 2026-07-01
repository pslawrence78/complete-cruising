# Complete Cruising App

This `app/` folder now contains the fresh-base Sun Princess 2026 cruise-stable application shell.

## Commands

```text
npm install
npm run typecheck
npm run test
npm run build
```

## Notes

- Production branch for deployment is `fresh-base/sun-princess-2026`.
- GitHub Pages base path remains `/complete-cruising/`.
- Routing is hash-based for static-host safety.
- Active routes are `/#/`, `/#/today`, `/#/itinerary`, `/#/ports`, `/#/ship`, `/#/plans`, `/#/memories` and `/#/about`.
- `/#/guide-loader` is no longer a live route and should fall back to the dashboard.
- Core cruise content is static and bundled from `src/data/sunPrincess2026.ts`.
- Public production assets now live under `public/` and are specific to the fresh base.
- The previous failed runtime source has been archived under `../legacy/`.
