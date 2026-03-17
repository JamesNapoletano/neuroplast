#!/usr/bin/env node

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

if (command !== "init" && command !== "sync") {
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

const instructionFiles = [
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

const knownManagedFiles = [
  ...instructionFiles.map((fileName) => path.join("neuroplast", fileName)),
  ...obsidianFiles.map((fileName) => path.join("neuroplast", ".obsidian", fileName))
];

if (command === "init") {
  runInit();
  runSync({ isPostInit: true });
} else {
  runSync({ isPostInit: false });
}

function runInit() {
  const state = loadState();

  logInfo(`Initializing Neuroplast in: ${targetRoot}`);

  for (const dir of requiredDirs) {
    ensureDirectory(path.join(targetRoot, dir), syncOptions);
  }

  for (const fileName of instructionFiles) {
    const src = path.join(packageRoot, "src", "instructions", fileName);
    const dest = path.join(targetRoot, "neuroplast", fileName);
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
    state.lastSyncedVersion = PACKAGE_VERSION;
    saveState(state);
  } else {
    logInfo("Dry run enabled: no files or state were modified.");
  }

  if (!isPostInit) {
    logInfo("Neuroplast sync complete.");
  }
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
      schemaVersion: 1,
      installedVersion: null,
      lastSyncedVersion: null,
      appliedMigrations: [],
      managedFiles: []
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, "utf8"));
    return {
      schemaVersion: 1,
      installedVersion: parsed.installedVersion || null,
      lastSyncedVersion: parsed.lastSyncedVersion || null,
      appliedMigrations: Array.isArray(parsed.appliedMigrations) ? parsed.appliedMigrations : [],
      managedFiles: Array.isArray(parsed.managedFiles) ? parsed.managedFiles.map(normalizeRelativePath) : []
    };
  } catch (error) {
    logError(`Could not parse ${STATE_FILE}; creating a fresh state file.`);
    return {
      schemaVersion: 1,
      installedVersion: null,
      lastSyncedVersion: null,
      appliedMigrations: [],
      managedFiles: []
    };
  }
}

function saveState(state) {
  const statePath = path.join(targetRoot, STATE_FILE);
  ensureDirectory(path.dirname(statePath), syncOptions);

  fs.writeFileSync(statePath, JSON.stringify({
    schemaVersion: 1,
    installedVersion: state.installedVersion || PACKAGE_VERSION,
    lastSyncedVersion: state.lastSyncedVersion || PACKAGE_VERSION,
    appliedMigrations: Array.from(new Set(state.appliedMigrations)),
    managedFiles: Array.from(new Set(state.managedFiles.map(normalizeRelativePath))).sort()
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
    }
  };
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
  console.log(`\nNeuroplast CLI\n\nUsage:\n  neuroplast init [--with-obsidian] [--dry-run]\n  neuroplast sync [--dry-run] [--backup] [--force]\n\nCommands:\n  init                 Copy Neuroplast instruction files into /neuroplast and create /neuroplast folders\n  sync                 Apply one-time versioned updates to managed Neuroplast files\n\nOptions:\n  --with-obsidian      Include neuroplast/.obsidian config files (init only)\n  --dry-run            Preview actions without writing files\n  --backup             Create backups before sync file updates\n  --force              Run sync even when version is unchanged or downgraded\n  -h, --help           Show this help\n`);
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
