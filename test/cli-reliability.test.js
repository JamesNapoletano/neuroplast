const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  PACKAGE_VERSION,
  INIT_SYNC_JSON_SCHEMA_VERSION,
  STATE_PATH,
  VALIDATE_JSON_SCHEMA_VERSION,
  assertSuccess,
  createInitializedRepo,
  createTempRepo,
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
const MANAGED_BUNDLED_EXTENSION_FILE = "neuroplast/extensions/verification-first/README.md";
const OBSIDIAN_FILE = "neuroplast/.obsidian/core-plugins.json";
const LCP_MANIFEST = ".lcp/manifest.yaml";
const REVERSE_ENGINEERING_FILE = "neuroplast/reverse-engineering.md";
const RECONCILE_CONFLICTS_FILE = "neuroplast/reconcile-conflicts.md";

test("init creates the default scaffold without obsidian config", (t) => {
  const { repoRoot, initResult } = createInitializedRepo(t, { label: "init-default" });

  assert.match(initResult.stdout, /Skipping neuroplast\/\.obsidian config/);
  assert.equal(exists(repoRoot, "neuroplast/manifest.yaml"), true);
  assert.equal(exists(repoRoot, "neuroplast/adapters/README.md"), true);
  assert.equal(exists(repoRoot, MANAGED_FILE), true);
  assert.equal(exists(repoRoot, MANAGED_BUNDLED_EXTENSION_FILE), true);
  assert.equal(exists(repoRoot, LCP_MANIFEST), true);
  assert.equal(exists(repoRoot, REVERSE_ENGINEERING_FILE), true);
  assert.equal(exists(repoRoot, RECONCILE_CONFLICTS_FILE), true);
  assert.equal(exists(repoRoot, OBSIDIAN_FILE), false);
  assert.equal(exists(repoRoot, "ARCHITECTURE.md"), true);
  assert.match(readFile(repoRoot, "ARCHITECTURE.md"), /minimal `ARCHITECTURE\.md` scaffold/);

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
  const { repoRoot } = createInitializedRepo(t, { label: "validate-success" });

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.stdout, /Validation complete/);
  assert.doesNotMatch(result.output, /\[neuroplast\]\[validate\]\[error\]/);
});

test("validate fails when the LCP bridge manifest is missing", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-missing-lcp-manifest" });
  remove(repoRoot, LCP_MANIFEST);

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Missing LCP manifest: \.lcp\/manifest\.yaml/);
});

test("validate fails when the required reverse-engineering instruction is missing", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-missing-reverse-engineering" });
  remove(repoRoot, REVERSE_ENGINEERING_FILE);

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Missing required instruction file neuroplast\/reverse-engineering\.md/);
});

test("validate fails when the required conflict-reconciliation instruction is missing", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-missing-reconcile-conflicts" });
  remove(repoRoot, RECONCILE_CONFLICTS_FILE);

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Missing required instruction file neuroplast\/reconcile-conflicts\.md/);
});

test("validate fails when the root architecture file is missing", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "validate-missing-architecture" });
  remove(repoRoot, "ARCHITECTURE.md");

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Missing root architecture file: ARCHITECTURE\.md/);
  assert.match(result.output, /Next step: Create or restore ARCHITECTURE\.md\./);
  assert.match(result.output, /Validation failed/);
});

test("init preserves an existing ARCHITECTURE.md", (t) => {
  const repoRoot = createTempRepo(t, "init-preserve-architecture");
  const architectureContent = "# Architecture\n\nCustom repo architecture.\n";
  writeFile(repoRoot, "ARCHITECTURE.md", architectureContent);

  const initResult = runCli(["init"], { targetRoot: repoRoot });

  assertSuccess(initResult);
  assert.equal(readFile(repoRoot, "ARCHITECTURE.md"), architectureContent);
  assert.match(initResult.output, /\[neuroplast\]\[skip\] ARCHITECTURE\.md/);
});

test("init rejects unsupported flags", (t) => {
  const repoRoot = createTempRepo(t, "init-invalid-flag");

  const result = runCli(["init", "--backup"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Unsupported option for init: --backup/);
});

test("init --json emits machine-readable output", (t) => {
  const repoRoot = createTempRepo(t, "init-json");

  const result = runCli(["init", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, true);
  assert.equal(payload.schemaVersion, INIT_SYNC_JSON_SCHEMA_VERSION);
  assert.equal(payload.command, "init");
  assert.equal(payload.options.json, true);
  assert.equal(payload.result.init.withObsidian, false);
  assert.equal(typeof payload.summary.created, "number");
  assert.equal(Array.isArray(payload.events), true);
  assert.equal(payload.events.some((event) => event.type === "create" && event.path === "ARCHITECTURE.md"), true);
});

test("validate rejects unexpected positional arguments", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "validate-invalid-arg" });

  const result = runCli(["validate", "extra"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Unexpected positional argument for validate: extra/);
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
  assert.equal(payload.schemaVersion, VALIDATE_JSON_SCHEMA_VERSION);
  assert.equal(typeof payload.summary.checks, "number");
  assert.equal(Array.isArray(payload.findings), true);
  assert.equal(payload.findings.some((finding) => finding.code === "sync_state_parseable"), true);
});

test("validate --json follows the documented schema contract", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-json-schema" });

  const result = runCli(["validate", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.schemaVersion, VALIDATE_JSON_SCHEMA_VERSION);
  assert.deepEqual(Object.keys(payload).sort(), ["findings", "ok", "schemaVersion", "summary"]);
  assert.deepEqual(Object.keys(payload.summary).sort(), ["checks", "errors", "warnings"]);

  for (const finding of payload.findings) {
    assert.deepEqual(Object.keys(finding).sort(), ["code", "level", "message", "remediation"]);
    assert.match(finding.level, /^(ok|warning|error)$/);
  }
});

test("validate --json keeps schema-shaped findings when environment guides directory is missing", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-json-guides-dir-missing" });
  remove(repoRoot, "neuroplast/adapters");

  const result = runCli(["validate", "--json"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  const payload = JSON.parse(result.stdout);
  const finding = payload.findings.find((entry) => entry.code === "environment_guides_dir_missing_on_disk");
  assert.ok(finding);
  assert.equal(typeof finding.message, "string");
  assert.equal(typeof finding.remediation, "string");
});

test("init --json exposes the documented top-level contract", (t) => {
  const repoRoot = createTempRepo(t, "init-json-shape");

  const result = runCli(["init", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.deepEqual(Object.keys(payload).sort(), ["command", "events", "ok", "options", "packageVersion", "result", "schemaVersion", "summary", "targetRoot"]);
  assert.deepEqual(Object.keys(payload.options).sort(), ["dryRun", "json", "withObsidian"]);
  assert.deepEqual(Object.keys(payload.result).sort(), ["init", "sync"]);
});

test("sync --json exposes the documented top-level contract", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-json-shape" });
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.1.1";
  });

  const result = runCli(["sync", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.deepEqual(Object.keys(payload).sort(), ["command", "events", "ok", "options", "packageVersion", "result", "schemaVersion", "summary", "targetRoot"]);
  assert.deepEqual(Object.keys(payload.options).sort(), ["backup", "dryRun", "force", "json"]);
  assert.deepEqual(Object.keys(payload.result).sort(), ["sync"]);
});

test("validate fails when an active bundled extension is missing README.md", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-bundled-extension-readme-missing" });

  writeFile(repoRoot, "neuroplast/manifest.yaml", `${readFile(repoRoot, "neuroplast/manifest.yaml").replace("active_bundled: []", "active_bundled:\n    - verification-first")}`);
  remove(repoRoot, "neuroplast/extensions/verification-first/README.md");

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Active workflow extension is missing README\.md: neuroplast\/extensions\/verification-first/);
});

test("validate fails when an active local extension has no canonical step files", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-local-extension-missing-steps" });

  writeFile(repoRoot, "neuroplast/local-extensions/no-steps/README.md", "# No Steps\n\nThis extension is additive guidance and must not override the Neuroplast workflow contract.\n");
  writeFile(repoRoot, "neuroplast/manifest.yaml", `${readFile(repoRoot, "neuroplast/manifest.yaml").replace("active_local: []", "active_local:\n    - no-steps")}`);

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Active workflow extension does not provide any canonical step files: neuroplast\/local-extensions\/no-steps/);
});

test("validate succeeds when a bundled extension follows the minimal file convention", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-bundled-extension-valid" });

  writeFile(repoRoot, "neuroplast/manifest.yaml", `${readFile(repoRoot, "neuroplast/manifest.yaml").replace("active_bundled: []", "active_bundled:\n    - verification-first")}`);

  const result = runCli(["validate", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.findings.some((finding) => finding.code === "extension_shape_valid" && finding.message.includes("neuroplast/extensions/verification-first")), true);
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
  assert.match(result.output, /Managed file preview complete \(1 created, 0 updated, 0 preserved, 37 baselines adopted, 0 unchanged\)\./);
  assert.match(result.output, /Dry run enabled: no files or state were modified\./);
  assert.equal(exists(repoRoot, MANAGED_FILE), false);
  assert.equal(readFile(repoRoot, STATE_PATH), stateBefore);
});

test("sync --json emits machine-readable output", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "sync-json" });
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.1.1";
  });
  remove(repoRoot, MANAGED_FILE);

  const result = runCli(["sync", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, true);
  assert.equal(payload.schemaVersion, INIT_SYNC_JSON_SCHEMA_VERSION);
  assert.equal(payload.command, "sync");
  assert.equal(payload.result.sync.decision.shouldRun, true);
  assert.equal(payload.result.sync.managedRefresh.created >= 1, true);
  assert.equal(payload.result.sync.stateUpdated, true);
  assert.equal(payload.events.some((event) => event.type === "create" && event.path === MANAGED_FILE), true);
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
  assert.match(result.output, /Managed file refresh complete \(0 created, 0 updated, 0 preserved, 0 baselines adopted, 38 unchanged\)\./);
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
