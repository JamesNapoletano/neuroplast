# Minor Version Doc Sync 1.2.3
#plan

**Created:** 2026-04-19
**Related to:** [[project-concept/release-operations.md]]

## Overview
Package the post-conflict-reconciliation workflow state into the `1.2.3` patch release and sync the canonical version statement across release-facing docs and profile artifacts.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this patch release updates package metadata and release-facing version statements only; it does not change managed-file behavior or introduce a new migration requirement for existing installs.

## Tasks

### 1. Bump package version
- [x] Update `package.json` from `1.2.2` to `1.2.3`.

### 2. Sync canonical version statements
- [x] Update the canonical human-readable version statement from `Neuroplast v1.2.2 implements LCP v1` to `Neuroplast v1.2.3 implements LCP v1` across current release-facing files.
- [x] Cover README, source profile code, source manifests, shipped `.lcp` profile artifacts, and LCP-facing docs.

### 3. Record the patch release
- [x] Add a new release bullet under the existing `2026-04-19` changelog entry.
- [x] Link this plan from the same changelog entry.

### 4. Verify
- [x] Run `npm test`.
- [x] Run `npm run validate`.

## Verification
- `npm test`
- `npm run validate`

## Handoff Notes
- Preserve historical references to `1.2.2` in prior plans and changelog entries as release history.
- Update only current release-facing statements and artifacts that should describe the active package version.

## Related
- [[learning/canonical-version-statements-should-be-synced-across-shipped-docs-and-profiles.md]]
- [[project-concept/changelog/2026-04-19.md]]
