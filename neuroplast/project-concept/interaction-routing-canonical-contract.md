# Interaction Routing Canonical Contract
#project-concept

## Overview
Define the initial portable interaction-routing contract for Neuroplast so common operator prompts can resolve consistently without changing the canonical workflow phases or giving adapter guides execution authority.

## Scope
This contract defines the smallest useful shared routing layer for:
- explicit instruction-file execution requests
- explicit workflow-step requests
- short natural-language prompts that imply `act`, `conceptualize`, plan inspection, or clarification

This contract is additive to the existing workflow contract and does not replace `neuroplast/act.md`, `neuroplast/conceptualize.md`, or the canonical phase loop.

## Canonical Resolution Order
Resolve operator intent in this order:

1. **Explicit file or artifact execution**
   - If the operator explicitly names a canonical file or artifact path, execute that target first.
   - Examples: `Execute @neuroplast/act.md`, `run neuroplast/conceptualize.md`, `follow WORKFLOW_CONTRACT.md`.

2. **Explicit canonical step selection**
   - If the operator explicitly names a canonical workflow step, route to that step.
   - Examples: `act`, `conceptualize this`, `run the act step`, `start with conceptualize`.

3. **Canonical natural-language phrase routing**
   - If the operator uses a recognized short phrase, map it to the canonical routed intent rules below.

4. **Clarification fallback**
   - If no safe routing decision exists, ask for clarification rather than guessing.

## Initial Shared Intent Set

### 1. `act`
Use for the next bounded implementation or execution step when the project mind already exists and the current objective is sufficiently clear.

Common phrase class:
- `go ahead`
- `continue`
- `do it`
- `proceed`
- `carry on`

Route to `act` only when:
- project context already exists
- the current objective is active, bounded, and understandable from repository state plus the current request

Do **not** silently route to `act` when the operator has not established what should happen next.

### 2. `conceptualize`
Use when the work is new, ambiguous, materially reframed, or missing durable project-mind context.

Common phrase class:
- `plan this`
- `conceptualize this`
- `reframe this`
- `plan this from scratch`
- `new initiative`
- `start fresh`

Route to `conceptualize` when:
- the operator explicitly asks for reframing or fresh planning
- the request is materially new or ambiguous enough that bounded execution would be unsafe

### 3. `inspect-current-plan`
Use when the operator is asking for orientation, next-step recall, or current-state inspection rather than immediate implementation.

Common phrase class:
- `what's next?`
- `where were we?`
- `what is the plan?`
- `show me the next step`

Expected behavior:
- inspect the current plan and relevant project-mind artifacts
- summarize the current objective, next bounded step, blockers, and likely execution target
- do not automatically treat inspection prompts as permission to execute work

### 4. `clarify`
Use when routing is unsafe because the request is underspecified, conflicting, or unsupported by the current project state.

Examples:
- `go ahead` with no active objective
- `continue` after a context switch that changed the likely target
- prompts that could reasonably mean either `act` or `conceptualize`

Expected behavior:
- ask the smallest useful clarification question
- prefer clarifying the target step or scope over broad re-interviewing

## Canonical Routing Rules
- Explicit file references outrank every inferred shortcut.
- Explicit canonical step names outrank natural-language aliases.
- `go ahead`-style phrases imply `act` only when there is an active bounded target.
- Inspection prompts imply plan reading and summarization, not execution permission.
- When ambiguity remains after checking repository context, choose `clarify` instead of guessing.

## Boundary Rules
- `neuroplast/WORKFLOW_CONTRACT.md`, `neuroplast/manifest.yaml`, `neuroplast/capabilities.yaml`, active step-matched extensions, and canonical instruction files remain the execution authority.
- Adapter guides may explain this routing contract, but they must not redefine canonical phrase meanings.
- Extensions may add bounded phrase overlays or repo-local examples, but they must not override canonical routed meanings for shared phrases like `go ahead`.
- This contract does not create new workflow phases; it only selects how the existing workflow should be entered.

## Examples
- `Execute @neuroplast/act.md` -> explicit file execution -> `act`
- `use conceptualize.md for this` -> explicit file execution -> `conceptualize`
- `go ahead` after an approved bounded plan exists -> routed phrase -> `act`
- `go ahead` with no clear next target -> fallback -> `clarify`
- `what's next?` -> routed phrase -> `inspect-current-plan`
- `this needs a reframe first` -> routed phrase -> `conceptualize`

## Success Criteria
- Shared phrases resolve by the same precedence rules across adapters.
- The routing contract stays smaller than the workflow contract it depends on.
- Ambiguous short prompts do not force silent execution guesses.

## Related
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-metadata-shape.md]]
- [[plans/interaction-routing-phase-1-canonical-contract.md]]
- [[learning/portable-interaction-routing-needs-a-shared-intent-contract.md]]
