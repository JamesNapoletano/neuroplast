# NPM Release Readiness Plan
#plan

**Created:** 2026-03-13
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-14.md]]

## Overview
Finalize npm package metadata, confirm publish payload quality, and prepare a deterministic checklist for first public release of `neuroplast@1.0.0`.

## Tasks

### 1. Metadata and Versioning Cleanup

**Goal:** Ensure publish-safe package metadata and stable first-release versioning.

**Actions:**
- [x] Confirm package name and initial stable version (`1.0.0`)
- [x] Add `author` field for release metadata completeness
- [x] Add `publishConfig.access=public` to reduce publish command mistakes
- [x] Ensure license declaration and LICENSE file are aligned

---

### 2. Package Payload Validation

**Goal:** Verify only required assets ship in npm tarball.

**Actions:**
- [x] Trim `package.json#files` allowlist to runtime essentials
- [x] Run `npm pack --dry-run`
- [x] Verify CLI entrypoint and source templates are included

---

### 3. Release Messaging and Publish Preparation

**Goal:** Prepare release-ready commit messaging and operator checklist.

**Actions:**
- [x] Draft release-ready commit message focused on release intent
- [x] Prepare publish checklist with preflight, publish, and post-publish verification

---

## Validation Checklist

- [x] `package.json` metadata is release-ready.
- [x] LICENSE file exists and matches declared license.
- [x] Dry-run packaging output is reviewed.
- [x] Release commit message is drafted.
- [x] Publish checklist is complete and actionable.

## Related Files

- [[project-concept/npm-package.md]]
- [[plans/npm-package-implementation.md]]
- [[project-concept/changelog/2026-03-14.md]]
