#!/usr/bin/env node
/**
 * Neuroplast artifact gate (Claude Code Stop hook).
 *
 * Enforces the Neuroplast workflow contract's changelog Update Rule
 * MECHANICALLY. If this session made real file changes but never recorded a
 * changelog entry, this hook BLOCKS the stop and instructs the model to
 * reconcile artifacts before ending the turn.
 *
 * Why this is different in kind from every other mechanism in the plugin:
 * CLAUDE.md, the artifact-sync extension, and the UserPromptSubmit gate can only
 * PRESENT the rule to the model — it remains advisory text the model can weigh
 * against task focus and skip (as happens in practice). A Stop-hook `block`
 * withholds turn completion until the condition is met. That is the qualitative
 * jump from "reminder" to "gate": the harness itself refuses to end the turn.
 *
 * Honest limitations (documented, not hidden):
 *  - It verifies a changelog file was TOUCHED this session, not that the entry
 *    is meaningful. A model could satisfy it with a token edit. Closing that gap
 *    needs human review or a second-pass content check, not a file hook.
 *  - It nudges ONCE. If it already blocked this turn (`stop_hook_active`) and the
 *    condition is still unmet, it allows the stop rather than hang the session in
 *    a loop. So it guarantees one hard, must-be-actively-addressed interruption,
 *    not an infinite refusal.
 *  - It is fail-open: any internal error allows the stop. A gate must never be
 *    able to trap the user in a session it cannot end.
 *
 * Contract: reads the Stop payload on stdin (session_id, cwd, stop_hook_active);
 * to block, writes {"decision":"block","reason":...} to stdout; to allow, exits 0
 * with no decision.
 */

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

function trackerPathFor(sessionId) {
  const safe = String(sessionId || "default").replace(/[^A-Za-z0-9_-]/g, "_");
  return path.join(os.tmpdir(), `neuroplast-gate-${safe}.json`);
}

function allow() {
  process.exit(0);
}

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
  process.exit(0);
}

const CHANGELOG_PREFIX = "neuroplast/project-concept/changelog/";
const PLAN_PREFIX = "neuroplast/plans/";

function evaluate(payload) {
  const cwd = payload.cwd || process.cwd();

  // Only enforce inside a Neuroplast project. Elsewhere the gate is inert.
  if (!fs.existsSync(path.join(cwd, "neuroplast"))) {
    return allow();
  }

  let changed = [];
  try {
    const data = JSON.parse(fs.readFileSync(trackerPathFor(payload.session_id), "utf8"));
    changed = Array.isArray(data.changed) ? data.changed : [];
  } catch (error) {
    changed = [];
  }

  // "Work" = edits to anything that is not itself the reconciliation surface.
  // Plans (handoff state) and changelog entries are excluded so pure planning
  // turns and pure changelog turns are never gated.
  const workFiles = changed.filter(
    (p) => !p.startsWith(CHANGELOG_PREFIX) && !p.startsWith(PLAN_PREFIX)
  );
  const changelogTouched = changed.some((p) => p.startsWith(CHANGELOG_PREFIX));

  // Nothing to enforce, or the cycle was already recorded.
  if (workFiles.length === 0 || changelogTouched) {
    return allow();
  }

  // Condition unmet. If we already blocked once this turn and the model still
  // has not reconciled, allow the stop to avoid a loop (one hard nudge only).
  if (payload.stop_hook_active) {
    process.stderr.write(
      "[neuroplast] Artifact gate: changelog still not updated after one prompt; allowing stop to avoid a loop.\n"
    );
    return allow();
  }

  const preview = workFiles.slice(0, 15).join(", ") + (workFiles.length > 15 ? ", …" : "");
  const reason =
    `Neuroplast artifact gate: this session changed ${workFiles.length} file(s) but recorded no changelog entry.\n` +
    `Changed: ${preview}\n\n` +
    `Per neuroplast/WORKFLOW_CONTRACT.md Update Rules, completed work MUST be recorded in a dated changelog entry ` +
    `under ${CHANGELOG_PREFIX}YYYY-MM-DD.md. If any change is architecturally significant, also update ARCHITECTURE.md ` +
    `to match. Record the changelog entry now (and ARCHITECTURE.md if relevant), then end the turn. ` +
    `If you have genuinely determined no artifact update is warranted, state that explicitly in the changelog entry.`;
  return block(reason);
}

let buf = "";
process.stdin.on("data", (chunk) => {
  buf += chunk;
});
process.stdin.on("end", () => {
  try {
    evaluate(JSON.parse(buf || "{}"));
  } catch (error) {
    // Fail-open: never trap the user in a session that cannot end.
    allow();
  }
});
if (process.stdin.isTTY) {
  allow();
}
