---
neuroplast:
  role: instruction
  step: act
  requires:
    - neuroplast/WORKFLOW_CONTRACT.md
    - neuroplast/capabilities.yaml
    - neuroplast/project-concept
    - ARCHITECTURE.md
    - neuroplast/CONCEPT_INSTRUCTIONS.md
    - neuroplast/CHANGELOG_INSTRUCTIONS.md
    - neuroplast/think.md
  writes_to:
    - neuroplast/plans
    - ARCHITECTURE.md
    - neuroplast/project-concept
    - neuroplast/project-concept/changelog
    - neuroplast/learning
  outputs:
    - neuroplast/plans/*.md
    - project files
    - ARCHITECTURE.md
    - neuroplast/project-concept/changelog/YYYY-MM-DD.md
    - neuroplast/learning/*.md
  optional: false
  human_review: recommended
  tags:
    - instruction
---

# Execution Instructions (AI-Operator Format)
#instruction

## Purpose
Execute work based on concept artifacts and maintain architecture, changelog, and learning records.

## Obsidian Tagging Policy
- Top-level instruction files in `/neuroplast/*.md` must include `#instruction` directly under the H1 title.
- Files under `/neuroplast/learning/` must include `#learning` directly under the H1 title.
- Files under `/neuroplast/project-concept/changelog/` must include `#changelog` directly under the H1 title.
- Files under `/neuroplast/project-concept/` (excluding `changelog/`) must include `#project-concept` directly under the H1 title.
- Files under `/neuroplast/plans/` must include `#plan` directly under the H1 title.

## Inputs
- `WORKFLOW_CONTRACT.md`
- `capabilities.yaml`
- `/neuroplast/project-concept/` artifacts
- `ARCHITECTURE.md` in repository root
- Existing notes in `/neuroplast/learning/`
- `CONCEPT_INSTRUCTIONS.md`
- `CHANGELOG_INSTRUCTIONS.md`
- `think.md`

## Outputs
- New or updated implementation plan in `/neuroplast/plans/`
- Updated project files from execution
- Updated `ARCHITECTURE.md` (if relevant)
- Updated concept and changelog artifacts (if relevant)
- New learning entry in `/neuroplast/learning/` (if relevant)

## Steps
1. Read `WORKFLOW_CONTRACT.md`.
2. Read `capabilities.yaml` and adjust execution strategy if environment limits are declared.
3. Read project context from `/neuroplast/project-concept/`.
4. Ensure `ARCHITECTURE.md` exists in repository root. If missing, create it.
5. Create or update a plan file in `/neuroplast/plans/` for the current work.
6. Ensure all created or updated markdown files include the correct Obsidian tag from the tagging policy.
7. Execute the plan, using relevant prior learnings from `/neuroplast/learning/`.
8. If environment capabilities block part of execution, record the limitation and fallback path in the current plan before proceeding or stopping.
9. Verify implementation quality and completeness.
10. Execute `CONCEPT_INSTRUCTIONS.md`.
11. Execute `CHANGELOG_INSTRUCTIONS.md`.
12. Execute `think.md`.

## Validation Checklist
- [ ] `/neuroplast/plans/` contains a current plan file.
- [ ] Implementation matches the plan scope.
- [ ] `ARCHITECTURE.md` exists and is current.
- [ ] Markdown files include required Obsidian tags by folder type.
- [ ] Concept/changelog/learning instructions were executed.

## Failure Handling
- If `/neuroplast/project-concept/` is missing, stop and report: `Missing required input: /neuroplast/project-concept/`.
- If plan execution fails, report blockers and incomplete tasks before stopping.

## Stop Condition
Stop after execution is verified and all post-execution instruction files are completed.
