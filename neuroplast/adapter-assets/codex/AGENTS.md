# Neuroplast Codex Bootstrap

Use this file as a copy/paste-ready Codex-style repository instruction asset.

## Startup Contract
Before executing any request in this repository:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`.
2. Read `neuroplast/manifest.yaml`.
3. Read `neuroplast/capabilities.yaml`.
4. Read `neuroplast/interaction-routing.yaml`.
5. Read any active workflow extensions declared in `neuroplast/manifest.yaml`.

## Shared Routing Behavior
- Follow the canonical routing rules in `neuroplast/interaction-routing.yaml`.
- `go ahead` / `continue` imply `neuroplast/act.md` only when a bounded active plan already exists; otherwise clarify.
- Prefer explicit instruction-file requests over inferred routing when possible.

## Execution Boundary
- Treat Neuroplast files as the project mind source of truth.
- Use `neuroplast/act.md` for normal bounded work, `neuroplast/conceptualize.md` for new or reframed work, `neuroplast/reverse-engineering.md` for code-grounded discovery, and `neuroplast/reconcile-conflicts.md` for conflict resolution.
- Keep all updates non-destructive and persist plans, changelog updates, and learnings in the designated Neuroplast folders.
