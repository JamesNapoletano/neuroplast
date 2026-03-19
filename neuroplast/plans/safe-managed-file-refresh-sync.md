# Safe Managed File Refresh Sync
#plan

**Created:** 2026-03-19
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-19.md]]

## Overview
Teach `sync` to safely refresh package-managed workflow files when packaged templates change, while preserving locally modified files.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this work changes the sync runtime and managed-file state model so future package updates can refresh unchanged managed files without requiring a bespoke migration per instruction-file edit.

## Tasks

### 1. Add Managed Refresh Metadata
- [ ] Extend sync state with per-file baseline metadata for package-managed static files.
- [ ] Keep existing state compatible with installs that only track managed file paths.

### 2. Implement Safe Managed Refresh
- [ ] Add a sync refresh phase for package-managed workflow, adapter, and bundled extension files.
- [ ] Create missing managed files during sync.
- [ ] Overwrite existing files only when they still match the last synced baseline.
- [ ] Skip locally modified files and report the preservation decision.

### 3. Update Documentation
- [ ] Update `README.md` with the safe refresh behavior.
- [ ] Update `ARCHITECTURE.md` and concept docs to reflect baseline-aware managed-file refresh.

### 4. Validate
- [ ] Run CLI help to confirm command docs remain accurate.
- [ ] Run `sync --dry-run --force` to verify refresh reporting.
- [ ] Run `validate` to confirm the workflow contract still passes.

## Validation Checklist
- [ ] Sync creates missing package-managed files.
- [ ] Sync updates unchanged managed files when packaged content changes.
- [ ] Sync preserves locally modified managed files.
- [ ] State persists per-file baseline metadata.
- [ ] Documentation reflects the new sync behavior.

## Related
- [[plans/versioned-managed-file-sync.md]]
- [[project-concept/npm-package.md]]
