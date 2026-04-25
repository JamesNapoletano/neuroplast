# Neuroplast Bootstrap

Use this shared startup contract when adapting Neuroplast to a specific AI tool.

## Mandatory Startup Sequence
1. Read `neuroplast/WORKFLOW_CONTRACT.md`.
2. Read `neuroplast/manifest.yaml`.
3. Read `neuroplast/capabilities.yaml`.
4. Read `neuroplast/interaction-routing.yaml`.
5. If `neuroplast/manifest.yaml` declares active workflow extensions, read the matching files under `neuroplast/extensions/` and `neuroplast/local-extensions/`.
6. Resolve the current instruction from an explicit file request, explicit step request, or canonical routed phrase.

## Canonical Routing Rules
- Prefer explicit instruction-file requests or explicit step names when possible.
- If the repository defines shared interaction-routing rules, use them before interpreting short prompts.
- `go ahead` / `continue` / `do it` / `proceed` / `carry on` -> continue with `neuroplast/act.md` only when a bounded active objective already exists; otherwise ask for clarification.
- `plan this` / `conceptualize this` / `reframe this` / `plan this from scratch` / `new initiative` / `start fresh` -> use `neuroplast/conceptualize.md` when the work is new, ambiguous, or materially reframed.
- `what's next?` / `where were we?` / `what is the plan?` / `show me the next step` -> inspect the current plan and summarize the next bounded step instead of executing automatically.
- When short-prompt meaning is still unclear after checking repository context, clarify instead of guessing.

## Execution Rules
- Treat the filesystem contract as the source of truth.
- Use `neuroplast/act.md` as the normal entrypoint once sufficient context exists.
- Use `neuroplast/reverse-engineering.md` when an existing codebase needs project-mind reconstruction.
- Use `neuroplast/reconcile-conflicts.md` when merge conflicts or competing edits need preservation-first reconciliation.
- Keep updates non-destructive and write outputs only to the documented Neuroplast locations.
- Keep plans, changelog entries, and learning notes current so sessions remain resumable across tools.
