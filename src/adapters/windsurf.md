# Windsurf Guide

## Purpose
Explain how to use Neuroplast in Windsurf while preserving the same canonical workflow structure.

## Support Status
- Verification status: **Documentation-only**
- Capability assumptions: file reads and writes are available; runtime capabilities may vary by account, mode, or tool permissions.
- Evidence boundary: this guide is contract-aligned, but the terminal-only guide remains the canonical actively verified first-loop proof.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Mandatory Start
Before executing any Neuroplast workflow step in Windsurf:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`
2. Read `neuroplast/manifest.yaml`
3. Read `neuroplast/capabilities.yaml`
4. If `neuroplast/manifest.yaml` declares active workflow extensions, read the matching files under `neuroplast/extensions/` and `neuroplast/local-extensions/`
5. Then read and execute the relevant instruction file such as `neuroplast/reverse-engineering.md`, `neuroplast/reconcile-conflicts.md`, `neuroplast/conceptualize.md`, or `neuroplast/act.md`

Prefer `neuroplast/act.md` for normal bounded work once enough project context exists. Use `neuroplast/reverse-engineering.md` when an existing codebase needs code-grounded project-mind reconstruction before conceptualization. Use `neuroplast/reconcile-conflicts.md` when merge conflicts or competing edits need a preservation-first reconciliation pass. Use `neuroplast/conceptualize.md` when the project is new, ambiguous, or needs reframing.

## Workflow Entrypoint
Open the workflow contract first, then any manifest-declared active workflow extensions, then follow the current Neuroplast instruction file for the active phase. Treat the files as the active project mind.

## Interaction Routing
- Prefer explicit instruction-file requests or explicit step names when possible.
- If the repository defines shared interaction-routing rules, use them before interpreting short prompts.
- Shared examples:
  - `go ahead` / `continue` -> continue with `neuroplast/act.md` only when a bounded active objective already exists; otherwise ask for clarification.
  - `plan this` / `reframe this` -> use `neuroplast/conceptualize.md` when the work is new, ambiguous, or materially reframed.
  - `what's next?` -> inspect the current plan and summarize the next bounded step instead of executing automatically.
- When short-prompt meaning is still unclear after checking repository context, clarify instead of guessing.

## Recommended Prompt
`Use the Neuroplast project mind contract as the source of truth. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. If the repository defines shared interaction-routing rules, use them before interpreting short prompts. Load current project state from files, keep all changes within the documented file contract, avoid destructive overwrites, and complete plan, changelog, and learning updates.`

## Usage Notes
- Treat environment automation as helpful but secondary to the file contract.
- Keep project context persisted in Neuroplast files rather than depending only on conversation state.
- Apply graceful degradation rules when available tools do not match the ideal workflow.

## Known Limitations
- Runtime behavior may vary by account or environment mode.
- If tool access is partial, preserve continuity through plan updates and explicit blockers.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
