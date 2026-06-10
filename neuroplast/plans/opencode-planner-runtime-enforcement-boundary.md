# OpenCode Planner Runtime Enforcement Boundary
#plan

**Created:** 2026-05-08
**Related to:** [[plans/opencode-planner-automatic-safety-lock.md]]

## Current Objective
- Harden the packaged OpenCode planner boundary so read-only planner mode is enforced more reliably even in mixed-agent or mid-session use.

## Scope
- Persist the current planner-runtime hardening direction as a bounded execution plan.
- Add validation that fails when bundled OpenCode planner assets drift from the strict read-only tool surface or lose required safety-lock language.
- Update shipped adapter assets and docs so they explicitly require runtime-side tool gating and fresh-session isolation for complete prevention.
- Preserve the orchestrator as the only execution-capable bundled OpenCode agent.

## Non-Goals
- Do not redefine canonical Neuroplast workflow phases.
- Do not claim that prompt text alone guarantees runtime enforcement.
- Do not implement OpenCode platform internals that do not exist in this repository.

## Assumptions
- The bundled `neuroplast-planner` prompt already states a strict read-only boundary, but that alone is insufficient when a host runtime leaks mutation-capable tools across agent switches.
- The strongest package-level improvement available in this repository is to make runtime enforcement expectations explicit and to validate that shipped planner assets remain locked to a read-only tool surface.

## Sync Impact
- **Decision:** no migration needed
- **Reason:** This work updates managed documentation, adapter assets, and validation logic without changing installed repository data structures.

## Execution Steps
1. - [x] Persist this bounded execution plan and make it the active plan for the cycle.
2. - [x] Add validation rules for the bundled OpenCode planner asset tool surface and required safety-lock language.
3. - [x] Add black-box tests covering the new validation behavior.
4. - [x] Update bundled OpenCode asset guidance to require runtime-side write-tool denial and fresh-session isolation for planner mode.
5. - [x] Update architecture/concept/changelog/learning artifacts to reflect the stronger planner-boundary stance.
6. - [x] Run `npm test` and `npm run validate`.

## Verification
- `npm test`
- `npm run validate`

## Blockers
- `neuroplast/current-context.md` is stale because `sync` skipped on the current package version and therefore did not refresh the briefing capsule from the new active plan.

## Execution Progress
- Added a bounded runtime-enforcement plan and made it the active plan for this cycle.
- Extended `validate` so the bundled OpenCode planner asset now fails if it enables mutation-capable tools or loses required safety-lock language.
- Added black-box validation tests covering planner tool-surface drift and safety-language drift.
- Updated bundled OpenCode planner/adaptor asset guidance to say explicit runtime tool gating and planner-session isolation are required for complete prevention.
- Updated architecture, concept, changelog, and learning artifacts to reflect the stronger runtime-enforcement stance.

## Handoff
- If future work adds an actual OpenCode wrapper/runtime layer, implement per-agent tool allowlists and session isolation there in addition to these packaged safeguards.

## Related
- [[plans/opencode-planner-automatic-safety-lock.md]]
- [[plans/opencode-planner-plan-only-boundary.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
