# Package Maintainer Extension
#instruction

## Purpose
Add maintainer-only workflow guidance for evolving the Neuroplast package without forcing that policy into every installed workflow.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Activation
Declare `package-maintainer` in `extensions.active_local` inside `neuroplast/manifest.yaml`.

## Usage
- Read the core Neuroplast contract, manifest, and capabilities profile first.
- Then automatically load this extension's matching per-step file whenever the corresponding core phase runs.
- For example:
  - `act` phase → `neuroplast/local-extensions/package-maintainer/act.md`
  - `changelog` phase → `neuroplast/local-extensions/package-maintainer/CHANGELOG_INSTRUCTIONS.md`
- Use these files as additive maintainer guidance layered on top of the canonical instruction set.

## Step Mapping
- `act` → `act.md`
- `changelog` → `CHANGELOG_INSTRUCTIONS.md`
- Steps without a matching file are skipped automatically.

## Scope
- Managed-file sync decisions
- Release-oriented documentation discipline
- Package-maintainer-only workflow checks

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
