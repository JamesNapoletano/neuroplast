# Verification-First Act Extension
#instruction

## Purpose
Keep execution anchored to the checks that will prove the work is complete.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/act.md`

## Additional Steps
1. Read and follow `neuroplast/act.md` first.
2. Before modifying files, confirm which tests, validation commands, or manual checks must pass.
3. After implementation, run or complete those checks before treating the task as done.
4. If a planned verification step cannot run, record the blocker and fallback evidence in the active plan.

## Validation Checklist
- [ ] Completion is backed by explicit verification, not assumption.
- [ ] Any skipped verification is documented with a reason and fallback evidence.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
