# On-Demand Conflict Reconciliation Instruction
#plan

**Created:** 2026-04-19
**Related to:** [[project-concept/npm-package.md]]

## Overview
Add a shipped, on-demand Neuroplast instruction for reconciling file conflicts without blindly choosing one side, so human + AI operators can preserve unique information and meld overlapping truth across competing edits.

## Scope
- Add a specialized instruction file for explicit conflict-reconciliation sessions.
- Ship the instruction in the package-managed instruction set.
- Update managed-file wiring, manifest/profile requirements, and documentation inventories.
- Add CLI tests proving the instruction is installed and validated as a required shipped instruction.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this change adds a new managed instruction file to fresh installs and future sync refreshes, but existing installs do not require a content-transforming migration because missing managed files are already created during sync.

## Assumptions
- Conflict reconciliation is a specialized, explicit entrypoint like `reverse-engineering.md`, not the new everyday default.
- The instruction should preserve the existing date-based changelog contract for now and focus on rescue/reconciliation behavior rather than changing the canonical artifact layout.

## Tasks

### 1. Add the instruction
- [x] Create `src/instructions/reconcile-conflicts.md` with Neuroplast frontmatter and `#instruction` tag.
- [x] Define explicit usage guidance, reconciliation rules, and stop conditions.

### 2. Ship and validate it as a managed instruction
- [x] Add the instruction to `src/instructions/manifest.yaml` required instruction list.
- [x] Add the instruction to `src/cli/constants.js` workflow file list.
- [x] Add the instruction to `src/lcp/profile.js` required instruction list.

### 3. Update docs and inventories
- [x] Update `README.md` to present `reconcile-conflicts.md` as an on-demand specialized entrypoint.
- [x] Update `ARCHITECTURE.md` installation inventories and workflow overview.
- [x] Update any relevant adapter or instruction references if they enumerate entrypoint choices.

### 4. Verify
- [x] Add CLI coverage showing `init` installs the instruction.
- [x] Add CLI coverage showing `validate` fails if the instruction is missing.
- [x] Run repository validation and tests.

## Verification
- `npm test`
- `npm run validate`

## Handoff Notes
- Keep the instruction specialized and rescue-oriented rather than turning it into an always-on collaboration policy.
- If future real-world usage shows frequent changelog collisions, consider a follow-up plan for session-scoped changelog artifacts or a preventive collaboration extension.

## Related
- [[project-concept/release-operations.md]]
- [[learning/reverse-engineering-should-feed-existing-conceptualization-not-replace-it.md]]
