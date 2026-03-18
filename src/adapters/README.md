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

## Shared Guide Template
Each guide should cover:
1. Purpose of the environment guide
2. Mandatory start sequence
3. How to load any active workflow extensions declared in `neuroplast/manifest.yaml`
4. Workflow entrypoint
5. Recommended prompt to start work
6. How to follow the Neuroplast contract in that environment
7. Known limitations and graceful degradation notes
8. Reminder that the guide is optional and non-authoritative
