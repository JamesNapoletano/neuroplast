# Required Reverse-Engineering Instruction Shipping
#plan

## Current Objective
- Promote `reverse-engineering.md` from a repo-local experiment to a required shipped Neuroplast instruction that installs, syncs, validates, and documents like the rest of the canonical instruction set.

## Scope
- Add `src/instructions/reverse-engineering.md` so the package ships the instruction.
- Update init/sync managed-file wiring so installed repositories receive and refresh `neuroplast/reverse-engineering.md`.
- Add the instruction to required manifest/profile/contract expectations so validation treats it as part of the canonical workflow.
- Update architecture, README, and related guidance to present reverse-engineering as a required specialized entrypoint alongside `conceptualize.md` and `act.md`.
- Update tests to cover installation, validation, and managed-file count changes.

## Non-Goals
- Do not change `reverse-engineering.md` from a specialized pre-conceptualization mode into an everyday default entrypoint.
- Do not add a new CLI command; this remains a file-based instruction.
- Do not change workflow-extension canonical step filenames in this pass.

## Assumptions
- Making the file required means fresh installs and synced repositories must contain `neuroplast/reverse-engineering.md` for validation to pass.
- The instruction remains required as part of the shipped canonical file set while still being used selectively based on repository state.

## Sync Impact Decision
- no migration needed

## Reason
- The change extends the managed instruction file set and validation contract but fits the existing init/sync safe-refresh model, so shipping the new managed file is sufficient without a custom migration.

## Execution Steps
1. Copy the current reverse-engineering instruction into `src/instructions/reverse-engineering.md`.
2. Add `reverse-engineering.md` to managed workflow file lists used by init/sync/state tracking.
3. Add `neuroplast/reverse-engineering.md` to the required instruction file lists in the manifest, LCP profile, and workflow contract.
4. Update README, architecture, and environment guidance wherever the canonical instruction set or instruction-choice language is enumerated.
5. Update tests to assert the new file is installed, validated, and included in managed refresh counts.
6. Run `npm test` and `npm run release:verify`.
7. Record concept/changelog/learning updates reflecting the promotion from optional repo-local file to required shipped instruction.

## Verification
- [ ] `npx neuroplast init` installs `neuroplast/reverse-engineering.md`.
- [ ] `npx neuroplast validate` requires the file and succeeds in initialized repositories.
- [ ] Sync summary/test expectations are updated for the new managed file count.
- [ ] README and architecture docs describe the required instruction set accurately.
- [ ] `npm test` passes.
- [ ] `npm run release:verify` passes.

## Risks
- Existing documentation may accidentally imply reverse-engineering is the new default rather than a specialized required entrypoint.
- Test fixtures that assume the previous managed-file count will fail until updated.
- Consumer repos that manually curate their managed files will start failing validation until they run `sync` or restore the new required file.

## Handoff
- After merge, maintainers should note in release guidance that existing installs may need `npx neuroplast sync` to receive the newly required instruction file.

## Related
- [[plans/reverse-engineering-instruction.md]]
- [[project-concept/release-operations.md]]
- [[learning/reverse-engineering-should-feed-existing-conceptualization-not-replace-it.md]]
- [[project-concept/changelog/2026-04-18.md]]
