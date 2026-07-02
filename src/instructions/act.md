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
    - .lcp/indexes/context.distilled.lcpq
  writes_to:
    - neuroplast/plans
    - ARCHITECTURE.md
    - neuroplast/project-concept
    - neuroplast/project-concept/changelog
  outputs:
    - neuroplast/plans/*.md
    - project files
    - ARCHITECTURE.md
    - neuroplast/project-concept/changelog/YYYY-MM-DD.md
  optional: false
  human_review: recommended
  tags:
    - instruction
---

# Execution Instructions (AI-Operator Format)
#instruction

## Purpose
Execute a bounded work session using the project mind and maintain architecture, changelog, and durable LCP memory.

## Everyday Entrypoint
Use `act.md` as the normal starting point once Neuroplast already has enough project context to proceed. Reach for `reconcile-conflicts.md` first when the immediate task is resolving merge conflicts or competing edits. Reach for `conceptualize.md` first only when the work is new, unclear, or needs a meaningful reframing.

## Obsidian Tagging Policy
- Top-level instruction files in `/neuroplast/*.md` must include `#instruction` directly under the H1 title.
- Files under `/neuroplast/project-concept/changelog/` must include `#changelog` directly under the H1 title.
- Files under `/neuroplast/project-concept/` (excluding `changelog/`) must include `#project-concept` directly under the H1 title.
- Files under `/neuroplast/plans/` must include `#plan` directly under the H1 title.

## Inputs
- `WORKFLOW_CONTRACT.md`
- `capabilities.yaml`
- `/neuroplast/project-concept/` artifacts
- `ARCHITECTURE.md` in repository root
- Assembled memory: the distilled high-signal index `.lcp/indexes/context.distilled.lcpq`, read directly (its authoritative source is `.lcp/knowledge/neuroplast-learning.yaml`; the index is derived and disposable)
- Current objective, request, or bounded work target from the human operator
- `CONCEPT_INSTRUCTIONS.md`
- `CHANGELOG_INSTRUCTIONS.md`
- `think.md`

## Outputs
- New or updated active plan in `/neuroplast/plans/`
- Updated project files or artifacts from the bounded work session
- Updated `ARCHITECTURE.md` (if relevant)
- Updated concept and changelog artifacts (if relevant)
- One or more new or superseding entries in `.lcp/knowledge/neuroplast-learning.yaml`, written via `think.md` (if relevant)

## Steps
1. Read `WORKFLOW_CONTRACT.md`.
2. Read `capabilities.yaml` and adjust execution strategy if environment limits are declared.
3. Read project context from `/neuroplast/project-concept/`.
4. Ensure `ARCHITECTURE.md` exists in repository root. If missing, create it.
5. Identify the current objective and next bounded step from the human request plus repository context.
6. Create or update a plan file in `/neuroplast/plans/` for the current work.
7. Ensure all created or updated markdown files include the correct Obsidian tag from the tagging policy.
8. Use the plan to record scope, assumptions, verification, blockers, and handoff context before and during the work.
9. Assemble the working context before acting: read the distilled high-signal memory index `.lcp/indexes/context.distilled.lcpq` directly (regenerate it with `neuroplast quantize --distill` if missing or stale). Treat the index as derived and disposable; `.lcp/knowledge/neuroplast-learning.yaml` remains authoritative and is never edited directly during this step.
10. Execute the bounded work, using the relevant prior learnings surfaced during assembly.
11. If environment capabilities block part of execution, record the limitation and fallback path in the current plan before proceeding or stopping.
12. Verify work quality and completeness using checks appropriate to the project domain.
13. Execute `CONCEPT_INSTRUCTIONS.md`.
14. Execute `CHANGELOG_INSTRUCTIONS.md`.
15. Execute `think.md`, including an explicit check for whether the cycle produced multiple distinct reusable learnings.

## Validation Checklist
- [ ] `/neuroplast/plans/` contains a current plan file.
- [ ] Completed work matches the plan scope.
- [ ] `ARCHITECTURE.md` exists and is current.
- [ ] Markdown files include required Obsidian tags by folder type.
- [ ] Concept/changelog/learning instructions were executed.

## Failure Handling
- If `/neuroplast/project-concept/` is missing, stop and report: `Missing required input: /neuroplast/project-concept/`.
- If plan execution fails, report blockers and incomplete tasks before stopping.

## Stop Condition
Stop after execution is verified and all post-execution instruction files are completed.
