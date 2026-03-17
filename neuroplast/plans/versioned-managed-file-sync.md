# Versioned Managed File Sync Plan
#plan

**Created:** 2026-03-17
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-17.md]]

## Overview
Add a version-aware, one-time migration system so library-managed Neuroplast files can receive safe upgrades when users update the package, including patch updates.

## Tasks

### 1. Add Sync and Migration Runtime

**Goal:** Support one-time-per-version file updates.

**Actions:**
- [x] Add `sync` command to CLI.
- [x] Execute sync automatically after `init`.
- [x] Add migration registry and version ordering.
- [x] Add persistent state file (`neuroplast/.neuroplast-state.json`) with applied migration tracking.

---

### 2. Implement First Migration: Tag Backfill

**Goal:** Keep migration framework active without enabling content mutations yet.

**Actions:**
- [x] Remove tag/example migration implementation.
- [x] Ensure no markdown content mutation occurs during `init` or `sync` by default.
- [x] Keep migration discovery and execution pipeline ready for future migrations.

---

### 3. Add Safety Controls and Documentation

**Goal:** Keep updates predictable and transparent.

**Actions:**
- [x] Add `--dry-run` preview mode.
- [x] Add `--backup` option for sync updates.
- [x] Update package scripts and remove self-dependency.
- [x] Update `README.md`, `ARCHITECTURE.md`, and concept documentation with sync behavior.

---

### 4. Validation

**Goal:** Verify CLI behavior and migration execution path.

**Actions:**
- [x] Run CLI help and confirm new command/options are shown.
- [x] Run sync dry-run to verify version-gated behavior and no-write mode.
- [x] Verify same-version no-op.
- [x] Verify downgrade skip behavior and `--force` override path.

## Validation Checklist

- [x] CLI includes `sync` command.
- [x] Sync checks all package updates (major/minor/patch).
- [x] Same-version sync is skipped.
- [x] Downgrade sync is skipped unless `--force` is used.
- [x] No content-altering migrations are active by default.
- [x] Documentation reflects new update behavior.

## Related Files

- [[project-concept/npm-package.md]]
- [[project-concept/changelog/2026-03-17.md]]
