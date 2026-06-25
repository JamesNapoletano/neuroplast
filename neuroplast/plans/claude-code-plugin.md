# Claude Code Plugin
#plan

**Created:** 2026-06-24
**Changelog:** [[project-concept/changelog/2026-06-24.md]]

## Current Objective
Package the Neuroplast Claude Code adapter assets (agents and skills) as an installable Claude Code plugin so users can get full Neuroplast workflow support in one step rather than manually copying files. Add a local workflow extension that enforces complete artifact sync for those plugin assets. Provide an install script so users can permanently register the plugin in `~/.claude/` without per-session flags.

## Scope
- Create the plugin at `src/adapter-assets/claude-code/plugin/` (source) and `neuroplast/adapter-assets/claude-code/plugin/` (installed copy).
- Plugin contains: `plugin.json`, `neuroplast-orchestrator` agent, `neuroplast-planner` agent, `neuroplast-bootstrap` skill, `neuroplast-route-short-prompts` skill, `neuroplast-execute-act` skill, and `README.md`.
- Update `ARCHITECTURE.md` to document plugin path and all 7 new sync mappings.
- Update test file-count assertions to reflect 7 new managed adapter-asset files.
- Create `neuroplast/local-extensions/claude-code-adapter-sync/` with `README.md`, `act.md`, `CHANGELOG_INSTRUCTIONS.md`, and `think.md`.
- Activate `claude-code-adapter-sync` in `neuroplast/manifest.yaml`.

## Non-Goals
- Do not publish the plugin to a marketplace (future work).
- Do not add CLI commands to install/manage the plugin.
- Do not change canonical workflow phases, file paths, or artifact roles.

## Sync Impact Decision
- **no migration needed** — the plugin files are new adapter assets added under `src/adapter-assets/claude-code/plugin/`. The dynamic file listing in `constants.js` picks them up automatically via `listManagedFilesRelative`. No one-time content migration is required.

## Assumptions
- The dynamic `adapterAssetFiles` listing in `src/cli/constants.js` will automatically include new files added to `src/adapter-assets/` without any code change — verified by running the listing logic directly.
- Plugin agent and skill content matches what is already installed in `~/.claude/` in this environment; these are the canonical Claude Code–specific versions.
- The OpenCode parallel assets (`src/adapter-assets/opencode/`) use a compatible but format-distinct representation; no OpenCode changes were needed for this cycle.

## Execution Steps
1. - [x] Create plugin directory at `src/adapter-assets/claude-code/plugin/` with `plugin.json`, agents, skills, `README.md`.
2. - [x] Mirror plugin to `neuroplast/adapter-assets/claude-code/plugin/` via `cp -r`.
3. - [x] Update `ARCHITECTURE.md` — add plugin to file installation table and portability notes.
4. - [x] Confirm dynamic file listing picks up all 7 new files (node one-liner verification).
5. - [x] Update test assertions: `52 → 59` baselines adopted, `53 → 60` unchanged.
6. - [x] Run `npm test` — 45/45 pass.
7. - [x] Create `neuroplast/local-extensions/claude-code-adapter-sync/` with all 4 extension files.
8. - [x] Activate extension in `neuroplast/manifest.yaml`.
9. - [x] Run `npx neuroplast validate` — 101 checks, 0 errors.
10. - [x] Create plan, changelog, concept-consistency check, learning notes.
11. - [x] Investigate permanent install mechanism — discovered `installed_plugins.json` + `settings.json` `enabledPlugins` as the registration surface.
12. - [x] Write `src/adapter-assets/claude-code/install-plugin.js` — idempotent Node.js script that registers the plugin permanently in `~/.claude/`.
13. - [x] Mirror script to `neuroplast/adapter-assets/claude-code/install-plugin.js`.
14. - [x] Update plugin `README.md` in both src and installed copies with correct install instructions.
15. - [x] Update `ARCHITECTURE.md` to add `install-plugin.js` sync mapping.
16. - [x] Update test assertions: `59 → 60` baselines adopted, `60 → 61` unchanged.
17. - [x] Run `npm test` — 45/45 pass.
18. - [x] Manually registered plugin via `installed_plugins.json` + `settings.json` in this environment.

## Sync Impact Decision
- **no migration needed** — `install-plugin.js` is a new adapter asset picked up by the dynamic file listing. No content-transforming migration required.

## Verification
- [x] `npm test` — 45/45 pass.
- [x] `npx neuroplast validate` — 101 checks, 0 errors.
- [x] Dynamic listing confirms 7 plugin files + `install-plugin.js` appear under `claude-code/`.
- [x] Install script runs idempotently — both "first install" and "already installed" paths verified.
- [x] Plugin permanently installed via official `claude plugin` CLI as `neuroplast@neuroplast-local` (local "directory" marketplace declared in `.claude-plugin/marketplace.json`). Replaced the earlier fragile hand-edited-JSON approach, which caused the "Marketplace 'local' not found" error and `/plugin list` disappearance.
- [x] `claude plugin list` confirms `neuroplast@neuroplast-local` v1.4.0 enabled.
- [ ] Agents appear in Claude Code `/agents` list after fresh session start (pending session restart).

## Handoff
- Start a new Claude Code session to confirm agents and skills load and no marketplace error appears.
- After editing plugin files, run `claude plugin update neuroplast@neuroplast-local` to refresh the cached copy (content is cached at install time).
- Future: publish plugin to Claude Code marketplace when ready.

## Related
- [[project-concept/npm-package.md]]
- [[project-concept/changelog/2026-06-24.md]]
