# Tranche 19: MVP Cruise Usability and Visual Polish v0.1

Date: 28 June 2026.

## Objective

This tranche improves the visible MVP cruise companion experience for the real Sun Princess 2026 sailing without changing schemas, import architecture, backend scope or protected-data behaviour.

The focus is practical polish: Dashboard, Today, Itinerary, Ports, Ship and More/Manage should feel more like a premium Ocean Luxe cruise guidebook and less like an administration surface.

## Files changed

- `app/src/data/sampleDashboardData.ts`
- `app/src/data/sampleTodayData.ts`
- `app/src/data/viewModelMappers.ts`
- `app/src/features/dashboard/DashboardPage.tsx`
- `app/src/features/dashboard/components/SailingHero.tsx`
- `app/src/features/today/TodayPage.tsx`
- `app/src/features/today/TodayPage.css`
- `app/src/features/today/components/TodayAshorePanel.tsx`
- `app/src/features/today/components/TodayPlanSummary.tsx`
- `app/src/features/today/components/WeatherTile.tsx`
- `app/src/features/itinerary/components/ItineraryDayCard.tsx`
- `app/src/features/ports/PortGuidePage.tsx`
- `app/src/features/data-management/DataManagementPage.tsx`
- `app/src/components/states/LocalDataState.tsx`
- `app/src/routes/routeConfig.ts`
- `app/src/tests/App.test.tsx`
- `README.md`
- `app/README.md`
- `docs/README.md`
- `docs/build-plan/tranche-plan-v0.1.md`

## User-facing changes

- Dashboard now presents the active sailing as the real local voyage, with departure and return labels, a live countdown, warmer voyage copy, guidebook readiness and calm operational caveats.
- Today now has a pre-cruise mode before 15 August 2026. It explains that the cruise day companion is preparing, highlights pending terminal, timing, weather and shore-plan areas, and points the user towards Itinerary.
- Itinerary cards use clearer cruise labels: Embarkation, Port call, At sea and Disembarkation. Pending port times are labelled as needing review.
- Ports copy now frames missing enrichment as guide pending, with generic guidebook highlight language rather than Naples-specific or raw record language.
- Ship guide copy presents the page as a local handbook and treats partial content as a useful reviewed/pending state.
- More/Manage labels now push backstage tooling behind Sailing Setup, Guidebook Tools, Import / Export and Data Safety.
- Shared empty states now use calm guidebook language.

## Visual comparison notes

Compared with the standalone HTML prototype and Ocean Luxe brief, this tranche improves:

- cinematic sailing hero specificity by removing prototype-placeholder wording from Dashboard;
- route and voyage language through clearer embarkation, port-call, sea-day and review labels;
- Today operational hierarchy by adding a purposeful pre-cruise state instead of a blank or misleading day state;
- guidebook tone in Ports and Ship by replacing raw enrichment wording with curated pending/partial states;
- confidence-chip usefulness by preserving review, refresh and confidence metadata while softening surrounding copy;
- backstage admin hierarchy by moving destructive/local-storage language further away from the primary cruise journey.

The React MVP still uses CSS-generated motifs rather than real imagery, matching the current local-first static scope.

## Validation performed

From `app/`:

```text
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

All three commands completed successfully. The production build emitted Vite's existing large chunk advisory for the generated JavaScript bundle; no build failure occurred.

A contained local production preview smoke pass checked:

```text
/#/
/#/today
/#/itinerary
/#/ports
/#/ship
/#/more
/#/data-management
```

at 390px, 430px, 768px, 1024px and 1440px. The app rendered expected page headings and no document-level horizontal overflow was detected. The automated clipping scan flagged only intentionally oversized decorative SVG motifs and scrollable route/timeline tracks. `/#/more` resolves to Dashboard because More is a navigation menu rather than a route; `/#/data-management` was checked as the backstage management route.

`git status` could not be run because `git` was not available in the PowerShell environment.

## Known limitations

- No live weather, Princess Cruises integration, OpenAI API, backend, Supabase, authentication or cloud sync was added.
- Operational times, terminal arrangements, all-aboard times, tendering, port changes, weather and shore plans remain pending until checked against current Princess and travel material.
- The app still has no automated visual regression reference.
- Guidebook richness depends on future reviewed enrichment imports; this tranche improves presentation, not data completeness.
- More remains a navigation menu, not a standalone route.

## Suggested commit message

```text
Polish MVP cruise usability and Ocean Luxe experience
```

## Recommended next tranche

Tranche 20: Content Accuracy Review and Offline Guidebook QA v0.1
