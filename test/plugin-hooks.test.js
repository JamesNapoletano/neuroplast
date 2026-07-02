const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const HOOKS_DIR = path.join(projectRoot, "src", "adapter-assets", "claude-code", "plugin", "hooks");
const TRACK = path.join(HOOKS_DIR, "neuroplast-track-changes.js");
const GATE = path.join(HOOKS_DIR, "neuroplast-artifact-gate.js");

function runHook(scriptPath, payload) {
  const result = spawnSync(process.execPath, [scriptPath], {
    input: JSON.stringify(payload),
    encoding: "utf8"
  });
  return { code: result.status, stdout: result.stdout || "", stderr: result.stderr || "" };
}

// Each test gets an isolated session id (so the temp tracker never collides) and
// a temp "repo" containing a neuroplast/ dir so the gate treats it as active.
function newSession(t) {
  const sessionId = `test-${process.pid}-${Math.random().toString(36).slice(2)}`;
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "neuroplast-hooktest-"));
  fs.mkdirSync(path.join(cwd, "neuroplast"), { recursive: true });
  const tracker = path.join(os.tmpdir(), `neuroplast-gate-${sessionId}.json`);
  t.after(() => {
    fs.rmSync(cwd, { recursive: true, force: true });
    fs.rmSync(tracker, { force: true });
  });
  return { sessionId, cwd };
}

function track(session, relPath) {
  return runHook(TRACK, {
    session_id: session.sessionId,
    cwd: session.cwd,
    tool_name: "Edit",
    tool_input: { file_path: path.join(session.cwd, relPath) }
  });
}

function stop(session, { stopHookActive = false } = {}) {
  return runHook(GATE, {
    session_id: session.sessionId,
    cwd: session.cwd,
    stop_hook_active: stopHookActive
  });
}

test("artifact gate blocks a stop when work was done but no changelog was recorded", (t) => {
  const s = newSession(t);
  track(s, "src/cli/lcp.js");
  const result = stop(s);
  const decision = JSON.parse(result.stdout);
  assert.equal(decision.decision, "block");
  assert.match(decision.reason, /changelog/i);
  assert.match(decision.reason, /src\/cli\/lcp\.js/);
});

test("artifact gate allows the stop once a changelog entry is recorded", (t) => {
  const s = newSession(t);
  track(s, "src/cli/lcp.js");
  track(s, "neuroplast/project-concept/changelog/2026-07-01.md");
  const result = stop(s);
  assert.equal(result.stdout.trim(), "", "expected no block decision");
  assert.equal(result.code, 0);
});

test("artifact gate does not gate planning-only turns", (t) => {
  const s = newSession(t);
  track(s, "neuroplast/plans/some-plan.md");
  const result = stop(s);
  assert.equal(result.stdout.trim(), "");
});

test("artifact gate does not gate read-only sessions", (t) => {
  const s = newSession(t);
  const result = stop(s);
  assert.equal(result.stdout.trim(), "");
});

test("artifact gate nudges only once: stop_hook_active lets an unmet stop through", (t) => {
  const s = newSession(t);
  track(s, "src/cli/lcp.js");
  const blocked = stop(s, { stopHookActive: false });
  assert.equal(JSON.parse(blocked.stdout).decision, "block");
  const second = stop(s, { stopHookActive: true });
  assert.equal(second.stdout.trim(), "", "must not block again once already active (no hang)");
});

test("artifact gate is inert outside a neuroplast project", (t) => {
  const sessionId = `test-${process.pid}-${Math.random().toString(36).slice(2)}`;
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "neuroplast-nonrepo-"));
  const tracker = path.join(os.tmpdir(), `neuroplast-gate-${sessionId}.json`);
  t.after(() => {
    fs.rmSync(cwd, { recursive: true, force: true });
    fs.rmSync(tracker, { force: true });
  });
  runHook(TRACK, { session_id: sessionId, cwd, tool_name: "Edit", tool_input: { file_path: path.join(cwd, "x.js") } });
  const result = runHook(GATE, { session_id: sessionId, cwd, stop_hook_active: false });
  assert.equal(result.stdout.trim(), "");
});

test("both hooks fail open on malformed input", (t) => {
  const trackResult = spawnSync(process.execPath, [TRACK], { input: "not json", encoding: "utf8" });
  assert.equal(trackResult.status, 0);
  const gateResult = spawnSync(process.execPath, [GATE], { input: "not json", encoding: "utf8" });
  assert.equal(gateResult.status, 0);
  assert.equal((gateResult.stdout || "").trim(), "");
});
