# Patch Release 1.3.3
#plan

**Created:** 2026-05-07
**Related to:** [[project-concept/release-operations.md]]
**Changelog:** [[project-concept/changelog/2026-05-07.md]]

## Overview
Package the OpenCode planner automatic safety-lock refinements into a `1.3.3` patch release and sync the canonical version statement across release-facing artifacts.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** this patch updates managed documentation/assets and version statements without requiring content-transforming migration logic for existing installs.

## Tasks

### 1. Bump package version
- [x] Update `package.json` from `1.3.2` to `1.3.3`.

### 2. Sync canonical version statements
- [x] Update the canonical human-readable version statement from `Neuroplast v1.3.2 implements LCP v1` to `Neuroplast v1.3.3 implements LCP v1` across current release-facing files.

### 3. Record the release
- [x] Update the `2026-05-07` changelog entry with release/version details and related plan links.

### 4. Verify
- [x] Run `npm run release:verify`.

## Verification
- `npm run validate`
- `npm run release:verify`

## Assumptions
- Existing references to `1.3.2` in prior release plans/changelog entries remain valid historical records and should not be rewritten.

## Handoff Notes
- Exclude local `.obsidian` workspace-only files from release commits unless explicitly requested.
