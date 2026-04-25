# OpenCode Planner Plan-Only Boundary
#plan

**Created:** 2026-04-24
**Related to:** [[plans/opencode-neuroplast-agents.md]]
**Changelog:** [[project-concept/changelog/2026-04-24.md]]

## Current Objective
- Restrict the OpenCode `neuroplast-planner` role so it stops at planning artifacts and never performs execution or implementation work.

## Scope
- Tighten the planner agent contract so its terminal state is a bounded plan returned without repository writes.
- Remove or narrow any planner guidance that currently implies implementation, execution, or direct handoff-in-place behavior.
- Align bundled OpenCode agent docs and related adapter guidance with a strict planner-orchestrator boundary.
- Preserve the orchestrator as the only OpenCode agent responsible for bounded execution.

## Non-Goals
- Do not change the canonical Neuroplast workflow phases.
- Do not move planning responsibilities into the orchestrator.
- Do not implement execution changes in this planning step.

## Assumptions
- The desired operating model is: planner returns a bounded plan without writing files, then the human explicitly switches to `neuroplast-orchestrator` for execution.
- The current planner asset is too permissive because it can read like a planning-first executor instead of a planning-only agent.
- OpenCode agent metadata and guidance should make this boundary obvious in both description and rules.

## Problem Framing
- The current `neuroplast-planner` asset says it should "create or refresh bounded plan state" and then "hand bounded execution back" to the orchestrator, but it does not explicitly forbid implementation strongly enough.
- Its declared tool surface currently includes terminal and file-writing capabilities that could be interpreted as allowing execution-oriented work.
- The conceptualization instruction also says to continue with `act.md` in the same agent session, which conflicts with the stricter OpenCode planner boundary requested here.

## Proposed Changes
1. Update the bundled OpenCode planner agent asset description so it explicitly states that the agent must stop after producing a usable plan.
2. Add an explicit rule that the planner must not implement, execute, or modify non-plan project artifacts as part of planner-mode work.
3. Clarify that planner outputs are limited to plan artifacts needed for handoff, plus any strictly planning-oriented context updates if required.
4. Review whether the planner tool list should be narrowed to reduce accidental execution capability, or whether the behavioral contract alone is sufficient.
5. Update any OpenCode guidance that currently implies the planner may continue directly into execution.
6. Resolve the conflict between the generic conceptualize guidance and the stricter OpenCode planner boundary, likely by clarifying that OpenCode planner mode ends with a handoff recommendation rather than same-session execution.

## Candidate Files
- `neuroplast/adapter-assets/opencode/agents/neuroplast-planner.md`
- `src/adapter-assets/opencode/agents/neuroplast-planner.md`
- `neuroplast/adapter-assets/opencode/agents/neuroplast-orchestrator.md`
- `src/adapter-assets/opencode/agents/neuroplast-orchestrator.md`
- `neuroplast/adapters/opencode.md`
- `src/adapters/opencode.md`
- Potentially `neuroplast/conceptualize.md` and `src/instructions/conceptualize.md` if the OpenCode-specific boundary needs a clearer carve-out

## Verification
- [x] The planner agent description explicitly says it ends with a plan and does not execute implementation work.
- [x] The planner rules explicitly forbid execution/implementation behavior.
- [x] OpenCode guidance tells the user to switch to `neuroplast-orchestrator` after planning.
- [x] No canonical workflow file is changed in a way that makes the planner a second workflow contract.
- [x] Any source/installed managed-file pairs remain aligned.

## Risks
- Over-tightening the planner may prevent legitimate planning-artifact updates if the boundary is phrased too broadly.
- Changing shared conceptualization wording without care could unintentionally affect non-OpenCode environments.
- Tool-surface changes alone may not be enough if the written behavior contract remains ambiguous.

## Open Decisions
- Planner terminal-command access, write access, and edit access were removed from the bundled OpenCode planner asset to enforce a strict read-only planning boundary.
- The core conceptualize instruction was left generic except for allowing planning-only wrappers or agents to end with a handoff recommendation instead of same-session execution.

## Execution Progress
- Updated both source and installed OpenCode planner agent assets to make the planner stop with a bounded plan and explicitly hand execution to `neuroplast-orchestrator`.
- Removed `bash`, `write`, and `edit` from the bundled OpenCode planner tool list as explicit boundary hardening.
- Updated source and installed OpenCode guidance to state that `neuroplast-planner` is strict read-only plan mode and `neuroplast-orchestrator` is the execution agent.
- Updated source and installed conceptualization instructions to allow planning-only wrappers or agents to end with a handoff recommendation rather than same-session execution.
- Updated cross-adapter concept and README text to document the explicit OpenCode planner/orchestrator split.

## Recommended Execution Order
1. Finalize the desired planner boundary language.
2. Update the planner agent asset and any mirrored source asset.
3. Update OpenCode guidance and any orchestrator wording that references planner handoff.
4. If needed, make a minimal clarifying change to conceptualization guidance without changing canonical workflow semantics.
5. Validate that the resulting docs describe a clean planner-then-orchestrator flow.

## Blockers
- None. Maintainer confirmed the strict read-only planner option.

## Handoff
- Once you approve this direction, switch to `neuroplast-orchestrator` to implement the boundary changes.
- The orchestrator should treat this file as the active bounded plan and avoid extending scope beyond planner/orchestrator boundary hardening.

## Related
- [[plans/opencode-neuroplast-agents.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
