# Reverse-Engineering Instruction File
#plan

## Current Objective
- Add a `reverse-engineering.md` instruction file that guides a human + AI pair through reconstructing a project mind from an existing codebase, and hands the resulting evidence off to `conceptualize.md` so the durable artifacts land in `/neuroplast/project-concept/`.

## Scope
- Author a new instruction file that fits the existing AI-Operator format (frontmatter, Purpose, Inputs, Outputs, Steps, Validation, Failure Handling, Stop Condition).
- Wire the instruction into the existing workflow so it composes with `conceptualize.md` and `PLANNING_INSTRUCTIONS.md` rather than replacing them.
- Produce the set of `/neuroplast/project-concept/` artifacts that Layers 1–2 of `PLANNING_INSTRUCTIONS.md` define (Orientation + Detailed Context per subject) and update root `ARCHITECTURE.md` when the reverse-engineering pass materially changes the canonical structure.
- Keep the new instruction domain-agnostic so it works for software repos, research repos, and other code-shaped project minds.

## Non-Goals
- Do not perform the reverse-engineering pass on this repository as part of this plan. The plan only delivers the instruction file and wiring; execution happens in a follow-up session that runs the new instruction.
- Do not modify `act.md`, `think.md`, or the canonical planning/concept/changelog instructions beyond adding discoverability links if needed.
- Do not ship the new instruction through `src/instructions/` in this plan. Ship-to-`src/` is a separate decision (see Open Questions).

## Problem Statement
- Today Neuroplast assumes the human already has enough context to start with `conceptualize.md` or `act.md`. There is no canonical loop for the common cold-start case: "here is a codebase I did not write, help me build the project mind from the code itself."
- Without a dedicated instruction, ad hoc reverse-engineering sessions produce inconsistent artifacts that do not plug cleanly into the Layer-1 / Layer-2 / `ARCHITECTURE.md` structure the rest of the workflow expects.

## Location and Integration Decision
- File will live at `neuroplast/reverse-engineering.md` (repo-local) for the first iteration, outside the manifest's `required_instruction_files`.
- Positioning: specialized **pre-conceptualization** mode. `reverse-engineering.md` collects code-grounded evidence, then explicitly hands off to `conceptualize.md` which writes the durable project-concept artifacts using `PLANNING_INSTRUCTIONS.md`.
- The instruction itself will write a single evidence artifact under `/neuroplast/project-concept/` (`codebase-reverse-engineering-evidence.md`) and then invoke the `conceptualize.md` step, so every subject surfaced during the pass becomes a normal Orientation + Detailed Context pair owned by the standard workflow.
- No changes to `manifest.yaml` `required_instruction_files` in this plan. A later plan can promote the file into `src/instructions/` and the manifest once the shape is proven.

## Proposed Instruction Shape
- **Frontmatter** (mirrors `conceptualize.md`):
  - `role: instruction`
  - `step: reverse-engineer`
  - `requires:` `neuroplast/WORKFLOW_CONTRACT.md`, `neuroplast/PLANNING_INSTRUCTIONS.md`, `neuroplast/conceptualize.md`
  - `writes_to:` `neuroplast/project-concept`, `neuroplast/project-concept/changelog`, `neuroplast/learning`, `ARCHITECTURE.md`
  - `outputs:` `neuroplast/project-concept/codebase-reverse-engineering-evidence.md`, plus any Layer-1/Layer-2 files and `ARCHITECTURE.md` updates produced by the downstream `conceptualize.md` run
  - `optional: true`, `human_review: recommended`, `tags: [instruction]`
- **H1 + Obsidian tag:** `# Reverse-Engineering Instructions (AI-Operator Format)` followed by `#instruction`.
- **Sections:** Purpose, Inputs, Outputs, Steps, Validation Checklist, Failure Handling, Stop Condition — matching the AI-Operator format used by peer instructions.

## Evidence Artifact Template
The single evidence file written directly by `reverse-engineering.md` will follow this shape so the downstream `conceptualize.md` run can translate it into normal Layer-1 / Layer-2 artifacts.

```md
# Codebase Reverse-Engineering Evidence
#project-concept
## Scanned Surface
- Entry points, build/config files, package manifests, test roots
## Inferred Work Surfaces
- Candidate subject / area — evidence paths
## Runtime and Control Flow Notes
- Observed loops, request paths, CLI commands, schedulers
## State and Data Model Notes
- Persistent stores, schemas, on-disk artifacts, migrations
## External Interfaces
- APIs, CLIs, SDKs, protocols, integrations
## Open Questions for the Human
- Ambiguities that code alone cannot resolve
## Handoff to conceptualize.md
- For each Inferred Work Surface: target Orientation + Detailed Context file names
```

## Reverse-Engineering Step Sequence (to be encoded in the instruction)
1. Read `WORKFLOW_CONTRACT.md`, `PLANNING_INSTRUCTIONS.md`, and `conceptualize.md` so the pass stays compatible with the canonical outputs.
2. Ensure the required folders exist (`/neuroplast/project-concept/`, `/neuroplast/project-concept/changelog/`, `/neuroplast/learning/`, `/neuroplast/plans/`).
3. Inventory the repository at a top level: README/docs, package/build manifests, language footprint, entry points, CLI/binary targets, test roots, CI config.
4. Walk the code breadth-first to identify candidate work surfaces: major modules, bounded contexts, data stores, external interfaces, runtime loops.
5. For each candidate, collect code-grounded evidence (paths, key symbols, brief behavior notes) without performing refactors or execution work.
6. Write `codebase-reverse-engineering-evidence.md` under `/neuroplast/project-concept/` using the template above.
7. Flag open questions that require human input before those surfaces can be promoted to Orientation + Detailed Context files.
8. Execute `conceptualize.md`, treating the evidence file as the primary input so it produces the Layer-1 / Layer-2 artifacts and updates `ARCHITECTURE.md` per `PLANNING_INSTRUCTIONS.md`.
9. Stop after the evidence artifact exists and `conceptualize.md` has completed its own Stop Condition.

## Validation Approach for the Instruction File Itself
- Frontmatter parses under the same schema as other instruction files (spot-check by running `npx neuroplast validate` after adding the file; validation should remain green because the file is not in `required_instruction_files`).
- Manual read-through confirms the Obsidian `#instruction` tag sits directly under the H1, matching the tagging policy stated in `act.md`.
- Dry-run the instruction on this repository in a follow-up session to confirm it produces a usable evidence artifact and that `conceptualize.md` accepts it as an input without friction.

## Sync Impact Decision
- no migration needed

## Reason
- The plan introduces a new repo-local instruction file outside `required_instruction_files` and makes no changes to manifest roles, required paths, validation structure, or sync-state semantics.

## Verification
- [x] `npx neuroplast validate` (or `npm run validate`) passes after the new instruction file is added. Result on 2026-04-18: 80 checks, 0 warnings, 0 errors.
- [~] `npm test` — 27 of 28 pass. The single failure (`validate --json keeps schema-shaped findings when environment guides directory is missing`) reports `Unterminated string in JSON at position 8192`, reproduces on a clean `main` checkout before this plan's changes, and is tracked as a pre-existing test-harness issue outside this plan's scope.
- [x] Manual review confirms `reverse-engineering.md` references `conceptualize.md`, uses the AI-Operator format, and documents outputs under `/neuroplast/project-concept/`.

## Execution Steps
1. Draft `neuroplast/reverse-engineering.md` using the frontmatter, sections, and step sequence specified above.
2. Ensure the Obsidian `#instruction` tag sits directly under the H1 title.
3. Cross-link from the instruction to `conceptualize.md` and `PLANNING_INSTRUCTIONS.md` so the handoff is explicit.
4. Run `npm run validate` and `npm test` to confirm the repository remains consistent.
5. Record a changelog entry for the new instruction under `/neuroplast/project-concept/changelog/` per `CHANGELOG_INSTRUCTIONS.md`.
6. Capture any reusable learnings (e.g., evidence-template shape, handoff pattern) under `/neuroplast/learning/` per `think.md`.

## Risks
- Overlap with `conceptualize.md` could confuse first-time users about which file to start from; mitigate by making the handoff explicit in both the new file's Purpose section and a short pointer in `conceptualize.md` if needed.
- The evidence artifact could become a dumping ground that bypasses the Layer-1 / Layer-2 decomposition; mitigate by requiring the final step to run `conceptualize.md` before stopping.
- Shipping only to the repo-local location means downstream consumers of the package do not receive the new instruction yet; acceptable for a first iteration but tracked as an Open Question.

## Open Questions
- Should `reverse-engineering.md` eventually be promoted into `src/instructions/` and referenced from `manifest.yaml` so it ships with `npx neuroplast init`? Defer to a follow-up plan once the shape is validated on this repo.
- Should the evidence artifact live at `/neuroplast/project-concept/codebase-reverse-engineering-evidence.md`, or under a new `/neuroplast/project-concept/reverse-engineering/` subfolder if multiple passes are expected? Default to the single-file path until a second pass is actually needed.
- Does `conceptualize.md` need a small edit to acknowledge the new upstream instruction, or is a one-way reference from `reverse-engineering.md` sufficient? Default to one-way reference to keep the core contract untouched.

## Related
- [[neuroplast/conceptualize.md]]
- [[neuroplast/PLANNING_INSTRUCTIONS.md]]
- [[neuroplast/act.md]]
- [[neuroplast/think.md]]
- [[neuroplast/WORKFLOW_CONTRACT.md]]

## Changelog
- [[project-concept/changelog/2026-04-18.md]]
