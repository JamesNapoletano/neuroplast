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
4. Ensure all created or updated markdown files include the correct Obsidian tag from the tagging policy.
5. Execute the plan, using relevant prior learnings from `/neuroplast/learning/`.
6. Verify implementation quality and completeness.
7. Execute `CONCEPT_INSTRUCTIONS.md`.
8. Execute `CHANGELOG_INSTRUCTIONS.md`.
9. Execute `think.md`.

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
