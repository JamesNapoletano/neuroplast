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
Define the filesystem-first Neuroplast project-mind contract so a human and an AI can load project context, choose the current objective, do bounded work, and preserve durable memory across sessions and tools while explicitly aligning to LCP.

Normative protocol source:

- <https://github.com/JamesNapoletano/lcp>

Neuroplast is an implementation of LCP, not the protocol standard itself.

## Canonical Interface
Neuroplast exposes a dual-layout interface:

- `.lcp/` provides the explicit LCP bridge entrypoint
- `/neuroplast/` provides the Neuroplast-managed implementation workspace
- root `ARCHITECTURE.md` is the Neuroplast default canonical architecture artifact

The workflow must remain understandable and executable from files alone.

Neuroplast should behave like a project mind, not only like a task checklist. The files should make it easy to answer:

- What is this project?
- What is true right now?
- What are we trying to do next?
- Why are we making these decisions?
- What changed or was learned?

## Required Layout

### Root Artifact
- `ARCHITECTURE.md` — Neuroplast default architecture reference for implementation and execution

### LCP Bridge Files
- `.lcp/manifest.yaml`
- `.lcp/profiles/neuroplast-default.yaml`
- `.lcp/workflows/neuroplast-loop.yaml`
- `.lcp/rules/neuroplast-boundaries.yaml`
- `.lcp/reasoning/neuroplast-execution-scaffold.yaml`
- `.lcp/tools/neuroplast-cli.yaml`
- `.lcp/knowledge/neuroplast-compatibility.yaml`

### Required `/neuroplast/` Files
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/conceptualize.md`
- `neuroplast/reverse-engineering.md`
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

This loop defines the durable artifact lifecycle, not a requirement that every session start from scratch.

- `act.md` is the normal entrypoint for everyday bounded work once the project mind already exists.
- `reverse-engineering.md` is the specialized entrypoint for reconstructing project-mind context from an existing codebase before handing off to `conceptualize.md`.
- `conceptualize.md` is for new initiatives, ambiguous requests, reframing, or major scope changes.
- `PLANNING_INSTRUCTIONS.md` defines how to refresh project-mind context when the existing structure is missing or insufficient.

### Phase Roles
- `conceptualize` — create or reframe durable project context when the work is new, unclear, or materially changed
- `reverse-engineer` — reconstruct code-grounded project context when an existing repository lacks trustworthy project-mind artifacts
- `plan` — define the current objective, bounded scope, and verification path in `/neuroplast/plans/`
- `act` — perform the next bounded work session and keep project artifacts aligned
- `changelog` — record what changed in the current cycle
- `think` — capture reusable, non-sensitive learnings from the cycle

## Human + AI Collaboration Model
- The human provides intent, priorities, constraints, and review.
- The AI loads the project mind from files, updates the active plan, performs bounded work, and writes durable handoff context back to the repository.
- Plans, changelogs, and learning notes are the shared memory surface when session memory or tool context is incomplete.
- The goal is not to force ceremony; the goal is to keep the project legible, resumable, and trustworthy.

## Artifact Roles
- `.lcp/manifest.yaml` stores the LCP bridge manifest for explicit protocol alignment
- `neuroplast/manifest.yaml` stores the Neuroplast machine-readable workflow map
- `neuroplast/capabilities.yaml` stores the advisory environment capability profile
- `/neuroplast/project-concept/` stores durable project-mind context, orientation, assumptions, and structured domain understanding
- `/neuroplast/plans/` stores the active objective, bounded work plans, blockers, and handoff state
- `/neuroplast/project-concept/changelog/` stores dated history of completed work cycles
- `/neuroplast/learning/` stores reusable practices and lessons from completed work
- `ARCHITECTURE.md` stores the canonical architecture, structure, or system map for the project

## Machine-Readable Metadata
- `.lcp/manifest.yaml` is the LCP-facing bridge manifest.
- `neuroplast/manifest.yaml` is the Neuroplast machine-readable map of workflow structure, document roles, and portability profile.
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
- `.lcp/manifest.yaml` must exist and remain parseable.
- LCP bridge document references must resolve.
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
- Architecture- or structure-relevant changes should be reflected in `ARCHITECTURE.md`.
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
