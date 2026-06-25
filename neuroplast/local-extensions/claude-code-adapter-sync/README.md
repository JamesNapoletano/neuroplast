# Claude Code Adapter Sync Extension
#instruction

## Purpose
Enforce complete artifact sync for Claude Code adapter assets in this repository. The Claude Code plugin and related adapter assets exist across multiple locations that must stay in sync; this extension makes those sync surfaces explicit so nothing drifts silently.

## Sync Surfaces

| Canonical source | Must stay in sync with | Mechanism |
|---|---|---|
| `src/adapter-assets/claude-code/plugin/` | `neuroplast/adapter-assets/claude-code/plugin/` | `npx neuroplast sync` |
| `src/adapter-assets/claude-code/.claude-plugin/marketplace.json` | `neuroplast/adapter-assets/claude-code/.claude-plugin/marketplace.json` | `npx neuroplast sync` |
| `src/adapter-assets/claude-code/install-plugin.js` | `neuroplast/adapter-assets/claude-code/install-plugin.js` | `npx neuroplast sync` |
| `neuroplast/adapter-assets/claude-code/plugin/` (installed content) | `~/.claude/plugins/cache/neuroplast-local/neuroplast/<version>/` | `claude plugin update` (version bump) or uninstall+install (same-version edit) |
| Claude Code plugin agent/skill semantics | `src/adapter-assets/opencode/agents/` and `src/adapter-assets/opencode/skills/` | Manual cross-adapter review |
| `src/adapter-assets/claude-code/plugin/.claude-plugin/plugin.json` version | `package.json` version | Manual bump on release |
| `src/adapter-assets/claude-code/CLAUDE.md` | `neuroplast/adapter-assets/claude-code/CLAUDE.md` | `npx neuroplast sync` |

## Activation
Declare `claude-code-adapter-sync` in `extensions.active_local` inside `neuroplast/manifest.yaml`.

## Step Mapping
- `act` → `act.md`
- `changelog` → `CHANGELOG_INSTRUCTIONS.md`
- `think` → `think.md`

## Scope
- Claude Code plugin source-to-installed sync (`src/` → `neuroplast/adapter-assets/`)
- Local marketplace manifest and installer sync
- Plugin cache refresh tracking (`claude plugin update` after content changes)
- Cross-adapter semantic alignment (Claude Code ↔ OpenCode)
- Plugin version consistency

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
