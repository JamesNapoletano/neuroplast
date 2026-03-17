# Sync Governed Folder Tag Backfill
#plan

**Created:** 2026-03-17
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-17.md]]

## Overview
Fix `sync` tag backfill scope so required Obsidian tags are enforced across all governed markdown files under `/neuroplast/` folder domains, not only files previously tracked in state.

## Tasks

### 1. Expand migration discovery scope
- [x] Add migration context support for governed markdown discovery under `/neuroplast/`.
- [x] Exclude non-governed paths (`/neuroplast/.obsidian/`, `/neuroplast/.backups/`).
- [x] Keep migration idempotent and non-destructive under `--dry-run`.

### 2. Route tag migration to governed files
- [x] Update tag backfill migration to use governed markdown discovery.
- [x] Keep fallback compatibility for older migration contexts.

### 3. Update documentation and architecture
- [x] Update `README.md` migration behavior to reflect governed-folder tag enforcement.
- [x] Update `ARCHITECTURE.md` migration flow description for governed file discovery.
- [x] Update project concept documentation where migration scope is described.

### 4. Validate and record
- [x] Run `sync --dry-run --force` to verify full governed-scope scanning path.
- [x] Update daily changelog with summary and plan links.
- [x] Record reusable learning note for migration-scope design.

## Validation Checklist
- [x] Sync context can enumerate governed markdown files under `/neuroplast/`.
- [x] Tag migration no longer depends solely on `managedFiles` state membership.
- [x] Excluded folders are not processed.
- [x] Docs and architecture reflect governed-folder behavior.
- [x] Changelog and learning artifacts updated.
