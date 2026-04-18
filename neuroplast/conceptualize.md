---
neuroplast:
  role: instruction
  step: conceptualize
  requires:
    - neuroplast/WORKFLOW_CONTRACT.md
    - neuroplast/PLANNING_INSTRUCTIONS.md
  writes_to:
    - neuroplast/project-concept
    - neuroplast/project-concept/changelog
    - neuroplast/learning
    - neuroplast/plans
    - ARCHITECTURE.md
  outputs:
    - neuroplast/project-concept/*.md
    - ARCHITECTURE.md
  optional: false
  human_review: recommended
  tags:
    - instruction
---

# Conceptualization Instructions (AI-Operator Format)
#instruction

## Purpose
Create or reframe project-mind context when the project direction is new, ambiguous, or materially changing. Do not perform the main work itself in this phase.

## Inputs
- `WORKFLOW_CONTRACT.md`
- `PLANNING_INSTRUCTIONS.md`
- Existing repository/project files (if present)
- Current request, goals, constraints, and open questions from the human operator

## Outputs
- Folder: `/neuroplast/project-concept/`
- Folder: `/neuroplast/project-concept/changelog/`
- Folder: `/neuroplast/learning/`
- Folder: `/neuroplast/plans/`
- Project-mind artifacts defined by `PLANNING_INSTRUCTIONS.md`, stored in `/neuroplast/project-concept/`

## Steps
1. Read `WORKFLOW_CONTRACT.md` fully before writing files.
2. Read `PLANNING_INSTRUCTIONS.md` fully before writing files.
3. Ensure required folders exist:
   - `/neuroplast/project-concept/`
   - `/neuroplast/project-concept/changelog/`
   - `/neuroplast/learning/`
   - `/neuroplast/plans/`
4. Use `PLANNING_INSTRUCTIONS.md` to build or refresh the durable project-mind context needed for future sessions.
5. Capture the current objective, key constraints, important work surfaces, and open questions in `/neuroplast/project-concept/`.
6. Create or update root `ARCHITECTURE.md` when the project-mind outputs define or change the canonical structure.
7. When done, instruct the developer to continue with `act.md` in the same agent session for bounded execution work.

## Validation Checklist
- [ ] All required folders exist.
- [ ] All project-mind artifacts required by `PLANNING_INSTRUCTIONS.md` are created.
- [ ] Root `ARCHITECTURE.md` exists when planning established or refined the canonical architecture.
- [ ] No primary execution work was performed during conceptualization.
- [ ] Outputs are in `/neuroplast/project-concept/`.

## Failure Handling
- If `PLANNING_INSTRUCTIONS.md` is missing, stop and report: `Missing required input: PLANNING_INSTRUCTIONS.md`.
- If any output path is invalid, stop and report the invalid path.

## Stop Condition
Stop after concept/planning artifacts are complete and validated.
