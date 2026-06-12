# Claude Code Guide

## Purpose
Explain how to use Neuroplast in Claude Code while keeping the workflow contract authoritative.

## Support Status
- Verification status: **Documentation-only**
- Capability assumptions: file reads and writes are available; tool permissions may vary; terminal access is often available but must be confirmed.
- Evidence boundary: this guide is contract-aligned, but the terminal-only guide remains the canonical actively verified first-loop proof.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Mandatory Start
Before executing any Neuroplast workflow step in Claude Code:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`
2. Read `neuroplast/manifest.yaml`
3. Read `neuroplast/capabilities.yaml`
4. If `neuroplast/manifest.yaml` declares active workflow extensions, read the matching files under `neuroplast/extensions/` and `neuroplast/local-extensions/`
5. Then read and execute the relevant instruction file such as `neuroplast/reverse-engineering.md`, `neuroplast/reconcile-conflicts.md`, `neuroplast/conceptualize.md`, or `neuroplast/act.md`

Prefer `neuroplast/act.md` for normal bounded work once enough project context exists. Use `neuroplast/reverse-engineering.md` when an existing codebase needs code-grounded project-mind reconstruction before conceptualization. Use `neuroplast/reconcile-conflicts.md` when merge conflicts or competing edits need a preservation-first reconciliation pass. Use `neuroplast/conceptualize.md` when the project is new, ambiguous, or needs reframing.

## Installing the Bootstrap (Where the File Goes)
Neuroplast ships no plugin or MCP server for Claude Code. Integration is purely file-based: Claude Code (terminal app, desktop app, and IDE extension alike) auto-loads a `CLAUDE.md` from the project root at the start of every session. To wire a repository:
1. Open the target repository as the Claude Code working directory.
2. Copy the shipped bootstrap asset to the repository root as `CLAUDE.md`:
   - macOS/Linux: `cp neuroplast/adapter-assets/claude-code/CLAUDE.md ./CLAUDE.md`
   - Windows (PowerShell): `Copy-Item neuroplast\adapter-assets\claude-code\CLAUDE.md .\CLAUDE.md`
3. Start a session. The root `CLAUDE.md` directs Claude through the mandatory startup sequence above before any work.

The desktop app behaves the same as the terminal app because it runs the same agent; no desktop-specific setup is required beyond the root `CLAUDE.md`.

## Workflow Entrypoint
Read `neuroplast/WORKFLOW_CONTRACT.md`, then any manifest-declared active workflow extensions, then execute the current workflow step through the matching instruction file. Treat the repository files as the project mind, not just as a task checklist.

## Interaction Routing
- Prefer explicit instruction-file requests or explicit step names when possible.
- If the repository defines shared interaction-routing rules, use them before interpreting short prompts.
- Shared examples:
  - `go ahead` / `continue` -> continue with `neuroplast/act.md` only when a bounded active objective already exists; otherwise ask for clarification.
  - `plan this` / `reframe this` -> use `neuroplast/conceptualize.md` when the work is new, ambiguous, or materially reframed.
  - `what's next?` -> inspect the current plan and summarize the next bounded step instead of executing automatically.
- When short-prompt meaning is still unclear after checking repository context, clarify instead of guessing.

## Recommended Prompt
`Execute the Neuroplast project mind from files. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. If the repository defines shared interaction-routing rules, use them before interpreting short prompts. Load the current project state from files, keep updates non-destructive, and write outputs only to the documented Neuroplast locations.`

## Usage Notes
- Keep plans current in `neuroplast/plans/`.
- Use the changelog and learning steps as mandatory post-execution records, not optional suggestions.
- Use capability guidance to degrade gracefully when certain tools are unavailable.

## Known Limitations
- Session context can still drift during long runs, so persist important state in plans and changelog files.
- Tool permissions may vary, so verify them rather than assuming full execution access.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
