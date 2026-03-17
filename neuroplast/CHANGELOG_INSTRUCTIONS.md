# Changelog Instructions (AI-Operator Format)
#instruction

## Purpose
Maintain a daily changelog with clear links to related plans and adjacent changelog entries.

## Inputs
- Current date
- `/neuroplast/project-concept/changelog/`
- Relevant files in `/neuroplast/plans/`

## Outputs
- Daily changelog file: `/neuroplast/project-concept/changelog/YYYY-MM-DD.md`
- Bidirectional links between changelog and related plan files
- Link to previous changelog entry when present
- Changelog files include `#changelog` directly under the H1 title

## Steps
1. Check `/neuroplast/project-concept/changelog/` for `YYYY-MM-DD.md` using current date.
2. If missing, create the file.
3. Ensure the changelog file includes `#changelog` directly under the H1 title.
4. Add an organized summary list of changes completed in the current cycle.
5. Add links from the changelog to relevant plan file(s) in `/neuroplast/plans/`.
6. Ensure each referenced plan file links back to this changelog entry.
7. If a previous changelog exists, add previous/next navigation links between entries.
8. If current-cycle changes affect user-facing behavior (commands, paths, initialization output, or workflow expectations), update project root `README.md` accordingly.

## Validation Checklist
- [ ] Daily changelog file exists.
- [ ] Changelog file includes `#changelog` under the H1 title.
- [ ] Change summary is clear and organized.
- [ ] Changelog ↔ Plan links are bidirectional.
- [ ] Previous changelog link exists when applicable.
- [ ] Project root `README.md` is updated when documentation-impacting changes were made (or explicitly confirmed unchanged).

## Failure Handling
- If `/neuroplast/project-concept/changelog/` is missing, create it first.
- If no relevant plan file exists, note this explicitly in the changelog entry.

## Stop Condition
Stop after changelog entry is complete and link integrity is verified.
