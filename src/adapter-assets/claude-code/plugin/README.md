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
| `neuroplast-gate` hook (`UserPromptSubmit`) | Injects the mandatory startup sequence + canonical routing into context on **every** prompt, so the contract is enforced deterministically by the harness — not left to advisory `CLAUDE.md` text the model can skip |
| `neuroplast-track-changes` hook (`PostToolUse`) | Silently records which files the session edits/creates, so the Stop gate can check real work against the contract |
| `neuroplast-artifact-gate` hook (`Stop`) | **Mechanically blocks turn completion** when the session changed files but recorded no changelog entry — the qualitative jump from a reminder the model can skip to a gate the harness enforces |

## Requirements

Your project must have a Neuroplast layout installed. Run `npx neuroplast init` if it doesn't exist yet.

## Install

**Permanent install (recommended):**

After running `npx neuroplast init` in your project, run the install script from your project root:

```bash
node neuroplast/adapter-assets/claude-code/install-plugin.js
```

This uses the official `claude plugin` CLI to register a local "directory" marketplace (`neuroplast-local`, declared in `neuroplast/adapter-assets/claude-code/.claude-plugin/marketplace.json`) and install the `neuroplast` plugin from it. It loads automatically in every Claude Code session. The script is idempotent — safe to run again.

Equivalent manual steps:
```bash
claude plugin marketplace add /path/to/your-project/neuroplast/adapter-assets/claude-code
claude plugin install neuroplast@neuroplast-local
```

> **Note:** Claude Code caches plugin content at install time. To pick up changed plugin files:
> - **On a version bump** (`plugin.json` version increased): `claude plugin update neuroplast@neuroplast-local`.
> - **Same-version content edits** (e.g. local iteration): `update` will report "already at latest version" and do nothing — reinstall to force a refresh:
>   ```bash
>   claude plugin uninstall neuroplast@neuroplast-local && claude plugin install neuroplast@neuroplast-local
>   ```
> Start a new Claude Code session afterward.

**Per-session only (no permanent install):**
```bash
cc --plugin-dir /path/to/your-project/neuroplast/adapter-assets/claude-code/plugin
```

## Usage

Once installed, the agents and skills are available automatically in any Claude Code session inside a Neuroplast-managed repository. The `neuroplast-bootstrap` skill runs the mandatory startup sequence; the agents invoke it automatically.

The bundled hooks (`hooks/hooks.json`) need no configuration; all are self-contained Node scripts with no dependencies, and all no-op in repositories that have no `neuroplast/` contract:

- **`neuroplast-gate`** (`UserPromptSubmit`) injects the startup gate and routing rules on every prompt. A hook guarantees the contract is *present* every turn — but injected text is still advisory in effect; the model can read it and still not act.
- **`neuroplast-track-changes`** (`PostToolUse`) records each file the session edits or creates into a session-scoped tracker in the OS temp dir. It never blocks a tool and produces no output.
- **`neuroplast-artifact-gate`** (`Stop`) is the mechanical enforcement half. If the session changed real files but never wrote a changelog entry, it returns `{"decision":"block"}` and the harness refuses to end the turn until the changelog (and `ARCHITECTURE.md`, if structural) is updated. This is enforcement, not a reminder: turn completion is withheld, not just annotated.

  **Honest limits, by design:** the gate verifies a changelog file was *touched*, not that the entry is *meaningful* (a token edit satisfies it — close that gap with human review, not a hook); it nudges **once** per turn (if it already blocked and the condition is still unmet, `stop_hook_active` lets the stop through so the session can never hang); and it is fail-open (any internal error allows the stop). For a still-stricter posture, also set `neuroplast-orchestrator` as your default agent.

To activate these hooks after this update, refresh the plugin cache (`claude plugin update neuroplast@neuroplast-local`) and start a new session.

Typical flow:
1. Open a Claude Code session in your project.
2. Use the `neuroplast-orchestrator` agent for everyday work.
3. Use the `neuroplast-planner` agent when starting new, ambiguous, or reframed work.
4. Short prompts (`go ahead`, `plan this`, `what's next?`) route through the canonical interaction-routing contract automatically.

## Relationship to Adapter Assets

This plugin packages the same agents and skills found in `neuroplast/adapter-assets/claude-code/` for installable distribution. The canonical source lives in `src/adapter-assets/claude-code/plugin/`. Keep plugin files and adapter assets in sync when updating either.
