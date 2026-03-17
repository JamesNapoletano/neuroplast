# Ignore Source Obsidian Workspace File Plan
#plan

**Created:** 2026-03-14
**Scope:** Prevent machine-specific `src/obsidian/.obsidian/workspace.json` from being committed.
**Changelog:** [[project-concept/changelog/2026-03-14.md]]

## Overview
Ensure the source Obsidian workspace state file remains local-only so developers can open the repo in Obsidian without creating commit noise.

## Tasks
- [x] Verify current ignore rules and confirm nested source path is not covered.
- [x] Add explicit ignore entry for `src/obsidian/.obsidian/workspace.json` in root `.gitignore`.
- [x] Remove the file from the Git index when already staged/tracked.
- [x] Verify Git now reports the file as ignored.

## Validation Checklist
- [x] `.gitignore` contains `src/obsidian/.obsidian/workspace.json`.
- [x] `git status --ignored` reports `!! src/obsidian/.obsidian/workspace.json`.
- [x] Workspace file is no longer included in pending commit set.

## Related Files
- [[project-concept/changelog/2026-03-14.md]]
