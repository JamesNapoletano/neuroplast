# VS Code + Copilot Guide

## Purpose
Explain how to use Neuroplast with VS Code and Copilot features without turning the workflow into an editor-specific system.

## Support Status
- Verification status: **Documentation-only**
- Capability assumptions: file reads and writes are available; terminal access depends on local setup and extension usage.
- Evidence boundary: this guide is contract-aligned, but the terminal-only guide remains the canonical actively verified first-loop proof.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Mandatory Start
Before executing any Neuroplast workflow step in VS Code + Copilot:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`
2. Read `neuroplast/manifest.yaml`
3. Read `neuroplast/capabilities.yaml`
4. If `neuroplast/manifest.yaml` declares active workflow extensions, read the matching files under `neuroplast/extensions/` and `neuroplast/local-extensions/`
5. Then read and execute the relevant instruction file such as `neuroplast/conceptualize.md` or `neuroplast/act.md`

Prefer `neuroplast/act.md` for normal bounded work once enough project context exists. Use `neuroplast/conceptualize.md` when the project is new, ambiguous, or needs reframing.

## Workflow Entrypoint
Read the workflow contract, then any manifest-declared active workflow extensions, then the current instruction file before using editor assistance for work. Treat the files as the active project mind.

## Recommended Prompt
`Work within the Neuroplast project mind contract. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. Load current project state from files, keep updates non-destructive, preserve required artifact paths, and finish plan, changelog, and learning steps.`

## Usage Notes
- Use Copilot suggestions as implementation assistance, not as workflow authority.
- Keep required recordkeeping artifacts open while working to reduce drift.
- If terminal or multi-step features are limited, follow the fallback rules from `capabilities.yaml`.

## Known Limitations
- Copilot interactions may be more code-centric than workflow-centric, so explicit prompt context helps.
- Manual discipline may be needed to complete plan and changelog maintenance.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
