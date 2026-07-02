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
Capture reusable, non-sensitive learnings from the current work cycle to improve future project-mind quality and execution quality. A single cycle may produce one or more distinct learnings.

## Inputs
- Mistakes or insights from the current work cycle
- Existing knowledge in `/neuroplast/learning/`

## Outputs
- One or more new or updated markdown note(s) in `/neuroplast/learning/` categorized by topic
- Cross-links to related learning notes when relevant
- Learning notes include `#learning` directly under the H1 title

## Steps
1. Identify key mistakes, corrections, and reusable practices from the current work.
2. Exclude sensitive, brand-specific, or confidential details.
3. Decide whether the cycle produced one reusable learning or multiple materially distinct learnings.
4. Group tightly related insights into one note when they support the same reusable practice; split distinct insights into separate notes when they would be more useful independently.
5. Determine the best category path under `/neuroplast/learning/` for each note.
6. If needed, create a new category folder (nested folders allowed).
7. Add or update the relevant learning note or notes in those categories.
8. Ensure each learning note includes `#learning` directly under the H1 title.
9. Link related learning notes to avoid duplicate categories and fragmented knowledge.

## Validation Checklist
- [ ] Each learning note captures actionable practice-level insight.
- [ ] No sensitive or brand-specific information is included.
- [ ] Category placement is logical and non-duplicative.
- [ ] Learning notes include required Obsidian tag (`#learning`).
- [ ] Related notes are linked when applicable.
- [ ] Distinct learnings from the cycle were either captured separately or intentionally grouped with a clear reason.

## Failure Handling
- If `/neuroplast/learning/` is missing, create it before writing notes.
- If category is ambiguous, choose the closest existing category and note a follow-up reorg task.

## Stop Condition
Stop after the execution cycle's reusable learnings have been captured in one or more validated learning updates.
