# Fix Sync Trailing Blank Lines
#plan

**Created:** 2026-03-17
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-17.md]]

## Overview
Fix `sync` tag migration text normalization so compliant markdown files are not rewritten with extra trailing blank lines.

## Tasks

### 1. Correct newline handling in migration formatter
- [x] Preserve original trailing newline contract without adding extra blank lines.
- [x] Remove split-sentinel empty line when source content ends with newline.
- [x] Trim trailing blank lines in reconstructed body to keep output stable.

### 2. Validate behavior
- [x] Run sync dry-run with force to verify no blank-line-only churn.
- [x] Ensure tag insertion logic still applies where required.

### 3. Update records
- [x] Update changelog summary with trailing-blank-line fix.
- [x] Add a learning note documenting newline-safe content reconstruction.

## Validation Checklist
- [x] `ensureTagUnderTitle` no longer creates extra EOF blank lines.
- [x] Sync remains idempotent on already compliant markdown files.
- [x] Changelog and learning artifacts updated.
