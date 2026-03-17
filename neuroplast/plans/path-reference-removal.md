# Path Reference Removal Plan
#plan

**Created:** 2026-03-13
**Scope:** Remove all legacy folder references and migrate concept paths to `/neuroplast/`
**Changelog:** [[project-concept/changelog/2026-03-13.md]]

## Objectives
- Remove all textual references to legacy workflow paths in repository documentation and plans.
- Migrate concept artifact references to `/neuroplast/project-concept/`.
- Preserve project concept content while relocating from legacy paths.

## Tasks
- [x] Update root docs (`README.md`, `PLANNING_INSTRUCTIONS.md`, `think.md`) to use `/neuroplast/` paths.
- [x] Update `ARCHITECTURE.md` folder creation and structure references.
- [x] Update plan links in `neuroplast/plans/npm-package-implementation.md`.
- [x] Create `neuroplast/project-concept/npm-package.md` with `/neuroplast/` references.
- [x] Remove legacy concept file under the old project-concept path.
- [x] Verify no legacy path references remain via repo-wide search.

## Verification
- Repo-wide search confirms no remaining references to the old folder path.
- All plan/concept wiki links point to `/neuroplast/` paths.

## Notes
- This change standardizes repository paths around `/neuroplast/` only.
