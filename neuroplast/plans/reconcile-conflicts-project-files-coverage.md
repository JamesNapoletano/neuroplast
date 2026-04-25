# Reconcile Conflicts Project Files Coverage
#plan

**Created:** 2026-04-24
**Objective:** Update the conflict-reconciliation instruction so project files are treated as first-class reconciliation targets throughout the instruction, not only Neuroplast artifacts.

## Scope
- Update `src/instructions/reconcile-conflicts.md`.
- Mirror the same wording update in `neuroplast/reconcile-conflicts.md`.
- Keep the change bounded to instruction wording unless a directly affected artifact also needs alignment.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this changes managed instruction content only and does not require any content-transforming migration for existing installs.

## Assumptions
- The current instruction already partially references project files, but its step guidance and validation emphasis should make that coverage explicit.
- No routing, manifest, or CLI wiring changes are required for this wording-only clarification.

## Tasks
- [x] Update the purpose, outputs, steps, file-type guidance, validation checklist, and stop condition in the source instruction.
- [x] Mirror the same update in the repository-managed `neuroplast/` copy.
- [x] Verify the revised instruction explicitly covers reconciliation of ordinary project files.
- [ ] Record the completed work in today's changelog.

## Completed Work
- Expanded the instruction purpose and outputs so the reconciliation target explicitly includes ordinary project files as well as Neuroplast artifacts.
- Added execution guidance that requires reconciling project-file behavior and intent directly instead of only reconciling surrounding Neuroplast notes.
- Added file-type and validation guidance for source files, tests, configuration, scripts, assets, and product docs.
- Broadened the stop condition so both project files and Neuroplast artifacts must align to the reconciled truth.

## Verification
- Manual review of `src/instructions/reconcile-conflicts.md` and `neuroplast/reconcile-conflicts.md`.
- Confirm the instruction now explicitly mentions project files in execution steps, file-type guidance, validation, and stop condition.

## Handoff Notes
- If later follow-up work broadens the summarized descriptions of `reconcile-conflicts.md` elsewhere, align README or adapter summaries in a separate bounded pass unless directly needed here.
