# Current Context

This file is an optional compact briefing capsule for the repository's current state.

It is auto-refreshed by `neuroplast sync` when it still matches the managed baseline. Local edits are preserved.

## Boundary
- This file is advisory, not canonical.
- `plans/`, `project-concept/`, `project-concept/changelog/`, `learning/`, and `ARCHITECTURE.md` remain the durable source of truth.
- If you want to keep custom notes here, edit the file directly; future sync runs will preserve your version instead of overwriting it.

## Advisory Bootstrap Modes
- **lean** — load the mandatory startup contract, then `current-context.md`, the active plan, and the current step file.
- **standard** — use `lean`, then add `ARCHITECTURE.md` plus the most relevant concept note or recent changelog entry.
- **deep** — use `standard`, then add broader concept, learning, and adjacent plan context for reframing or higher-risk work.

## Current Snapshot
- **Active plan:** `neuroplast/plans/context-efficiency-and-success-reliability.md`
- **Active plan source:** pointer
- **Objective:** Define a bounded Neuroplast improvement track that lowers startup token cost and makes planner/orchestrator outputs more consistently successful without changing the filesystem-first contract.
- **Next bounded step:** - [x] Capture the initiative as a durable plan and concept note instead of leaving it only in conversation state.
- **Blockers:** None recorded.
- **Verification:** The initiative is captured in /neuroplast/plans/ with explicit scope, assumptions, and non-goals. | A matching concept artifact records why this direction matters to Neuroplast.

## Route-Aware Reading Hints
- **act** -> use `lean` context depth and emphasize objective, next bounded step, blockers, verification.
- **inspect-current-plan** -> use `standard` context depth and emphasize objective, next bounded step, blockers, related files.
- **conceptualize** -> use `deep` context depth and emphasize objective, scope assumptions, related files, recent context.

## Relevant Files
- `neuroplast/plans/context-efficiency-and-success-reliability.md`
- `project-concept/context-efficiency-and-success-reliability.md`
- `neuroplast/project-concept/changelog/2026-05-07.md`
- `ARCHITECTURE.md`

## Refresh Sources
- The active plan pointer in `neuroplast/plans/.active-plan` is used when present; otherwise the newest plan in `neuroplast/plans/` is used.
- Related concept context is taken from the active plan when it links to a `project-concept/` note.
- The newest changelog entry under `neuroplast/project-concept/changelog/` provides recent completed-context continuity.
- `ARCHITECTURE.md` remains the canonical architecture anchor for any deeper context load.
