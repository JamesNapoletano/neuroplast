# Neuroplast Claude Code Plugin

This plugin packages the Neuroplast workflow support for Claude Code. It provides the bootstrap skill, routing skill, execution skill, and both Neuroplast agents so any Claude Code user can install them without manually copying adapter assets.

## What's Included

| Component | Purpose |
|-----------|---------|
| `neuroplast-bootstrap` skill | Load the Neuroplast contract, manifest, capabilities, and interaction routing before interpreting requests |
| `neuroplast-route-short-prompts` skill | Apply canonical short-prompt routing (`go ahead`, `plan this`, `what's next?`, etc.) |
| `neuroplast-execute-act` skill | Execute bounded work once routing resolves to `act.md` |
| `neuroplast-orchestrator` agent | Default agent for day-to-day Neuroplast work — bootstrap, route, execute |
| `neuroplast-planner` agent | Read-only planning agent for new, ambiguous, or reframed work |

## Requirements

Your project must have a Neuroplast layout installed. Run `npx neuroplast init` if it doesn't exist yet.

## Install

**Permanent install (recommended):**

After running `npx neuroplast init` in your project, run the install script from your project root:

```bash
node neuroplast/adapter-assets/claude-code/install-plugin.js
```

This registers the plugin in `~/.claude/` so it loads automatically in every Claude Code session. The script is idempotent — safe to run again after a `npx neuroplast sync` that updates plugin files.

**From the marketplace (once published):**
```
/plugin install neuroplast
```

**Per-session only (no permanent install):**
```bash
cc --plugin-dir /path/to/your-project/neuroplast/adapter-assets/claude-code/plugin
```

## Usage

Once installed, the agents and skills are available automatically in any Claude Code session inside a Neuroplast-managed repository. The `neuroplast-bootstrap` skill runs the mandatory startup sequence; the agents invoke it automatically.

Typical flow:
1. Open a Claude Code session in your project.
2. Use the `neuroplast-orchestrator` agent for everyday work.
3. Use the `neuroplast-planner` agent when starting new, ambiguous, or reframed work.
4. Short prompts (`go ahead`, `plan this`, `what's next?`) route through the canonical interaction-routing contract automatically.

## Relationship to Adapter Assets

This plugin packages the same agents and skills found in `neuroplast/adapter-assets/claude-code/` for installable distribution. The canonical source lives in `src/adapter-assets/claude-code/plugin/`. Keep plugin files and adapter assets in sync when updating either.
