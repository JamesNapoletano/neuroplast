# Conceptualization Instructions (AI-Operator Format)

## Purpose
Create project concept artifacts only. Do not implement product code in this phase.

## Inputs
- `PLANNING_INSTRUCTIONS.md`
- Existing vault/project files (if present)

## Outputs
- Folder: `/brain/project-concept/`
- Folder: `/brain/project-concept/changelog/`
- Folder: `/brain/learning/`
- Folder: `/brain/plans/`
- Planning artifacts defined by `PLANNING_INSTRUCTIONS.md`, stored in `/brain/project-concept/`

## Steps
1. Read `PLANNING_INSTRUCTIONS.md` fully before writing files.
2. Ensure required folders exist:
   - `/brain/project-concept/`
   - `/brain/project-concept/changelog/`
   - `/brain/learning/`
   - `/brain/plans/`
3. Generate concept/planning documents exactly as specified in `PLANNING_INSTRUCTIONS.md`.
4. Save all planning outputs under `/brain/project-concept/`.
5. When done, instruct the developer to continue with `act.md` in the same agent session.

## Validation Checklist
- [ ] All required folders exist.
- [ ] All planning files required by `PLANNING_INSTRUCTIONS.md` are created.
- [ ] No implementation code was added during conceptualization.
- [ ] Outputs are in `/brain/project-concept/`.

## Failure Handling
- If `PLANNING_INSTRUCTIONS.md` is missing, stop and report: `Missing required input: PLANNING_INSTRUCTIONS.md`.
- If any output path is invalid, stop and report the invalid path.

## Stop Condition
Stop after concept/planning artifacts are complete and validated.
