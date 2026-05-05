# Orchestrator Should Accept Planner Handoff Context
#plan

**Created:** 2026-04-25
**Objective:** Allow the OpenCode `neuroplast-orchestrator` to begin bounded execution from a usable planner handoff already present in the active conversation, while still persisting that handoff into `/neuroplast/plans/` before continuing execution.

## Scope
- Update bundled OpenCode orchestrator guidance to accept a bounded planner handoff from active conversation context.
- Clarify short-prompt routing and execute-act skill language so a same-session planner handoff counts as temporary active plan state.
- Update OpenCode adapter guidance so the planner-to-orchestrator handoff is practical and explicit.
- Keep durable plan-file discipline by requiring the orchestrator to persist the handoff before broader execution.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this is a managed guidance and adapter-behavior clarification only; existing installs can receive it through normal sync refresh without a content-transforming migration.

## Assumptions
- A bounded planner handoff in active conversation context is trustworthy enough to start execution in the same OpenCode session.
- The repository plan file is still required for continuity, but it can be created by the orchestrator as its first execution step.
- Clarification should only be required when neither a current plan file nor a bounded planner handoff exists.

## Tasks
- [x] Update source and installed OpenCode orchestrator assets.
- [x] Update source and installed OpenCode skill guidance for short-prompt routing and act execution.
- [x] Update OpenCode adapter guide language to describe the new handoff behavior.
- [x] Record architecture/changelog/learning updates.
- [ ] Run validation and tests.
- [x] Run validation and tests.

## Completed Work
- Updated both source and installed OpenCode orchestrator assets so they accept a same-session bounded planner handoff as valid execution input and persist it before broader implementation.
- Updated both source and installed OpenCode `neuroplast-route-short-prompts` and `neuroplast-execute-act` skills so the handoff behavior is consistent with the orchestrator guidance.
- Updated both source and installed OpenCode environment guidance to explain that the planner returns a conversational handoff and the orchestrator persists it during execution startup.
- Updated `ARCHITECTURE.md`, cross-adapter interaction-routing concept notes, a new daily changelog entry, and a reusable learning note to capture the contract clarification.

## Verification
- The orchestrator docs explicitly allow a bounded planner handoff from active conversation context.
- The orchestrator docs require persisting that handoff to `/neuroplast/plans/` before broader execution.
- Short-prompt routing guidance no longer implies clarification is required when same-session bounded planner handoff context exists.
- `npm run validate` passes.
- `npm test` passes.

## Handoff Notes
- Keep the planner read-only boundary intact; only the orchestrator should persist the plan and execute it.

## Verification Results
- `npm run validate` -> 94 checks, 0 warnings, 0 errors
- `npm test` -> 35 passing, 0 failing
