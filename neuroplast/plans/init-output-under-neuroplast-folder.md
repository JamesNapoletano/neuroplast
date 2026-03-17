# Init Output Placement Under `/neuroplast` Plan
#plan

**Created:** 2026-03-14
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-14.md]]

## Overview
Align `neuroplast init` behavior with expected output placement by writing instruction files and optional Obsidian configuration under the generated `/neuroplast/` folder.

## Tasks

### 1. Update CLI Destination Paths

**Goal:** Ensure init copies instruction and optional Obsidian files to `/neuroplast/...` instead of repository root locations.

**Actions:**
- [x] Change instruction destination from `<project>/<file>.md` to `<project>/neuroplast/<file>.md`
- [x] Change Obsidian destination from `<project>/.obsidian/` to `<project>/neuroplast/.obsidian/`
- [x] Keep non-destructive copy behavior unchanged

---

### 2. Update User-Facing Documentation

**Goal:** Keep README and help text consistent with new install paths.

**Actions:**
- [x] Update README descriptions of installed file locations
- [x] Update architecture mapping in `ARCHITECTURE.md`
- [x] Update project concept assumptions in `/neuroplast/project-concept/npm-package.md`

---

### 3. Verify Packaging and Runtime Behavior

**Goal:** Confirm package payload remains intact and init writes expected layout.

**Actions:**
- [x] Run `npm pack --dry-run` and review output
- [x] Run local init smoke test in a temp directory
- [x] Validate expected files are under `<project>/neuroplast/`

## Validation Checklist

- [x] `neuroplast init` writes instruction files under `/neuroplast/`
- [x] `neuroplast init --with-obsidian` writes `.obsidian` under `/neuroplast/.obsidian/`
- [x] Docs and architecture reflect actual behavior
- [x] Dry-run package output remains valid

## Related Files

- [[project-concept/npm-package.md]]
- [[project-concept/changelog/2026-03-14.md]]
