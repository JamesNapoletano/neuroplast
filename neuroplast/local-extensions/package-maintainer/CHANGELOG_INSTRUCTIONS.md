# Package Maintainer Changelog Extension
#instruction

## Purpose
Add maintainer-only changelog checks for migration-worthy Neuroplast package changes.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/CHANGELOG_INSTRUCTIONS.md`

## Additional Steps
1. Read and follow `neuroplast/CHANGELOG_INSTRUCTIONS.md` first.
2. If current-cycle changes touch managed Neuroplast assets or sync behavior, verify whether a new migration was required and confirm the decision is recorded in the active plan.
3. If a new migration was added, mention it explicitly in the changelog summary.
4. If current-cycle changes affect user-facing behavior related to sync or managed assets, update `README.md` accordingly.

## Validation Checklist
- [ ] Migration-worthy managed-asset changes were checked and the decision is reflected in the active plan.
- [ ] New migrations are mentioned explicitly in the changelog summary.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
