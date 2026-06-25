# Local Claude Code Plugins Must Be Installed via a "directory" Marketplace, Not Hand-Edited JSON

**Date:** 2026-06-25
**Context:** Permanent local install of the Neuroplast Claude Code plugin without marketplace submission

## What I Got Wrong (twice)
1. Hand-edited `~/.claude/plugins/installed_plugins.json` + `settings.json` with key `neuroplast@local`. Claude Code parsed `@local` as a marketplace name, failed to find it in `known_marketplaces.json`, and showed "Marketplace 'local' not found" on every session.
2. Tried a bare `neuroplast` key — the plugin then vanished from `/plugin list` entirely (the `name@marketplace` form is required).
3. Tried registering a `local` marketplace stub with source type `"local"` — that type is invalid and **corrupted** the marketplace config (`marketplace list` then errored).

## The Correct Mechanism
Claude Code ships a first-class CLI for exactly this. A local plugin is hosted by a local marketplace:

```bash
claude plugin marketplace add /path/to/<marketplace-root>
claude plugin install <plugin-name>@<marketplace-name>
```

- The marketplace root contains `.claude-plugin/marketplace.json` (validate with `claude plugin validate <dir>`).
- Marketplace source type for a local path is `"directory"` (NOT `"local"`).
- A plugin entry's `source` must be a **subdirectory** path (e.g. `"./plugin"`); `"."` is rejected.
- The marketplace NAME comes from `marketplace.json`'s `name` field and is what you reference as `<plugin>@<name>`.
- Both `marketplace add` and `install` are idempotent — safe to script.

## Critical Gotcha: Content Is Cached, and `update` Is Version-Gated
`install` copies plugin content into `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`. Editing the source files later does NOT update the running plugin. Refresh rule:
- **Version bump** (`plugin.json` version increased): `claude plugin update <plugin>@<marketplace>` picks it up.
- **Same-version edit:** `update` reports "already at latest version" and does nothing — you must `uninstall` + `install` to force a fresh cache copy.

## Lesson
Don't reverse-engineer and hand-edit a tool's internal state files. Check for a supported CLI first (`claude plugin --help`). The `@marketplace` suffix in a plugin key is a resolved marketplace identifier, not a free-form tag — improvising it (or its backing config) breaks lookups or corrupts state.
