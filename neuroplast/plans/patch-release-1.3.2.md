# Patch Release 1.3.2
#plan

**Created:** 2026-05-05
**Related to:** [[project-concept/release-operations.md]]
**Changelog:** [[project-concept/changelog/2026-05-05.md]]

## Overview
Package the current context-efficiency, OpenCode handoff, and installed README refinements into the `1.3.2` patch release and sync the canonical version statement across current release-facing artifacts.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this patch release ships additive managed asset, validation, adapter-guidance, and documentation refinements that existing installs can receive through the normal `sync` path without a new content-transforming migration.

## Tasks

### 1. Bump package version
- [x] Update `package.json` from `1.3.1` to `1.3.2`.

### 2. Sync canonical version statements
- [x] Update the canonical human-readable version statement from `Neuroplast v1.3.1 implements LCP v1` to `Neuroplast v1.3.2 implements LCP v1` across current release-facing files.
- [x] Cover README, source profile code, source manifests, shipped `.lcp` profile artifacts, and LCP-facing docs.

### 3. Record the release
- [x] Add a release entry under `2026-05-05` changelog.
- [x] Link this plan from that changelog entry.

### 4. Verify
- [x] Run `npm run release:verify`.

## Verification
- `npm run release:verify`

## Assumptions
- The current uncommitted context-efficiency, active-plan, OpenCode handoff, and installed README updates are the intended scope for the `1.3.2` patch release.
- Historical references to `1.3.1` in prior release plans and prior changelog entries remain history rather than current version statements.

## Handoff Notes
- Exclude local `.obsidian` workspace-only changes from the release commit unless explicitly requested.

## Verification Results
- `npm run release:verify` -> passed
