# Remove Include Workspace Option Plan
#plan

**Created:** 2026-03-14
**Scope:** Remove the `--include-workspace` CLI flag and stop shipping `src/obsidian/.obsidian/workspace.json`.
**Changelog:** [[project-concept/changelog/2026-03-14.md]]

## Overview
Simplify Obsidian initialization behavior so `--with-obsidian` installs only shared configuration files and never includes machine-local workspace state.

## Tasks
- [x] Remove `--include-workspace` argument parsing and related help text from `bin/neuroplast.js`.
- [x] Remove `workspace.json` from optional Obsidian copy list.
- [x] Remove `src/obsidian/.obsidian/workspace.json` from source templates.
- [x] Update active docs and concept artifacts to remove `--include-workspace` usage and references.
- [x] Verify CLI help output reflects the new command surface.

## Validation Checklist
- [x] `neuroplast init --help` shows `--with-obsidian` only.
- [x] No active runtime/documentation files reference `--include-workspace`.
- [x] Source template `workspace.json` file is deleted.

## Related Files
- [[project-concept/changelog/2026-03-14.md]]
- [[project-concept/npm-package.md]]
