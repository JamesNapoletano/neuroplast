# OpenCode Planner Automatic Safety Lock
#plan

**Created:** 2026-05-07
**Related to:** [[plans/opencode-planner-plan-only-boundary.md]]
**Changelog:** [[project-concept/changelog/2026-05-07.md]]

## Current Objective
- Ensure the bundled OpenCode `neuroplast-planner` asset enforces an always-on, automatic read-only safety lock so planner mode cannot execute or edit files.

## Scope
- Update `src/adapter-assets/opencode/agents/neuroplast-planner.md` to make strict planner safety behavior explicit and always-on.
- Keep execution ownership with `neuroplast-orchestrator`.
- Preserve canonical Neuroplast workflow semantics.

## Non-Goals
- No changes to canonical workflow phase definitions.
- No expansion of planner tool permissions.
- No execution behavior changes outside the planner asset contract.

## Assumptions
- Planner reliability is improved by explicit non-negotiable boundary language.
- Existing orchestrator guidance already covers execution ownership.

## Sync Impact
- **Decision:** no migration needed
- **Reason:** The change updates a managed adapter-asset document and does not require transforming existing repository data structures.

## Execution Steps
1. - [x] Read required Neuroplast contract and act-phase instruction files for this cycle.
2. - [x] Update the source OpenCode planner asset with an always-on safety lock section and stricter boundary language.
3. - [x] Confirm planner handoff wording still routes execution to `neuroplast-orchestrator`.
4. - [x] Run repository validation checks relevant to this documentation/asset update.
5. - [x] Record changelog and learning updates for this cycle.

## Verification
- `npm run validate` (pass)

## Blockers
- None.

## Handoff
- Continue using `neuroplast-planner` for planning-only output and switch to `neuroplast-orchestrator` for all implementation steps.

## Related
- [[plans/opencode-planner-plan-only-boundary.md]]
- [[learning/planner-safety-locks-should-be-always-on-and-attested.md]]
- [[plans/patch-release-1.3.3.md]]
