# Claude Code Adapter Sync Extension
#instruction

## Purpose
Enforce complete artifact sync for Claude Code adapter assets in this repository. The Claude Code plugin and related adapter assets exist across multiple locations that must stay in sync; this extension makes those sync surfaces explicit so nothing drifts silently.

## Sync Surfaces

| Canonical source | Must stay in sync with | Mechanism |
|---|---|---|
| `src/adapter-assets/claude-code/plugin/` | `neuroplast/adapter-assets/claude-code/plugin/` | `npx neuroplast sync` |
| `src/adapter-assets/claude-code/plugin/agents/*.md` | `~/.claude/agents/` (installed copies) | Manual reinstall of plugin |
| `src/adapter-assets/claude-code/plugin/skills/*/SKILL.md` | `~/.claude/skills/neuroplast-*/` (installed copies) | Manual reinstall of plugin |
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
- Claude Code plugin source-to-installed sync
- Installed-copy (agent/skill) reinstall tracking
- Cross-adapter semantic alignment (Claude Code ↔ OpenCode)
- Plugin version consistency

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
