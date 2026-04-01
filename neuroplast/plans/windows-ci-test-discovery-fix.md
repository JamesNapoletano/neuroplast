# Windows CI Test Discovery Fix
#plan

**Created:** 2026-04-01
**Related to:** [[project-concept/release-operations.md]]
**Changelog:** [[project-concept/changelog/2026-04-01.md]]

## Overview
Fix the CI test failure caused by shell-dependent wildcard expansion in the npm test script so release verification behaves the same on Windows and POSIX runners.

## Tasks

### 1. Confirm root cause
- [x] Trace the failure to `node --test test/*.test.js` being passed literally on Windows.
- [x] Confirm the repository already contains discoverable `node:test` files under `test/`.

### 2. Implement a cross-platform fix
- [x] Replace the shell-dependent test glob with Node's built-in test discovery.
- [x] Keep the external maintainer command surface unchanged as `npm test`.

### 3. Verify release workflow behavior
- [x] Run `npm test` locally.
- [x] Run `npm run release:verify` locally.
- [x] Confirm no migration is needed because no managed install payload or sync semantics changed.

## Sync Impact
**Decision:** no migration needed

**Reason:** This change only updates repository-local verification behavior in `package.json` and related maintainer documentation; it does not change installed managed files, sync state, or upgrade behavior for consuming repositories.

## Success Criteria
- [x] `npm test` passes on the local repository.
- [x] `npm run release:verify` passes locally.
- [x] Windows CI no longer depends on shell glob expansion for test discovery.

## Related Files
- `package.json`
- `ARCHITECTURE.md`
- [[project-concept/release-operations.md]]
- [[project-concept/changelog/2026-04-01.md]]
