# Terminal-Only Guide

## Purpose
Explain how to run Neuroplast in plain terminal-driven workflows where editor or agent features may be minimal.

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
5. Then read and execute the relevant instruction file such as `neuroplast/conceptualize.md` or `neuroplast/act.md`

## Workflow Entrypoint
Read the workflow contract, then any manifest-declared active workflow extensions, then the current instruction file directly from the filesystem, then work step by step through the required artifacts.

## Recommended Prompt
`Operate the Neuroplast workflow from files only. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. Use the filesystem contract as the source of truth, keep changes non-destructive, and record plan, changelog, and learning updates in the required locations.`

## Usage Notes
- Prefer smaller, explicit steps and persist progress often.
- Keep the current plan file updated before and after meaningful work.
- Use capability-driven fallback rules when context or tooling is limited.

## Known Limitations
- Terminal-only workflows may require more manual navigation and document tracking.
- If no agent memory exists, rely on plan files, changelog entries, and learning notes to preserve context.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
