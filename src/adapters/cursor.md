# Cursor Guide

## Purpose
Explain how to use Neuroplast in Cursor without introducing a Cursor-specific fork of the workflow.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Mandatory Start
Before executing any Neuroplast workflow step in Cursor:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`
2. Read `neuroplast/manifest.yaml`
3. Read `neuroplast/capabilities.yaml`
4. If `neuroplast/manifest.yaml` declares active workflow extensions, read the matching files under `neuroplast/extensions/` and `neuroplast/local-extensions/`
5. Then read and execute the relevant instruction file such as `neuroplast/conceptualize.md` or `neuroplast/act.md`

## Workflow Entrypoint
Begin from the workflow contract, then any manifest-declared active workflow extensions, then open the current instruction file for the active step.

## Recommended Prompt
`Follow the Neuroplast workflow from files only. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. Keep behavior aligned with the documented folder contract, write only to approved locations, and preserve changelog and learning updates.`

## Usage Notes
- Treat agent/chat behavior as a convenience layer over the file contract.
- Keep artifact names and paths exactly aligned with Neuroplast conventions.
- Use environment capability notes if Cursor tooling is limited in a given context.

## Known Limitations
- Editor-centric workflows can encourage ad hoc file changes, so keep the active plan visible while working.
- If automation features skip required recordkeeping, return to the contract and finish plan/changelog/learning steps manually.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
