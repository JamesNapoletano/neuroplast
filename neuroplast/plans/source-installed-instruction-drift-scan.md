# Source Installed Instruction Drift Scan
#plan

**Created:** 2026-04-24
**Objective:** Check whether source instruction files under `src/instructions/` still match their installed `/neuroplast/` mirrors and fix any confirmed drift found during the scan.

## Scope
- Compare each core instruction file in `src/instructions/` with its corresponding file in `neuroplast/`.
- Fix confirmed drift when the intended mirror relationship is clear.
- Keep the pass focused on instruction-file parity rather than broader docs or adapter audits.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this pass only checks and corrects managed instruction wording parity and does not require a content-transforming migration for existing installs.

## Assumptions
- Core shipped instruction files in `src/instructions/` are expected to mirror the installed `/neuroplast/` copies in this repository.
- Any intentional divergence should be rare and should be documented by stronger repository evidence before preserving it.

## Tasks
- [x] Compare source and installed core instruction files.
- [x] Fix any confirmed mismatches.
- [ ] Record the scan result in today's changelog.
- [ ] Validate the repository after any changes.

## Completed Work
- Compared all core instruction files under `src/instructions/` and `neuroplast/`.
- Confirmed two mismatches: `WORKFLOW_CONTRACT.md` and `reverse-engineering.md`.
- Restored the source contract to include `reconcile-conflicts.md` and removed outdated contract wording that no longer matched the installed copy.
- Marked the source `reverse-engineering.md` frontmatter as `optional: true` to match the installed instruction metadata.
- Rechecked parity after the fixes and confirmed no content mismatches remain once line-ending differences are normalized.

## Verification
- Manual comparison or diff review for each instruction pair.
- Run `npm run validate` after any edits.

## Handoff Notes
- If no drift is found, record that explicitly instead of forcing a no-op file change.
