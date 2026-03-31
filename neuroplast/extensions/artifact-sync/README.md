# Artifact-Sync Extension

## Purpose
Add reusable guidance that keeps implementation artifacts and user-facing documentation aligned when behavior, paths, or workflow expectations change.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Activation
Declare `artifact-sync` in `extensions.active_bundled` inside `neuroplast/manifest.yaml`.

## Step Coverage
- `act.md`
- `CHANGELOG_INSTRUCTIONS.md`
- `think.md`

## Use When
- A change affects commands, file paths, architecture descriptions, or workflow expectations.
- You want execution to treat documentation drift as part of the implementation task.
- You want learning capture to call out documentation-sync practices.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
