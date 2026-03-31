# Verification-First Extension

## Purpose
Add reusable guidance that keeps planning and execution anchored to explicit verification criteria before work is treated as complete.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Activation
Declare `verification-first` in `extensions.active_bundled` inside `neuroplast/manifest.yaml`.

## Step Coverage
- `PLANNING_INSTRUCTIONS.md`
- `act.md`
- `CHANGELOG_INSTRUCTIONS.md`

## Use When
- You want implementation plans to include verification up front.
- You want execution to name the exact checks that prove work is done.
- You want changelog entries to mention the verification performed for user-facing or contract-relevant changes.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
