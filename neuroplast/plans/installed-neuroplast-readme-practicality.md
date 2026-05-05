# Installed Neuroplast README Practicality
#plan

**Created:** 2026-04-24
**Objective:** Add a practical managed `neuroplast/README.md` to the installed Neuroplast file set so people opening deposited workflow files in a consumer repository can quickly understand how to use them.
**Changelog:** [[project-concept/changelog/2026-05-04.md]]

## Scope
- Add a new source-managed installed README under `src/instructions/README.md`.
- Wire the file into package-managed init/sync behavior so it installs to `neuroplast/README.md`.
- Update repository documentation and architecture references that describe the installed file set.
- Extend CLI reliability coverage for the new managed file.
- Refine the installed README so it feels more human-first and practical for people opening `/neuroplast/` in a consumer repository.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this adds a new managed documentation file that can be created on init and recreated on sync without any content-transforming migration for existing installs.

## Assumptions
- The installed `neuroplast/README.md` should be a practical convenience artifact for consumers, not a new canonical contract file.
- The root repository `README.md` remains the package-level documentation, while `neuroplast/README.md` focuses on immediate in-repo usage after install.
- Existing installs should receive the file through the normal safe managed refresh path.

## Tasks
- [x] Draft a concise practical installed README for `/neuroplast/` consumers.
- [x] Add the file to managed workflow install/sync wiring.
- [x] Update root docs and architecture references that enumerate installed files.
- [x] Add or adjust tests for init/sync coverage.
- [ ] Run validation and targeted tests.
- [x] Run validation and targeted tests.
- [ ] Record changelog and learning updates for the cycle.
- [x] Record changelog and learning updates for the cycle.
- [x] Rewrite the installed README opening and section order to prioritize human usage guidance.
- [x] Mirror the revised wording into both `src/instructions/README.md` and `neuroplast/README.md`.
- [x] Re-run validation after the README refinement.
- [x] Record the README refinement in the current changelog and learning notes.

## Completed Work
- Added a new practical installed README at `src/instructions/README.md` and mirrored it into `neuroplast/README.md` in this repository.
- Wired the installed README into managed workflow files through `src/cli/constants.js` so `init` and `sync` treat it like the other core installed workflow files.
- Updated the root `README.md`, `ARCHITECTURE.md`, and `neuroplast/project-concept/npm-package.md` to describe the new installed orientation file and its role.
- Extended CLI reliability coverage so `init` asserts the presence of `neuroplast/README.md` and sync summary expectations account for the additional managed file.
- Refined the installed README wording to be more practical on first open by adding a fast-start section, clearer human-versus-AI startup guidance, common prompt meanings, and explicit shared-memory framing for the durable folders.

## 2026-05-04 Refinement Slice
- **Objective:** Make the installed README feel more humanized so a person understands how to use Neuroplast before they encounter protocol-oriented wording.
- **Verification for this slice:**
  - A reader can quickly answer what Neuroplast is for, where to start, how to choose between `conceptualize.md` and `act.md`, and where to record progress.
  - `npm run validate` passes after the README updates.
- **Assumptions:**
  - The installed README should primarily serve humans, with AI bootstrap guidance preserved but moved below the human-first guidance.
  - This is a documentation refinement only, so no migration is needed beyond the existing managed-file safe refresh path.

## Completed This Refinement Slice
- Rewrote the installed README opening so it leads with human usage and immediate next steps instead of startup-contract language.
- Reorganized the file around human workflow questions such as where to start, which file to use, and how to record progress.
- Preserved the AI startup contract and advisory context-depth guidance, but moved them below the human-first sections.
- Kept the source-managed and installed copies in lockstep.

## Verification
- `npx neuroplast init` creates `neuroplast/README.md`.
- `npx neuroplast sync` recreates the file when missing and preserves local edits when changed.
- `npm run validate` passes.
- `npm test` passes.

## Handoff Notes
- Keep the installed README practical and brief so it helps first-time consumers without duplicating the full package README.
- Favor plain-language workflow guidance over contract terminology in the top half of the installed README.

## Verification Results
- `npm run validate` -> 94 checks, 0 warnings, 0 errors
- `npm test` -> 35 passing, 0 failing
- `npm run validate` after the humanization pass -> 97 checks, 1 warning, 0 errors
- Validation warning: `neuroplast/current-context.md` may be stale relative to a newer plan artifact; this was outside the README wording scope and did not block the documentation change.
