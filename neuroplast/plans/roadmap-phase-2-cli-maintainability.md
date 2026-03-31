# Roadmap Phase 2 - CLI Maintainability
#plan

**Created:** 2026-03-24
**Related to:** [[project-concept/neuroplast-product-maturity-roadmap.md]]
**Changelog:** [[project-concept/changelog/2026-03-24.md]]

## Overview
Refactor the CLI into smaller, testable modules without expanding scope or changing the public command surface. This phase should make future work safer after the reliability harness is in place.

## Dependencies
- [[plans/roadmap-phase-1-reliability-hardening.md]]

## Tasks

### 1. Separate core concerns
- [x] Extract command parsing and dispatch from the monolithic CLI file.
- [x] Extract state loading/saving and managed-file tracking logic.
- [x] Extract sync refresh and migration runner behavior.
- [x] Extract validation and parsing helpers.

### 2. Preserve current behavior
- [x] Keep `init`, `sync`, and `validate` behavior unchanged while refactoring.
- [x] Keep existing log semantics stable unless Phase 3 explicitly updates them.
- [x] Use tests from Phase 1 to guard against behavior drift.

### 3. Improve code navigation
- [x] Create a clearer source layout for CLI/runtime concerns.
- [x] Update `ARCHITECTURE.md` if implementation structure changes materially.
- [x] Add lightweight maintainer notes only where the extracted structure needs explanation.

## Success Criteria
- [x] `bin/neuroplast.js` becomes a thin entrypoint or orchestrator.
- [x] Core runtime behaviors live in focused modules.
- [x] Refactoring completes without command-surface regressions.

## Execution Notes
- `bin/neuroplast.js` is now a thin entrypoint that delegates to `src/cli/runtime.js`.
- CLI responsibilities are separated into constants, logging, shared helpers, parsing, filesystem behavior, state management, sync flow, and validation flow.
- Phase 1 black-box tests were reused unchanged to confirm command-surface stability after refactoring.

## Risks
- Refactoring can accidentally change output ordering or log text relied on by tests.
- Over-modularization could add complexity if boundaries are not kept pragmatic.

## Related Files
- `bin/neuroplast.js`
- `src/`
- `src/cli/`
- `ARCHITECTURE.md`
- [[plans/roadmap-phase-1-reliability-hardening.md]]
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
- [[project-concept/changelog/2026-03-24.md]]
