# Patch Release 1.3.1
#plan

**Created:** 2026-04-24
**Related to:** [[project-concept/release-operations.md]]

## Overview
Package the latest instruction, learning-capture, and parity-alignment updates into the `1.3.1` patch release and sync the canonical version statement across current release-facing artifacts.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this patch release updates managed instruction content and current version statements without introducing a new content-transforming migration requirement for existing installs.

## Tasks

### 1. Bump package version
- [x] Update `package.json` from `1.3.0` to `1.3.1`.

### 2. Sync canonical version statements
- [x] Update the canonical human-readable version statement from `Neuroplast v1.3.0 implements LCP v1` to `Neuroplast v1.3.1 implements LCP v1` across current release-facing files.
- [x] Cover README, source profile code, source manifests, shipped `.lcp` profile artifacts, and LCP-facing docs.

### 3. Record the release
- [x] Add a release bullet under the existing `2026-04-24` changelog entry.
- [x] Link this plan from that changelog entry.

### 4. Verify
- [x] Run `npm run validate`.

## Verification
- `npm run validate`

## Assumptions
- The current uncommitted workflow instruction and learning-capture updates are the intended scope for the `1.3.1` patch release.
- Historical references to `1.3.0` in prior release plans and release-history bullets remain as history rather than current version statements.

## Handoff Notes
- Exclude local `.obsidian` workspace-only changes from the release commit unless explicitly requested.

## Verification Results
- `npm run validate` -> 94 checks, 0 warnings, 0 errors
