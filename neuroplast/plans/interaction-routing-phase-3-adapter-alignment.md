# Interaction Routing Phase 3 - Adapter Alignment
#plan

**Created:** 2026-04-18
**Related to:** [[project-concept/cross-adapter-interaction-routing.md]]
**Changelog:** [[project-concept/changelog/2026-04-18.md]]

## Overview
Align all bundled environment guides around the shared interaction-routing contract so the same short operator prompts mean the same thing across adapters without giving adapters execution authority.

## Dependencies
- [[plans/interaction-routing-phase-1-canonical-contract.md]]
- [[plans/interaction-routing-phase-2-manifest-and-extension-shape.md]]
- [[plans/roadmap-phase-5-portability-proof.md]]

## Work Type
Documentation-only alignment.

## Tasks

### 1. Align startup guidance
- [x] Update each adapter guide to point to the canonical interaction-routing contract.
- [x] Keep `Mandatory Start` ordering aligned with contract, manifest, capabilities, active extensions, then instruction file execution.
- [x] Ensure adapters remain guidance-only and do not become alternate execution specs.

### 2. Add shared examples
- [x] Add consistent examples for prompts such as `go ahead`, `continue`, `plan this`, and `what's next?`.
- [x] Document when an adapter should ask for clarification instead of guessing.
- [x] Keep examples capability-aware without changing semantic meaning.

### 3. Protect the boundary
- [x] Verify bundled adapter docs do not carry private or tool-exclusive phrase maps.
- [x] Add documentation checks or review rules that keep adapter language synchronized.
- [x] Keep Codex and future adapters as thin wrappers over the same routing contract.

## Success Criteria
- [x] Bundled adapters describe the same routing behavior.
- [x] Adapter docs remain documentation-only.
- [x] Ambiguous prompts are handled consistently across guides.

## Execution Notes
- Updated bundled adapter guides in both `neuroplast/adapters/` and `src/adapters/` to carry the same interaction-routing guidance.
- Added consistent shared examples for `go ahead`, `continue`, `plan this`, and `what's next?`.
- Added clarification guidance so adapters document when to stop guessing and ask a question.
- Updated shared adapter guidance docs so future adapters remain thin wrappers over the same routing contract.

## Risks
- Example phrasing may drift even when the underlying rule is shared.
- Environment-specific conveniences may tempt adapters to fork the routing model.

## Related Files
- `neuroplast/adapters/README.md`
- `neuroplast/adapters/`
- `src/adapters/`
- [[learning/adapters-should-explicitly-separate-guidance-from-execution.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
