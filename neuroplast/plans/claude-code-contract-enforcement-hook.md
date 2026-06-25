---
neuroplast:
  role: plan
  step: act
  requires:
    - neuroplast/WORKFLOW_CONTRACT.md
    - neuroplast/interaction-routing.yaml
  writes_to:
    - .claude/settings.json
    - .claude/hooks/
  outputs:
    - .claude/settings.json
    - .claude/hooks/neuroplast-gate.md
  optional: false
  human_review: recommended
  tags:
    - plan
---

# Plan: Claude Code Contract-Enforcement Hook
#plan

## Objective
Make the Neuroplast mandatory startup sequence and short-prompt routing actually
enforced for Claude Code sessions in this repo, instead of relying on advisory
`CLAUDE.md` text the model can skip.

## Motivation
A live test exposed the failure mode: with only `CLAUDE.md` ("Mandatory Startup
Sequence") and the installed plugin (agents + skills), a short "commit and bump
version / go ahead" request was executed directly — the contract files were never
read and routing was never applied. Root cause: `CLAUDE.md` is advisory text the
model weighs against other pressures; plugin agents/skills are opt-in and do not
auto-activate. The only always-on, deterministic surface in Claude Code is a
**hook**, which the harness executes regardless of model judgment.

## Scope (bounded)
- IN: Add a `UserPromptSubmit` hook to project `.claude/settings.json` that injects
  a startup-gate + routing reminder into context on every prompt.
- IN: Store the gate text in `.claude/hooks/neuroplast-gate.md` so it is editable
  without touching JSON.
- OUT: Productizing this as a shipped Claude Code adapter asset under
  `src/adapter-assets/claude-code/` (separate, larger cycle — see Follow-ups).
- OUT: Setting `neuroplast-orchestrator` as the default `agent` (deferred; the hook
  is the higher-leverage, lower-friction first step).

## Approach
- Hook command runs Node (guaranteed in this npm project) to read the gate file and
  emit `{hookSpecificOutput:{hookEventName:"UserPromptSubmit",additionalContext:...}}`
  with `suppressOutput:true` so it does not clutter the transcript.
- Path resolved via `$CLAUDE_PROJECT_DIR` with a `.` fallback.
- Project-scoped `settings.json` (committed) rather than `settings.local.json`, so
  the enforcement protects anyone working in the repo, not just one machine. The
  existing `settings.local.json` (personal permissions) is left untouched.

## Honest limitation
A hook guarantees the gate content is present every turn; it cannot physically force
the model to act on it. It closes the observed gap (contract never loaded at all) but
is not a hard gate. A future stricter layer = default agent + the hook.

## Assumptions
- `.claude/settings.json` does not yet exist (verified: only `settings.local.json`).
- Hooks fire after the settings watcher picks up the new file; may require opening
  `/hooks` once or a restart to activate this session (watcher caveat).

## Verification
- [ ] `node -e ...` reader emits valid JSON (pipe-tested).
- [ ] `jq -e` confirms hook is present at `.hooks.UserPromptSubmit[]` with a command.
- [ ] settings.json is valid JSON.
- [ ] settings.local.json untouched.

## Phase 2 — Productize the gate for everybody (now IN scope)
The stopgap above only protects this one repo. To enforce for ANY Neuroplast user,
bundle the hook in the distributed Claude Code plugin (plugins can ship hooks via
`hooks/hooks.json` + `${CLAUDE_PLUGIN_ROOT}`), so enabling the plugin enforces the
contract — no per-repo manual `.claude/settings.json` edit.

This crosses into adapter-asset territory → `claude-code-adapter-sync` rules apply:
edit `src/` only, then `npx neuroplast sync`; keep plugin.json version aligned to
`package.json`; reinstall to refresh the plugin cache.

### Phase 2 scope
- IN: `src/adapter-assets/claude-code/plugin/hooks/neuroplast-gate.js` — a single,
  self-contained, reusable Node script that emits the gate as `additionalContext`.
- IN: `src/adapter-assets/claude-code/plugin/hooks/hooks.json` — `UserPromptSubmit`
  entry invoking the script via `${CLAUDE_PLUGIN_ROOT}`.
- IN: bump `plugin.json` 1.4.0 → 1.4.1 to match `package.json`.
- IN: `npx neuroplast sync`; update plugin `README.md`; refresh test baselines.
- IN: remove the now-redundant repo-local `.claude/settings.json` + gate file
  (superseded by the plugin hook) to avoid double-injection.
- OUT: OpenCode parallel — hooks are a Claude Code harness feature; no equivalent
  UserPromptSubmit hook in OpenCode, and no agent/skill *logic* changed. N/A.

### Sync-impact decision (package-maintainer extension)
`no migration needed` — the two new plugin files (`hooks/hooks.json`,
`hooks/neuroplast-gate.js`) are additive managed assets picked up by the dynamic
managed-file listing, the same way `marketplace.json` was. Existing installs receive
them via the established managed-file backfill on `npx neuroplast sync`; new installs
get them at init. No data/path migration is required.

### Phase 2 verification
- [ ] `node neuroplast-gate.js < payload` emits valid `additionalContext` JSON.
- [ ] `npx neuroplast sync` propagates new files to `neuroplast/adapter-assets/`.
- [ ] `npm test` green (baseline counts updated to reality, not guessed).
- [ ] plugin.json version == package.json version.

## Links
- Changelog: [[project-concept/changelog/2026-06-25.md]]
