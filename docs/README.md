# Complete Cruising project knowledge index

This is the entry point for project knowledge in the Complete Cruising repository. It inventories the current project files, explains which document to consult for each kind of decision, and records gaps between the documented target and the repository as it exists.

Last inventoried: 19 June 2026.

## Repository at a glance

Complete Cruising is a documentation-first project for a premium, local-first Lawrence Family Series PWA. The intended experience is a rich cruise guidebook and companion, not a plain administration or CRUD interface.

The repository currently contains project governance, seven v0.1 foundation documents, the standalone Ocean Luxe HTML prototype, the initial delivery tracker, illustrative sample records, reserved enrichment workspaces and the tested Tranche 1 application scaffold. The scaffold deliberately contains no production feature screens, database, PWA support or deployment workflow.

```text
complete-cruising/
|-- .git/                             Git repository metadata; not project knowledge
|-- .gitattributes                    Text-file normalisation configuration
|-- .gitignore                        Future app and local-tool exclusions
|-- AGENTS.md                         Mandatory project-working instructions
|-- README.md                         Contributor-facing project introduction
|-- app/
|   |-- README.md                     Scaffold usage and base-path note
|   |-- index.html                    Vite HTML entry point
|   |-- package.json                  App scripts and dependencies
|   |-- package-lock.json             Reproducible npm dependency lock
|   |-- vite.config.ts                Vite and GitHub Pages base-path config
|   |-- vitest.config.ts              Component-test configuration
|   |-- tsconfig.json                 TypeScript project references
|   |-- tsconfig.app.json             Browser-source TypeScript config
|   |-- tsconfig.node.json            Tooling TypeScript config
|   `-- src/
|       |-- App.tsx                   Minimal scaffold component
|       |-- main.tsx                  React entry point
|       |-- vite-env.d.ts             Vite client types
|       |-- data/sampleData.ts        Static Tranche 1 placeholder
|       |-- routes/routeConfig.ts     Typed placeholder route config
|       |-- styles/base.css           Minimal non-production base styles
|       |-- tests/App.test.tsx        Scaffold render test
|       `-- tests/setup.ts            Testing Library matchers
|-- docs/
|   |-- README.md                     This living inventory and knowledge index
|   |-- 01-product-specification-v0.1.md
|   |-- 02-enrichment-framework-v0.1.md
|   |-- 03-data-model-v0.1.md
|   |-- 04-visual-experience-brief-v0.1.md
|   |-- 05-html-prototype-specification-v0.1.md
|   |-- 06-technical-architecture-v0.1.md
|   |-- 07-build-plan-v0.1.md
|   |-- build-plan/
|   |   `-- tranche-plan-v0.1.md
|   `-- decisions/
|       `-- 0001-project-start.md
|-- enrichment/
|   |-- imports/README.md
|   |-- prompts/README.md
|   `-- reviewed/README.md
|-- prototypes/
|   `-- v0.1/
|       `-- complete-cruising-prototype-v0.1.html
`-- samples/
    |-- ports/naples.sample.json
    |-- sailings/sun-princess-mediterranean-2026.sample.json
    `-- ships/sun-princess.sample.json
```

## Project file inventory

| Path | Classification | Purpose and authority |
| --- | --- | --- |
| [../AGENTS.md](../AGENTS.md) | Governance | Mandatory working rules: preserve Ocean Luxe, use British English, avoid unapproved external APIs, work in small tranches, protect record separation and trust metadata, and report validation, limitations and a suggested commit message. |
| [../README.md](../README.md) | Project introduction | Concise contributor entry point covering status, repository structure, current artefacts, development approach, sample-data safety and the next tranche. |
| [../.gitattributes](../.gitattributes) | Repository configuration | Enables automatic text detection and LF normalisation. |
| [../.gitignore](../.gitignore) | Repository configuration | Excludes dependency folders, build output, local environment files, editor settings, logs and coverage output without hiding project artefacts. |
| [README.md](README.md) | Project knowledge | Living repository inventory, knowledge router, current-state summary and gap register. |
| [01-product-specification-v0.1.md](01-product-specification-v0.1.md) | Product foundation | Defines the vision, audience, journeys, scope, information architecture, product-level data concepts, enrichment philosophy, visual ambition and success criteria. |
| [02-enrichment-framework-v0.1.md](02-enrichment-framework-v0.1.md) | Trust and content foundation | Defines targeted enrichment packs, source hierarchy, confidence, review and refresh metadata, review workflow, family lenses, import standards and anti-patterns. |
| [03-data-model-v0.1.md](03-data-model-v0.1.md) | Data foundation | Defines conceptual entities, relationships, enumerations, protected-field conflict rules, quality rules and the boundary between reusable guidebook data and sailing-specific records. |
| [04-visual-experience-brief-v0.1.md](04-visual-experience-brief-v0.1.md) | Experience foundation | Defines Ocean Luxe visual direction, layout and card systems, core screens, interaction, responsiveness, accessibility, imagery and the visual acceptance bar. |
| [05-html-prototype-specification-v0.1.md](05-html-prototype-specification-v0.1.md) | Prototype specification | Defines the expected standalone prototype, sample sailing content, page sections, interactions, responsive behaviour, CSS approach and prototype acceptance criteria. It is a specification, not the prototype itself. |
| [06-technical-architecture-v0.1.md](06-technical-architecture-v0.1.md) | Technical foundation | Defines the target PWA architecture, stack, source structure, local data, imports and exports, offline behaviour, security, testing, deployment and architectural decisions. |
| [07-build-plan-v0.1.md](07-build-plan-v0.1.md) | Delivery foundation | Converts the foundations into ordered implementation tranches with deliverables, acceptance criteria, validation expectations and suggested commit messages. |
| [build-plan/tranche-plan-v0.1.md](build-plan/tranche-plan-v0.1.md) | Delivery tracker | Concise 16-tranche sequence for implementation; subordinate to the detailed Build Plan v0.1 and intended to evolve transparently. |
| [decisions/0001-project-start.md](decisions/0001-project-start.md) | Decision record | Records the accepted local-first static PWA, prototype-reference, tranche-delivery, no-live-API MVP and sample-data privacy decisions. |
| [../prototypes/v0.1/complete-cruising-prototype-v0.1.html](../prototypes/v0.1/complete-cruising-prototype-v0.1.html) | Authoritative visual reference | Standalone Ocean Luxe concept prototype. Use it to preserve the proven visual direction during production implementation; it is reference material, not production code. |
| [../samples/sailings/sun-princess-mediterranean-2026.sample.json](../samples/sailings/sun-princess-mediterranean-2026.sample.json) | Illustrative sample data | Non-sensitive sailing shell for Rome to Barcelona; it is not a confirmed itinerary or booking record. |
| [../samples/ships/sun-princess.sample.json](../samples/ships/sun-princess.sample.json) | Illustrative sample data | Lightweight reusable Sun Princess guidebook record, explicitly marked partial and illustrative. |
| [../samples/ports/naples.sample.json](../samples/ports/naples.sample.json) | Illustrative sample data | Lightweight reusable Naples guidebook record, explicitly marked partial and illustrative. |
| [../enrichment/prompts/README.md](../enrichment/prompts/README.md) | Enrichment workspace guidance | Reserves the prompt area for small, structured packs while preserving trust metadata and record boundaries. |
| [../enrichment/imports/README.md](../enrichment/imports/README.md) | Enrichment workspace guidance | Reserves the import staging area and states that staged files are neither trusted nor committed data. |
| [../enrichment/reviewed/README.md](../enrichment/reviewed/README.md) | Enrichment workspace guidance | Reserves the reviewed-output area without allowing reviewed content to overwrite trusted data silently. |
| [../app/README.md](../app/README.md) | App guidance | Records scaffold commands, current scope and the `/complete-cruising/` GitHub Pages base-path decision. |
| [../app/package.json](../app/package.json) and [package-lock.json](../app/package-lock.json) | App configuration | Define the Tranche 1 scripts and locked React, TypeScript, Vite, Vitest and Testing Library dependencies. |
| [../app/index.html](../app/index.html) | App entry point | Provides the static Vite document shell using British English document metadata. |
| [../app/vite.config.ts](../app/vite.config.ts) and [vitest.config.ts](../app/vitest.config.ts) | Tooling configuration | Configure React builds, the documented GitHub Pages base path and jsdom component tests. |
| [../app/tsconfig.json](../app/tsconfig.json), [tsconfig.app.json](../app/tsconfig.app.json) and [tsconfig.node.json](../app/tsconfig.node.json) | TypeScript configuration | Separate browser-source and tooling checks through TypeScript project references. |
| [../app/src/App.tsx](../app/src/App.tsx), [main.tsx](../app/src/main.tsx) and [vite-env.d.ts](../app/src/vite-env.d.ts) | App source | Render the minimal Complete Cruising scaffold without introducing production feature screens. |
| [../app/src/routes/routeConfig.ts](../app/src/routes/routeConfig.ts) and [data/sampleData.ts](../app/src/data/sampleData.ts) | App placeholders | Provide a typed root-route skeleton and non-sensitive static Tranche 1 sample data. |
| [../app/src/styles/base.css](../app/src/styles/base.css) | App styles | Supplies only minimal scaffold styling; Ocean Luxe remains reserved for Tranche 2. |
| [../app/src/tests/App.test.tsx](../app/src/tests/App.test.tsx) and [setup.ts](../app/src/tests/setup.ts) | App tests | Configure Testing Library matchers and verify that the scaffold renders. |

## Knowledge routing

Use this table to find the narrowest authoritative source before making a change.

| Question or task | Read first | Then cross-check |
| --- | --- | --- |
| What is the product and what belongs in scope? | Product Specification | Build Plan |
| How should information be researched, trusted or refreshed? | Enrichment Framework | Data Model |
| Where should a field live, and can it be overwritten? | Data Model | Enrichment Framework |
| How should the app look and feel? | Visual Experience Brief | HTML Prototype Specification |
| What should a specific prototype screen contain? | HTML Prototype Specification | Visual Experience Brief |
| How should documented visual intent appear in practice? | Standalone HTML prototype | Visual Experience Brief and HTML Prototype Specification |
| Which technologies and repository structure should be used? | Technical Architecture | Build Plan |
| What should be built next and how is it accepted? | Build Plan | Relevant specialist foundation document |
| What rules apply to all work in the repository? | `AGENTS.md` | This index |

## Canonical project decisions

These decisions recur across the current foundation set and should be treated as established unless the project owner explicitly changes them:

- The product is a visually rich, personalised cruise companion for the Lawrence family.
- Ocean Luxe is the visual direction; premium guidebook presentation must survive implementation.
- The target is a static, local-first PWA suitable for GitHub Pages.
- The recommended application stack is React, TypeScript and Vite, with Dexie for IndexedDB and Zod for validation.
- Initial navigation should use hash routing for static-host compatibility.
- MVP enrichment enters through structured, reviewable imports rather than live external APIs.
- Reusable guidebook records, including ships and ports, remain separate from sailing-specific itinerary records.
- Confidence, source, review and refresh metadata remain attached to enriched or time-sensitive information.
- Manual, booking-derived, trusted or confirmed data must not be silently replaced by generic enrichment.
- Work proceeds in small, independently reviewable tranches.
- Product copy and project documentation use British English.

## Document relationships

The documents form a deliberate progression:

1. The Product Specification establishes the product promise and boundaries.
2. The Enrichment Framework defines how knowledge earns trust.
3. The Data Model gives that knowledge a durable structure.
4. The Visual Experience Brief translates the product into an experience language.
5. The HTML Prototype Specification turns that language into a concrete visual proof brief.
6. The standalone HTML prototype provides the authoritative visual proof and implementation reference.
7. The Technical Architecture defines how to implement the proven direction.
8. The Build Plan sequences implementation into controlled tranches.

Specialist documents take precedence for decisions in their own domain. Product intent should still be checked against the Product Specification, and all implementation remains subject to `AGENTS.md`.

## Current repository gaps

The following are described by the foundation documents but are not present in the repository at the date of this inventory:

- design tokens, reusable components and screen implementations;
- production routing beyond the typed Tranche 1 placeholder;
- detailed sample itinerary and family data beyond the lightweight Tranche 0 sailing, ship and port records;
- runtime schemas, local database code and import/export logic;
- broader automated test coverage and visual regression references beyond the scaffold render check;
- PWA manifest, service worker and GitHub Pages workflow;

## Maintenance rules

Update this index whenever a tranche adds, removes, renames or supersedes a project file.

- Add new knowledge-bearing files to both the tree and inventory table.
- Mark superseded documents clearly; do not silently replace or delete trusted project knowledge.
- Keep generated files, dependency folders and build output out of the knowledge inventory unless they are deliberate reference artefacts.
- Record absent-but-expected artefacts under current repository gaps.
- When a gap is filled, remove it from the gap register and add the new file to the inventory.
- Preserve version labels on fixed foundation artefacts. Keep this `README.md` unversioned because it is a living index.

## Inventory validation

This inventory was created from a recursive repository file listing with Git metadata, dependency folders, build output and coverage output excluded from the knowledge set. Every non-Git file present on 19 June 2026 is represented above.
