# Package Rename Plan: `neuroplast-npm` → `neuroplast`
#plan

**Created:** 2026-03-13
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-14.md]]

## Overview
Rename the npm package from `neuroplast-npm` to `neuroplast` before first publish, and align user-facing usage examples and release artifacts accordingly.

## Tasks

### 1. Package Metadata Rename

**Goal:** Publish under canonical package name.

**Actions:**
- [x] Update `package.json#name` to `neuroplast`

---

### 2. User-Facing Command Updates

**Goal:** Ensure install/init examples match package rename.

**Actions:**
- [x] Update README `npx` command examples to `npx neuroplast init`

---

### 3. Concept/Plan Artifact Alignment

**Goal:** Keep planning and release docs consistent with implementation.

**Actions:**
- [x] Update concept references that include old package folder/name
- [x] Update release plan references to `neuroplast@1.0.0`

---

### 4. Verification

**Goal:** Confirm renamed package metadata and tarball identity.

**Actions:**
- [x] Verify npm registry query for `neuroplast` currently returns unclaimed status
- [x] Re-run `npm pack --dry-run` and confirm tarball naming

## Validation Checklist

- [x] Package metadata uses `neuroplast`.
- [x] README commands use `npx neuroplast ...`.
- [x] Concept/plan artifacts align with renamed package.
- [x] Dry-run tarball reflects renamed package identity.

## Related Files

- [[project-concept/npm-package.md]]
- [[plans/npm-release-readiness.md]]
- [[project-concept/changelog/2026-03-14.md]]
