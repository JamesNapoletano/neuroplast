# Orchestrators Should Persist Conversational Plan Handoffs Before Execution
#learning

## Insight
When a planner is intentionally read-only, the executor should be allowed to start from a usable same-session plan handoff in conversation context, but it should persist that handoff to repository plan files before broader execution.

## Reusable Practice
- Let planner-mode output stay conversational when the planner is explicitly non-writing.
- Allow the execution agent to treat that bounded handoff as temporary active plan state in the same session.
- Require the execution agent to write the active plan file before implementation so continuity survives session loss or agent switching.
- Clarify short-prompt routing so `go ahead` does not bounce the user unnecessarily when a bounded planner handoff is already available in context.

## Related
- [[plans/orchestrator-should-accept-planner-handoff-context.md]]
- [[learning/planning-only-agents-need-an-explicit-stop-boundary.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
