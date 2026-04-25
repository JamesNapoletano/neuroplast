const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const packageJson = require("../../package.json");
const { INIT_SYNC_JSON_SCHEMA_VERSION } = require("../../src/cli/output");
const { ROUTING_JSON_SCHEMA_VERSION } = require("../../src/cli/interaction-routing");
const { VALIDATE_JSON_SCHEMA_VERSION } = require("../../src/cli/validate");

const projectRoot = path.resolve(__dirname, "..", "..");
const cliPath = path.join(projectRoot, "bin", "neuroplast.js");
const PACKAGE_VERSION = packageJson.version;
const STATE_PATH = "neuroplast/.neuroplast-state.json";

function createTempRepo(t, label = "repo") {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), `neuroplast-${label}-`));
  t.after(() => {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  });
  return repoRoot;
}

function runCli(args, { targetRoot, cwd = projectRoot, env = {} } = {}) {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    env: {
      ...process.env,
      ...env,
      INIT_CWD: targetRoot
    },
    encoding: "utf8"
  });

  return {
    code: result.status,
    signal: result.signal,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    error: result.error,
    output: `${result.stdout || ""}${result.stderr || ""}`
  };
}

function assertSuccess(result) {
  assert.equal(result.error, undefined, result.error && result.error.message);
  assert.equal(result.signal, null, result.output);
  assert.equal(result.code, 0, result.output);
}

function createInitializedRepo(t, { withObsidian = false, withArchitecture = false, label = "repo" } = {}) {
  const repoRoot = createTempRepo(t, label);
  const args = ["init"];

  if (withObsidian) {
    args.push("--with-obsidian");
  }

  const initResult = runCli(args, { targetRoot: repoRoot });
  assertSuccess(initResult);

  if (withArchitecture) {
    writeFile(repoRoot, "ARCHITECTURE.md", "# Architecture\n\nFixture architecture for CLI tests.\n");
  }

  return { repoRoot, initResult };
}

function readFile(repoRoot, relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function writeFile(repoRoot, relativePath, content) {
  const absolutePath = path.join(repoRoot, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, "utf8");
}

function exists(repoRoot, relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function remove(repoRoot, relativePath) {
  fs.rmSync(path.join(repoRoot, relativePath), { recursive: true, force: true });
}

function readJson(repoRoot, relativePath) {
  return JSON.parse(readFile(repoRoot, relativePath));
}

function writeJson(repoRoot, relativePath, value) {
  writeFile(repoRoot, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readState(repoRoot) {
  return readJson(repoRoot, STATE_PATH);
}

function writeState(repoRoot, value) {
  writeJson(repoRoot, STATE_PATH, value);
}

function updateState(repoRoot, updater) {
  const current = readState(repoRoot);
  const draft = JSON.parse(JSON.stringify(current));
  const next = updater(draft) || draft;
  writeState(repoRoot, next);
  return next;
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

module.exports = {
  PACKAGE_VERSION,
  INIT_SYNC_JSON_SCHEMA_VERSION,
  STATE_PATH,
  ROUTING_JSON_SCHEMA_VERSION,
  VALIDATE_JSON_SCHEMA_VERSION,
  assertSuccess,
  createInitializedRepo,
  createTempRepo,
  exists,
  hashContent,
  readFile,
  readJson,
  readState,
  remove,
  runCli,
  updateState,
  writeFile,
  writeJson,
  writeState
};
