# Phase 4 Bundled Extensions Implementation
#plan

**Created:** 2026-03-30
**Related to:** [[plans/roadmap-phase-4-extension-system-mvp.md]]
**Changelog:** [[project-concept/changelog/2026-03-30.md]]

## Overview
Implement Roadmap Phase 4 by shipping three separate bundled workflow extensions, tightening active-extension validation, and adding maintainer-facing authoring guidance without changing the safe default of zero active bundled extensions.

## Scope
- Add bundled `verification-first`, `artifact-sync`, and `context-continuity` extensions under `src/extensions/` and installed mirrors under `neuroplast/extensions/`.
- Expand managed-file installation and safe refresh coverage for bundled extension assets.
- Tighten `validate` so active extensions must follow a minimal shape and documentation convention.
- Update architecture and user-facing docs for activation, authoring, and extension intent.
- Add regression tests for bundled extension installation and extension validation behavior.

## Sync-Impact Decision
- Decision: `no migration needed`
- Reason: bundled extension assets are package-managed static files that can be created or refreshed by the existing managed-file sync pipeline once they are added to the managed file map.

## Tasks
- [x] Add packaged bundled extension files for the three extension paths.
- [x] Define and enforce a minimal active-extension file convention.
- [x] Update init/sync managed-file coverage for nested bundled extension files.
- [x] Add black-box CLI tests for bundled extension installation and malformed active extensions.
- [x] Update README, architecture, roadmap, and extension authoring artifacts.
- [x] Run `npm test` and `npm run validate`.

## Success Criteria
- [x] Three separate bundled extensions ship as inactive-by-default managed assets.
- [x] Validation catches malformed active bundled or local extension setups.
- [x] Documentation is sufficient for maintainers to create and activate extensions.
- [x] Existing safe defaults remain unchanged when no bundled extensions are active.

## Related Files
- `src/extensions/`
- `neuroplast/extensions/`
- `src/cli/constants.js`
- `src/cli/validate.js`
- `test/cli-reliability.test.js`
- `README.md`
- `ARCHITECTURE.md`

## Outcome Notes
- `npm test` passed after adding bundled-extension coverage and updating sync summary expectations for the expanded managed-file set.
- `npm run validate` passed with the repo-local `package-maintainer` extension satisfying the new minimal extension shape checks.
