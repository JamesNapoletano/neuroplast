# Conceptualization Instructions (AI-Operator Format)
#instruction

## Purpose
Create project concept artifacts only. Do not implement product code in this phase.

## Inputs
- `PLANNING_INSTRUCTIONS.md`
- Existing vault/project files (if present)

## Outputs
- Folder: `/neuroplast/project-concept/`
- Folder: `/neuroplast/project-concept/changelog/`
- Folder: `/neuroplast/learning/`
- Folder: `/neuroplast/plans/`
- Planning artifacts defined by `PLANNING_INSTRUCTIONS.md`, stored in `/neuroplast/project-concept/`

## Steps
1. Read `PLANNING_INSTRUCTIONS.md` fully before writing files.
2. Ensure required folders exist:
   - `/neuroplast/project-concept/`
   - `/neuroplast/project-concept/changelog/`
   - `/neuroplast/learning/`
   - `/neuroplast/plans/`
3. Generate concept/planning documents exactly as specified in `PLANNING_INSTRUCTIONS.md`.
4. Save all planning outputs under `/neuroplast/project-concept/`.
5. When done, instruct the developer to continue with `act.md` in the same agent session.

## Validation Checklist
- [ ] All required folders exist.
- [ ] All planning files required by `PLANNING_INSTRUCTIONS.md` are created.
- [ ] No implementation code was added during conceptualization.
- [ ] Outputs are in `/neuroplast/project-concept/`.

## Failure Handling
- If `PLANNING_INSTRUCTIONS.md` is missing, stop and report: `Missing required input: PLANNING_INSTRUCTIONS.md`.
- If any output path is invalid, stop and report the invalid path.

## Stop Condition
Stop after concept/planning artifacts are complete and validated.
