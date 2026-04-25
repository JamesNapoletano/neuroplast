# Codex CLI Guide

## Purpose
Explain how to use Neuroplast with Codex-style CLI workflows without making the adapter the source of truth for routing or execution behavior.

## Support Status
- Verification status: **Documentation-only**
- Capability assumptions: file reads and writes are available; terminal access is usually available because this guide targets CLI-style usage.
- Evidence boundary: this guide is contract-aligned, but the terminal-only guide remains the canonical actively verified first-loop proof.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Mandatory Start
Before executing any Neuroplast workflow step in Codex-style CLI workflows:
1. Read `neuroplast/WORKFLOW_CONTRACT.md`
2. Read `neuroplast/manifest.yaml`
3. Read `neuroplast/capabilities.yaml`
4. If `neuroplast/manifest.yaml` declares active workflow extensions, read the matching files under `neuroplast/extensions/` and `neuroplast/local-extensions/`
5. Then read and execute the relevant instruction file such as `neuroplast/conceptualize.md` or `neuroplast/act.md`

Prefer `neuroplast/act.md` for normal bounded work once enough project context exists. Use `neuroplast/conceptualize.md` when the project is new, ambiguous, or needs reframing.

## Workflow Entrypoint
Start from the workflow contract, then any manifest-declared active workflow extensions, then the current instruction file. Treat the filesystem as the active project mind and use `neuroplast route` when deterministic short-prompt inspection is useful.

## Interaction Routing
- Prefer explicit instruction-file requests or explicit step names when possible.
- If the repository defines shared interaction-routing rules, use them before interpreting short prompts.
- Shared examples:
  - `go ahead` / `continue` -> continue with `neuroplast/act.md` only when a bounded active objective already exists; otherwise ask for clarification.
  - `plan this` / `reframe this` -> use `neuroplast/conceptualize.md` when the work is new, ambiguous, or materially reframed.
  - `what's next?` -> inspect the current plan and summarize the next bounded step instead of executing automatically.
- When short-prompt meaning is still unclear after checking repository context, clarify instead of guessing.

## Recommended Prompt
`Operate inside the Neuroplast project mind from files. Read neuroplast/WORKFLOW_CONTRACT.md, neuroplast/manifest.yaml, neuroplast/capabilities.yaml, any active workflow extensions declared in the manifest, and the current instruction file. If the repository defines shared interaction-routing rules, use them before interpreting short prompts. Load current project state from files, keep changes non-destructive, and record plan, changelog, and learning updates in the required locations.`

## Usage Notes
- Treat CLI-native convenience as secondary to the file contract.
- Use `npx neuroplast route "<phrase>" --json` when wrapper tooling needs deterministic phrase inspection.
- Keep plans and changelog entries current so CLI sessions remain resumable.

## Known Limitations
- This guide is documentation-only and is not yet a separately rerun proof path.
- Different Codex-style runtimes may vary in how they inject prompt context or expose local tools.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
