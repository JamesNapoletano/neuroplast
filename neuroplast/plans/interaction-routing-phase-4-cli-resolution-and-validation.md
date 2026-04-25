# Interaction Routing Phase 4 - CLI Resolution and Validation
#plan

**Created:** 2026-04-18
**Related to:** [[project-concept/cross-adapter-interaction-routing.md]]
**Changelog:** [[project-concept/changelog/2026-04-18.md]]

## Overview
Add an optional deterministic runtime seam for interaction routing so phrase-to-intent resolution can be validated and reused even when adapter chat UX differs.

## Dependencies
- [[plans/interaction-routing-phase-1-canonical-contract.md]]
- [[plans/interaction-routing-phase-2-manifest-and-extension-shape.md]]
- [[plans/interaction-routing-phase-3-adapter-alignment.md]]
- [[plans/roadmap-phase-2-cli-maintainability.md]]
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]

## Work Type
CLI, validation, and test coverage planning.

## Tasks

### 1. Define the runtime seam
- [x] Decide whether to add a new `neuroplast` subcommand for routing inspection or execution intent resolution.
- [x] Keep the CLI surface narrow and aligned with filesystem-first execution.
- [x] Ensure phrase resolution can be inspected without forcing adapter-specific integrations.

### 2. Extend validation safely
- [x] Add validation rules for malformed or conflicting routing declarations.
- [x] Separate deterministic validation from advisory phrase examples.
- [x] Keep validation focused on contract integrity rather than chat orchestration.

### 3. Add verification coverage
- [x] Add black-box coverage for any new routing command or JSON output.
- [x] Verify cross-platform behavior for phrase resolution and diagnostics.
- [x] Record fallback evidence when terminal-driven verification is unavailable in a target environment.

## Success Criteria
- [x] Routing resolution can be inspected or validated outside any single adapter.
- [x] Validation catches unsafe or conflicting declarations.
- [x] CLI additions remain narrow and backward compatible.

## Execution Notes
- Added `neuroplast/interaction-routing.yaml` as the canonical machine-readable routing artifact and shipped it through the managed workflow file set.
- Added `neuroplast route <phrase> [--json]` as a narrow inspection seam for canonical phrase resolution.
- Extended validation to check the routing artifact and reject extension overlays that try to override protected canonical phrases.
- Added a published JSON schema for `route --json` and black-box coverage for route inspection and routing validation failures.

## Risks
- The CLI could grow into environment orchestration if the seam is not tightly bounded.
- Natural-language examples may pressure the runtime into supporting more ambiguity than planned.

## Related Files
- `bin/neuroplast.js`
- `src/cli/`
- `test/`
- `schemas/`
- [[project-concept/cross-adapter-interaction-routing.md]]
