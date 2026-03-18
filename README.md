# Neuroplast

An npm-delivered workflow bootstrap for AI-assisted product planning, architecture design, execution, changelog tracking, and continuous learning notes.

The workflow is file-system-first and now ships with a machine-readable manifest plus lightweight instruction frontmatter.

It also ships with an advisory `capabilities.yaml` profile so execution can degrade gracefully in constrained environments without changing the core file contract.

It can also ship optional workflow extensions so bundled or repo-local augmentations can add custom guidance without modifying the canonical instruction set.

## Quick Start

Initialize Neuroplast in any project directory:

```bash
npx neuroplast init
```

Include shared Obsidian config files:

```bash
npx neuroplast init --with-obsidian
```

Apply one-time versioned updates to managed files:

```bash
npx neuroplast sync
```

Preview sync changes without writing files:

```bash
npx neuroplast sync --dry-run
```

Validate the workflow contract and metadata:

```bash
npx neuroplast validate
```

The initializer is non-destructive: existing files are skipped and never overwritten.

By default, instruction files are written under `/neuroplast/` in your target project.

`init` also runs `sync` after file bootstrap so new package migrations are applied once per version.

## Managed File Updates (Versioned Migrations)

Neuroplast now supports one-time versioned migrations for library-managed files under `/neuroplast/`.

- Sync state is persisted in `neuroplast/.neuroplast-state.json`.
- Each migration has an ID and target version.
- Applied migrations are recorded so they only run once.
- Sync evaluation runs on all package version updates, including patch releases.
- Downgrade detection skips automatic sync; use `--force` to override.
- Use `--backup` with `sync` to keep pre-update file copies under `neuroplast/.backups/`.

### Sync behavior by version

- Same version: sync is skipped.
- Higher version (major/minor/patch): sync runs once and records new sync version.
- Lower version (downgrade): sync is skipped by default.

### Current migration behavior

- Tag backfill migration enforces required Obsidian tags across managed markdown folders under `/neuroplast/`.
- Governed sync scope excludes `/neuroplast/.obsidian/` and `/neuroplast/.backups/`.

## Optional Workflow Extensions

- Bundled reusable extension scaffolding is installed under `neuroplast/extensions/`.
- Repo-local custom extensions may be created under `neuroplast/local-extensions/`.
- Activate extensions in `neuroplast/manifest.yaml` under `extensions.active_bundled` and `extensions.active_local`.
- Active extensions are additive guidance only and must not override the core workflow contract.
- Read active extensions after the core contract/manifest/capabilities documents and before executing the matching canonical instruction file.
- Use the seamless step-loading convention: for each active extension, load the matching file for the current phase when it exists.
- The `package-maintainer` extension in this repository is repo-local only and is not shipped as part of the published package.

## What This Repository Is

This repository contains instruction files that guide an AI agent through a repeatable process:

1. Conceptualize a project
2. Produce architecture/planning artifacts
3. Execute implementation steps
4. Record changelog updates
5. Capture reusable lessons learned

It is set up as a workflow package template rather than a traditional code application.

## Current Repository Contents

Source-of-truth package files in this repository:

- `src/instructions/` — canonical instruction templates copied by `neuroplast init`
  - `manifest.yaml`
  - `capabilities.yaml`
  - `WORKFLOW_CONTRACT.md`
  - `conceptualize.md`
  - `PLANNING_INSTRUCTIONS.md`
  - `act.md`
  - `CONCEPT_INSTRUCTIONS.md`
  - `CHANGELOG_INSTRUCTIONS.md`
  - `think.md`
- `src/obsidian/.obsidian/` — optional shared Obsidian config templates
- `src/extensions/` — optional bundled workflow extension scaffolding
- `src/adapters/` — optional environment guidance documents
- `bin/neuroplast.js` — CLI initializer that creates folders and copies templates
- `.gitignore` — currently ignores `.obsidian/workspace.json`

Installed output in target projects (created by `npx neuroplast init`):

- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/conceptualize.md`
- `neuroplast/PLANNING_INSTRUCTIONS.md`
- `neuroplast/act.md`
- `neuroplast/CONCEPT_INSTRUCTIONS.md`
- `neuroplast/CHANGELOG_INSTRUCTIONS.md`
- `neuroplast/think.md`
- `neuroplast/extensions/` — optional bundled workflow extension scaffolding
- `neuroplast/local-extensions/` — optional repo-local custom workflow extensions
- `neuroplast/adapters/` — documentation-only environment guides
- `neuroplast/.obsidian/` (optional via `--with-obsidian`)

## Intended Folder Structure (Created During Workflow)

The instruction files reference these folders, which are expected to be created as part of the process:

- `/neuroplast/project-concept/`
- `/neuroplast/project-concept/changelog/`
- `/neuroplast/learning/`
- `/neuroplast/plans/`

## Workflow Overview

### 1) Conceptualization

Start from `neuroplast/WORKFLOW_CONTRACT.md`, then `neuroplast/conceptualize.md`, which points to planning rules in `neuroplast/PLANNING_INSTRUCTIONS.md`.

`neuroplast/manifest.yaml` provides the canonical machine-readable map of workflow files, roles, and portability expectations.

`neuroplast/capabilities.yaml` provides the advisory machine-readable profile for environment limits and graceful degradation.

Optional environment guides live under `neuroplast/adapters/` and explain how to apply the same contract in specific tools without changing workflow behavior.

Optional workflow extensions live under `neuroplast/extensions/` (bundled scaffolding/shared extensions) or `neuroplast/local-extensions/` (repo-local) and can add custom guidance without changing the canonical workflow behavior.

### 2) Planning Outputs

Generate layered planning documents:

- Per-page high-level specs
- Per-page mid-level architecture
- Root `ARCHITECTURE.md` as the canonical architecture artifact
- Optional supporting planning notes under `/neuroplast/project-concept/`

Obsidian wiki-links (`[[File Name]]`) are supported and recommended, but the workflow must remain understandable in plain markdown.

### 3) Execution

Follow `neuroplast/act.md` in order:

- Read project concept artifacts
- Read `neuroplast/WORKFLOW_CONTRACT.md`
- Ensure `ARCHITECTURE.md` exists in the repository root
- Create a plan in `/neuroplast/plans/`
- Execute plan with references to `/neuroplast/learning/`
- Run concept/changelog/think instructions

### 4) Changelog Discipline

`neuroplast/CHANGELOG_INSTRUCTIONS.md` expects date-based changelog files (`YYYY-MM-DD.md`) under `/neuroplast/project-concept/changelog/` with links to associated plans.

### 5) Learning Capture

`neuroplast/think.md` defines how to store non-sensitive lessons in `/neuroplast/learning` by category.

## Prerequisites

- Git for versioning
- [Obsidian](https://obsidian.md/) optional for wiki-link navigation and graph-based note workflow

## Notes and Caveats

- Some referenced files/folders are not present yet in the current repo (they are expected to be created by following the workflow).
- Keep architecture references consistent as `ARCHITECTURE.md`.
- This repo currently functions as a process framework and documentation system.
- `neuroplast/WORKFLOW_CONTRACT.md` is the canonical portability contract for the workflow.
- `neuroplast/manifest.yaml` is the canonical machine-readable workflow map.
- `neuroplast/capabilities.yaml` is the advisory capability profile for constrained environments.
- `neuroplast/adapters/` contains optional environment guides and is not an alternate workflow definition.
- `neuroplast/extensions/` contains optional bundled workflow extension scaffolding or shared extensions that are only active when declared in `neuroplast/manifest.yaml`.
- `neuroplast/local-extensions/` is reserved for repo-local custom extensions declared in `neuroplast/manifest.yaml`.
- This repository keeps `package-maintainer` as a repo-local extension rather than a published bundled extension.
- Instruction frontmatter is workflow metadata only and intentionally excludes model-tuning fields.
- `neuroplast validate` checks contract structure, required files, metadata parseability, instruction frontmatter, environment-guide boundaries, and any active workflow extension declarations.
- Validation is scoped to contract and metadata compliance, not environment orchestration.

## Suggested Next Steps

1. Create the `/neuroplast/...` folders referenced above.
2. Add an initial project concept in `/neuroplast/project-concept/`.
3. Start daily changelog files in `/neuroplast/project-concept/changelog/`.
4. Add a root architecture file matching your preferred naming convention.
