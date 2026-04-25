# Act Entrypoint Guidance Alignment
#plan

**Created:** 2026-04-24
**Objective:** Realign `act.md` everyday-entrypoint guidance so the source and installed copies match the workflow contract's distinction between normal execution, conflict reconciliation, and conceptualization.

## Scope
- Update `src/instructions/act.md`.
- Mirror the same wording in `neuroplast/act.md`.
- Keep this pass limited to the everyday-entrypoint guidance unless another directly coupled wording mismatch is found.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this is a managed instruction wording alignment only and does not require a content-transforming migration for existing installs.

## Assumptions
- The live installed `neuroplast/act.md` still reflects the intended contract wording by mentioning `reconcile-conflicts.md` as the specialized entrypoint for conflict work.
- The source copy drifted during the multi-learning wording pass and should be brought back into alignment.

## Tasks
- [x] Restore the missing `reconcile-conflicts.md` guidance in `src/instructions/act.md`.
- [x] Confirm the installed `neuroplast/act.md` remains aligned.
- [ ] Record the alignment in today's changelog.
- [ ] Validate the repository after the wording fix.

## Completed Work
- Restored the missing `reconcile-conflicts.md` entrypoint sentence in `src/instructions/act.md`.
- Confirmed the installed `neuroplast/act.md` already matched the workflow contract wording.

## Verification
- Manual review of `src/instructions/act.md` and `neuroplast/act.md`.
- Run `npm run validate`.

## Handoff Notes
- Keep the wording aligned with `WORKFLOW_CONTRACT.md` and avoid broadening this pass into a full instruction audit.
