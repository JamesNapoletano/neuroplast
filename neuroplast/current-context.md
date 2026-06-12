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
- **Active plan:** `neuroplast/plans/neuroplast-first-party-harness.md`
- **Active plan source:** pointer
- **Objective:** Persist a durable Neuroplast direction for a first-party harness that can replace adapter-dependent execution surfaces with a Neuroplast-owned runtime and VS Code extension strategy.
- **Next bounded step:** Plan the first implementation slice for sidecar capability enforcement, reservation lifecycle management, live sync publishing, and extension UX for presence and approvals.
- **Blockers:** None recorded.
- **Verification:** A bounded plan and matching concept note exist for the harness direction. | The harness concept now includes an initial capability manifest shape plus reservation and collaboration policy guidance. | `npm run validate` completed after the capability/collaboration update with no errors.
- **Most recent completed cycle (2026-06-10):** Documented the file-based Claude Code integration path (root `CLAUDE.md`), added the install-location section to `src/adapters/claude-code.md`, re-synced the installed copy, and wired this repo with a root `CLAUDE.md`. See `neuroplast/plans/claude-code-desktop-adapter-bootstrap.md`.

## Route-Aware Reading Hints
- **act** -> use `lean` context depth and emphasize objective, next bounded step, blockers, verification.
- **inspect-current-plan** -> use `standard` context depth and emphasize objective, next bounded step, blockers, related files.
- **conceptualize** -> use `deep` context depth and emphasize objective, scope assumptions, related files, recent context.

## Relevant Files
- `neuroplast/plans/neuroplast-first-party-harness.md`
- `project-concept/neuroplast-first-party-harness.md`
- `neuroplast/project-concept/changelog/2026-06-10.md`
- `ARCHITECTURE.md`

## Refresh Sources
- The active plan pointer in `neuroplast/plans/.active-plan` is used when present; otherwise the newest plan in `neuroplast/plans/` is used.
- Related concept context is taken from the active plan when it links to a `project-concept/` note.
- The newest changelog entry under `neuroplast/project-concept/changelog/` provides recent completed-context continuity.
- `ARCHITECTURE.md` remains the canonical architecture anchor for any deeper context load.
