# Obsidian Tag Enforcement and Migration Plan
#plan

**Created:** 2026-03-17
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-17.md]]

## Overview
Implement deterministic Obsidian tag conventions across Neuroplast-managed markdown files, enforce the policy in instruction templates, and ship a migration that backfills tags for existing managed files.

## Tasks

### 1. Define and enforce tag policy in instruction templates
- [x] Add top-level instruction tag requirement (`#instruction`) to source instruction files.
- [x] Add explicit folder-to-tag mapping rules in `act.md`.
- [x] Add per-instruction validation language for changelog, concept, planning, and learning flows.

### 2. Apply tags to currently managed markdown files
- [x] Add required tags under H1 for existing files in `/neuroplast/`.
- [x] Ensure changelog, plan, learning, and project concept files follow folder-specific tags.

### 3. Add migration for existing installs
- [x] Add migration module to backfill required tags by managed file path.
- [x] Preserve idempotency (no-op when compliant).
- [x] Validate migration via `sync --dry-run --force`.

### 4. Validation
- [x] Verify tag placement is line 2 for all relevant files.
- [x] Ensure changelog ↔ plan links remain intact.
- [x] Record a reusable learning note.

## Validation Checklist
- [x] Tag policy exists in execution instructions.
- [x] Source templates include `#instruction`.
- [x] Existing managed markdown files include required folder tags.
- [x] Migration exists and runs in dry-run.
- [x] Learning and changelog artifacts updated for this cycle.

## Related Files
- [[project-concept/npm-package.md]]
- [[project-concept/changelog/2026-03-17.md]]
- [[learning/obsidian-tag-policy-needs-closed-loop-execution.md]]
