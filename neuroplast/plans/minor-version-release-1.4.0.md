# Minor Version Release 1.4.0
#plan

**Created:** 2026-06-25
**Changelog:** [[project-concept/changelog/2026-06-24.md]]

## Current Objective
Bump the Neuroplast npm package from `1.3.4` to `1.4.0` to reflect the addition of the Claude Code plugin, install script, and `claude-code-adapter-sync` local extension as a meaningful capability addition warranting a minor version increment.

## Scope
Update the npm version and all canonical version statements to `1.4.0`:
- `package.json`
- `src/lcp/profile.js` — `versionStatement`
- `src/instructions/manifest.yaml` — `compatibility_statement`
- `src/lcp-files/profiles/neuroplast-default.yaml` — `version_statement`
- `README.md` — version badge line
- `src/adapter-assets/claude-code/plugin/.claude-plugin/plugin.json` — `version`
- `neuroplast/adapter-assets/claude-code/plugin/.claude-plugin/plugin.json` — `version`

## Sync Impact Decision
- **no migration needed** — the version statement updates propagate to managed files (`src/instructions/manifest.yaml`, `src/lcp-files/profiles/`) via safe-refresh sync on the next `npx neuroplast sync`. No one-time content migration is required.

## Execution Steps
1. - [x] Record this plan and sync-impact decision before implementation.
2. - [x] Update all seven version strings listed above.
3. - [x] Run `npm test` — 45/45 pass.
4. - [ ] Commit plugin work, then commit version bump separately.

## Verification
- [x] `npm test` — 45/45 pass.
- [x] `node -e "console.log(require('./package.json').version)"` outputs `1.4.0`.
- [x] No version string grep returns `1.3.4` in canonical files.

## Related
- [[plans/claude-code-plugin.md]]
- [[project-concept/changelog/2026-06-24.md]]
