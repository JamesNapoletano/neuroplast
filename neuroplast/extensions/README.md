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
- Current bundled extensions shipped with Neuroplast:
  - `verification-first` — adds explicit verification planning and completion discipline.
  - `artifact-sync` — keeps behavior changes aligned with README, architecture, and changelog artifacts.
  - `context-continuity` — improves resumability by pushing assumptions, blockers, and handoff context into files.

## Minimal Extension File Convention
- Each active extension should include a `README.md` at the extension root.
- The extension `README.md` should describe the purpose, activation path, and covered canonical step files.
- The extension `README.md` must include the additive boundary reminder: `This extension is additive guidance and must not override the Neuroplast workflow contract.`
- Each active extension must provide at least one canonical step file:
  - `conceptualize.md`
  - `PLANNING_INSTRUCTIONS.md`
  - `act.md`
  - `CONCEPT_INSTRUCTIONS.md`
  - `CHANGELOG_INSTRUCTIONS.md`
  - `think.md`
- Keep step files at the extension root so automatic step-loading remains predictable.

## Authoring Guidance
1. Decide whether the extension is broadly reusable (`neuroplast/extensions/`) or repo-local (`neuroplast/local-extensions/`).
2. Add a `README.md` that explains purpose, activation, step coverage, and additive boundaries.
3. Add only the canonical step files the extension actually needs.
4. Declare the extension in `neuroplast/manifest.yaml` under `extensions.active_bundled` or `extensions.active_local`.
5. Keep the guidance additive; do not override workflow phases, required file paths, artifact roles, or safe write rules.
6. Run `neuroplast validate` after activating the extension.

## Boundary Reminder
This guide is optional documentation and must not override the Neuroplast workflow contract.
