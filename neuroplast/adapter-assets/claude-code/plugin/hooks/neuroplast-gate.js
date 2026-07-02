#!/usr/bin/env node
/**
 * Neuroplast contract-enforcement gate (Claude Code UserPromptSubmit hook).
 *
 * Bundled in the Neuroplast plugin and wired up by hooks/hooks.json, so any user
 * who installs and enables the plugin gets the Neuroplast startup sequence and
 * short-prompt routing injected into context on EVERY prompt — without editing
 * their own .claude/settings.json.
 *
 * Why a hook and not just CLAUDE.md: CLAUDE.md is advisory text the model can
 * skip on tasks that look trivial, and plugin agents/skills are opt-in (they do
 * not auto-activate). A UserPromptSubmit hook is run deterministically by the
 * harness every turn, so the contract is always in front of the model.
 *
 * Honest limitation: this guarantees the gate is PRESENT every turn; it cannot
 * force the model to act on it. Pair with a default agent for a harder gate.
 *
 * Contract: reads the hook payload on stdin (unused), writes a JSON object with
 * hookSpecificOutput.additionalContext to stdout. suppressOutput keeps it out of
 * the visible transcript. Self-contained: no external files, no dependencies.
 */

"use strict";

const GATE = `NEUROPLAST STARTUP GATE — enforced on every prompt by the plugin's UserPromptSubmit hook.

BEFORE acting on this prompt, you MUST have read these files THIS SESSION. If you
have not already read them in this conversation, read them now (in order) before
producing any other tool call or response:
  1. neuroplast/WORKFLOW_CONTRACT.md
  2. neuroplast/manifest.yaml
  3. neuroplast/capabilities.yaml
  4. neuroplast/interaction-routing.yaml
  5. Any active workflow extensions declared in neuroplast/manifest.yaml
Do not treat a request as "too simple" to skip this — the contract applies to all work.

SHORT-PROMPT ROUTING (canonical, from neuroplast/interaction-routing.yaml):
  Resolution order: explicit_file > explicit_step > routed_phrase > clarify
  - "go ahead" / "continue" / "do it" / "proceed" / "carry on"
        -> act intent -> neuroplast/act.md, ONLY if a bounded active plan already
           exists. If no active plan exists, CLARIFY instead of guessing.
  - "plan this" / "conceptualize this" / "reframe this" / "plan this from scratch"
    / "new initiative" / "start fresh"
        -> neuroplast/conceptualize.md
  - "what's next?" / "where were we?" / "what is the plan?" / "show me the next step"
        -> inspect the current active plan
  - Ambiguous after checking repository context -> ask a clarifying question.

WORKING RULES:
  - Treat the Neuroplast filesystem contract as authoritative.
  - Keep changes non-destructive; write outputs only to documented Neuroplast
    locations (plans/, project-concept/changelog/, .lcp/knowledge/, etc.).
  - Maintain plans, changelog entries, and LCP memory so work stays resumable.

If this repository is not a Neuroplast project (no neuroplast/ contract files),
ignore this gate and proceed normally.`;

function emit() {
  const out = {
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: GATE,
    },
    suppressOutput: true,
  };
  process.stdout.write(JSON.stringify(out));
}

// Drain stdin (the hook payload) so the parent never blocks on an unread pipe,
// then emit regardless of payload contents.
let buf = "";
process.stdin.on("data", (chunk) => {
  buf += chunk;
});
process.stdin.on("end", emit);
// If stdin is not piped (e.g. manual run in a TTY), emit immediately.
if (process.stdin.isTTY) {
  emit();
  process.exit(0);
}
