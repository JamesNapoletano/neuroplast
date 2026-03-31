# Neuroplast Environment Guides

These files explain how to apply the same Neuroplast workflow contract in different AI-assisted development environments.

## Rules
- These guides are documentation-only.
- They must not redefine workflow phases, file structure, or artifact roles.
- They must always defer to `neuroplast/WORKFLOW_CONTRACT.md` and `neuroplast/manifest.yaml`.
- They must also defer to `neuroplast/capabilities.yaml` when describing constrained-environment behavior.
- They should instruct the operator to read any manifest-declared active workflow extensions before executing a matching instruction file.
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
| Windsurf | Documentation-only | File reads and writes; runtime capabilities may vary by mode | Contract-aligned guide, not yet a separately verified proof path. |
| VS Code + Copilot | Documentation-only | File reads and writes; terminal availability depends on local setup | Contract-aligned guide, not yet a separately verified proof path. |

## Shared Guide Template
Each guide should cover:
1. Purpose of the environment guide
2. Support status and capability assumptions
2. Mandatory start sequence
3. How to load any active workflow extensions declared in `neuroplast/manifest.yaml`
4. Workflow entrypoint
5. Recommended prompt to start work
6. How to follow the Neuroplast contract in that environment
7. Known limitations and graceful degradation notes
8. Reminder that the guide is optional and non-authoritative
