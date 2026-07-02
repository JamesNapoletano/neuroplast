#!/usr/bin/env node
/**
 * Neuroplast change tracker (Claude Code PostToolUse hook).
 *
 * Records which files were edited or created this session into a small
 * session-scoped tracker file, so the Stop gate (neuroplast-artifact-gate.js)
 * can enforce the contract's changelog Update Rule against real work.
 *
 * This is the passive half of the mechanical gate. It never blocks a tool call
 * and never produces visible output — it only appends to the tracker. It is
 * fail-open by construction: any error is swallowed so a tracking failure can
 * never interrupt the user's work (the gate simply has less to check).
 *
 * Contract: reads the PostToolUse payload on stdin (tool_name, tool_input, cwd,
 * session_id), writes nothing to stdout, exits 0.
 */

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

// One tracker file per session, keyed by session_id so concurrent sessions and
// stale prior sessions never cross-contaminate. Lives in the OS temp dir so it
// never pollutes the user's repository.
function trackerPathFor(sessionId) {
  const safe = String(sessionId || "default").replace(/[^A-Za-z0-9_-]/g, "_");
  return path.join(os.tmpdir(), `neuroplast-gate-${safe}.json`);
}

function record(payload) {
  const input = payload.tool_input || {};
  const filePath = input.file_path || input.notebook_path;
  if (!filePath) {
    return;
  }

  const cwd = payload.cwd || process.cwd();
  const rel = path
    .relative(cwd, path.resolve(cwd, filePath))
    .split(path.sep)
    .join("/");

  // Ignore edits outside the project tree (defensive; hooks run at repo root).
  if (rel.startsWith("../")) {
    return;
  }

  const trackerPath = trackerPathFor(payload.session_id);
  let data = { changed: [] };
  try {
    data = JSON.parse(fs.readFileSync(trackerPath, "utf8"));
  } catch (error) {
    data = { changed: [] };
  }
  if (!Array.isArray(data.changed)) {
    data.changed = [];
  }
  if (!data.changed.includes(rel)) {
    data.changed.push(rel);
  }
  fs.writeFileSync(trackerPath, JSON.stringify(data));
}

let buf = "";
process.stdin.on("data", (chunk) => {
  buf += chunk;
});
process.stdin.on("end", () => {
  try {
    record(JSON.parse(buf || "{}"));
  } catch (error) {
    // Fail-open: a tracking error must never interrupt work.
  }
  process.exit(0);
});
if (process.stdin.isTTY) {
  process.exit(0);
}
