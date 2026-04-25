# Interaction Routing Phase 1 - Canonical Contract
#plan

**Created:** 2026-04-18
**Related to:** [[project-concept/cross-adapter-interaction-routing.md]]
**Changelog:** [[project-concept/changelog/2026-04-18.md]]

## Overview
Define a portable, tool-agnostic interaction-routing contract so short operator prompts like `go ahead`, `continue`, and `what's next?` resolve to Neuroplast workflow intents without turning adapter guides into behavior forks.

## Dependencies
- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[project-concept/lcp-alignment-implementation-model.md]]
- [[plans/roadmap-phase-5-portability-proof.md]]

## Work Type
Docs and contract design only.

## Tasks

### 1. Define canonical intents
- [x] Define the initial shared intent set for interaction routing.
- [x] Clarify which phrases should map to `act`, `conceptualize`, plan inspection, or clarification.
- [x] Keep the routing layer additive to the existing workflow loop rather than redefining phases.

### 2. Define routing behavior
- [x] Document precedence between explicit file execution, explicit step names, and ambiguous natural-language prompts.
- [x] Define ambiguity handling rules when a prompt could map to more than one step.
- [x] Define fallback behavior when no safe routing decision exists.

### 3. Define boundary rules
- [x] State that adapter guides may reference the routing contract but must not redefine mappings.
- [x] State that extensions may add bounded phrase overlays without overriding canonical intent meanings.
- [x] Keep the filesystem contract and instruction files as the execution authority.

## Success Criteria
- [x] A single canonical routing model exists for common operator phrases.
- [x] The phase loop remains `conceptualize -> plan -> act -> changelog -> think -> repeat`.
- [x] The routing layer is documented as additive rather than a workflow replacement.

## Execution Notes
- Added `[[project-concept/interaction-routing-canonical-contract.md]]` as the phase-1 contract artifact.
- Defined a smallest useful shared intent set: `act`, `conceptualize`, `inspect-current-plan`, and `clarify`.
- Established resolution precedence: explicit file execution -> explicit step selection -> routed phrase -> clarification fallback.
- Bound `go ahead`-style prompts to `act` only when a bounded current objective already exists.

## Risks
- Natural-language scope can expand too quickly beyond the smallest useful intent set.
- A routing spec that is too vague will push behavior drift back into adapter docs.

## Related Files
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `.lcp/manifest.yaml`
- `.lcp/workflows/neuroplast-loop.yaml`
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-canonical-contract.md]]
