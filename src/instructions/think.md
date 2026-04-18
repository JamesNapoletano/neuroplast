---
neuroplast:
  role: instruction
  step: think
  requires:
    - neuroplast/learning
  writes_to:
    - neuroplast/learning
  outputs:
    - neuroplast/learning/*.md
  optional: false
  human_review: recommended
  tags:
    - instruction
---

# Learning Capture Instructions (AI-Operator Format)
#instruction

## Purpose
Capture reusable, non-sensitive learnings from the current work cycle to improve future project-mind quality and execution quality.

## Inputs
- Mistakes or insights from the current work cycle
- Existing knowledge in `/neuroplast/learning/`

## Outputs
- New or updated markdown note(s) in `/neuroplast/learning/` categorized by topic
- Cross-links to related learning notes when relevant
- Learning notes include `#learning` directly under the H1 title

## Steps
1. Identify key mistakes, corrections, and reusable practices from the current work.
2. Exclude sensitive, brand-specific, or confidential details.
3. Determine the best category path under `/neuroplast/learning/`.
4. If needed, create a new category folder (nested folders allowed).
5. Add or update a learning note in that category.
6. Ensure each learning note includes `#learning` directly under the H1 title.
7. Link related learning notes to avoid duplicate categories and fragmented knowledge.

## Validation Checklist
- [ ] Learning note captures actionable practice-level insight.
- [ ] No sensitive or brand-specific information is included.
- [ ] Category placement is logical and non-duplicative.
- [ ] Learning notes include required Obsidian tag (`#learning`).
- [ ] Related notes are linked when applicable.

## Failure Handling
- If `/neuroplast/learning/` is missing, create it before writing notes.
- If category is ambiguous, choose the closest existing category and note a follow-up reorg task.

## Stop Condition
Stop after at least one validated learning update is recorded for the execution cycle.
