# Changelog Instructions (AI-Operator Format)

## Purpose
Maintain a daily changelog with clear links to related plans and adjacent changelog entries.

## Inputs
- Current date
- `/brain/project-concept/changelog/`
- Relevant files in `/brain/plans/`

## Outputs
- Daily changelog file: `/brain/project-concept/changelog/YYYY-MM-DD.md`
- Bidirectional links between changelog and related plan files
- Link to previous changelog entry when present

## Steps
1. Check `/brain/project-concept/changelog/` for `YYYY-MM-DD.md` using current date.
2. If missing, create the file.
3. Add an organized summary list of changes completed in the current cycle.
4. Add links from the changelog to relevant plan file(s) in `/brain/plans/`.
5. Ensure each referenced plan file links back to this changelog entry.
6. If a previous changelog exists, add previous/next navigation links between entries.

## Validation Checklist
- [ ] Daily changelog file exists.
- [ ] Change summary is clear and organized.
- [ ] Changelog ↔ Plan links are bidirectional.
- [ ] Previous changelog link exists when applicable.

## Failure Handling
- If `/brain/project-concept/changelog/` is missing, create it first.
- If no relevant plan file exists, note this explicitly in the changelog entry.

## Stop Condition
Stop after changelog entry is complete and link integrity is verified.
