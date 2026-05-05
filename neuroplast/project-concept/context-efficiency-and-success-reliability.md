# Context Efficiency And Success Reliability
#project-concept

## Overview
Define a focused Neuroplast improvement direction that makes startup context cheaper to load and execution outputs easier to trust without changing the canonical filesystem-first workflow contract.

## Problem Statement
Neuroplast already preserves durable project memory well, but common execution loops still tend to reload many artifacts to rediscover the current objective, next step, and relevant files. That increases token use and can make outputs feel more variable than they need to be.

## Direction
Improve Neuroplast by compressing current-state context rather than reducing durable memory. The durable artifacts should remain the source of truth, while lighter-weight briefing artifacts and loading rules make everyday execution cheaper and more reliable.

## Candidate Refinements
- **Adaptive bootstrap modes** so common `act` flows can load a smaller subset of project-mind artifacts than deeper conceptualization work.
- **Briefing capsule artifact** that summarizes the active objective, next step, blockers, verification expectations, and key files.
- **Routing-aware context loading** that changes the default read set based on whether the request maps to `act`, `conceptualize`, or plan inspection.
- **Success-oriented output structure** that makes planner/orchestrator responses more uniform about scope, assumptions, next action, and verification.
- **Context-budget hygiene checks** that identify stale, oversized, or duplicative active-context artifacts before they become expensive noise.

## Constraints
- Keep the canonical contract model-agnostic and free of provider-tuning metadata.
- Preserve `/neuroplast/` files as the durable shared-memory surface.
- Prefer additive guidance and validation over workflow-phase expansion.
- Avoid turning compact summaries into a hidden second contract.

## Why This Matters
- Lower startup context cost makes Neuroplast more practical in constrained environments.
- Clearer current-state artifacts improve resume reliability across interrupted sessions and thin agents.
- More consistent response structure improves operator trust without forcing one provider or tool.

## First Implemented Slice
- Neuroplast now ships an optional `current-context.md` briefing template as an installed managed file.
- Installed guidance and shared bootstrap assets now describe advisory `lean`, `standard`, and `deep` context depths layered on top of the mandatory startup contract.
- Validation now includes a lightweight advisory size-budget check for `current-context.md` so the briefing capsule stays compact.

## Auto-Refresh Direction
- `sync` can now refresh `current-context.md` from the latest plan and nearby durable artifacts when the file still matches the managed baseline.
- Local edits convert the file into a preserved custom briefing instead of being overwritten.

## Stale-Context Direction
- `validate` now warns when `current-context.md` is older than the latest plan or changelog inputs that should inform it.
- The stale check is advisory so operators can choose between rerunning `sync` or maintaining a custom preserved briefing manually.

## Route-Aware Context Direction
- `route` now returns additive context-depth and briefing-emphasis recommendations based on the resolved intent.
- The generated briefing capsule now includes route-aware reading hints so humans and wrappers know what to emphasize for `act`, `inspect-current-plan`, and `conceptualize` flows.

## Active-Plan Selection Direction
- Neuroplast now supports an explicit `neuroplast/plans/.active-plan` pointer so route resolution and briefing generation can use the intended active plan directly.
- Newest-file fallback remains available when the pointer is absent, preserving backward compatibility.

## Output-Contract Direction
- The first success-oriented output contract lives in adapter bootstrap assets and thin OpenCode agent guidance rather than the canonical workflow files.
- Planning responses now prefer a consistent shape around summary, scope, assumptions, plan, verification, blockers, and handoff.
- Execution responses now prefer a consistent shape around outcome, scope, verification, blockers, next step, and updated artifacts.

## Success Criteria
- The common path for bounded execution reads fewer artifacts than the deepest planning path.
- A future operator can answer “what are we doing now?” from one compact artifact plus the active plan.
- Compact artifacts and loading rules remain explicitly tied back to canonical files.
- Any structured response guidance improves consistency without redefining workflow phases.

## Related
- [[plans/context-efficiency-and-success-reliability.md]]
- [[project-concept/neuroplast-product-maturity-roadmap.md]]
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
- [[learning/project-mind-workflows-need-an-active-objective-and-durable-shared-memory.md]]
