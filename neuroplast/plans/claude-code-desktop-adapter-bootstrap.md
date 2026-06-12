# Claude Code Desktop Adapter Bootstrap
#plan

**Created:** 2026-06-10
**Changelog:** [[project-concept/changelog/2026-06-10.md]]

## Current Objective
- Make Neuroplast usable from Claude Code Desktop by documenting and demonstrating the file-based bootstrap path (root `CLAUDE.md`), since integration is purely file-based with no plugin or MCP server.

## Scope
- Add an explicit "where the bootstrap file goes" install step to the Claude Code adapter guide so users learn that the shipped `CLAUDE.md` asset must be copied to the repository root to take effect.
- Land that change in the shippable source `src/adapters/claude-code.md`, not only the installed working copy.
- Re-sync the installed `neuroplast/adapters/claude-code.md` to match its source-of-truth (also fixing pre-existing src→installed drift).
- Wire this repository itself for the desktop app by depositing a root `CLAUDE.md` copied from the shipped bootstrap asset.

## Non-Goals
- Do not change canonical workflow phases, file paths, or artifact roles.
- Do not implement a plugin, MCP server, or any desktop-specific runtime; integration stays file-based.
- Do not promote the Claude Code adapter from "Documentation-only" to "Actively verified" (no separate verified proof path was run).

## Sync Impact Decision
- no migration needed

## Reason
- This cycle adds additive documentation to a managed adapter file (`src/adapters/claude-code.md`) and re-aligns the installed copy. Managed safe-refresh sync propagates additive doc updates to consumers whose copy is unchanged; no one-time migration behavior is required.

## Assumptions
- Claude Code Desktop runs the same agent as the terminal/IDE forms, so a root `CLAUDE.md` is the only integration surface needed.
- The installed `neuroplast/adapters/*` files are meant to mirror `src/adapters/*`; making the installed copy identical to source is alignment, not destructive loss.

## Execution Steps
1. - [x] Deposit a root `CLAUDE.md` in this repo copied from `src/adapter-assets/claude-code/CLAUDE.md` (verified byte-identical).
2. - [x] Add an "Installing the Bootstrap (Where the File Goes)" section to `src/adapters/claude-code.md`.
3. - [x] Re-sync `neuroplast/adapters/claude-code.md` to match the updated source.
4. - [x] Run concept-consistency check (ARCHITECTURE / project-concept) — see Verification.
5. - [x] Record the cycle in `neuroplast/project-concept/changelog/2026-06-10.md` with plan + previous-entry links.
6. - [x] Capture reusable learning about file-based integration docs needing an explicit install location.
7. - [x] Run `npx neuroplast validate`.

## Verification
- [x] `npx neuroplast validate` passes (0 errors).
- [x] Root `CLAUDE.md` is byte-identical to the shipped bootstrap asset.
- [x] `src/adapters/claude-code.md` and `neuroplast/adapters/claude-code.md` are identical after re-sync (no remaining drift).
- [x] Concept check: no `ARCHITECTURE.md` change needed — adding install guidance to an existing documentation-only adapter does not change architecture, structure, or artifact roles.
- [x] README check: no change needed — the Portability Support Matrix already lists Claude Code as Documentation-only; no new command, path, or status changed.

## Handoff
- Recommended next bounded step: if the desktop path is to graduate from "Documentation-only" to "Actively verified," run a real first-loop proof in Claude Code Desktop and record it as a separate verification cycle, then update the README Portability Support Matrix status.

## Related
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[learning/file-based-integration-docs-must-state-where-the-bootstrap-file-installs.md]]
- [[learning/environment-guides-should-document-usage-not-behavior.md]]
- [[learning/adapters-should-explicitly-separate-guidance-from-execution.md]]
