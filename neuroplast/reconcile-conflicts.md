---
neuroplast:
  role: instruction
  step: reconcile-conflicts
  requires:
    - neuroplast/WORKFLOW_CONTRACT.md
    - neuroplast/manifest.yaml
    - neuroplast/capabilities.yaml
    - neuroplast/CONCEPT_INSTRUCTIONS.md
    - neuroplast/CHANGELOG_INSTRUCTIONS.md
  writes_to:
    - neuroplast/plans
    - neuroplast/project-concept
    - neuroplast/project-concept/changelog
    - neuroplast/learning
    - ARCHITECTURE.md
    - conflicted project files
  outputs:
    - neuroplast/plans/*.md
    - reconciled project files
    - ARCHITECTURE.md
    - neuroplast/project-concept/*.md
    - neuroplast/project-concept/changelog/YYYY-MM-DD.md
    - neuroplast/learning/*.md
  optional: false
  human_review: recommended
  tags:
    - instruction
---

# Conflict Reconciliation Instructions (AI-Operator Format)
#instruction

## Purpose
Resolve file conflicts or competing parallel edits without blindly choosing one side. Preserve informational integrity, keep unique facts that remain valid, meld overlapping truth into one coherent result, and update the normal Neuroplast artifacts when the reconciled state changes project understanding.

`reconcile-conflicts.md` is a specialized on-demand entrypoint. It does not replace `act.md` for normal bounded work.

## When To Use
- Git merge conflicts exist in working files.
- Two humans or AI sessions made competing edits to the same Neuroplast artifact or project file.
- A changelog, plan, concept note, instruction, or README now contains overlapping but non-identical truth that must be reconciled carefully.
- A managed file and local edits appear to disagree and the operator wants a preservation-first review before accepting one version.

## When Not To Use
- There is no actual conflict or competing edit surface. Use `act.md` for normal bounded work.
- The work is new implementation rather than reconciliation of existing changes.
- The project mind is missing or stale because the codebase has never been mapped. Use `reverse-engineering.md` or `conceptualize.md` first.

## Inputs
- `WORKFLOW_CONTRACT.md`
- `manifest.yaml`
- `capabilities.yaml`
- The conflicted file set and any conflict markers, alternate versions, diffs, or branch-specific context provided by the operator
- Relevant files under `/neuroplast/project-concept/`, `/neuroplast/plans/`, `/neuroplast/project-concept/changelog/`, and `/neuroplast/learning/`
- `CONCEPT_INSTRUCTIONS.md` and `CHANGELOG_INSTRUCTIONS.md` when the reconciled truth affects concept or changelog state

## Outputs
- Reconciled file(s) that preserve the strongest valid information from all conflict inputs
- Updated active plan in `/neuroplast/plans/` recording what was reconciled, what was preserved, and any unresolved ambiguity
- Updated concept artifacts, changelog entries, learning notes, or `ARCHITECTURE.md` when the reconciled truth changes them materially

## Reconciliation Principles
- Preserve unique facts from each side unless they are clearly obsolete, false, or superseded by stronger repository evidence.
- Prefer melding over choosing when both sides contain compatible partial truth.
- Deduplicate overlap, but do not compress away meaningful rationale, validation evidence, blockers, or links.
- Treat repository evidence and documented behavior as stronger than unsupported prose.
- If uncertainty remains, preserve the ambiguity explicitly instead of inventing certainty.
- Prefer additive restructuring over destructive deletion.

## Conflict Classes
- **Content conflict:** two versions of the same file contain competing prose or structure.
- **Changelog conflict:** multiple updates describe overlapping work on the same date or artifact.
- **Plan or handoff conflict:** competing statements about scope, blockers, assumptions, or next steps.
- **Concept drift conflict:** architecture or concept documents disagree with newer evidence.
- **Managed-file conflict:** package-managed defaults and local edits differ in a way that needs judgment rather than blind replacement.

## Steps
1. Read `WORKFLOW_CONTRACT.md`, `manifest.yaml`, and `capabilities.yaml` before reconciling files.
2. Identify the conflicted file set and collect all available sides: conflict markers, alternate file versions, related diffs, and any operator notes about intent.
3. Create or update an active plan in `/neuroplast/plans/` that records scope, files being reconciled, verification approach, and unresolved questions.
4. For each conflicted file, classify the conflict type and identify what information is unique to each side versus duplicated across both sides.
5. Use repository evidence, adjacent artifacts, and explicit validation results to determine which claims are confirmed, which can be melded, and which must remain marked as uncertain.
6. Produce a reconciled version that:
   - keeps valid unique facts from each side,
   - merges compatible summaries into one coherent structure,
   - preserves important rationale, blockers, migration decisions, and links,
   - removes only clearly superseded, contradictory, or duplicated content.
7. If a conflict affects shared project understanding, execute `CONCEPT_INSTRUCTIONS.md` so architecture and concept artifacts match the reconciled truth.
8. If a conflict affects completed-work history, execute `CHANGELOG_INSTRUCTIONS.md` and ensure the resulting changelog records the reconciled outcome rather than a one-sided version.
9. If the conflict reveals a reusable practice, update `/neuroplast/learning/` with a non-sensitive note.
10. Record any unresolved ambiguity, manual follow-up, or required human judgment in the active plan before stopping.

## File-Type Guidance
- For changelogs, preserve unique completed-work facts, related-plan links, validation outcomes, and README-impact notes from both sides when they remain true.
- For plans, preserve scope decisions, blockers, assumptions, sync-impact decisions, and handoff notes unless clearly invalidated.
- For concept or architecture files, prefer the version that best matches repository reality, but carry forward any still-valid rationale from the alternate side.
- For managed instruction or documentation files, preserve user-facing guidance that remains accurate and update inventories when a reconciled result changes shipped behavior.

## Validation Checklist
- [ ] The active plan records which files were reconciled and why.
- [ ] Reconciled files preserve valid unique information from each conflict side.
- [ ] Duplicated content was normalized without dropping meaningful facts or links.
- [ ] Any remaining uncertainty is explicit instead of guessed.
- [ ] `ARCHITECTURE.md`, concept files, changelog files, and learning notes were updated when the reconciled truth required it.

## Failure Handling
- If the available conflict inputs are incomplete, stop and report what is missing rather than guessing the absent side.
- If repository evidence is insufficient to choose between contradictory claims, preserve the ambiguity and record the required human decision in the active plan.
- If environment limits prevent reading all needed files, reconcile the smallest bounded subset possible and record the blocker in the active plan.

## Stop Condition
Stop after the conflicted files have a reconciled version, affected Neuroplast artifacts are aligned to that reconciled truth, and any remaining ambiguity or manual follow-up is captured in the active plan.
