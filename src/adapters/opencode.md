# OpenCode Guide

## Purpose
Explain how to use Neuroplast in OpenCode without changing the canonical workflow contract.

## Support Status
- Verification status: **Documentation-only**
- Capability assumptions: file reads and writes are available; terminal access may vary by runtime.
- Evidence boundary: this guide is kept aligned with the contract, but the terminal-only guide remains the canonical actively verified first-loop proof.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Mandatory Start
Before executing any Neuroplast workflow step in OpenCode:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`
2. Read `neuroplast/manifest.yaml`
3. Read `neuroplast/capabilities.yaml`
4. If `neuroplast/manifest.yaml` declares active workflow extensions, read the matching files under `neuroplast/extensions/` and `neuroplast/local-extensions/`
5. Then read and execute the relevant instruction file such as `neuroplast/reverse-engineering.md`, `neuroplast/reconcile-conflicts.md`, `neuroplast/conceptualize.md`, or `neuroplast/act.md`

## Workflow Entrypoint
Start by reading `neuroplast/WORKFLOW_CONTRACT.md`, then any manifest-declared active workflow extensions, then follow the relevant instruction file for the current step. Treat the files as the active project mind.

Prefer `neuroplast/act.md` for normal bounded work once project context exists. Use `neuroplast/reverse-engineering.md` when an existing codebase needs code-grounded project-mind reconstruction before conceptualization. Use `neuroplast/reconcile-conflicts.md` when merge conflicts or competing edits need a preservation-first reconciliation pass. Use `neuroplast/conceptualize.md` when the project mind needs to be created or reframed.

## Recommended Prompt
`You are operating inside a Neuroplast project mind. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the relevant instruction file. Load the current project state from files, do bounded work, do not overwrite files unless explicitly instructed, and record plan, changelog, and learning updates in the designated Neuroplast folders.`

## Usage Notes
- Use the current instruction file as the immediate task contract.
- Use `neuroplast/capabilities.yaml` to adjust behavior if environment limits apply.
- Keep updates inside the canonical Neuroplast folders and root `ARCHITECTURE.md`.

## Known Limitations
- Tool availability may differ by runtime, so always confirm file-writing and terminal capabilities before assuming them.
- If execution is constrained, record blockers and fallback steps in the current plan.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
