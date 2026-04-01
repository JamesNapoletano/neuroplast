# Roadmap Phase 6 - Release and Adoption Layer
#plan

**Created:** 2026-03-24
**Related to:** [[project-concept/neuroplast-product-maturity-roadmap.md]]
**Changelog:** [[project-concept/changelog/2026-03-30.md]]

## Overview
Make Neuroplast easier to ship, upgrade, and adopt in real teams by tightening release verification, compatibility communication, and consuming-repo guidance.

## Dependencies
- [[plans/roadmap-phase-1-reliability-hardening.md]]
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
- [[plans/roadmap-phase-5-portability-proof.md]]

## Tasks

### 1. Improve release verification
- [x] Add package smoke checks such as `npm pack` verification and install testing.
- [x] Verify the published payload against expected managed assets.
- [x] Define a repeatable pre-release checklist for sync-sensitive changes.

### 2. Clarify compatibility policy
- [x] Define what parts of the workflow contract are stable versus evolving.
- [x] Document deprecation and migration expectations for consumers.
- [x] Make upgrade notes consistent for future releases.
- [x] Treat `validate --json` as a documented schema-versioned compatibility contract for CI consumers.

### 3. Improve adoption guidance
- [x] Document how consuming repositories can use `neuroplast validate` in CI.
- [x] Add maintainer guidance for troubleshooting, migrations, and release operations.
- [x] Keep adoption docs aligned with the narrow-CLI and filesystem-first model.

## Sync Impact
**Decision:** no migration needed

**Reason:** This phase adds release verification, a documented validation JSON schema, and release/adoption documentation without changing the managed-file refresh semantics or requiring existing installs to transform state.

## Success Criteria
- [x] Releases are verified by repeatable checks before publish.
- [x] Consumers understand upgrade and compatibility expectations.
- [x] Team adoption guidance is concrete enough for real repository rollout.

## Risks
- Formal guarantees may slow iteration if they are defined too broadly too early.
- Release-process overhead can grow faster than the current maintainer needs.

## Related Files
- `package.json`
- `README.md`
- `schemas/validate-json.schema.json`
- `scripts/release-verify.js`
- [[project-concept/release-and-compatibility-policy.md]]
- [[project-concept/release-operations.md]]
- [[plans/npm-release-readiness.md]]
- [[project-concept/changelog/2026-03-30.md]]
