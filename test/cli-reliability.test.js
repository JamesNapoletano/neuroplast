const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  PACKAGE_VERSION,
  STATE_PATH,
  assertSuccess,
  createInitializedRepo,
  exists,
  hashContent,
  readFile,
  readState,
  remove,
  runCli,
  updateState,
  writeFile
} = require("./helpers/cli-harness");

const MANAGED_FILE = "neuroplast/extensions/README.md";
const OBSIDIAN_FILE = "neuroplast/.obsidian/core-plugins.json";

test("init creates the default scaffold without obsidian config", (t) => {
  const { repoRoot, initResult } = createInitializedRepo(t, { label: "init-default" });

  assert.match(initResult.stdout, /Skipping neuroplast\/\.obsidian config/);
  assert.equal(exists(repoRoot, "neuroplast/manifest.yaml"), true);
  assert.equal(exists(repoRoot, "neuroplast/adapters/README.md"), true);
  assert.equal(exists(repoRoot, MANAGED_FILE), true);
  assert.equal(exists(repoRoot, OBSIDIAN_FILE), false);
  assert.equal(exists(repoRoot, "ARCHITECTURE.md"), false);

  const state = readState(repoRoot);
  assert.equal(state.installedVersion, PACKAGE_VERSION);
  assert.equal(state.lastSyncedVersion, PACKAGE_VERSION);
  assert.ok(state.managedFiles.includes("neuroplast/manifest.yaml"));
});

test("init --with-obsidian installs shared obsidian config", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withObsidian: true, label: "init-obsidian" });

  assert.equal(exists(repoRoot, OBSIDIAN_FILE), true);
  assert.equal(exists(repoRoot, "neuroplast/.obsidian/app.json"), true);

  const state = readState(repoRoot);
  assert.ok(state.managedFiles.includes(OBSIDIAN_FILE));
});

test("validate succeeds for a complete initialized repository", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-success" });

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.stdout, /Validation complete/);
  assert.doesNotMatch(result.output, /\[neuroplast\]\[validate\]\[error\]/);
});

test("validate fails when the root architecture file is missing", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "validate-missing-architecture" });

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Missing root architecture file: ARCHITECTURE\.md/);
  assert.match(result.output, /Next step: Create or restore ARCHITECTURE\.md\./);
  assert.match(result.output, /Validation failed/);
});

test("validate fails when the manifest is not parseable", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-bad-manifest" });
  writeFile(repoRoot, "neuroplast/manifest.yaml", "- broken\n");

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Could not parse manifest at neuroplast\/manifest\.yaml/);
  assert.match(result.output, /Fix YAML syntax in neuroplast\/manifest\.yaml and rerun neuroplast validate\./);
});

test("validate --json emits machine-readable output", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-json" });

  const result = runCli(["validate", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, true);
  assert.equal(typeof payload.summary.checks, "number");
  assert.equal(Array.isArray(payload.findings), true);
  assert.equal(payload.findings.some((finding) => finding.code === "sync_state_parseable"), true);
});

test("validate fails when sync state is not parseable", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-bad-state" });
  writeFile(repoRoot, "neuroplast/.neuroplast-state.json", "{broken\n");

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Could not parse sync state at neuroplast\/\.neuroplast-state\.json/);
  assert.match(result.output, /Fix JSON syntax in neuroplast\/\.neuroplast-state\.json or remove the file and rerun neuroplast sync\./);
});

test("sync skips when the current version is already synced", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-same-version" });
  remove(repoRoot, MANAGED_FILE);

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.stdout, new RegExp(`Already synced for version ${PACKAGE_VERSION}; skipping\\.`));
  assert.equal(exists(repoRoot, MANAGED_FILE), false);
});

test("sync --dry-run reports changes without writing files or state", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-dry-run" });
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.1.1";
  });
  remove(repoRoot, MANAGED_FILE);
  const stateBefore = readFile(repoRoot, STATE_PATH);

  const result = runCli(["sync", "--dry-run"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.output, /Dry run enabled: previewing sync changes without modifying files or state\./);
  assert.match(result.output, /\[neuroplast\]\[create\]\[dry-run\] neuroplast\/extensions\/README\.md/);
  assert.match(result.output, /Managed file preview complete \(1 created, 0 updated, 0 preserved, 16 baselines adopted, 0 unchanged\)\./);
  assert.match(result.output, /Dry run enabled: no files or state were modified\./);
  assert.equal(exists(repoRoot, MANAGED_FILE), false);
  assert.equal(readFile(repoRoot, STATE_PATH), stateBefore);
});

test("sync summary distinguishes unchanged files from preserved edits", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-summary-unchanged" });
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.1.1";
    for (const relativePath of state.managedFiles) {
      state.managedFileState[relativePath] = {
        contentHash: hashContent(readFile(repoRoot, relativePath)),
        lastSyncedVersion: PACKAGE_VERSION
      };
    }
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.output, /Managed file refresh complete \(0 created, 0 updated, 0 preserved, 0 baselines adopted, 17 unchanged\)\./);
});

test("sync skips on package downgrade by default", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-downgrade" });
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "9.9.9";
  });
  remove(repoRoot, MANAGED_FILE);
  const stateBefore = readFile(repoRoot, STATE_PATH);

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.output, /Detected package downgrade \(9\.9\.9 -> /);
  assert.equal(exists(repoRoot, MANAGED_FILE), false);
  assert.equal(readFile(repoRoot, STATE_PATH), stateBefore);
});

test("sync preserves locally edited managed files", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-preserve-local" });
  const originalContent = readFile(repoRoot, MANAGED_FILE);
  const editedContent = `${originalContent}\nLocal test edit.\n`;

  writeFile(repoRoot, MANAGED_FILE, editedContent);
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.1.1";
    state.managedFileState[MANAGED_FILE] = {
      contentHash: hashContent(originalContent),
      lastSyncedVersion: "1.1.1"
    };
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.output, /\[neuroplast\]\[preserve\] neuroplast\/extensions\/README\.md \(local edits detected\)/);
  assert.equal(readFile(repoRoot, MANAGED_FILE), editedContent);
  assert.equal(readState(repoRoot).lastSyncedVersion, PACKAGE_VERSION);
});

test("sync --backup snapshots files before refreshing managed content", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-backup" });
  const staleContent = "# Stale bundled extension guide\n\nOld package content.\n";

  writeFile(repoRoot, MANAGED_FILE, staleContent);
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.1.1";
    state.managedFileState[MANAGED_FILE] = {
      contentHash: hashContent(staleContent),
      lastSyncedVersion: "1.1.1"
    };
  });

  const result = runCli(["sync", "--backup"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.output, /Backup created: neuroplast[\\/]\.backups[\\/]/);
  assert.match(result.output, /\[neuroplast\]\[update\] neuroplast\/extensions\/README\.md/);

  const backupRoot = path.join(repoRoot, "neuroplast", ".backups");
  const timestamps = fs.readdirSync(backupRoot);
  assert.equal(timestamps.length, 1);

  const backupFile = path.join(backupRoot, timestamps[0], "neuroplast", "extensions", "README.md");
  assert.equal(fs.existsSync(backupFile), true);
  assert.equal(fs.readFileSync(backupFile, "utf8"), staleContent);
  assert.notEqual(readFile(repoRoot, MANAGED_FILE), staleContent);
});

test("sync adopts a baseline for matching managed files without prior baseline metadata", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-baseline-adoption" });
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.1.1";
    delete state.managedFileState[MANAGED_FILE];
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.output, /Adopted managed baseline for neuroplast\/extensions\/README\.md\./);

  const state = readState(repoRoot);
  assert.ok(state.managedFileState[MANAGED_FILE]);
  assert.equal(state.managedFileState[MANAGED_FILE].lastSyncedVersion, PACKAGE_VERSION);
  assert.equal(typeof state.managedFileState[MANAGED_FILE].contentHash, "string");
});
