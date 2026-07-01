# Complete Cruising

Complete Cruising is a Lawrence Family Series PWA for the Lawrence family's real **Sun Princess Mediterranean 2026** sailing.

The active branch direction is now a **fresh-base rescue**: a premium, static, cruise-stable guidebook rather than a reusable local-database platform.

## Project status

**Fresh base active on `fresh-base/sun-princess-2026`.**

The live app path has been reset to a new static React shell under `app/src`, while the previous failed implementation has been archived under `legacy/` for reference only.

## Start here

- Read the [project knowledge index](docs/README.md).
- Review the [fresh-base product brief](docs/fresh-base/00-fresh-base-product-brief.md).
- Review the [fresh-base architecture](docs/fresh-base/01-fresh-base-architecture.md).
- Use the [standalone Ocean Luxe prototype](prototypes/v0.1/complete-cruising-prototype-v0.1.html) as the visual reference.
- Follow [AGENTS.md](AGENTS.md) for working rules.

## Repository structure

```text
complete-cruising/
|-- app/               Active fresh-base cruise companion
|-- docs/              Foundations, rescue notes, decisions and fresh-base scope
|-- content-source/    Source corpus and verification notes
|-- legacy/            Archived failed v1 runtime reference
|-- enrichment/        Preserved enrichment artefacts
|-- prototypes/        Preserved Ocean Luxe reference artefacts
`-- samples/           Preserved illustrative JSON reference files
```

## Development approach

This branch exists to stay deployable until after the real cruise. Work should favour static content, British English, Ocean Luxe presentation, mobile usefulness and calm confidence cues.

The app can be validated from `app/`; see [app/README.md](app/README.md) for commands.
