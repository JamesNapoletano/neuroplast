# Root Instruction File Removal Plan
#plan

**Created:** 2026-03-14  
**Scope:** Remove legacy instruction file duplicates from repository root and keep `src/instructions/` as the only package source of truth.  
**Changelog:** [[project-concept/changelog/2026-03-14.md]]

## Objectives
- Remove obsolete root-level instruction files that are no longer used by CLI runtime.
- Keep package behavior unchanged (`bin/neuroplast.js` continues to install from `src/instructions/`).
- Keep execution records aligned via changelog and learning updates.

## Tasks
- [x] Delete legacy root instruction files:
  - `act.md`
  - `conceptualize.md`
  - `think.md`
  - `CONCEPT_INSTRUCTIONS.md`
  - `CHANGELOG_INSTRUCTIONS.md`
  - `PLANNING_INSTRUCTIONS.md`
- [x] Confirm runtime source remains `src/instructions/*`.
- [x] Update daily changelog with this cleanup item.
- [x] Capture a reusable learning note about avoiding duplicate instruction sources.

## Verification
- Root no longer contains instruction-file duplicates.
- Runtime CLI source and copy behavior remain unchanged.

## Notes
- Optional future cleanup: remove stale recent-file references in local Obsidian workspace configs.
