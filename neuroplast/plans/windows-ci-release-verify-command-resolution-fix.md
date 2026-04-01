# Windows CI Release Verify Command Resolution Fix
#plan

**Created:** 2026-04-01
**Related to:** [[project-concept/release-operations.md]]
**Changelog:** [[project-concept/changelog/2026-04-01.md]]

## Overview
Fix the Windows CI release verification failure caused by `release:verify` assuming `npm.cmd` and `npx.cmd` live under `%APPDATA%\npm` instead of letting Windows resolve the commands from `PATH`.

## Tasks

### 1. Confirm root cause
- [x] Trace the failure to the Windows-specific command wrapper logic in `scripts/release-verify.js`.
- [x] Confirm the script currently hardcodes `%APPDATA%\npm\{npm,npx}.cmd` for Windows.

### 2. Implement a cross-platform fix
- [ ] Update Windows command execution to invoke bare `npm` and `npx` through `cmd.exe` so runner `PATH` resolution works in both local and GitHub Actions environments.
- [ ] Preserve existing POSIX behavior and command labels.

### 3. Verify release workflow behavior
- [ ] Run targeted local checks for the updated release verification path.
- [ ] Run `npm run release:verify` locally.
- [ ] Confirm no migration is needed because no installed payload, sync behavior, or user-facing CLI contract changes.

## Sync Impact
**Decision:** no migration needed

**Reason:** This change only adjusts repository-local release verification command execution on Windows. It does not alter shipped workflow files, installed repository layout, sync state, or the published CLI surface.

## Success Criteria
- [ ] Windows release verification no longer depends on `%APPDATA%\npm`.
- [ ] `npm run release:verify` passes locally after the fix.
- [ ] The verification script continues to work on non-Windows platforms unchanged.

## Related Files
- `scripts/release-verify.js`
- `ARCHITECTURE.md`
- [[project-concept/release-operations.md]]
- [[project-concept/changelog/2026-04-01.md]]
