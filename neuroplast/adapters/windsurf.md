# Windsurf Guide

## Purpose
Explain how to use Neuroplast in Windsurf while preserving the same canonical workflow structure.

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
5. Then read and execute the relevant instruction file such as `neuroplast/conceptualize.md` or `neuroplast/act.md`

## Workflow Entrypoint
Open the workflow contract first, then any manifest-declared active workflow extensions, then follow the current Neuroplast instruction file for the active phase.

## Recommended Prompt
`Use the Neuroplast workflow contract as the source of truth. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. Keep all changes within the documented file contract, avoid destructive overwrites, and complete plan, changelog, and learning updates.`

## Usage Notes
- Treat environment automation as helpful but secondary to the file contract.
- Keep project context persisted in Neuroplast files rather than depending only on conversation state.
- Apply graceful degradation rules when available tools do not match the ideal workflow.

## Known Limitations
- Runtime behavior may vary by account or environment mode.
- If tool access is partial, preserve continuity through plan updates and explicit blockers.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
