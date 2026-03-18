---
neuroplast:
  role: instruction
  step: contract
  requires: []
  writes_to:
    - neuroplast/WORKFLOW_CONTRACT.md
    - neuroplast/manifest.yaml
    - neuroplast/capabilities.yaml
  outputs:
    - neuroplast/WORKFLOW_CONTRACT.md
    - neuroplast/manifest.yaml
    - neuroplast/capabilities.yaml
  optional: false
  human_review: recommended
  tags:
    - instruction
---

# Neuroplast Workflow Contract
#instruction

## Purpose
Define the canonical, filesystem-first contract that makes Neuroplast portable across AI-assisted development environments.

## Canonical Interface
Neuroplast's primary interface is the `/neuroplast/` folder plus the root `ARCHITECTURE.md` file.

The workflow must remain understandable and executable from files alone.

## Required Layout

### Root Artifact
- `ARCHITECTURE.md` — canonical architecture reference for implementation and execution

### Required `/neuroplast/` Files
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/conceptualize.md`
- `neuroplast/PLANNING_INSTRUCTIONS.md`
- `neuroplast/act.md`
- `neuroplast/CONCEPT_INSTRUCTIONS.md`
- `neuroplast/CHANGELOG_INSTRUCTIONS.md`
- `neuroplast/think.md`

### Required `/neuroplast/` Directories
- `neuroplast/project-concept/`
- `neuroplast/project-concept/changelog/`
- `neuroplast/plans/`
- `neuroplast/learning/`

## Workflow Phases
The canonical workflow loop is:

`conceptualize -> plan -> act -> changelog -> think -> repeat`

### Phase Roles
- `conceptualize` — create or refine concept artifacts and planning context
- `plan` — define structured work in `/neuroplast/plans/`
- `act` — execute the plan and update implementation artifacts
- `changelog` — record completed work for the current date
- `think` — capture reusable, non-sensitive learnings

## Artifact Roles
- `neuroplast/manifest.yaml` stores the canonical machine-readable workflow map
- `neuroplast/capabilities.yaml` stores the advisory environment capability profile
- `/neuroplast/project-concept/` stores concept and planning context
- `/neuroplast/plans/` stores execution plans
- `/neuroplast/project-concept/changelog/` stores dated changelog entries
- `/neuroplast/learning/` stores reusable execution learnings
- `ARCHITECTURE.md` stores the canonical implementation architecture

## Machine-Readable Metadata
- `neuroplast/manifest.yaml` is the normative machine-readable map of workflow structure, document roles, and portability profile.
- `neuroplast/capabilities.yaml` is the advisory machine-readable profile for environment limits and graceful degradation behavior.
- Top-level instruction files may include Neuroplast YAML frontmatter that describes step role, dependencies, write targets, outputs, and review expectations.
- Frontmatter must stay workflow-oriented and must not include provider-specific tuning fields.

## Metadata Boundary
- Normative metadata includes manifest structure plus frontmatter fields for `role`, `step`, `requires`, `writes_to`, `outputs`, and `optional`.
- Normative metadata also includes optional extension declarations when present in `neuroplast/manifest.yaml`.
- Advisory metadata includes `neuroplast/capabilities.yaml` plus frontmatter fields such as `human_review` and `tags`.

## Workflow Extensions
- Neuroplast may be augmented with optional workflow extensions that add repo-specific or role-specific guidance without changing the canonical workflow contract.
- Bundled reusable extensions should live under `neuroplast/extensions/` when shipped with the package.
- Repo-local custom extensions may live under `neuroplast/local-extensions/`.
- Active extensions must be declared in `neuroplast/manifest.yaml`.
- Extensions are additive only and must not override workflow phases, required file paths, artifact roles, or safe write rules.
- When active extensions are declared, read the relevant extension files after the core contract/manifest/capabilities documents and before executing the matching canonical instruction file.

## Capability Profile
- Read `neuroplast/capabilities.yaml` before execution when environment limits might affect workflow behavior.
- Capability values are advisory and may be user-maintained or tool-generated.
- Capability limits must change execution strategy, not the canonical file contract.

## Graceful Degradation Rules
- If terminal commands are unavailable, continue with file-only workflow steps and record terminal-dependent blockers in the current plan.
- If context is limited, work in smaller scopes and restate required context in plan files rather than assuming persistent conversation memory.
- If multi-step execution is unavailable, complete one bounded step at a time and leave clear continuation instructions in the active plan.
- If agent memory is unavailable, persist working context in `/neuroplast/plans/`, changelog entries, and learning notes.

## Validation Rules
- Required directories under `/neuroplast/` must exist.
- Required instruction files must exist and match the manifest.
- Required support files (`manifest.yaml` and `capabilities.yaml`) must exist and be parseable.
- Root `ARCHITECTURE.md` must exist and remain the canonical architecture artifact.
- Instruction frontmatter must include the required workflow metadata fields.
- Workflow paths and document roles must remain aligned with `neuroplast/manifest.yaml`.
- Environment guides or adapter docs must not redefine workflow phases, file structure, or artifact roles.
- Active workflow extensions declared in the manifest must resolve to existing extension directories and remain additive to the core contract.

## Safe Write Rules
- Do not overwrite existing files unless explicitly instructed.
- Prefer additive or targeted updates over destructive rewrites.
- Keep managed workflow files predictable and path-stable.
- Update related documentation when workflow behavior or user-facing paths change.

## Update Rules
- New work should create or update a current plan file in `/neuroplast/plans/`.
- Architecture-relevant changes should be reflected in `ARCHITECTURE.md`.
- Completed work should be recorded in the current dated changelog entry.
- Reusable lessons should be captured in `/neuroplast/learning/`.

## Naming Rules
- Use root `ARCHITECTURE.md` as the canonical architecture artifact.
- Use date-based changelog filenames: `YYYY-MM-DD.md`.
- Keep folder paths under `/neuroplast/` stable unless an explicit migration changes them.

## Required Conventions
- Markdown files must follow the documented folder and file naming contract.
- Managed markdown files should include the required Neuroplast tag for their folder type.
- Workflow steps must preserve the canonical artifact roles and phase order.

## Optional-Compatible Conventions
- Obsidian wiki-links are supported and recommended for graph-style navigation.
- Obsidian configuration under `/neuroplast/.obsidian/` is optional.
- The workflow must still remain usable in plain markdown editors, terminal-only environments, and non-Obsidian tooling.

## Portability Boundary
- Environment-specific guides may explain how to use the contract in a given tool.
- Environment-specific guides must not redefine file structure, artifact roles, or workflow phase order.
- Environment-specific guides should live under `neuroplast/adapters/` when bundled with the workflow package.
- Workflow extensions may add bounded guidance for specific repos or roles, but they must remain opt-in and non-overriding.
- CLI scope should remain focused on workflow bootstrap, sync, and future validation support.

## Stop Condition
This contract is satisfied when the filesystem layout, workflow phases, architecture naming, and update rules remain consistent across instructions and documentation.
