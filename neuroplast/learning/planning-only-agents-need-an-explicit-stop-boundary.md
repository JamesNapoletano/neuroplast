# Planning-Only Agents Need an Explicit Stop Boundary
#learning

## Insight
If a planning agent can sound like a lightweight executor, users and wrappers will eventually let it drift into implementation. Planning-only agents stay reliable when they explicitly stop at a handoff-ready plan and name the execution agent that should take over next.

## Reusable Practice
- State in the agent description that planning ends with a bounded plan, not implementation.
- Add a direct rule that the planner must not execute or validate the planned changes.
- If the environment supports separate planner and executor agents, name the executor explicitly in the planner handoff.
- Remove clearly execution-oriented capabilities when the tool surface would otherwise blur the boundary.
- If you need a truly non-executing planner, remove write and edit permissions too and treat the returned plan as chat output until an execution agent persists it.

## Related
- [[plans/opencode-planner-plan-only-boundary.md]]
- [[learning/opencode-should-use-thin-agents-to-invoke-shared-neuroplast-skills.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
