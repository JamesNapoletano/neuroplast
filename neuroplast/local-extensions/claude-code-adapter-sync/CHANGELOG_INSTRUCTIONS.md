# Claude Code Adapter Sync — Changelog Extension
#instruction

## Purpose
Add plugin-aware changelog checks when Claude Code adapter assets changed in the current cycle.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/CHANGELOG_INSTRUCTIONS.md`

## Additional Steps

1. Read and follow `neuroplast/CHANGELOG_INSTRUCTIONS.md` first.

2. If the current cycle touched any plugin or Claude Code adapter asset, include in the changelog:
   - Which files changed (list by path under `src/adapter-assets/claude-code/`).
   - Whether the change was format-only or semantic (i.e., does agent/skill behavior differ for the user).
   - Whether OpenCode parallel assets were updated in the same cycle, or left intentionally unchanged.

3. If agent or skill content changed, add a reinstall note: users who have the plugin installed in `~/.claude/` need to copy the updated files from `neuroplast/adapter-assets/claude-code/plugin/` to refresh their local copies.

4. If `plugin.json` version was bumped, confirm the new version appears in the changelog summary.

## Validation Checklist
- [ ] Changed plugin/adapter asset files are listed in the changelog.
- [ ] Semantic vs. format-only distinction is noted.
- [ ] OpenCode parallel asset status is noted (updated or intentionally unchanged).
- [ ] Reinstall note present when agent/skill content changed.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
