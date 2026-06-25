# Workflow-Contract Adherence Needs a Harness Hook, Not Advisory Instructions
#learning

## Insight
A workflow contract enforced only through `CLAUDE.md` ("Mandatory Startup Sequence")
and an installed plugin (agents + skills) is **not actually enforced**. In a live
test, a short "commit and bump version / go ahead" request was executed directly: the
contract files were never read and short-prompt routing was never applied.

## Why It Happens
- `CLAUDE.md` is always loaded but is **advisory text** — the model weighs it against
  competing pressures (e.g. "act once you have enough info"), and on a task that looks
  trivial the instruction loses.
- Plugin **agents** only run when selected; plugin **skills** only fire when their
  description matches or they are invoked. Neither auto-activates for an arbitrary
  request, so the bootstrap/routing skills stay dormant.
- The only always-on, deterministic surface in Claude Code is a **hook**, which the
  harness executes regardless of model judgment.

## Reusable Practice
- To make a startup sequence or routing rule reliable, add a `UserPromptSubmit` hook
  to project `.claude/settings.json` that injects the rules into context every turn
  (`hookSpecificOutput.additionalContext`, `suppressOutput:true`). Keep the injected
  text in a separate file (e.g. `.claude/hooks/<gate>.md`) so it is editable without
  touching JSON; read it with a runtime guaranteed to exist in the project (Node here).
- Prefer **project** `settings.json` (committed) over `settings.local.json` when the
  rule should protect everyone working in the repo, not one machine.
- Be honest about the residual: a hook guarantees the content is **present**, not that
  the model **acts** on it. For a harder gate, combine the hook with a default
  `agent` whose system prompt encodes the contract.

## Distribute It To Everybody: Bundle the Hook In the Plugin
A repo-local `.claude/settings.json` hook only protects one repo. To enforce for any
user, ship the hook **inside the Claude Code plugin**: add `hooks/hooks.json` at the
plugin root and reference a bundled script via `${CLAUDE_PLUGIN_ROOT}` (confirmed
convention — bundled official plugins like `security-guidance` use exactly this). When
the plugin is enabled the hook applies automatically, with no per-repo settings edit.
- Make the handler a single self-contained script (embed the injected text, no external
  reads, no deps) so it is portable and "a usable script for anybody."
- Make it **no-op when the contract is absent** (e.g. no `neuroplast/` dir) so enabling
  the plugin is safe in any repository.
- Once bundled, the hook is a distributed adapter asset → it falls under the
  `claude-code-adapter-sync` rules (edit `src/` only, `npx neuroplast sync`, keep
  `plugin.json` version aligned to `package.json`, reinstall/update to refresh cache).
- Remove any earlier repo-local stopgap hook to avoid double-injection.

## Gotcha: sync can preserve a divergent mirror file
If `npx neuroplast sync` reports `[preserve] ... (local edits detected (no stored
baseline))` for a file you just changed in `src/` (e.g. `plugin.json` version), the
installed mirror will NOT be updated automatically. Reconcile the installed copy to
match `src` once; the next sync adopts a baseline and propagates cleanly thereafter.

## Related
- [[secure-ai-harnesses-need-capability-enforcement-not-prompt-only-rules]]
- [[active-extensions-should-load-by-step-not-by-memory]]
- [[adapters-should-explicitly-separate-guidance-from-execution]]
