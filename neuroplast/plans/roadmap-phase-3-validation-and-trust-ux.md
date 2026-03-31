# Roadmap Phase 3 - Validation and Trust UX
#plan

**Created:** 2026-03-24
**Related to:** [[project-concept/neuroplast-product-maturity-roadmap.md]]
**Changelog:** [[project-concept/changelog/2026-03-24.md]]

## Overview
Improve operator confidence in Neuroplast by making `validate` and `sync` easier to understand, safer to preview, and more actionable when something is wrong.

## Dependencies
- [[plans/roadmap-phase-1-reliability-hardening.md]]
- [[plans/roadmap-phase-2-cli-maintainability.md]]
- [[plans/portability-phase-5-cli-validation-and-polish.md]]

## Tasks

### 1. Improve validation usefulness
- [x] Add clearer remediation guidance to validation findings.
- [x] Evaluate deeper validation targets such as sync-state integrity and extension step-shape checks.
- [x] Consider machine-readable validation output if it improves CI and consuming-repo workflows.

### 2. Improve sync clarity
- [x] Make `sync` summaries easier to interpret for create/update/preserve/adopt outcomes.
- [x] Clarify dry-run messaging so operators can judge risk before writing files.
- [x] Evaluate whether output should better distinguish unchanged files from preserved local edits.

### 3. Preserve CLI boundary discipline
- [x] Keep UX improvements within the current narrow CLI scope.
- [x] Avoid environment orchestration or tool-specific command growth.
- [x] Update docs only where behavior or expectations materially improve.

## Success Criteria
- [x] Operators can tell what `sync` will do before running it for real.
- [x] Validation findings point clearly to the next corrective action.
- [x] UX improvements do not expand Neuroplast into environment orchestration.

## Execution Notes
- `validate` now attaches remediation guidance to human-readable warnings and errors and can emit JSON findings with `--json`.
- Validation now checks sync-state parseability/integrity and warns when active extension markdown files will not be step-loaded automatically.
- `sync` now announces dry-run preview mode explicitly and reports create/update/preserve/adopt/unchanged counts in its summary.

## Risks
- More detailed output can become noisy if the signal hierarchy is weak.
- JSON or structured output must not destabilize human-readable defaults.

## Related Files
- `bin/neuroplast.js`
- `src/cli/sync.js`
- `src/cli/validate.js`
- `README.md`
- `ARCHITECTURE.md`
- [[plans/portability-phase-5-cli-validation-and-polish.md]]
- [[project-concept/changelog/2026-03-24.md]]
