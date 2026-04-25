# Neuroplast Environment Guides

These files explain how to apply the same Neuroplast workflow contract in different AI-assisted development environments.

Copy/paste-ready operational assets live separately under `neuroplast/adapter-assets/` so the guides in this folder can remain documentation-only.

## Rules
- These guides are documentation-only.
- They must not redefine workflow phases, file structure, or artifact roles.
- They must always defer to `neuroplast/WORKFLOW_CONTRACT.md` and `neuroplast/manifest.yaml`.
- They must also defer to `neuroplast/capabilities.yaml` when describing constrained-environment behavior.
- They should instruct the operator to read any manifest-declared active workflow extensions before executing a matching instruction file.
- They should describe short-prompt routing with shared Neuroplast semantics rather than adapter-local assumptions.
- Environment-specific prompts and tips may improve usability, but they must not fork behavior.
- They must not override the Neuroplast workflow contract.

## Support Status Definitions
- **Actively verified**: maintainers rerun a documented first-loop workflow in that environment and confirm the canonical contract still works as described.
- **Documentation-only**: the guide is kept aligned with the canonical contract, but it is not yet maintained as an independently verified proof path.

## Current Support Matrix
| Environment | Status | Capability assumptions | Notes |
| --- | --- | --- | --- |
| Terminal-only | Actively verified | File reads, file writes, terminal commands | Canonical portability proof path and first-loop walkthrough. |
| OpenCode | Documentation-only | File reads and writes; terminal access may vary by runtime | Contract-aligned guide, not yet a separately verified proof path. |
| Claude Code | Documentation-only | File reads and writes; tool permissions may vary; terminal usually available | Contract-aligned guide, not yet a separately verified proof path. |
| Cursor | Documentation-only | File reads and writes; editor automation may vary | Contract-aligned guide, not yet a separately verified proof path. |
| Codex CLI | Documentation-only | File reads and writes; terminal access usually available | Thin wrapper over the same routing contract, but not yet maintained as a separately rerun proof path. |
| Windsurf | Documentation-only | File reads and writes; runtime capabilities may vary by mode | Contract-aligned guide, not yet a separately verified proof path. |
| VS Code + Copilot | Documentation-only | File reads and writes; terminal availability depends on local setup | Contract-aligned guide, not yet a separately verified proof path. |

## Shared Guide Template
Each guide should cover:
1. Purpose of the environment guide
2. Support status and capability assumptions
3. Mandatory start sequence
4. How to load any active workflow extensions declared in `neuroplast/manifest.yaml`
5. Workflow entrypoint
6. Shared interaction-routing guidance and examples
7. Recommended prompt to start work
8. How to follow the Neuroplast contract in that environment
9. Known limitations and graceful degradation notes
10. Reminder that the guide is optional and non-authoritative

## Shared Interaction Routing Expectations
- Prefer explicit instruction-file requests or explicit step names when possible.
- If the repository defines shared interaction-routing rules, use them before interpreting short prompts.
- Keep common prompt examples aligned across adapters:
  - `go ahead` / `continue` -> route to `neuroplast/act.md` only when a bounded active objective already exists; otherwise clarify.
  - `plan this` / `reframe this` -> route to `neuroplast/conceptualize.md` when the work is new, ambiguous, or materially reframed.
  - `what's next?` -> inspect the current plan and summarize the next bounded step instead of executing work automatically.
- Future adapters should remain thin wrappers over the same shared routing rules.
