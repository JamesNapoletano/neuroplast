# Neuroplast

Neuroplast is a repository-local project mind for humans and AI systems, and an implementation of the Local Cognitive Protocol (LCP).

Normative protocol source:

- <https://github.com/JamesNapoletano/lcp>

LCP is the standard. Neuroplast is an implementation of that standard.

Neuroplast remains domain-agnostic. It can support software repositories, research repositories, marine biology repositories, educational repositories, collaborative learning repositories, and other local knowledge contexts.

Neuroplast preserves its existing `/neuroplast/` working layout while also installing an explicit `.lcp/` bridge entrypoint for visible LCP alignment.

Current version statement:

- `Neuroplast v1.2.2 implements LCP v1`

## Quick Start

Initialize Neuroplast in any project directory:

```bash
npx neuroplast init
```

Include shared Obsidian config files:

```bash
npx neuroplast init --with-obsidian
```

Apply one-time versioned updates and safe managed-file refreshes:

```bash
npx neuroplast sync
```

Preview sync changes without writing files:

```bash
npx neuroplast sync --dry-run
```

Emit machine-readable output for automation around `init` or `sync`:

```bash
npx neuroplast init --json
npx neuroplast sync --json
```

Published JSON schemas for automation consumers:

- `schemas/init-json.schema.json`
- `schemas/sync-json.schema.json`
- `schemas/validate-json.schema.json`

Validate the LCP bridge, Neuroplast profile, and metadata:

```bash
npx neuroplast validate
```

Emit machine-readable validation results for CI or wrapper tooling:

```bash
npx neuroplast validate --json
```

Run the full maintainer pre-release verification flow:

```bash
npm run release:verify
```

Run the repository reliability suite while developing Neuroplast itself:

```bash
npm test
```

The initializer is non-destructive: existing files are skipped and never overwritten during `init`.

`init` also creates a minimal root `ARCHITECTURE.md` scaffold when that file does not already exist, so a fresh repository can complete the first validation loop immediately.

By default, Neuroplast writes working files under `/neuroplast/` and installs a companion `.lcp/` bridge layout.

`init` also runs `sync` after file bootstrap so new package migrations are applied once per version.

## First Successful Loop

After `npx neuroplast init`, read these files in order before doing any real work:

1. `.lcp/manifest.yaml`
2. `neuroplast/WORKFLOW_CONTRACT.md`
3. `neuroplast/manifest.yaml`
4. `neuroplast/capabilities.yaml`
5. Any active workflow extensions declared in `neuroplast/manifest.yaml`
6. The current instruction file such as `neuroplast/reverse-engineering.md`, `neuroplast/conceptualize.md`, or `neuroplast/act.md`

Use the instruction files with this operating model:

- Start with `neuroplast/act.md` for normal bounded work once the project already has enough context.
- Start with `neuroplast/reverse-engineering.md` when an existing codebase needs code-grounded project-mind reconstruction before conceptualization.
- Start with `neuroplast/conceptualize.md` when the project is new, the request is ambiguous, or the project mind needs reframing.
- Treat `/neuroplast/project-concept/`, `/neuroplast/plans/`, `/neuroplast/project-concept/changelog/`, and `/neuroplast/learning/` as the durable memory surface shared by the human and the AI.

### Terminal-first portability proof walkthrough

The terminal-only path is the current actively verified portability proof for Neuroplast because it exercises the workflow from the filesystem contract alone.

Use this first loop in a realistic consumer repository:

1. Run `npx neuroplast init` in the target repository.
2. Read the LCP bridge manifest, the Neuroplast contract, the Neuroplast manifest, the capability profile, and any active extensions.
3. Review the root `ARCHITECTURE.md` scaffold created by `init`, or confirm your existing architecture file.
4. Add one concept artifact under `neuroplast/project-concept/` and one execution plan under `neuroplast/plans/`.
5. Execute one bounded step through `neuroplast/act.md`.
6. Run `npx neuroplast validate` to confirm the LCP bridge and Neuroplast profile are still valid.
7. On later package updates, run `npx neuroplast sync` to apply package-managed refreshes without overwriting local edits.

This walkthrough shows the file contract in action without requiring any editor-specific integration.

## LCP Relationship

- **LCP** is the normative external protocol source.
- **Neuroplast** is an implementation of LCP for repository-local cognitive augmentation.
- **`.lcp/`** provides the LCP-facing bridge entrypoint.
- **`/neuroplast/`** remains the Neuroplast-owned working layout and compatibility profile.
- **CLI/runtime behavior** is Neuroplast tooling, not LCP core semantics.

See:

- `docs/lcp-mapping.md`
- `docs/lcp-compatibility.md`
- `docs/domain-generalization.md`
- `docs/migration-to-lcp.md`

## Managed File Updates (Versioned Migrations)

Neuroplast now supports one-time versioned migrations plus safe refreshes for library-managed files under `/neuroplast/`.

- Sync state is persisted in `neuroplast/.neuroplast-state.json`.
- Each migration has an ID and target version.
- Applied migrations are recorded so they only run once.
- Managed package files also store a baseline content hash and last synced version.
- Sync evaluation runs on all package version updates, including patch releases.
- Downgrade detection skips automatic sync; use `--force` to override.
- Use `--backup` with `sync` to keep pre-update file copies under `neuroplast/.backups/`.

### Managed refresh behavior

- Missing managed workflow, adapter, and bundled extension files are recreated during `sync`.
- Unchanged managed files are refreshed to the latest packaged version.
- Locally modified managed files are preserved and reported instead of being overwritten.
- Older installs without baseline metadata only adopt a file into safe refresh management when the current file already matches the packaged content exactly.

### Sync behavior by version

- Same version: sync is skipped.
- Higher version (major/minor/patch): sync runs once and records new sync version.
- Lower version (downgrade): sync is skipped by default.

### Current sync behavior

- Tag backfill migration enforces required Obsidian tags across managed markdown folders under `/neuroplast/`.
- Governed sync scope excludes `/neuroplast/.obsidian/` and `/neuroplast/.backups/`.
- `sync --dry-run` now announces preview mode explicitly and reports create/update/preserve/adopt/unchanged counts before any real write.

## Validation Trust UX

- Human-readable validation output now includes a clear next corrective action for warnings and errors.
- `init --json` and `sync --json` now emit machine-readable action summaries for wrapper tooling while preserving the human-readable default output.
- `npx neuroplast validate --json` emits machine-readable findings and summary counts for CI or wrapper tooling.
- Published JSON schemas now document the stable payload contracts for `init --json`, `sync --json`, and `validate --json` within the current major version.
- `validate --json` now includes `schemaVersion`, and the stable payload contract for the current major version is documented in `schemas/validate-json.schema.json`.
- Validation now also checks sync-state parseability and warns when active extension files will not be step-loaded automatically.

## Compatibility and Upgrade Policy

### Stable within a major version

- CLI command names: `init`, `sync`, `validate`
- The `/neuroplast/` root layout and required folder paths
- Root `ARCHITECTURE.md` as the canonical architecture artifact
- Core manifest document-role paths and required workflow files
- Non-destructive `init` behavior for existing files
- Non-destructive `sync` behavior for locally edited managed files
- `validate --json` schema contract for the active `schemaVersion`

### May evolve within a major version

- Human-readable CLI output wording
- Additive validation findings and documentation improvements
- Additional optional bundled extensions or additive metadata fields
- Documentation-only adapter guidance

### Deprecation and upgrade expectations

- When practical, deprecations should be documented before removal rather than changed silently.
- Release notes should state whether consumers need to run `npx neuroplast sync`, `npx neuroplast sync --dry-run`, or no follow-up command.
- If a release changes managed assets or upgrade behavior materially, maintainers should publish upgrade notes or a migration guide alongside the change.

## Using `validate --json` in CI

Use `validate --json` when a consuming repository wants machine-readable pass/fail output without scraping human logs.

Example GitHub Actions step after Neuroplast has been initialized in the repository:

```yaml
- name: Validate Neuroplast contract
  run: npx neuroplast validate --json
```

Current CI consumer expectations:

- exit code `0` means no validation errors were found
- exit code `1` means at least one validation error was found
- `schemaVersion` identifies the machine-readable payload contract
- `summary.errors`, `summary.warnings`, and `findings` can be consumed by wrapper tooling

If your automation depends on the JSON shape, pin the Neuroplast major version and review `schemas/validate-json.schema.json` when adopting a newer major release.

## Maintainer Release Operations

- Run `npm run release:verify` before publish.
- The release verification flow runs `npm run validate`, `npm test`, checks the `npm pack --json` payload against expected shipped assets, and performs a packed-install smoke test.
- Repo-local maintainer assets such as `neuroplast/local-extensions/package-maintainer/` are intentionally excluded from the published package payload.

## Optional Workflow Extensions

- Bundled reusable workflow extensions are installed under `neuroplast/extensions/`.
- Repo-local custom extensions may be created under `neuroplast/local-extensions/`.
- Activate extensions in `neuroplast/manifest.yaml` under `extensions.active_bundled` and `extensions.active_local`.
- Active extensions are additive guidance only and must not override the core workflow contract.
- Read active extensions after the core contract/manifest/capabilities documents and before executing the matching canonical instruction file.
- Use the seamless step-loading convention: for each active extension, load the matching file for the current phase when it exists.
- Active extensions should include a `README.md`, the additive boundary reminder, and at least one canonical step file.
- Bundled extensions shipped with Neuroplast:
  - `verification-first`
  - `artifact-sync`
  - `context-continuity`
- The `package-maintainer` extension in this repository is repo-local only and is not shipped as part of the published package.

## Portability Support Matrix

- **Actively verified** means the environment has a maintained first-loop proof path that is rerun against the canonical file contract.
- **Documentation-only** means the guide is kept aligned with the contract, but it is not yet treated as a separately verified portability proof.

| Environment | Status | Capability assumptions | Notes |
| --- | --- | --- | --- |
| Terminal-only | Actively verified | File reads, file writes, and terminal commands | Canonical proof path for `init` -> read files -> execute one loop -> `validate` -> later `sync`. |
| OpenCode | Documentation-only | File reads and writes; terminal access may vary by runtime | Guide stays aligned with the contract but is not yet maintained as a separately verified proof path. |
| Claude Code | Documentation-only | File reads and writes; tool permissions may vary; terminal usually available | Use the same file contract and recordkeeping path as the terminal proof. |
| Cursor | Documentation-only | File reads and writes; editor automation may vary | Treat editor assistance as convenience, not workflow authority. |
| Windsurf | Documentation-only | File reads and writes; runtime capabilities may vary by mode | Fall back to the file contract when tool support is partial. |
| VS Code + Copilot | Documentation-only | File reads and writes; terminal availability depends on local setup | Keep the workflow grounded in files rather than editor chat state. |

## What This Repository Is

This repository contains instruction files that help a human and an AI maintain a usable project mind through a repeatable process:

1. Orient to the project and preserve durable context
2. Produce or refresh architecture/project-map artifacts
3. Execute bounded work sessions
4. Record what changed
5. Capture reusable lessons learned

It is set up as a workflow package template rather than a traditional code application.

## Current Repository Contents

Source-of-truth package files in this repository:

- `src/instructions/` — canonical instruction templates copied by `neuroplast init`
  - `manifest.yaml`
  - `capabilities.yaml`
  - `WORKFLOW_CONTRACT.md`
  - `conceptualize.md`
  - `reverse-engineering.md`
  - `PLANNING_INSTRUCTIONS.md`
  - `act.md`
  - `CONCEPT_INSTRUCTIONS.md`
  - `CHANGELOG_INSTRUCTIONS.md`
  - `think.md`
- `src/obsidian/.obsidian/` — optional shared Obsidian config templates
- `src/extensions/` — optional bundled workflow extensions and authoring scaffold
- `src/adapters/` — optional environment guidance documents
- `bin/neuroplast.js` — CLI initializer that creates folders and copies templates
- `.gitignore` — currently ignores `.obsidian/workspace.json`

Installed output in target projects (created by `npx neuroplast init`):

- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `ARCHITECTURE.md` — minimal root architecture scaffold created during `init` when missing
- `neuroplast/conceptualize.md`
- `neuroplast/reverse-engineering.md`
- `neuroplast/PLANNING_INSTRUCTIONS.md`
- `neuroplast/act.md`
- `neuroplast/CONCEPT_INSTRUCTIONS.md`
- `neuroplast/CHANGELOG_INSTRUCTIONS.md`
- `neuroplast/think.md`
- `neuroplast/extensions/` — optional bundled workflow extensions and shared scaffolding
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

### 1) Project-Mind Orientation

Start from `neuroplast/WORKFLOW_CONTRACT.md`, then choose the current instruction:

- `neuroplast/act.md` for normal bounded work
- `neuroplast/reverse-engineering.md` for code-grounded reconstruction of project context from an existing repository
- `neuroplast/conceptualize.md` when the work is new, ambiguous, or needs reframing

`neuroplast/conceptualize.md` points to the structured context rules in `neuroplast/PLANNING_INSTRUCTIONS.md`.

`neuroplast/reverse-engineering.md` feeds code-grounded evidence into `neuroplast/conceptualize.md` when the repository exists but the durable project mind does not yet match reality.

`neuroplast/manifest.yaml` provides the canonical machine-readable map of workflow files, roles, and portability expectations.

`neuroplast/capabilities.yaml` provides the advisory machine-readable profile for environment limits and graceful degradation.

Optional environment guides live under `neuroplast/adapters/` and explain how to apply the same contract in specific tools without changing workflow behavior.

Optional workflow extensions live under `neuroplast/extensions/` (bundled shared extensions) or `neuroplast/local-extensions/` (repo-local) and can add custom guidance without changing the canonical workflow behavior.

### 2) Project-Mind Outputs

Generate layered project-mind documents as needed:

- Orientation artifacts for major work surfaces, subject areas, or domains
- Detailed context artifacts for those same areas when needed
- Root `ARCHITECTURE.md` as the canonical architecture or project-map artifact
- Optional supporting notes under `/neuroplast/project-concept/`

Obsidian wiki-links (`[[File Name]]`) are supported and recommended, but the workflow must remain understandable in plain markdown.

### 3) Bounded Work Sessions

Follow `neuroplast/act.md` in order:

- Read project concept artifacts
- Read `neuroplast/WORKFLOW_CONTRACT.md`
- Ensure `ARCHITECTURE.md` exists in the repository root
- Update the active plan in `/neuroplast/plans/`
- Execute the next bounded step with references to `/neuroplast/learning/`
- Run concept/changelog/think instructions

### Reverse-Engineering Sessions

Follow `neuroplast/reverse-engineering.md` when the repository already exists but the project mind needs to be reconstructed from code evidence before normal conceptualization and execution can proceed.

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
- Terminal-only is the current actively verified portability proof path; other bundled environment guides are documentation-only until separately verified.
- `neuroplast/extensions/` contains optional bundled workflow extensions that are only active when declared in `neuroplast/manifest.yaml`.
- `neuroplast/local-extensions/` is reserved for repo-local custom extensions declared in `neuroplast/manifest.yaml`.
- This repository keeps `package-maintainer` as a repo-local extension rather than a published bundled extension.
- Instruction frontmatter is workflow metadata only and intentionally excludes model-tuning fields.
- `neuroplast validate` checks contract structure, required files, metadata parseability, instruction frontmatter, environment-guide boundaries, and whether any active workflow extensions follow the minimal file convention.
- Validation is scoped to contract and metadata compliance, not environment orchestration.
- `npm test` runs black-box CLI regression tests against temporary repositories.

## Suggested Next Steps

1. Create the `/neuroplast/...` folders referenced above.
2. Add an initial project concept in `/neuroplast/project-concept/`.
3. Start daily changelog files in `/neuroplast/project-concept/changelog/`.
4. Add a root architecture file matching your preferred naming convention.
