# Roadmap Phase 6 - Release and Adoption Layer
#plan

**Created:** 2026-03-24
**Related to:** [[project-concept/neuroplast-product-maturity-roadmap.md]]
**Changelog:** [[project-concept/changelog/2026-03-24.md]]

## Overview
Make Neuroplast easier to ship, upgrade, and adopt in real teams by tightening release verification, compatibility communication, and consuming-repo guidance.

## Dependencies
- [[plans/roadmap-phase-1-reliability-hardening.md]]
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
- [[plans/roadmap-phase-5-portability-proof.md]]

## Tasks

### 1. Improve release verification
- [ ] Add package smoke checks such as `npm pack` verification and install testing.
- [ ] Verify the published payload against expected managed assets.
- [ ] Define a repeatable pre-release checklist for sync-sensitive changes.

### 2. Clarify compatibility policy
- [ ] Define what parts of the workflow contract are stable versus evolving.
- [ ] Document deprecation and migration expectations for consumers.
- [ ] Make upgrade notes consistent for future releases.

### 3. Improve adoption guidance
- [ ] Document how consuming repositories can use `neuroplast validate` in CI.
- [ ] Add maintainer guidance for troubleshooting, migrations, and release operations.
- [ ] Keep adoption docs aligned with the narrow-CLI and filesystem-first model.

## Success Criteria
- [ ] Releases are verified by repeatable checks before publish.
- [ ] Consumers understand upgrade and compatibility expectations.
- [ ] Team adoption guidance is concrete enough for real repository rollout.

## Risks
- Formal guarantees may slow iteration if they are defined too broadly too early.
- Release-process overhead can grow faster than the current maintainer needs.

## Related Files
- `package.json`
- `README.md`
- [[plans/npm-release-readiness.md]]
- [[project-concept/changelog/2026-03-24.md]]
