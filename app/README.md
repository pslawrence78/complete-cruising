# Complete Cruising app

This directory contains the tested Vite, React and TypeScript application scaffold and the Tranche 2 Ocean Luxe shell.

## Commands

Run these commands from `app/`:

```text
npm install
npm run dev
npm run typecheck
npm run build
npm run test
```

## Current scope

The application renders a responsive Ocean Luxe shell with shared design tokens, glass and paper surfaces, route-ready navigation placeholders, status chips and confidence chips. Its content remains deliberately lightweight: no production feature screens, local database, import/export flow or PWA support are included.

## GitHub Pages base path

Vite is configured with the documented project path `/complete-cruising/`. This makes generated asset URLs suitable for a future project-site deployment on GitHub Pages. The path may need revisiting if the app moves to a custom domain or a differently named repository. Routing and the deployment workflow remain intentionally deferred to later tranches.
