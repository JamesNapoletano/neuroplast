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

## Workflow Entrypoint
Read `neuroplast/WORKFLOW_CONTRACT.md`, then any manifest-declared active workflow extensions, then execute the current workflow step through the matching instruction file.

## Recommended Prompt
`Execute the Neuroplast workflow from files. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. Follow the contract exactly, keep updates non-destructive, and write outputs only to the documented Neuroplast locations.`

## Usage Notes
- Keep plans current in `neuroplast/plans/`.
- Use the changelog and learning steps as mandatory post-execution records, not optional suggestions.
- Use capability guidance to degrade gracefully when certain tools are unavailable.

## Known Limitations
- Session context can still drift during long runs, so persist important state in plans and changelog files.
- Tool permissions may vary, so verify them rather than assuming full execution access.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
