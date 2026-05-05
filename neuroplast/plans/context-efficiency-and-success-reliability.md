# Context Efficiency And Success Reliability
#plan

**Created:** 2026-04-25
**Related to:** [[project-concept/context-efficiency-and-success-reliability.md]]
**Changelog:** [[project-concept/changelog/2026-04-25.md]]

## Current Objective
- Define a bounded Neuroplast improvement track that lowers startup token cost and makes planner/orchestrator outputs more consistently successful without changing the filesystem-first contract.

## Scope
- Specify adaptive bootstrap modes such as `lean`, `standard`, and `deep` for different execution intents.
- Specify a compact briefing capsule artifact that summarizes the current objective, next step, blockers, and relevant files.
- Define routing-aware context-loading guidance so `act`, `conceptualize`, and plan-inspection flows load different context depths.
- Evaluate a lightweight success-oriented output contract for planner/orchestrator responses.
- Add a minimal validation direction for stale, oversized, or duplicative active-context artifacts.

## Non-Goals
- Do not add provider-specific tuning fields such as token budgets, model names, or temperature to canonical Neuroplast metadata.
- Do not replace the canonical contract, plans, changelog, or learning artifacts with generated summaries.
- Do not expand Neuroplast into cloud telemetry, runtime orchestration, or adapter-specific behavior control.

## Assumptions
- Neuroplast should stay filesystem-first and model-agnostic.
- Context compaction should be additive and advisory rather than a second source of truth.
- The narrow CLI boundary is still preferred unless a later implementation slice proves a CLI seam is necessary.

## Sync Impact
- **Decision:** no migration needed
- **Reason:** this execution pass adds a new managed briefing artifact plus additive documentation and validation behavior, but existing installs can receive it through normal `sync` refreshes without a content-transforming migration.

## Execution Steps
1. - [x] Capture the initiative as a durable plan and concept note instead of leaving it only in conversation state.
2. - [x] Design the briefing capsule artifact shape, status rules, and canonical/advisory boundary.
3. - [x] Design adaptive bootstrap loading modes that preserve the mandatory contract while reducing common-case context load.
4. - [x] Define routing-aware context-loading guidance for `act`, `conceptualize`, and plan-inspection flows.
5. - [x] Decide whether success-oriented output structure belongs in instructions, adapter assets, CLI reporting, or a combination.
6. - [x] Add at least one validation or maintenance rule for stale or oversized active-context artifacts.
7. - [x] Update package docs and architecture docs for the new managed briefing artifact and advisory context-depth guidance.
8. - [x] Run validation and any implementation-relevant verification commands during the first concrete implementation slice.

## Verification For This Cycle
- [x] The initiative is captured in `/neuroplast/plans/` with explicit scope, assumptions, and non-goals.
- [x] A matching concept artifact records why this direction matters to Neuroplast.
- [x] Daily changelog and learning artifacts record the new initiative.
- [x] `npm run validate` passes after the planning artifacts are written.

## Completed This Slice
- Added a managed `current-context.md` briefing template to the installed workflow file set and this repository's installed copy.
- Documented advisory `lean`, `standard`, and `deep` context depths in installed guidance and shared adapter bootstrap assets.
- Added a lightweight validation warning when `neuroplast/current-context.md` grows beyond the advisory size budget.
- Updated package architecture and concept docs so the new briefing artifact is treated as additive current-state compression rather than a second source of truth.
- Standardized a success-oriented response contract in shared bootstrap assets plus bundled OpenCode planner/orchestrator guidance.
- Added automatic `current-context.md` refresh behavior during `sync` when the file still matches its managed baseline.
- Added stale-context validation that warns when `current-context.md` is older than newer plan or changelog inputs.
- Added route-aware context recommendations so `route` can suggest context depth and the briefing can emphasize different fields by intent.
- Added explicit active-plan selection via `neuroplast/plans/.active-plan` so routing and briefing generation prefer a durable active-plan signal over newest-file heuristics.

## Output-Contract Decision
- **Decision:** start in adapter assets and thin agent guidance, not CLI reporting or canonical instruction files.
- **Reason:** response-shape consistency is primarily an agent-behavior concern, and additive adapter guidance can improve output quality without turning the core workflow contract into a provider-shaped response specification.

## Success Criteria
- Common `act` flows can load less context while preserving enough durable state to remain trustworthy.
- `what's next?` and resume-style flows can rely on compact current-state artifacts instead of rescanning many large files.
- Planner/orchestrator outputs become more uniform in scope, next-step clarity, and verification framing.
- Any compact artifacts remain additive to the existing contract and never become hidden adapter-only behavior.

## Risks
- A compact summary artifact can drift from canonical files if refresh rules are vague.
- Context-efficiency work can accidentally become provider-tuning unless kept at the workflow-behavior layer.
- More summary artifacts can increase maintenance burden if they are not clearly scoped to current-state compression.

## Handoff
- Recommended first implementation slice: specify the briefing capsule artifact, adaptive bootstrap mode behavior, and one validation rule for stale or oversized active-context artifacts.
- If implementation starts from conversational handoff again, persist the chosen slice here before broader execution work begins.

## Related
- [[project-concept/context-efficiency-and-success-reliability.md]]
- [[project-concept/neuroplast-product-maturity-roadmap.md]]
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
- [[plans/opencode-neuroplast-agents.md]]
- [[learning/project-mind-workflows-need-an-active-objective-and-durable-shared-memory.md]]
- [[learning/trust-oriented-cli-ux-should-add-remediation-and-structured-output-without-breaking-human-defaults.md]]
