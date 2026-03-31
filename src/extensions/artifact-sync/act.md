# Artifact-Sync Act Extension
#instruction

## Purpose
Prompt execution-time checks for documentation and artifact alignment alongside implementation work.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/act.md`

## Additional Steps
1. Read and follow `neuroplast/act.md` first.
2. When code or managed assets change user-facing behavior, identify which supporting artifacts also need updates (`README.md`, `ARCHITECTURE.md`, active plans, concept notes, or changelog files).
3. Treat those artifact updates as part of the implementation scope instead of post-hoc cleanup.

## Validation Checklist
- [ ] Behavior-changing work includes corresponding artifact updates or an explicit note that no artifact update was needed.
- [ ] Architecture-relevant changes are reflected in `ARCHITECTURE.md`.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
