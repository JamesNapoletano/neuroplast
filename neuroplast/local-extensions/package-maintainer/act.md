# Package Maintainer Act Extension
#instruction

## Purpose
Add maintainer-only execution checks when changing Neuroplast package behavior or managed workflow assets.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/act.md`

## Additional Steps
1. Read and follow `neuroplast/act.md` first.
2. If the work changes managed Neuroplast assets (for example files under `src/instructions/`, `src/adapters/`, `src/extensions/`, `src/obsidian/`, `src/migrations/`, or managed-file lists in the CLI), record a sync-impact decision in the active plan before implementation.
3. Allowed sync-impact decisions are `migration required` or `no migration needed`.
4. If the decision is `migration required`, add the migration in the same execution cycle or stop and report the work as incomplete.

## Validation Checklist
- [ ] Managed-asset changes include a recorded sync-impact decision in the active plan.
- [ ] Migration-required changes include an implemented migration or a documented blocker.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
