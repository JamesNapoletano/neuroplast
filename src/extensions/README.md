# Neuroplast Workflow Extensions

## Purpose
Describe how optional workflow extensions augment Neuroplast without changing the canonical workflow contract.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Rules
- Extensions are optional and additive.
- Extensions must be declared in `neuroplast/manifest.yaml` to be considered active.
- Bundled reusable extensions live under `neuroplast/extensions/`.
- Repo-local custom extensions may live under `neuroplast/local-extensions/`.
- Extensions may add bounded repo-specific or role-specific guidance.
- Extensions must not override the Neuroplast workflow contract.

## Activation Model
- Add bundled extension names to `extensions.active_bundled` in `neuroplast/manifest.yaml`.
- Add repo-local extension names to `extensions.active_local` in `neuroplast/manifest.yaml`.
- After reading the core contract, manifest, and capabilities profile, automatically load the matching per-step extension files for every active extension before executing the relevant canonical instruction.

## Seamless Step Loading Convention
- Treat active extensions as phase overlays, not one-off manual reads.
- For the current step, load the same-named extension file when it exists.
- Step-to-file convention:
  - `conceptualize` → `conceptualize.md`
  - `plan` → `PLANNING_INSTRUCTIONS.md`
  - `act` → `act.md`
  - `changelog` → `CHANGELOG_INSTRUCTIONS.md`
  - `think` → `think.md`
- If an active extension does not provide a file for the current step, skip it and continue.
- This keeps the core workflow unchanged while making active extensions feel automatic.

## Bundled Extension Example
- Bundled extensions can provide reusable guidance for shared workflows that multiple installs may opt into.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
