# Neuroplast Claude Code Bootstrap

Use this file as a copy/paste-ready Claude Code project instruction asset.

## Mandatory Startup Sequence
Before executing any request in this repository:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`.
2. Read `neuroplast/manifest.yaml`.
3. Read `neuroplast/capabilities.yaml`.
4. Read `neuroplast/interaction-routing.yaml`.
5. Read any active workflow extensions declared in `neuroplast/manifest.yaml`.

## Routing Expectations
- Follow the canonical short-prompt routing in `neuroplast/interaction-routing.yaml`.
- `go ahead` / `continue` route to `neuroplast/act.md` only when a bounded active plan already exists; otherwise clarify.
- When a prompt is ambiguous after checking repository context, ask a clarifying question instead of guessing.

## Working Rules
- Treat the Neuroplast filesystem contract as authoritative.
- Use the appropriate instruction file for the current step.
- Keep changes non-destructive and write outputs only to documented Neuroplast locations.
- Maintain plans, changelog entries, and learning notes so work remains resumable.
