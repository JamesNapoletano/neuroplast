# Terminal-Only Guide

## Purpose
Explain how to run Neuroplast in plain terminal-driven workflows where editor or agent features may be minimal.

## Support Status
- Verification status: **Actively verified**
- Capability assumptions: file reads, file writes, and terminal command execution are available.
- Evidence boundary: this is the canonical first-loop portability proof path for Neuroplast.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Mandatory Start
Before executing any Neuroplast workflow step in a terminal-only environment:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`
2. Read `neuroplast/manifest.yaml`
3. Read `neuroplast/capabilities.yaml`
4. If `neuroplast/manifest.yaml` declares active workflow extensions, read the matching files under `neuroplast/extensions/` and `neuroplast/local-extensions/`
5. Then read and execute the relevant instruction file such as `neuroplast/reverse-engineering.md`, `neuroplast/reconcile-conflicts.md`, `neuroplast/conceptualize.md`, or `neuroplast/act.md`

For normal day-to-day use, prefer `neuroplast/act.md` as the entrypoint once enough project context already exists. Use `neuroplast/reverse-engineering.md` when an existing codebase needs code-grounded project-mind reconstruction before conceptualization. Use `neuroplast/reconcile-conflicts.md` when merge conflicts or competing edits need a preservation-first reconciliation pass. Use `neuroplast/conceptualize.md` when the project is new, ambiguous, or needs reframing.

## Workflow Entrypoint
Read the workflow contract, then any manifest-declared active workflow extensions, then the current instruction file directly from the filesystem, then work step by step through the required artifacts.

## Interaction Routing
- Prefer explicit instruction-file requests or explicit step names when possible.
- If the repository defines shared interaction-routing rules, use them before interpreting short prompts.
- Shared examples:
  - `go ahead` / `continue` -> continue with `neuroplast/act.md` only when a bounded active objective already exists; otherwise ask for clarification.
  - `plan this` / `reframe this` -> use `neuroplast/conceptualize.md` when the work is new, ambiguous, or materially reframed.
  - `what's next?` -> inspect the current plan and summarize the next bounded step instead of executing automatically.
- When short-prompt meaning is still unclear after checking repository context, clarify instead of guessing.

## Verified First Loop
Use this sequence to prove the filesystem contract in a realistic consumer repository:

1. Run `npx neuroplast init` in the target repository.
2. Read `neuroplast/WORKFLOW_CONTRACT.md`, `neuroplast/manifest.yaml`, `neuroplast/capabilities.yaml`, and any active extension files declared in the manifest.
3. Create or confirm root `ARCHITECTURE.md`.
4. Add one project-context artifact under `neuroplast/project-concept/` and one active plan file under `neuroplast/plans/`.
5. Execute one bounded work step through `neuroplast/act.md`.
6. Run `npx neuroplast validate` to confirm the contract and metadata are still valid.
7. When Neuroplast is later updated, run `npx neuroplast sync` to apply package-managed refreshes while preserving local edits.

This path proves that the workflow stays usable from files and commands alone.

## Recommended Prompt
`Operate the Neuroplast project mind from files only. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. If the repository defines shared interaction-routing rules, use them before interpreting short prompts. Use the filesystem contract as the source of truth, load current project state from files, keep changes non-destructive, and record plan, changelog, and learning updates in the required locations.`

## Usage Notes
- Prefer smaller, explicit steps and persist progress often.
- Keep the current plan file updated before and after meaningful work.
- Use capability-driven fallback rules when context or tooling is limited.

## Known Limitations
- Terminal-only workflows may require more manual navigation and document tracking.
- If no agent memory exists, rely on plan files, changelog entries, and learning notes to preserve context.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
