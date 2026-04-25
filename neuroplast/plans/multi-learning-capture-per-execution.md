# Multi-Learning Capture Per Execution
#plan

**Created:** 2026-04-24
**Objective:** Update Neuroplast learning-capture guidance so a single execution cycle can record more than one reusable learning when the work produces distinct insights.

## Scope
- Update `src/instructions/think.md`.
- Mirror the wording in `neuroplast/think.md`.
- Align `act.md` only if needed so execution explicitly considers whether a cycle produced multiple distinct learnings.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this is a managed instruction wording update only and does not require a content-transforming migration for existing installs.

## Assumptions
- The current workflow already allows multiple notes implicitly, but the stop condition and step wording bias operators toward only one learning per cycle.
- Distinct learnings should be split into separate notes when they serve different reusable practices, while tightly related insights can still be grouped.

## Tasks
- [x] Update `think.md` to explicitly allow one or more learning notes per execution cycle.
- [x] Add guidance for when to split distinct learnings versus group related ones.
- [x] Align `act.md` if execution should explicitly check for multiple learnings before closing the cycle.
- [x] Verify the revised wording in both source and installed copies.
- [ ] Record the completed work in today's changelog.

## Completed Work
- Updated `think.md` so a single cycle may yield one or more distinct learnings.
- Added explicit split-versus-group guidance for separate notes versus tightly related insights.
- Updated `act.md` so execution explicitly checks whether a cycle produced multiple distinct reusable learnings before closing.

## Verification
- Manual review of `src/instructions/think.md` and `neuroplast/think.md`.
- If `act.md` changes, manual review of both source and installed copies there as well.
- Run `npm run validate`.

## Handoff Notes
- Keep the change focused on learning-capture semantics rather than redesigning folder structure or category rules.
