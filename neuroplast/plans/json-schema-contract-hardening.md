# JSON Schema Contract Hardening
#plan

**Created:** 2026-04-12
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-04-12.md]]

## Goal
Harden Neuroplast's machine-readable CLI contracts by fixing the known `validate --json` schema inconsistency and publishing explicit schemas for `init --json` and `sync --json`.

## Tasks
- [x] Fix any `validate --json` finding branches that can bypass the documented schema shape. → Verify: every finding includes `level`, `code`, `message`, and `remediation`.
- [x] Add published JSON schema files for `init --json` and `sync --json`. → Verify: schemas ship in `schemas/` and match current payload fields.
- [x] Extend tests to assert the fixed validation shape and the documented init/sync payload contracts. → Verify: black-box tests fail if payload keys drift.
- [x] Update README, architecture, and concept docs to reference the new schema artifacts. → Verify: docs describe where automation consumers can find the schemas.
- [x] Run project validation and tests after implementation. → Verify: `npm test` and `npm run validate` pass.

## Sync Impact
**Decision:** no migration needed

**Reason:** This work strengthens documented automation contracts and validation reporting without changing managed-file semantics or installed repository structure.

## Done When
- [x] `validate --json` cannot emit schema-invalid findings.
- [x] `init --json` and `sync --json` have published schema files.
- [x] Documentation, changelog, and learning artifacts reflect the hardened contract.
