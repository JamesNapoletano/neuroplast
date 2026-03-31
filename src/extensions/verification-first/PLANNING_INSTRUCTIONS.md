# Verification-First Planning Extension
#instruction

## Purpose
Add explicit verification design to the planning step before execution begins.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/PLANNING_INSTRUCTIONS.md`

## Additional Steps
1. Define how the work will be verified before implementation starts.
2. List the exact commands, checks, or manual validation steps expected at the end of execution.
3. If a task changes contract-relevant behavior, include documentation verification in the plan scope.

## Validation Checklist
- [ ] The active plan includes explicit verification tasks or success checks.
- [ ] Verification scope matches the implementation scope.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
