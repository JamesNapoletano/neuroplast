# Source Obsidian Workspace Ignore Rule
#learning

## Insight
Ignoring only `.obsidian/workspace.json` at repository root does not cover nested source template paths like `src/obsidian/.obsidian/workspace.json`.

## Reusable Practice
- Add explicit ignore rules for machine-local files under template source folders (for example, `src/obsidian/.obsidian/workspace.json`).
- After adding ignore rules, run `git status --ignored -- <path>` to verify the file is reported as ignored (`!!`).
- If the file was already staged or tracked, remove it from the index with `git rm --cached -- <path>`.

## Related
- [[plans/ignore-obsidian-source-workspace-file.md]]
- [[project-concept/changelog/2026-03-14.md]]
