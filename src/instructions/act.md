# Execution Instructions (AI-Operator Format)

## Purpose
Execute work based on concept artifacts and maintain architecture, changelog, and learning records.

## Inputs
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
1. Read project context from `/neuroplast/project-concept/`.
2. Ensure `ARCHITECTURE.md` exists in repository root. If missing, create it.
3. Create or update a plan file in `/neuroplast/plans/` for the current work.
4. Execute the plan, using relevant prior learnings from `/neuroplast/learning/`.
5. Verify implementation quality and completeness.
6. Execute `CONCEPT_INSTRUCTIONS.md`.
7. Execute `CHANGELOG_INSTRUCTIONS.md`.
8. Execute `think.md`.

## Validation Checklist
- [ ] `/neuroplast/plans/` contains a current plan file.
- [ ] Implementation matches the plan scope.
- [ ] `ARCHITECTURE.md` exists and is current.
- [ ] Concept/changelog/learning instructions were executed.

## Failure Handling
- If `/neuroplast/project-concept/` is missing, stop and report: `Missing required input: /neuroplast/project-concept/`.
- If plan execution fails, report blockers and incomplete tasks before stopping.

## Stop Condition
Stop after execution is verified and all post-execution instruction files are completed.
