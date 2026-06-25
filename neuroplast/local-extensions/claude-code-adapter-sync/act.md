# Claude Code Adapter Sync — Act Extension
#instruction

## Purpose
Add sync-surface checks when execution touches Claude Code adapter assets or the Neuroplast plugin.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/act.md`

## Additional Steps

1. Read and follow `neuroplast/act.md` first.

2. **Identify affected sync surfaces.** Before implementing, check whether the work touches any of:
   - `src/adapter-assets/claude-code/plugin/` (plugin source)
   - `src/adapter-assets/claude-code/CLAUDE.md` (bootstrap asset)
   - `src/adapter-assets/opencode/agents/` or `src/adapter-assets/opencode/skills/` (OpenCode parallel assets)
   - `neuroplast/adapter-assets/claude-code/` (installed copies — should not be edited directly)

3. **src is the only edit surface.** Never edit `neuroplast/adapter-assets/claude-code/` directly. All changes go in `src/adapter-assets/claude-code/` and propagate via `npx neuroplast sync`.

4. **Run sync after changes.** After any change to `src/adapter-assets/claude-code/`, run `npx neuroplast sync` to update `neuroplast/adapter-assets/claude-code/`. Confirm the installed copy reflects the change before marking work complete.

5. **Flag installed-copy reinstall.** If plugin agent or skill content changed (files under `src/adapter-assets/claude-code/plugin/agents/` or `src/adapter-assets/claude-code/plugin/skills/`), note in the active plan that the locally installed `~/.claude/agents/` and `~/.claude/skills/` copies must be refreshed. These are not updated by sync — they require reinstalling the plugin.

6. **Check cross-adapter alignment.** If agent or skill logic changed in the Claude Code plugin, compare with the parallel OpenCode assets:
   - `src/adapter-assets/opencode/agents/neuroplast-orchestrator.md` vs `plugin/agents/neuroplast-orchestrator.md`
   - `src/adapter-assets/opencode/agents/neuroplast-planner.md` vs `plugin/agents/neuroplast-planner.md`
   - `src/adapter-assets/opencode/skills/neuroplast-bootstrap/SKILL.md` vs `plugin/skills/neuroplast-bootstrap/SKILL.md`
   - Bootstrap startup sequence and routing rules should remain semantically equivalent across both adapters.
   - Update the OpenCode assets in the same cycle if the change is semantic (not format-specific).

7. **Check plugin version.** If plugin content changed in a way that warrants a release, confirm `src/adapter-assets/claude-code/plugin/.claude-plugin/plugin.json` version matches the target release version in `package.json`.

## Validation Checklist
- [ ] All edits made to `src/` not `neuroplast/adapter-assets/` directly.
- [ ] `npx neuroplast sync` run after src changes.
- [ ] Installed-copy reinstall flagged in plan when agent/skill content changed.
- [ ] OpenCode assets checked for semantic drift when agent/skill logic changed.
- [ ] Plugin version consistent with `package.json` for release-bound changes.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
