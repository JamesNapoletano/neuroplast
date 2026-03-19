#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");

const args = process.argv.slice(2);
const command = args[0];

const flagSet = new Set(args.slice(1));
const withObsidian = flagSet.has("--with-obsidian");
const dryRun = flagSet.has("--dry-run");
const backup = flagSet.has("--backup");
const force = flagSet.has("--force");

const PACKAGE_VERSION = packageJson.version;
const STATE_FILE = "neuroplast/.neuroplast-state.json";
const packageRoot = path.resolve(__dirname, "..");
const targetRoot = process.env.INIT_CWD || process.cwd();

const MIGRATIONS = loadMigrations();

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

if (command !== "init" && command !== "sync" && command !== "validate") {
  logError(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

const syncOptions = { dryRun, backup, force };

const requiredDirs = [
  "neuroplast/project-concept",
  "neuroplast/project-concept/changelog",
  "neuroplast/learning",
  "neuroplast/plans"
];

const workflowFiles = [
  "manifest.yaml",
  "capabilities.yaml",
  "WORKFLOW_CONTRACT.md",
  "conceptualize.md",
  "act.md",
  "think.md",
  "CONCEPT_INSTRUCTIONS.md",
  "CHANGELOG_INSTRUCTIONS.md",
  "PLANNING_INSTRUCTIONS.md"
];

const obsidianFiles = [
  "core-plugins.json",
  "app.json",
  "appearance.json",
  "graph.json"
];

const adapterFiles = [
  "README.md",
  "opencode.md",
  "claude-code.md",
  "cursor.md",
  "windsurf.md",
  "vscode-copilot.md",
  "terminal.md"
];

const extensionFiles = [
  path.join("README.md")
];

const knownManagedFiles = [
  ...workflowFiles.map((fileName) => path.join("neuroplast", fileName)),
  ...adapterFiles.map((fileName) => path.join("neuroplast", "adapters", fileName)),
  ...extensionFiles.map((fileName) => path.join("neuroplast", "extensions", fileName)),
  ...obsidianFiles.map((fileName) => path.join("neuroplast", ".obsidian", fileName))
];

const refreshManagedFiles = [
  ...workflowFiles.map((fileName) => ({
    source: path.join("src", "instructions", fileName),
    destination: path.join("neuroplast", fileName)
  })),
  ...adapterFiles.map((fileName) => ({
    source: path.join("src", "adapters", fileName),
    destination: path.join("neuroplast", "adapters", fileName)
  })),
  ...extensionFiles.map((fileName) => ({
    source: path.join("src", "extensions", fileName),
    destination: path.join("neuroplast", "extensions", fileName)
  }))
];

if (command === "init") {
  runInit();
  runSync({ isPostInit: true });
} else if (command === "sync") {
  runSync({ isPostInit: false });
} else {
  runValidate();
}

function runInit() {
  const state = loadState();

  logInfo(`Initializing Neuroplast in: ${targetRoot}`);

  for (const dir of requiredDirs) {
    ensureDirectory(path.join(targetRoot, dir), syncOptions);
  }

  for (const fileName of workflowFiles) {
    const src = path.join(packageRoot, "src", "instructions", fileName);
    const dest = path.join(targetRoot, "neuroplast", fileName);
    copyIfMissing(src, dest, {
      ...syncOptions,
      state
    });
  }

  const adaptersTargetDir = path.join(targetRoot, "neuroplast", "adapters");
  ensureDirectory(adaptersTargetDir, syncOptions);

  for (const fileName of adapterFiles) {
    const src = path.join(packageRoot, "src", "adapters", fileName);
    const dest = path.join(adaptersTargetDir, fileName);
    copyIfMissing(src, dest, {
      ...syncOptions,
      state
    });
  }

  const extensionsTargetDir = path.join(targetRoot, "neuroplast", "extensions");
  ensureDirectory(extensionsTargetDir, syncOptions);

  for (const fileName of extensionFiles) {
    const src = path.join(packageRoot, "src", "extensions", fileName);
    const dest = path.join(extensionsTargetDir, fileName);
    copyIfMissing(src, dest, {
      ...syncOptions,
      state
    });
  }

  if (withObsidian) {
    const obsidianTargetDir = path.join(targetRoot, "neuroplast", ".obsidian");
    ensureDirectory(obsidianTargetDir, syncOptions);

    for (const fileName of obsidianFiles) {
      const src = path.join(packageRoot, "src", "obsidian", ".obsidian", fileName);
      const dest = path.join(obsidianTargetDir, fileName);
      copyIfMissing(src, dest, {
        ...syncOptions,
        state
      });
    }

  } else {
    logInfo("Skipping neuroplast/.obsidian config (use --with-obsidian to include it).");
  }

  if (!syncOptions.dryRun) {
    state.installedVersion = PACKAGE_VERSION;
    saveState(state);
  }

  logInfo("Neuroplast initialization complete.");
}

function runSync({ isPostInit }) {
  const state = loadState();
  seedKnownManagedFiles(state);

  const syncDecision = getSyncDecision({
    lastSyncedVersion: state.lastSyncedVersion,
    currentVersion: PACKAGE_VERSION,
    force: syncOptions.force
  });

  logInfo(syncDecision.message);

  if (!syncDecision.shouldRun) {
    if (!isPostInit) {
      logInfo("Neuroplast sync complete.");
    }
    return;
  }

  const managedRefreshResult = refreshManagedStaticFiles(state);

  if (managedRefreshResult.scanned > 0) {
    logInfo(
      `Managed file refresh complete (${managedRefreshResult.updated} updated, ${managedRefreshResult.created} created, ${managedRefreshResult.preserved} preserved, ${managedRefreshResult.adopted} baselines adopted).`
    );
  }

  const migrationContext = createMigrationContext(state);
  const pendingMigrations = MIGRATIONS.filter((migration) => {
    const isTargetVersionReached = compareSemver(migration.version, PACKAGE_VERSION) <= 0;
    const isApplied = state.appliedMigrations.includes(migration.id);
    return isTargetVersionReached && !isApplied;
  });

  if (!pendingMigrations.length) {
    logInfo(`No pending migrations for version ${PACKAGE_VERSION}.`);
  }

  for (const migration of pendingMigrations) {
    logInfo(`Applying migration ${migration.id}: ${migration.description}`);
    const result = migration.run(migrationContext);

    if (!syncOptions.dryRun) {
      state.appliedMigrations.push(migration.id);
    }

    logInfo(`Migration ${migration.id} complete (${result.updated} updated, ${result.scanned} scanned).`);
  }

  if (!syncOptions.dryRun) {
    finalizeManagedStaticFiles(state, managedRefreshResult.controlledPaths);
    state.lastSyncedVersion = PACKAGE_VERSION;
    saveState(state);
  } else {
    logInfo("Dry run enabled: no files or state were modified.");
  }

  if (!isPostInit) {
    logInfo("Neuroplast sync complete.");
  }
}

function runValidate() {
  const findings = [];
  const manifestPath = path.join(targetRoot, "neuroplast", "manifest.yaml");
  const capabilitiesPath = path.join(targetRoot, "neuroplast", "capabilities.yaml");
  const contractPath = path.join(targetRoot, "neuroplast", "WORKFLOW_CONTRACT.md");

  logInfo(`Validating Neuroplast contract in: ${targetRoot}`);

  const manifest = validateYamlFile({
    filePath: manifestPath,
    label: "manifest",
    findings
  });

  validateYamlFile({
    filePath: capabilitiesPath,
    label: "capabilities profile",
    findings
  });

  validateExists(contractPath, "workflow contract", findings);
  validateExists(path.join(targetRoot, "ARCHITECTURE.md"), "root architecture file", findings);

  if (manifest) {
    validateManifestStructure(manifest, findings);
    validateRequiredPaths(manifest, findings);
    validateDocumentRoles(manifest, findings);
    validateInstructionFrontmatter(manifest, findings);
    validateEnvironmentGuides(manifest, findings);
    validateWorkflowExtensions(manifest, findings);
  }

  const errorCount = findings.filter((finding) => finding.level === "error").length;
  const warningCount = findings.filter((finding) => finding.level === "warning").length;

  for (const finding of findings) {
    if (finding.level === "error") {
      logValidationError(finding.message);
    } else if (finding.level === "warning") {
      logValidationWarning(finding.message);
    } else {
      logValidationOk(finding.message);
    }
  }

  if (errorCount > 0) {
    logError(`Validation failed (${errorCount} error(s), ${warningCount} warning(s)).`);
    process.exit(1);
  }

  logInfo(`Validation complete (${findings.length} checks, ${warningCount} warning(s), 0 errors).`);
}

function ensureDirectory(directoryPath, options = {}) {
  if (!fs.existsSync(directoryPath)) {
    if (!options.dryRun) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    logCreated(path.relative(targetRoot, directoryPath) || ".", options.dryRun);
  }
}

function copyIfMissing(sourcePath, destinationPath, options = {}) {
  if (!fs.existsSync(sourcePath)) {
    logError(`Missing source file in package: ${sourcePath}`);
    return;
  }

  const relativeDestinationPath = normalizeRelative(destinationPath);

  if (options.state) {
    trackManagedFile(options.state, relativeDestinationPath);
  }

  if (fs.existsSync(destinationPath)) {
    logSkip(path.relative(targetRoot, destinationPath), options.dryRun);
    return;
  }

  const destinationDir = path.dirname(destinationPath);
  ensureDirectory(destinationDir, options);

  if (!options.dryRun) {
    fs.copyFileSync(sourcePath, destinationPath);
  }

  logCreated(path.relative(targetRoot, destinationPath), options.dryRun);
}

function loadState() {
  const statePath = path.join(targetRoot, STATE_FILE);

  if (!fs.existsSync(statePath)) {
    return {
      schemaVersion: 2,
      installedVersion: null,
      lastSyncedVersion: null,
      appliedMigrations: [],
      managedFiles: [],
      managedFileState: {}
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, "utf8"));
    return {
      schemaVersion: Number.isInteger(parsed.schemaVersion) ? parsed.schemaVersion : 1,
      installedVersion: parsed.installedVersion || null,
      lastSyncedVersion: parsed.lastSyncedVersion || null,
      appliedMigrations: Array.isArray(parsed.appliedMigrations) ? parsed.appliedMigrations : [],
      managedFiles: Array.isArray(parsed.managedFiles) ? parsed.managedFiles.map(normalizeRelativePath) : [],
      managedFileState: normalizeManagedFileState(parsed.managedFileState)
    };
  } catch (error) {
    logError(`Could not parse ${STATE_FILE}; creating a fresh state file.`);
    return {
      schemaVersion: 2,
      installedVersion: null,
      lastSyncedVersion: null,
      appliedMigrations: [],
      managedFiles: [],
      managedFileState: {}
    };
  }
}

function saveState(state) {
  const statePath = path.join(targetRoot, STATE_FILE);
  ensureDirectory(path.dirname(statePath), syncOptions);
  pruneManagedFileState(state, getRefreshManagedFilePaths());

  fs.writeFileSync(statePath, JSON.stringify({
    schemaVersion: 2,
    installedVersion: state.installedVersion || PACKAGE_VERSION,
    lastSyncedVersion: state.lastSyncedVersion || PACKAGE_VERSION,
    appliedMigrations: Array.from(new Set(state.appliedMigrations)),
    managedFiles: Array.from(new Set(state.managedFiles.map(normalizeRelativePath))).sort(),
    managedFileState: sortObjectByKeys(serializeManagedFileState(state.managedFileState))
  }, null, 2) + "\n", "utf8");
}

function seedKnownManagedFiles(state) {
  for (const relativeFilePath of knownManagedFiles) {
    const absolutePath = path.join(targetRoot, relativeFilePath);
    if (fs.existsSync(absolutePath)) {
      trackManagedFile(state, relativeFilePath);
    }
  }
}

function trackManagedFile(state, relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  if (!state.managedFiles.includes(normalized)) {
    state.managedFiles.push(normalized);
  }
}

function refreshManagedStaticFiles(state) {
  const result = {
    scanned: 0,
    created: 0,
    updated: 0,
    preserved: 0,
    adopted: 0,
    controlledPaths: []
  };

  const controlledPathSet = new Set();
  const backupRoot = syncOptions.backup
    ? path.join(targetRoot, "neuroplast", ".backups", createTimestampLabel())
    : null;

  for (const file of refreshManagedFiles) {
    result.scanned += 1;

    const sourcePath = path.join(packageRoot, file.source);
    const destinationPath = path.join(targetRoot, file.destination);
    const relativeDestinationPath = normalizeRelativePath(file.destination);

    if (!fs.existsSync(sourcePath)) {
      logError(`Missing source file in package: ${sourcePath}`);
      continue;
    }

    trackManagedFile(state, relativeDestinationPath);

    const sourceHash = hashFileContents(fs.readFileSync(sourcePath, "utf8"));
    const baseline = getManagedFileBaseline(state, relativeDestinationPath);

    if (!fs.existsSync(destinationPath)) {
      ensureDirectory(path.dirname(destinationPath), syncOptions);

      if (!syncOptions.dryRun) {
        fs.copyFileSync(sourcePath, destinationPath);
      }

      logCreated(relativeDestinationPath, syncOptions.dryRun);
      result.created += 1;
      controlledPathSet.add(relativeDestinationPath);
      continue;
    }

    const currentHash = hashFileContents(fs.readFileSync(destinationPath, "utf8"));

    if (!baseline) {
      if (currentHash === sourceHash) {
        logInfo(`Adopted managed baseline for ${relativeDestinationPath}.`);
        result.adopted += 1;
        controlledPathSet.add(relativeDestinationPath);
      } else {
        logPreserved(relativeDestinationPath, syncOptions.dryRun, "local edits detected (no stored baseline)");
        result.preserved += 1;
      }

      continue;
    }

    if (currentHash !== baseline.contentHash) {
      logPreserved(relativeDestinationPath, syncOptions.dryRun, "local edits detected");
      result.preserved += 1;
      continue;
    }

    controlledPathSet.add(relativeDestinationPath);

    if (currentHash === sourceHash) {
      continue;
    }

    if (!syncOptions.dryRun) {
      maybeBackupFile(destinationPath, backupRoot);
      fs.copyFileSync(sourcePath, destinationPath);
    }

    logUpdated(relativeDestinationPath, syncOptions.dryRun);
    result.updated += 1;
  }

  result.controlledPaths = Array.from(controlledPathSet).sort();
  return result;
}

function finalizeManagedStaticFiles(state, controlledPaths) {
  for (const relativePath of controlledPaths) {
    const absolutePath = path.join(targetRoot, relativePath);

    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    setManagedFileBaseline(state, relativePath, {
      contentHash: hashFileContents(fs.readFileSync(absolutePath, "utf8")),
      lastSyncedVersion: PACKAGE_VERSION
    });
  }
}

function getManagedFileBaseline(state, relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const baseline = state.managedFileState && state.managedFileState[normalized];

  if (!baseline || typeof baseline !== "object") {
    return null;
  }

  if (typeof baseline.contentHash !== "string" || !baseline.contentHash) {
    return null;
  }

  return {
    contentHash: baseline.contentHash,
    lastSyncedVersion: typeof baseline.lastSyncedVersion === "string" ? baseline.lastSyncedVersion : null
  };
}

function setManagedFileBaseline(state, relativePath, baseline) {
  const normalized = normalizeRelativePath(relativePath);

  if (!state.managedFileState || typeof state.managedFileState !== "object") {
    state.managedFileState = {};
  }

  state.managedFileState[normalized] = {
    contentHash: baseline.contentHash,
    lastSyncedVersion: baseline.lastSyncedVersion || PACKAGE_VERSION
  };
}

function normalizeManagedFileState(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  const normalized = {};

  for (const [relativePath, value] of Object.entries(input)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      continue;
    }

    if (typeof value.contentHash !== "string" || !value.contentHash) {
      continue;
    }

    normalized[normalizeRelativePath(relativePath)] = {
      contentHash: value.contentHash,
      lastSyncedVersion: typeof value.lastSyncedVersion === "string" ? value.lastSyncedVersion : null
    };
  }

  return normalized;
}

function serializeManagedFileState(managedFileState) {
  return normalizeManagedFileState(managedFileState);
}

function pruneManagedFileState(state, keepPaths) {
  if (!state.managedFileState || typeof state.managedFileState !== "object") {
    state.managedFileState = {};
    return;
  }

  const keepSet = new Set(keepPaths.map(normalizeRelativePath));

  for (const relativePath of Object.keys(state.managedFileState)) {
    if (!keepSet.has(relativePath)) {
      delete state.managedFileState[relativePath];
    }
  }
}

function sortObjectByKeys(input) {
  const sorted = {};

  for (const key of Object.keys(input).sort()) {
    sorted[key] = input[key];
  }

  return sorted;
}

function createMigrationContext(state) {
  const backupRoot = syncOptions.backup
    ? path.join(targetRoot, "neuroplast", ".backups", createTimestampLabel())
    : null;

  return {
    getManagedMarkdownFiles() {
      const neuroplastRoot = path.join(targetRoot, "neuroplast");

      if (!fs.existsSync(neuroplastRoot)) {
        return [];
      }

      return listFilesRecursive(neuroplastRoot)
        .map((absolutePath) => normalizeRelativePath(path.relative(targetRoot, absolutePath)))
        .filter((relativePath) => relativePath.endsWith(".md"))
        .filter((relativePath) => !relativePath.startsWith("neuroplast/.obsidian/"))
        .filter((relativePath) => !relativePath.startsWith("neuroplast/.backups/"));
    },
    updateMarkdownFile(relativePath, updater) {
      const absolutePath = path.join(targetRoot, relativePath);
      const current = fs.readFileSync(absolutePath, "utf8");
      const next = updater(current);

      if (next === current) {
        return false;
      }

      if (!syncOptions.dryRun) {
        maybeBackupFile(absolutePath, backupRoot);
        fs.writeFileSync(absolutePath, next, "utf8");
      }

      logUpdated(relativePath, syncOptions.dryRun);
      return true;
    },
    trackManagedFile(relativePath) {
      trackManagedFile(state, relativePath);
    },
    logCreatedFile(relativePath) {
      logCreated(relativePath, syncOptions.dryRun);
    },
    dryRun: syncOptions.dryRun
  };
}

function validateYamlFile({ filePath, label, findings }) {
  if (!fs.existsSync(filePath)) {
    findings.push({ level: "error", message: `Missing ${label}: ${normalizeRelative(filePath)}` });
    return null;
  }

  try {
    const parsed = parseSimpleYaml(fs.readFileSync(filePath, "utf8"));
    findings.push({ level: "ok", message: `${label} is parseable: ${normalizeRelative(filePath)}` });
    return parsed;
  } catch (error) {
    findings.push({ level: "error", message: `Could not parse ${label} at ${normalizeRelative(filePath)} (${error.message})` });
    return null;
  }
}

function validateExists(absolutePath, label, findings) {
  if (!fs.existsSync(absolutePath)) {
    findings.push({ level: "error", message: `Missing ${label}: ${normalizeRelative(absolutePath)}` });
    return false;
  }

  findings.push({ level: "ok", message: `${label} exists: ${normalizeRelative(absolutePath)}` });
  return true;
}

function validateManifestStructure(manifest, findings) {
  const requiredArrayFields = [
    "required_directories",
    "required_instruction_files",
    "required_support_files",
    "validation_targets"
  ];

  for (const fieldName of requiredArrayFields) {
    if (!Array.isArray(manifest[fieldName])) {
      findings.push({ level: "error", message: `Manifest field must be an array: ${fieldName}` });
    } else {
      findings.push({ level: "ok", message: `Manifest field is present and array-typed: ${fieldName}` });
    }
  }

  if (!manifest.document_roles || typeof manifest.document_roles !== "object" || Array.isArray(manifest.document_roles)) {
    findings.push({ level: "error", message: "Manifest field must be an object: document_roles" });
  } else {
    findings.push({ level: "ok", message: "Manifest document_roles object is present." });
  }
}

function validateRequiredPaths(manifest, findings) {
  for (const relativeDir of manifest.required_directories || []) {
    const absolutePath = path.join(targetRoot, relativeDir);
    validateExists(absolutePath, `required directory ${relativeDir}`, findings);
  }

  for (const relativeFile of manifest.required_instruction_files || []) {
    const absolutePath = path.join(targetRoot, relativeFile);
    validateExists(absolutePath, `required instruction file ${relativeFile}`, findings);
  }

  for (const relativeFile of manifest.required_support_files || []) {
    const absolutePath = path.join(targetRoot, relativeFile);
    validateExists(absolutePath, `required support file ${relativeFile}`, findings);
  }
}

function validateDocumentRoles(manifest, findings) {
  const roles = manifest.document_roles || {};
  const expectedRoles = {
    manifest: "neuroplast/manifest.yaml",
    capabilities: "neuroplast/capabilities.yaml",
    contract: "neuroplast/WORKFLOW_CONTRACT.md",
    architecture: "ARCHITECTURE.md",
    concept_dir: "neuroplast/project-concept",
    changelog_dir: "neuroplast/project-concept/changelog",
    plans_dir: "neuroplast/plans",
    learning_dir: "neuroplast/learning",
    environment_guides_dir: "neuroplast/adapters",
    extensions_dir: "neuroplast/extensions"
  };

  for (const [roleName, expectedPath] of Object.entries(expectedRoles)) {
    if (roles[roleName] !== expectedPath) {
      findings.push({ level: "error", message: `Manifest document role mismatch for ${roleName}: expected ${expectedPath}` });
      continue;
    }

    findings.push({ level: "ok", message: `Manifest document role matches expected path for ${roleName}.` });
    validateExists(path.join(targetRoot, expectedPath), `document role ${roleName}`, findings);
  }
}

function validateInstructionFrontmatter(manifest, findings) {
  const requiredFields = ["role", "step", "requires", "writes_to", "outputs", "optional"];

  for (const relativeFile of manifest.required_instruction_files || []) {
    const absolutePath = path.join(targetRoot, relativeFile);

    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const content = fs.readFileSync(absolutePath, "utf8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter || !frontmatter.neuroplast || typeof frontmatter.neuroplast !== "object") {
      findings.push({ level: "error", message: `Missing or invalid Neuroplast frontmatter: ${relativeFile}` });
      continue;
    }

    const metadata = frontmatter.neuroplast;
    let isValid = true;

    for (const fieldName of requiredFields) {
      if (!(fieldName in metadata)) {
        findings.push({ level: "error", message: `Missing frontmatter field '${fieldName}' in ${relativeFile}` });
        isValid = false;
      }
    }

    if (metadata.requires && !Array.isArray(metadata.requires)) {
      findings.push({ level: "error", message: `Frontmatter field 'requires' must be an array in ${relativeFile}` });
      isValid = false;
    }

    if (metadata.writes_to && !Array.isArray(metadata.writes_to)) {
      findings.push({ level: "error", message: `Frontmatter field 'writes_to' must be an array in ${relativeFile}` });
      isValid = false;
    }

    if (metadata.outputs && !Array.isArray(metadata.outputs)) {
      findings.push({ level: "error", message: `Frontmatter field 'outputs' must be an array in ${relativeFile}` });
      isValid = false;
    }

    if (metadata.optional !== undefined && typeof metadata.optional !== "boolean") {
      findings.push({ level: "error", message: `Frontmatter field 'optional' must be a boolean in ${relativeFile}` });
      isValid = false;
    }

    if (isValid) {
      findings.push({ level: "ok", message: `Instruction frontmatter is valid: ${relativeFile}` });
    }
  }
}

function validateEnvironmentGuides(manifest, findings) {
  const guidesDir = manifest.document_roles && manifest.document_roles.environment_guides_dir;

  if (!guidesDir) {
    findings.push({ level: "warning", message: "Manifest does not declare environment_guides_dir." });
    return;
  }

  const absoluteGuidesDir = path.join(targetRoot, guidesDir);
  if (!fs.existsSync(absoluteGuidesDir)) {
    findings.push({ level: "error", message: `Missing environment guides directory: ${guidesDir}` });
    return;
  }

  const guideFiles = fs.readdirSync(absoluteGuidesDir)
    .filter((fileName) => fileName.endsWith(".md"));

  for (const fileName of guideFiles) {
    const absolutePath = path.join(absoluteGuidesDir, fileName);
    const relativePath = normalizeRelative(absolutePath);
    const content = fs.readFileSync(absolutePath, "utf8");
    const requiredReferences = [
      "neuroplast/WORKFLOW_CONTRACT.md",
      "neuroplast/manifest.yaml",
      "neuroplast/capabilities.yaml"
    ];

    let isValid = true;

    for (const reference of requiredReferences) {
      if (!content.includes(reference)) {
        findings.push({ level: "error", message: `Environment guide missing canonical reference '${reference}': ${relativePath}` });
        isValid = false;
      }
    }

    if (!content.includes("must not override the Neuroplast workflow contract")) {
      findings.push({ level: "error", message: `Environment guide missing non-authoritative boundary reminder: ${relativePath}` });
      isValid = false;
    }

    if (isValid) {
      findings.push({ level: "ok", message: `Environment guide is aligned to the workflow contract: ${relativePath}` });
    }
  }
}

function validateWorkflowExtensions(manifest, findings) {
  const config = manifest.extensions;

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    findings.push({ level: "warning", message: "Manifest does not declare workflow extension configuration." });
    return;
  }

  const bundledDir = typeof config.bundled_dir === "string" ? config.bundled_dir : "neuroplast/extensions";
  const localDir = typeof config.local_dir === "string" ? config.local_dir : "neuroplast/local-extensions";
  const activeBundled = Array.isArray(config.active_bundled) ? config.active_bundled : [];
  const activeLocal = Array.isArray(config.active_local) ? config.active_local : [];

  validateExists(path.join(targetRoot, bundledDir), "bundled workflow extensions directory", findings);

  for (const extensionName of activeBundled) {
    if (typeof extensionName !== "string" || !extensionName.trim()) {
      findings.push({ level: "error", message: "Manifest bundled extensions must contain non-empty string names." });
      continue;
    }

    const extensionPath = path.join(targetRoot, bundledDir, extensionName);
    if (!fs.existsSync(extensionPath)) {
      findings.push({ level: "error", message: `Missing active bundled workflow extension: ${normalizeRelative(extensionPath)}` });
      continue;
    }

    findings.push({ level: "ok", message: `Active bundled workflow extension exists: ${normalizeRelative(extensionPath)}` });
  }

  if (activeLocal.length > 0) {
    validateExists(path.join(targetRoot, localDir), "repo-local workflow extensions directory", findings);
  }

  for (const extensionName of activeLocal) {
    if (typeof extensionName !== "string" || !extensionName.trim()) {
      findings.push({ level: "error", message: "Manifest local extensions must contain non-empty string names." });
      continue;
    }

    const extensionPath = path.join(targetRoot, localDir, extensionName);
    if (!fs.existsSync(extensionPath)) {
      findings.push({ level: "error", message: `Missing active repo-local workflow extension: ${normalizeRelative(extensionPath)}` });
      continue;
    }

    findings.push({ level: "ok", message: `Active repo-local workflow extension exists: ${normalizeRelative(extensionPath)}` });
  }
}

function listFilesRecursive(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(absolutePath));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

function parseFrontmatter(content) {
  if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
    return null;
  }

  const normalized = content.replace(/\r\n/g, "\n");
  const endIndex = normalized.indexOf("\n---\n", 4);

  if (endIndex === -1) {
    throw new Error("Unterminated frontmatter block");
  }

  const yamlContent = normalized.slice(4, endIndex);
  return parseSimpleYaml(yamlContent);
}

function parseSimpleYaml(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const root = {};
  const stack = [{ indent: -1, container: root }];

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const indent = rawLine.length - rawLine.trimStart().length;
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1].container;

    if (trimmed.startsWith("- ")) {
      if (!Array.isArray(current)) {
        throw new Error(`Unexpected list item on line ${index + 1}`);
      }

      current.push(parseScalar(trimmed.slice(2).trim()));
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) {
      throw new Error(`Invalid mapping entry on line ${index + 1}`);
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const valuePart = trimmed.slice(separatorIndex + 1).trim();

    if (Array.isArray(current)) {
      throw new Error(`Unexpected mapping entry inside array on line ${index + 1}`);
    }

    if (!valuePart) {
      const nextLine = findNextMeaningfulLine(lines, index + 1);
      const nextTrimmed = nextLine ? nextLine.trimStart() : "";
      const nextIndent = nextLine ? nextLine.length - nextLine.trimStart().length : indent;
      const container = nextLine && nextIndent > indent && nextTrimmed.startsWith("- ") ? [] : {};
      current[key] = container;
      stack.push({ indent, container });
      continue;
    }

    current[key] = parseScalar(valuePart);
  }

  return root;
}

function findNextMeaningfulLine(lines, startIndex) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (trimmed && !trimmed.startsWith("#")) {
      return lines[index];
    }
  }

  return null;
}

function parseScalar(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === "[]") {
    return [];
  }

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  if (/^-?\d+$/.test(value)) {
    return Number.parseInt(value, 10);
  }

  return value;
}

function hashFileContents(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function getRefreshManagedFilePaths() {
  return refreshManagedFiles.map((file) => normalizeRelativePath(file.destination));
}

function getSyncDecision({ lastSyncedVersion, currentVersion, force }) {
  if (force) {
    return {
      shouldRun: true,
      message: "Force sync enabled: running sync pipeline."
    };
  }

  if (!lastSyncedVersion) {
    return {
      shouldRun: true,
      message: `No previous sync version found. Running sync for ${currentVersion}.`
    };
  }

  const comparison = compareSemver(currentVersion, lastSyncedVersion);

  if (comparison === 0) {
    return {
      shouldRun: false,
      message: `Already synced for version ${currentVersion}; skipping.`
    };
  }

  if (comparison < 0) {
    return {
      shouldRun: false,
      message: `Detected package downgrade (${lastSyncedVersion} -> ${currentVersion}); skipping sync. Use --force to override.`
    };
  }

  return {
    shouldRun: true,
    message: `Detected package update (${lastSyncedVersion} -> ${currentVersion}); running sync.`
  };
}

function loadMigrations() {
  const migrationsDir = path.join(packageRoot, "src", "migrations");

  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  return fs.readdirSync(migrationsDir)
    .filter((fileName) => fileName.endsWith(".js"))
    .map((fileName) => require(path.join(migrationsDir, fileName)))
    .filter((migration) => migration && migration.id && migration.version && typeof migration.run === "function")
    .sort((a, b) => compareSemver(a.version, b.version) || a.id.localeCompare(b.id));
}

function maybeBackupFile(absolutePath, backupRoot) {
  if (!backupRoot) {
    return;
  }

  const relativePath = path.relative(targetRoot, absolutePath);
  const backupPath = path.join(backupRoot, relativePath);
  ensureDirectory(path.dirname(backupPath), syncOptions);

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(absolutePath, backupPath);
    logInfo(`Backup created: ${path.relative(targetRoot, backupPath)}`);
  }
}

function compareSemver(a, b) {
  const aParts = String(a).split(".").map((part) => Number.parseInt(part, 10) || 0);
  const bParts = String(b).split(".").map((part) => Number.parseInt(part, 10) || 0);
  const maxLength = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < maxLength; i += 1) {
    const diff = (aParts[i] || 0) - (bParts[i] || 0);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

function normalizeRelative(filePath) {
  return normalizeRelativePath(path.relative(targetRoot, filePath));
}

function normalizeRelativePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function createTimestampLabel() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function printHelp() {
  console.log(`\nNeuroplast CLI\n\nUsage:\n  neuroplast init [--with-obsidian] [--dry-run]\n  neuroplast sync [--dry-run] [--backup] [--force]\n  neuroplast validate\n\nCommands:\n  init                 Copy Neuroplast workflow files into /neuroplast and create /neuroplast folders\n  sync                 Apply versioned migrations and safe refreshes to managed Neuroplast files\n  validate             Validate the Neuroplast contract, metadata, and environment-guide boundaries\n\nOptions:\n  --with-obsidian      Include neuroplast/.obsidian config files (init only)\n  --dry-run            Preview actions without writing files\n  --backup             Create backups before sync file updates\n  --force              Run sync even when version is unchanged or downgraded\n  -h, --help           Show this help\n`);
}

function logInfo(message) {
  console.log(`[neuroplast] ${message}`);
}

function logError(message) {
  console.error(`[neuroplast][error] ${message}`);
}

function logCreated(relativePath, preview = false) {
  const prefix = preview ? "[neuroplast][create][dry-run]" : "[neuroplast][create]";
  console.log(`${prefix} ${relativePath}`);
}

function logSkip(relativePath, preview = false) {
  const prefix = preview ? "[neuroplast][skip][dry-run]" : "[neuroplast][skip]";
  console.log(`${prefix} ${relativePath}`);
}

function logUpdated(relativePath, preview = false) {
  const prefix = preview ? "[neuroplast][update][dry-run]" : "[neuroplast][update]";
  console.log(`${prefix} ${relativePath}`);
}

function logPreserved(relativePath, preview = false, reason = "local edits detected") {
  const prefix = preview ? "[neuroplast][preserve][dry-run]" : "[neuroplast][preserve]";
  console.log(`${prefix} ${relativePath} (${reason})`);
}

function logValidationOk(message) {
  console.log(`[neuroplast][validate][ok] ${message}`);
}

function logValidationWarning(message) {
  console.warn(`[neuroplast][validate][warning] ${message}`);
}

function logValidationError(message) {
  console.error(`[neuroplast][validate][error] ${message}`);
}
