# Patch Release 1.3.4
#plan

**Created:** 2026-06-11
**Related to:** [[plans/patch-release-1.3.3.md]]
**Changelog:** [[project-concept/changelog/2026-06-11.md]]

## Overview
Bump the package patch version from `1.3.3` to `1.3.4` and sync the canonical
human-readable version statement across release-facing source, docs, and the LCP
bridge profile so installed and shipped artifacts stay internally consistent.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this patch only updates version statements and the package version
  field. It does not add or alter content-transforming managed assets that would
  require migration behavior for existing installs (same posture as `1.3.3`).

## Tasks

### 1. Bump package version
- [x] Update `package.json` from `1.3.3` to `1.3.4`.

### 2. Sync canonical version statements
- [x] Update `Neuroplast v1.3.3 implements LCP v1` to `Neuroplast v1.3.4 implements LCP v1`
  across current release-facing files: `src/lcp/profile.js`,
  `src/lcp-files/profiles/neuroplast-default.yaml`, `src/instructions/manifest.yaml`,
  `README.md`, and `docs/lcp-compatibility.md`, `docs/lcp-mapping.md`,
  `docs/migration-to-lcp.md`.
- [x] Run `npm run sync`; it detected the bump and refreshed
  `neuroplast/.neuroplast-state.json`.
- [x] Update the sync-preserved LCP bridge profile `.lcp/profiles/neuroplast-default.yaml`
  directly (safe-refresh preserved it due to local edits / no stored baseline).

### 3. Record the release
- [x] Add the `2026-06-11` changelog entry with release/version details and plan links.

### 4. Verify
- [x] Run `npm run validate` (99 checks, 0 errors).
- [x] Run `npm run release:verify` (validate + tests + pack + smoke install passed).

## Process Note
- This release was executed and pushed before the package-maintainer plan +
  sync-impact decision were recorded. This plan and the matching changelog entry
  were authored immediately afterward to restore contract compliance. The recorded
  decision (`no migration needed`) matches what the implementation actually did, so
  no release artifacts required correction.

## Assumptions
- Existing references to `1.3.3` in prior release plans/changelog entries and in
  per-file `lastSyncedVersion` state for sync-preserved files remain valid
  historical records and should not be rewritten.

## Handoff Notes
- Exclude local `.obsidian` workspace-only files from release commits unless explicitly requested.
