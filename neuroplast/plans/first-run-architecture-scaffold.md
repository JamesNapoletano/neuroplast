# First-Run Architecture Scaffold
#plan

**Created:** 2026-04-12
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-04-12.md]]

## Goal
Make `npx neuroplast init` leave a newly initialized repository in a practical first-run state by scaffolding a minimal root `ARCHITECTURE.md`, clarifying CLI guidance, and locking the behavior with black-box tests.

## Tasks
- [x] Add a minimal packaged `ARCHITECTURE.md` scaffold and copy it during `init` only when the file is missing. → Verify: fresh init creates root `ARCHITECTURE.md`, existing files remain untouched.
- [x] Tighten CLI option validation for `init`, `sync`, and `validate`. → Verify: unsupported flags return exit code `1` with a clear error.
- [x] Update README, architecture, and concept docs to reflect the new first-run behavior. → Verify: docs describe `init` as creating a minimal root architecture scaffold.
- [x] Expand CLI reliability coverage for the new onboarding path. → Verify: tests cover fresh init validation success, existing architecture preservation, and invalid flags.
- [x] Run project validation and tests after implementation. → Verify: `npm test` and `npm run validate` pass.

## Sync Impact
**Decision:** no migration needed

**Reason:** This change improves fresh initialization behavior and CLI validation without changing managed-file refresh semantics for existing installed repositories.

## Done When
- [x] Fresh `npx neuroplast init` produces a repo that passes `npx neuroplast validate`.
- [x] Existing `ARCHITECTURE.md` files are preserved.
- [x] Docs and changelog reflect the behavior change.
