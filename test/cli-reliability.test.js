const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  PACKAGE_VERSION,
  INIT_SYNC_JSON_SCHEMA_VERSION,
  ROUTING_JSON_SCHEMA_VERSION,
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
const INSTALLED_WORKFLOW_README = "neuroplast/README.md";
const CURRENT_CONTEXT_FILE = "neuroplast/current-context.md";
const OBSIDIAN_FILE = "neuroplast/.obsidian/core-plugins.json";
const LCP_MANIFEST = ".lcp/manifest.yaml";
const REVERSE_ENGINEERING_FILE = "neuroplast/reverse-engineering.md";
const RECONCILE_CONFLICTS_FILE = "neuroplast/reconcile-conflicts.md";

test("init creates the default scaffold without obsidian config", (t) => {
  const { repoRoot, initResult } = createInitializedRepo(t, { label: "init-default" });

  assert.match(initResult.stdout, /Skipping neuroplast\/\.obsidian config/);
  assert.equal(exists(repoRoot, "neuroplast/manifest.yaml"), true);
  assert.equal(exists(repoRoot, INSTALLED_WORKFLOW_README), true);
  assert.equal(exists(repoRoot, CURRENT_CONTEXT_FILE), true);
  assert.equal(exists(repoRoot, "neuroplast/adapters/README.md"), true);
  assert.equal(exists(repoRoot, "neuroplast/adapter-assets/README.md"), true);
  assert.equal(exists(repoRoot, "neuroplast/adapter-assets/codex/AGENTS.md"), true);
  assert.equal(exists(repoRoot, "neuroplast/adapter-assets/claude-code/CLAUDE.md"), true);
  assert.equal(exists(repoRoot, "neuroplast/adapter-assets/opencode/skills/neuroplast-bootstrap/SKILL.md"), true);
  assert.equal(exists(repoRoot, "neuroplast/adapter-assets/opencode/agents/neuroplast-orchestrator.md"), true);
  assert.equal(exists(repoRoot, "neuroplast/adapter-assets/opencode/agents/neuroplast-planner.md"), true);
  assert.equal(exists(repoRoot, MANAGED_FILE), true);
  assert.equal(exists(repoRoot, MANAGED_BUNDLED_EXTENSION_FILE), true);
  assert.equal(exists(repoRoot, LCP_MANIFEST), true);
  assert.equal(exists(repoRoot, REVERSE_ENGINEERING_FILE), true);
  assert.equal(exists(repoRoot, RECONCILE_CONFLICTS_FILE), true);
  assert.equal(exists(repoRoot, OBSIDIAN_FILE), false);
  assert.equal(exists(repoRoot, "ARCHITECTURE.md"), true);
  assert.match(readFile(repoRoot, "ARCHITECTURE.md"), /minimal `ARCHITECTURE\.md` scaffold/);
  assert.match(readFile(repoRoot, CURRENT_CONTEXT_FILE), /`neuroplast sync` may auto-refresh this file/);
  assert.match(readFile(repoRoot, CURRENT_CONTEXT_FILE), /## Current Snapshot/);

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

test("validate fails when the bundled OpenCode planner asset enables mutation-capable tools", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-opencode-planner-tool-surface" });
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Test active plan.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");

  const plannerPath = "neuroplast/adapter-assets/opencode/agents/neuroplast-planner.md";
  const plannerContent = readFile(repoRoot, plannerPath).replace("  glob: true", "  glob: true\n  bash: true");
  writeFile(repoRoot, plannerPath, plannerContent);

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /must not enable mutation-capable tool 'bash'/);
});

test("validate fails when the bundled OpenCode planner asset loses required safety-lock language", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-opencode-planner-safety-language" });
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Test active plan.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");

  const plannerPath = "neuroplast/adapter-assets/opencode/agents/neuroplast-planner.md";
  const plannerContent = readFile(repoRoot, plannerPath).replace("## Automatic Safety Lock (Always On)\n", "");
  writeFile(repoRoot, plannerPath, plannerContent);

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /missing required safety-lock language/);
});

test("validate succeeds for a complete initialized repository", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "validate-success" });
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Test active plan.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");

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
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Test active plan.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");

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
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Test active plan.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");

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

test("validate --json warns when current-context briefing exceeds the advisory size budget", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-current-context-too-long" });
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Test active plan.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");
  writeFile(repoRoot, "neuroplast/current-context.md", Array.from({ length: 130 }, (_, index) => `line ${index + 1}`).join("\n"));

  const result = runCli(["validate", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  const finding = payload.findings.find((entry) => entry.code === "current_context_briefing_too_long");
  assert.ok(finding);
  assert.equal(finding.level, "warning");
  assert.match(finding.message, /Current context briefing exceeds the advisory size budget/);
});

test("validate --json warns when current-context briefing is older than the latest plan", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-current-context-stale" });
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Newer plan state.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");

  const currentContextPath = path.join(repoRoot, "neuroplast", "current-context.md");
  const planPath = path.join(repoRoot, "neuroplast", "plans", "current-objective.md");
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60_000);
  fs.utimesSync(currentContextPath, oneMinuteAgo, oneMinuteAgo);
  fs.utimesSync(planPath, now, now);

  const result = runCli(["validate", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  const finding = payload.findings.find((entry) => entry.code === "current_context_briefing_stale");
  assert.ok(finding);
  assert.equal(finding.level, "warning");
  assert.match(finding.message, /newer context artifacts exist/);
  assert.match(finding.message, /neuroplast\/plans\/current-objective\.md/);
});

test("sync refreshes current-context from the latest plan when still managed", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "sync-current-context-refresh" });
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", [
    "# Current Objective",
    "#plan",
    "",
    "## Current Objective",
    "- Ship a compact briefing refresh.",
    "",
    "## Execution Steps",
    "- [ ] Implement the auto-refresh behavior.",
    "",
    "## Verification",
    "- Run `npm run validate`.",
    "",
    "## Related",
    "- [[project-concept/context-efficiency-and-success-reliability.md]]",
    ""
  ].join("\n"));
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.3.0";
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  const currentContext = readFile(repoRoot, CURRENT_CONTEXT_FILE);
  assert.match(currentContext, /`neuroplast\/plans\/current-objective\.md`/);
  assert.match(currentContext, /Ship a compact briefing refresh\./);
  assert.match(currentContext, /Implement the auto-refresh behavior\./);
  assert.match(currentContext, /project-concept\/context-efficiency-and-success-reliability\.md/);
});

test("sync preserves locally edited current-context briefings", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "sync-current-context-preserve" });
  writeFile(repoRoot, CURRENT_CONTEXT_FILE, "# Current Context\n\nCustom local briefing.\n");
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.3.0";
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  assert.match(result.output, /\[neuroplast\]\[preserve\] neuroplast\/current-context\.md \(local edits detected \(no stored baseline\)\)/);
  assert.equal(readFile(repoRoot, CURRENT_CONTEXT_FILE), "# Current Context\n\nCustom local briefing.\n");
});

test("route --json resolves canonical act phrases when an active plan exists", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "route-json-act" });
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\nBounded work.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");

  const result = runCli(["route", "go ahead", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, true);
  assert.equal(payload.schemaVersion, ROUTING_JSON_SCHEMA_VERSION);
  assert.equal(payload.phrase, "go ahead");
  assert.equal(payload.routingFile, "neuroplast/interaction-routing.yaml");
  assert.equal(payload.resolution.type, "routed_phrase");
  assert.equal(payload.resolution.intent, "act");
  assert.equal(payload.resolution.instruction, "neuroplast/act.md");
  assert.equal(payload.recommendation.contextDepth, "lean");
  assert.deepEqual(payload.recommendation.briefingEmphasis, ["objective", "next_step", "verification", "blockers"]);
});

test("route --json falls back to clarify for act phrases without an active plan", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "route-json-clarify" });

  const result = runCli(["route", "continue", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.schemaVersion, ROUTING_JSON_SCHEMA_VERSION);
  assert.equal(payload.resolution.type, "clarify");
  assert.equal(payload.resolution.intent, "clarify");
  assert.equal(payload.resolution.instruction, null);
  assert.equal(payload.recommendation.contextDepth, "standard");
});

test("route prefers explicit active-plan pointer over newest-file heuristic", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "route-json-active-plan-pointer" });
  writeFile(repoRoot, "neuroplast/plans/older-plan.md", "# Older Plan\n#plan\n");
  writeFile(repoRoot, "neuroplast/plans/newer-plan.md", "# Newer Plan\n#plan\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "older-plan.md\n");

  const result = runCli(["route", "go ahead", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.match(payload.resolution.reason, /older-plan\.md \(pointer\)/);
});

test("route --json resolves conceptualize phrases", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "route-json-conceptualize" });

  const result = runCli(["route", "plan this", "--json"], { targetRoot: repoRoot });

  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.schemaVersion, ROUTING_JSON_SCHEMA_VERSION);
  assert.equal(payload.resolution.intent, "conceptualize");
  assert.equal(payload.resolution.instruction, "neuroplast/conceptualize.md");
  assert.equal(payload.recommendation.contextDepth, "deep");
  assert.deepEqual(payload.recommendation.briefingEmphasis, ["objective", "scope", "assumptions", "related_files"]);
});

test("sync-generated current-context includes route-aware reading hints", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "sync-current-context-route-hints" });
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Use route-aware hints.\n");
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.3.0";
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  const currentContext = readFile(repoRoot, CURRENT_CONTEXT_FILE);
  assert.match(currentContext, /## Route-Aware Reading Hints/);
  assert.match(currentContext, /\*\*act\*\* -> use `lean` context depth/);
  assert.match(currentContext, /\*\*conceptualize\*\* -> use `deep` context depth/);
});

test("sync-generated current-context uses explicit active-plan pointer when present", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "sync-current-context-active-plan-pointer" });
  writeFile(repoRoot, "neuroplast/plans/older-plan.md", "# Older Plan\n#plan\n\n## Current Objective\n- Pointer-selected plan.\n");
  writeFile(repoRoot, "neuroplast/plans/newer-plan.md", "# Newer Plan\n#plan\n\n## Current Objective\n- Newer mtime plan.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "older-plan.md\n");
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.3.0";
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });

  assertSuccess(result);
  const currentContext = readFile(repoRoot, CURRENT_CONTEXT_FILE);
  assert.match(currentContext, /\*\*Active plan:\*\* `neuroplast\/plans\/older-plan\.md`/);
  assert.match(currentContext, /\*\*Active plan source:\*\* pointer/);
  assert.match(currentContext, /Pointer-selected plan\./);
});

test("validate fails when active-plan pointer target is missing", (t) => {
  const { repoRoot } = createInitializedRepo(t, { withArchitecture: true, label: "validate-active-plan-pointer-missing-target" });
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "missing-plan.md\n");

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Active plan pointer target is missing: neuroplast\/plans\/missing-plan\.md/);
});

test("validate fails when interaction routing artifact is missing", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "validate-missing-routing-artifact" });
  remove(repoRoot, "neuroplast/interaction-routing.yaml");

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Missing interaction routing artifact: neuroplast\/interaction-routing\.yaml/);
});

test("validate fails when an extension overlay overrides a protected routing phrase", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "validate-routing-overlay-protected" });
  writeFile(repoRoot, "neuroplast/local-extensions/routing-overlay/README.md", "# Routing Overlay\n\nThis extension is additive guidance and must not override the Neuroplast workflow contract.\n");
  writeFile(repoRoot, "neuroplast/local-extensions/routing-overlay/act.md", "# Overlay Act\n#instruction\n");
  writeFile(repoRoot, "neuroplast/local-extensions/routing-overlay/interaction-routing.yaml", "intents:\n  custom:\n    phrases:\n      - go ahead\n");
  writeFile(repoRoot, "neuroplast/manifest.yaml", `${readFile(repoRoot, "neuroplast/manifest.yaml").replace("active_local: []", "active_local:\n    - routing-overlay")}`);

  const result = runCli(["validate"], { targetRoot: repoRoot });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /Interaction routing overlay attempts to override protected phrase 'go ahead'/);
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
  writeFile(repoRoot, "neuroplast/plans/current-objective.md", "# Current Objective\n#plan\n\n## Current Objective\n- Test active plan.\n");
  writeFile(repoRoot, "neuroplast/plans/.active-plan", "current-objective.md\n");

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
  assert.match(result.output, /Managed file preview complete \(1 created, 0 updated, 0 preserved, 64 baselines adopted, 1 unchanged\)\./);
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
  assert.match(result.output, /Managed file refresh complete \(0 created, 0 updated, 0 preserved, 0 baselines adopted, 65 unchanged\)\./);
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
  assert.equal(timestamps.length >= 1, true);

  const backupFile = timestamps
    .map((timestamp) => path.join(backupRoot, timestamp, "neuroplast", "extensions", "README.md"))
    .find((candidatePath) => fs.existsSync(candidatePath));

  assert.equal(typeof backupFile, "string");
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

// --- LCP v2.0 context, memory model, and quantization ---------------------

const { parseYaml, stringifyYaml } = require("../src/lcp/yaml");

const LCP_LEARNING_ARTIFACT = ".lcp/knowledge/neuroplast-learning.yaml";
const LCP_INDEX = ".lcp/indexes/context.lcpq";
const LCP_DISTILLED_INDEX = ".lcp/indexes/context.distilled.lcpq";

function readLcpDoc(repoRoot, relativePath) {
  return parseYaml(readFile(repoRoot, relativePath));
}

test("init scaffolds a v2.0 LCP manifest with documents and extensions", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-v2-manifest" });
  const manifest = readLcpDoc(repoRoot, LCP_MANIFEST);

  assert.equal(manifest.lcp_version, "2.0");
  assert.equal(manifest.kind, "manifest");
  assert.ok(Array.isArray(manifest.documents));
  assert.ok(manifest.documents.every((ref) => typeof ref.id === "string" && typeof ref.path === "string"));
  assert.ok(manifest.documents.some((ref) => ref.path === LCP_LEARNING_ARTIFACT));
  assert.ok(Array.isArray(manifest.extensions));
  assert.ok(manifest.extensions.some((ext) => ext.name === "lcp/quantized"));
  assert.ok(manifest.extensions.some((ext) => ext.name === "neuroplast/operational-binding"));
});

test("validate accepts the v2.0 context and reports the missing quantized index", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-v2-validate" });

  const result = runCli(["validate", "--json"], { targetRoot: repoRoot });
  assertSuccess(result);
  const payload = JSON.parse(result.stdout);

  assert.equal(payload.ok, true);
  assert.ok(payload.findings.some((f) => f.code === "lcp_document_schema_valid"));
  assert.ok(payload.findings.some((f) => f.code === "lcp_memory_lifecycle_valid"));
  assert.ok(payload.findings.some((f) => f.code === "lcp_quantized_index_missing" && f.level === "warning"));
  assert.ok(payload.findings.some((f) => f.code === "lcp_distilled_index_missing" && f.level === "warning"));
});

test("validate flags a schema-invalid LCP document", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-v2-schema-bad" });
  // Break the rule document: kind must be the const "rule".
  writeFile(repoRoot, ".lcp/rules/neuroplast-boundaries.yaml", 'lcp_version: "2.0"\nkind: not_a_rule\nid: x\ntitle: X\n');

  const result = runCli(["validate", "--json"], { targetRoot: repoRoot });
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, false);
  assert.ok(payload.findings.some((f) => f.code === "lcp_document_schema_invalid" || f.code === "lcp_document_kind_invalid"));
});

test("validate errors on an unimplemented future LCP major but only warns on legacy v1", (t) => {
  // Future/unknown major this consumer does not implement -> error (semantics.md).
  const future = createInitializedRepo(t, { label: "lcp-future-major" });
  writeFile(future.repoRoot, ".lcp/rules/neuroplast-boundaries.yaml",
    'lcp_version: "3.0"\nkind: rule\nid: neuroplast-boundaries\ntitle: X\nstatement: X\nseverity: error\nscope:\n  root: .\n');
  const futureResult = runCli(["validate", "--json"], { targetRoot: future.repoRoot });
  const futurePayload = JSON.parse(futureResult.stdout);
  assert.equal(futurePayload.ok, false);
  assert.ok(futurePayload.findings.some((f) => f.code === "lcp_version_unsupported" && f.level === "error"),
    futureResult.stdout);

  // Legacy v1 is re-baselined by v2.0 and remains structurally valid -> warning, not error.
  const legacy = createInitializedRepo(t, { label: "lcp-legacy-major" });
  writeFile(legacy.repoRoot, ".lcp/rules/neuroplast-boundaries.yaml",
    'lcp_version: "1.0"\nkind: rule\nid: neuroplast-boundaries\ntitle: X\nstatement: X\nseverity: error\nscope:\n  root: .\n');
  const legacyResult = runCli(["validate", "--json"], { targetRoot: legacy.repoRoot });
  const legacyPayload = JSON.parse(legacyResult.stdout);
  assert.ok(legacyPayload.findings.some((f) => f.code === "lcp_version_legacy" && f.level === "warning"),
    legacyResult.stdout);
  assert.ok(!legacyPayload.findings.some((f) => f.code === "lcp_version_unsupported"),
    legacyResult.stdout);
});

test("quantize writes a current .lcpq bundle that validate recognizes", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-quantize" });

  const result = runCli(["quantize"], { targetRoot: repoRoot });
  assertSuccess(result);
  assert.equal(exists(repoRoot, LCP_INDEX), true);
  assert.match(readFile(repoRoot, LCP_INDEX), /^LCPQ\/2 pack/);

  const validateResult = runCli(["validate", "--json"], { targetRoot: repoRoot });
  const payload = JSON.parse(validateResult.stdout);
  assert.ok(payload.findings.some((f) => f.code === "lcp_quantized_index_current" && f.level === "ok"));
});

test("quantize --distill produces a distilled bundle at its own path, leaving pack untouched", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-distill" });

  assertSuccess(runCli(["quantize"], { targetRoot: repoRoot }));
  assert.match(readFile(repoRoot, LCP_INDEX), /^LCPQ\/2 pack/);

  const result = runCli(["quantize", "--distill", "--json"], { targetRoot: repoRoot });
  assertSuccess(result);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.result.quantize.mode, "distill");
  assert.equal(payload.result.quantize.index, LCP_DISTILLED_INDEX);
  assert.match(readFile(repoRoot, LCP_DISTILLED_INDEX), /^LCPQ\/2 distill/);

  // Distilling must not clobber the separately-maintained pack bundle.
  assert.match(readFile(repoRoot, LCP_INDEX), /^LCPQ\/2 pack/);
});

test("remember writes an LCP memory entry and regenerates both derived indexes", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-remember" });

  const result = runCli([
    "remember",
    "--id", "use-stable-ids",
    "--title", "Use Stable IDs",
    "--note", "## Insight\nStable ids let memory be superseded.",
    "--json"
  ], { targetRoot: repoRoot });
  assertSuccess(result);

  const artifact = readLcpDoc(repoRoot, LCP_LEARNING_ARTIFACT);
  const entry = artifact.entries.find((e) => e.id === "use-stable-ids");
  assert.ok(entry);
  assert.equal(entry.status, "active");
  assert.ok(entry.provenance && typeof entry.provenance.origin === "string");

  // Neuroplast holds no memory of its own outside the artifact: no rendered
  // markdown view is written. Both derived quantized indexes are regenerated.
  assert.equal(exists(repoRoot, "neuroplast/learning"), false);
  assert.match(readFile(repoRoot, LCP_INDEX), /^LCPQ\/2 pack/);
  assert.match(readFile(repoRoot, LCP_DISTILLED_INDEX), /^LCPQ\/2 distill/);
});

test("remember --supersedes retires the prior entry and the distilled index drops it", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-supersede" });

  assertSuccess(runCli(["remember", "--id", "policy-v1", "--note", "## Insight\nOld policy."], { targetRoot: repoRoot }));
  assertSuccess(runCli(["remember", "--id", "policy-v2", "--supersedes", "policy-v1", "--note", "## Insight\nNew policy."], { targetRoot: repoRoot }));

  const artifact = readLcpDoc(repoRoot, LCP_LEARNING_ARTIFACT);
  const v1 = artifact.entries.find((e) => e.id === "policy-v1");
  const v2 = artifact.entries.find((e) => e.id === "policy-v2");
  assert.equal(v1.status, "superseded");
  assert.equal(v2.status, "active");
  assert.ok(v2.supersedes.includes("policy-v1"));

  // The superseded entry's content is dropped from the distilled working view
  // (only its id may remain, referenced by v2's `supersedes`), but the pack
  // bundle stays lossless (both entries' content present) so history round-trips.
  const distilled = readFile(repoRoot, LCP_DISTILLED_INDEX);
  assert.doesNotMatch(distilled, /Old policy/);
  assert.match(distilled, /New policy/);
  const packed = readFile(repoRoot, LCP_INDEX);
  assert.match(packed, /Old policy/);
  assert.match(packed, /New policy/);
});

test("v2.0 upgrade migration upgrades a legacy v1.0 bridge and migrates learning notes", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-v2-migration" });

  // Simulate a pre-2.0 install: a locally-edited v1.0 bridge document, a legacy
  // markdown learning note, and no learning memory artifact yet.
  writeFile(repoRoot, ".lcp/profiles/neuroplast-default.yaml", [
    'lcp_version: "1.0"',
    "kind: profile",
    "id: neuroplast.default",
    "title: Neuroplast default profile",
    "refs:",
    "  - neuroplast/manifest.yaml",
    "scope:",
    "  root: .",
    "profile:",
    "  version_statement: Neuroplast v1.3.4 implements LCP v1",
    ""
  ].join("\n"));
  writeFile(repoRoot, "neuroplast/learning/legacy-note.md", "# Legacy Note\n#learning\n\n## Insight\nA migrated insight.\n");
  remove(repoRoot, LCP_LEARNING_ARTIFACT);
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.4.2";
    state.appliedMigrations = state.appliedMigrations.filter((id) => id !== "2026-06-30-lcp-v2-upgrade");
    delete state.managedFileState[".lcp/profiles/neuroplast-default.yaml"];
  });

  const result = runCli(["sync", "--force"], { targetRoot: repoRoot });
  assertSuccess(result);

  // Bridge document upgraded to v2.0.
  const profile = readLcpDoc(repoRoot, ".lcp/profiles/neuroplast-default.yaml");
  assert.equal(profile.lcp_version, "2.0");

  // Legacy note migrated into an LCP memory entry.
  const artifact = readLcpDoc(repoRoot, LCP_LEARNING_ARTIFACT);
  const migrated = artifact.entries.find((e) => e.id === "legacy-note");
  assert.ok(migrated);
  assert.equal(migrated.status, "active");
  assert.ok(migrated.provenance && migrated.provenance.origin === "learning-migration");

  // Whole context validates clean afterward.
  const validateResult = runCli(["validate", "--json"], { targetRoot: repoRoot });
  const payload = JSON.parse(validateResult.stdout);
  assert.equal(payload.findings.filter((f) => f.level === "error").length, 0, validateResult.stdout);
});

test("remove-learning-view migration folds unmigrated notes into LCP memory and removes the folder", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-remove-learning-view" });

  // One note already migrated (present in the artifact), one note that is not
  // (simulating an install between the 2026-06-30 and 2026-07-01 migrations).
  writeFile(repoRoot, "neuroplast/learning/already-migrated.md", "# Already Migrated\n#learning\n\n## Insight\nAlready in the artifact.\n");
  writeFile(repoRoot, "neuroplast/learning/not-yet-migrated.md", "# Not Yet Migrated\n#learning\n\n## Insight\nStill only a markdown note.\n");
  const artifact = readLcpDoc(repoRoot, LCP_LEARNING_ARTIFACT);
  artifact.entries.push({
    id: "already-migrated",
    status: "active",
    confidence: 0.8,
    title: "Already Migrated",
    note: "Already in the artifact.",
    provenance: { origin: "learning-migration", method: "captured-during-work-cycle" },
    updated_at: "2026-06-30T00:00:00Z"
  });
  writeFile(repoRoot, LCP_LEARNING_ARTIFACT, stringifyYaml(artifact));
  updateState(repoRoot, (state) => {
    state.appliedMigrations = state.appliedMigrations.filter((id) => id !== "2026-07-01-remove-learning-view");
  });

  const result = runCli(["sync", "--force"], { targetRoot: repoRoot });
  assertSuccess(result);

  // The unmigrated note is folded in; the already-migrated entry is not duplicated.
  const updated = readLcpDoc(repoRoot, LCP_LEARNING_ARTIFACT);
  assert.equal(updated.entries.filter((e) => e.id === "already-migrated").length, 1);
  const folded = updated.entries.find((e) => e.id === "not-yet-migrated");
  assert.ok(folded);
  assert.equal(folded.status, "active");

  // The rendered folder is gone entirely; memory lives only in the artifact.
  assert.equal(exists(repoRoot, "neuroplast/learning"), false);

  const validateResult = runCli(["validate", "--json"], { targetRoot: repoRoot });
  const payload = JSON.parse(validateResult.stdout);
  assert.equal(payload.findings.filter((f) => f.level === "error").length, 0, validateResult.stdout);
});

test("remove-learning-view migration strips the stale learning_dir role from the user's own manifest.yaml", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-remove-learning-view-manifest" });

  // neuroplast/manifest.yaml is never overwritten by sync (no shipped baseline),
  // so simulate a pre-2.0.1 install whose own manifest still requires the
  // folder and maps the now-removed learning_dir document role. Start from the
  // real current manifest and reintroduce just the two stale lines, so the
  // test isolates that delta instead of hand-maintaining a drift-prone copy.
  const currentManifest = readFile(repoRoot, "neuroplast/manifest.yaml");
  const staleManifest = currentManifest
    .replace(
      "  - neuroplast/plans\n",
      "  - neuroplast/plans\n  - neuroplast/learning\n"
    )
    .replace(
      "  plans_dir: neuroplast/plans\n",
      "  plans_dir: neuroplast/plans\n  learning_dir: neuroplast/learning\n"
    );
  assert.notEqual(staleManifest, currentManifest, "test setup must actually add the stale lines");
  writeFile(repoRoot, "neuroplast/manifest.yaml", staleManifest);
  updateState(repoRoot, (state) => {
    state.appliedMigrations = state.appliedMigrations.filter((id) => id !== "2026-07-01-remove-learning-view");
  });

  const result = runCli(["sync", "--force"], { targetRoot: repoRoot });
  assertSuccess(result);

  const manifest = readLcpDoc(repoRoot, "neuroplast/manifest.yaml");
  assert.ok(!manifest.required_directories.includes("neuroplast/learning"));
  assert.equal(manifest.document_roles.learning_dir, undefined);
  // Everything else the user's manifest declared survives untouched.
  assert.ok(manifest.required_directories.includes("neuroplast/project-concept"));
  assert.equal(manifest.document_roles.concept_dir, "neuroplast/project-concept");

  const validateResult = runCli(["validate", "--json"], { targetRoot: repoRoot });
  const payload = JSON.parse(validateResult.stdout);
  assert.equal(payload.findings.filter((f) => f.level === "error").length, 0, validateResult.stdout);
});

test("upgrade rescue refreshes unbaselined managed instruction files and backs up prior content", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-upgrade-rescue" });

  // Simulate a pre-baseline install (e.g. 1.2.2): managed instruction files that
  // have no baseline and no longer match the shipped version. This is the class
  // of file that would otherwise be stranded stale forever on upgrade. One is
  // untouched-old-shipped, one carries a local edit — without a baseline we
  // cannot tell them apart, so both are rescued and their prior content backed up.
  writeFile(repoRoot, "neuroplast/act.md", "# Old Act\n#instruction\n\nAncient pre-baseline content.\n");
  writeFile(repoRoot, "neuroplast/think.md", "# Old Think\n#instruction\n\nAncient content.\n<!-- local customization -->\n");
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.2.2";
    delete state.managedFileState["neuroplast/act.md"];
    delete state.managedFileState["neuroplast/think.md"];
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });
  assertSuccess(result);

  // Both files are refreshed to the shipped v2.0.1 content.
  assert.match(readFile(repoRoot, "neuroplast/act.md"), /Assemble the working context/);
  assert.match(readFile(repoRoot, "neuroplast/think.md"), /assess its confidence deliberately/);

  // Nothing is lost: the prior content (including the local edit) is backed up.
  const backupsRoot = path.join(repoRoot, "neuroplast", ".backups");
  const backupDirs = fs.existsSync(backupsRoot) ? fs.readdirSync(backupsRoot) : [];
  assert.ok(backupDirs.length > 0, "an upgrade backup directory should exist");
  const backedUpThink = fs.readFileSync(
    path.join(backupsRoot, backupDirs[0], "neuroplast", "think.md"),
    "utf8"
  );
  assert.match(backedUpThink, /local customization/, "prior edited content is preserved in the backup");

  // Baselines are recorded, so a second sync treats them as controlled (no re-rescue).
  assert.ok(readState(repoRoot).managedFileState["neuroplast/act.md"], "act.md baseline recorded after rescue");
  const second = runCli(["sync", "--force"], { targetRoot: repoRoot });
  assertSuccess(second);
  assert.doesNotMatch(`${second.stdout}${second.stderr}`, /Refreshed unbaselined managed file/);
});

test("backfill migration adds missing document_roles to an older install's manifest", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "backfill-doc-roles" });

  // Simulate an old manifest missing two document roles newer versions require,
  // with a user comment that must survive the surgical backfill.
  const stale = readFile(repoRoot, "neuroplast/manifest.yaml")
    .replace(/^  interaction_routing:.*\n/m, "")
    .replace(/^  adapter_assets_dir:.*\n/m, "")
    .replace(/^document_roles:\n/m, "document_roles:\n  # user note in the roles block\n");
  writeFile(repoRoot, "neuroplast/manifest.yaml", stale);
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.2.2";
    state.appliedMigrations = state.appliedMigrations.filter((id) => id !== "2026-07-02-backfill-document-roles");
  });

  const result = runCli(["sync", "--force"], { targetRoot: repoRoot });
  assertSuccess(result);

  const manifest = readLcpDoc(repoRoot, "neuroplast/manifest.yaml");
  assert.equal(manifest.document_roles.interaction_routing, "neuroplast/interaction-routing.yaml");
  assert.equal(manifest.document_roles.adapter_assets_dir, "neuroplast/adapter-assets");
  // Surgical: the user comment and pre-existing roles are untouched.
  assert.match(readFile(repoRoot, "neuroplast/manifest.yaml"), /# user note in the roles block/);
  assert.equal(manifest.document_roles.plans_dir, "neuroplast/plans");

  // Whole context validates clean afterward.
  const validateResult = runCli(["validate", "--json"], { targetRoot: repoRoot });
  const payload = JSON.parse(validateResult.stdout);
  assert.equal(payload.findings.filter((f) => f.level === "error").length, 0, validateResult.stdout);
});

test("upgrade rescue leaves user-maintainable config (manifest) untouched even without a baseline", (t) => {
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-upgrade-rescue-config" });

  const customManifest = `${readFile(repoRoot, "neuroplast/manifest.yaml")}\n# user customization marker\n`;
  writeFile(repoRoot, "neuroplast/manifest.yaml", customManifest);
  updateState(repoRoot, (state) => {
    state.lastSyncedVersion = "1.2.2";
    delete state.managedFileState["neuroplast/manifest.yaml"];
  });

  const result = runCli(["sync"], { targetRoot: repoRoot });
  assertSuccess(result);
  assert.match(readFile(repoRoot, "neuroplast/manifest.yaml"), /# user customization marker/);
});

test("assembleView returns a prioritized working context view with lifecycle filtering", (t) => {
  const { assembleView } = require("../src/lcp/assemble");
  const { repoRoot } = createInitializedRepo(t, { label: "lcp-assemble" });

  // Seed memory: one active and one superseded entry.
  assertSuccess(runCli(["remember", "--id", "keep-me", "--note", "## Insight\nActive."], { targetRoot: repoRoot }));
  assertSuccess(runCli(["remember", "--id", "replace-me", "--note", "## Insight\nOld."], { targetRoot: repoRoot }));
  assertSuccess(runCli(["remember", "--id", "replace-me-v2", "--supersedes", "replace-me", "--note", "## Insight\nNew."], { targetRoot: repoRoot }));

  const view = assembleView(repoRoot, { intent: "act" });
  assert.equal(view.intent, "act");
  assert.ok(Array.isArray(view.profiles) && view.profiles.includes("neuroplast-default"));

  // Hard constraints (rules) are ordered ahead of reasoning scaffolds.
  const ruleIndex = view.documents.findIndex((d) => d.kind === "rule");
  const scaffoldIndex = view.documents.findIndex((d) => d.kind === "reasoning_scaffold");
  assert.ok(ruleIndex !== -1 && scaffoldIndex !== -1 && ruleIndex < scaffoldIndex);

  // Superseded memory never reaches the assembled view.
  const learningEntries = view.documents
    .filter((d) => d.kind === "knowledge_artifact")
    .flatMap((d) => d.entries || []);
  assert.ok(learningEntries.some((e) => e.id === "keep-me"));
  assert.ok(learningEntries.some((e) => e.id === "replace-me-v2"));
  assert.ok(!learningEntries.some((e) => e.id === "replace-me"));
});
