const fs = require("fs");
const path = require("path");

const { PACKAGE_VERSION, packageRoot, refreshManagedFiles } = require("./constants");
const { ensureDirectory, maybeBackupFile } = require("./filesystem");
const {
  loadState,
  saveState,
  seedKnownManagedFiles,
  trackManagedFile,
  getManagedFileBaseline,
  setManagedFileBaseline
} = require("./state");
const {
  compareSemver,
  createTimestampLabel,
  hashFileContents,
  listFilesRecursive,
  normalizeRelativePath
} = require("./shared");

function runSync(context, { isPostInit }) {
  const state = loadState(context);
  seedKnownManagedFiles(context, state);

  const syncDecision = getSyncDecision({
    lastSyncedVersion: state.lastSyncedVersion,
    currentVersion: PACKAGE_VERSION,
    force: context.syncOptions.force
  });

  context.logInfo(syncDecision.message);

  if (!syncDecision.shouldRun) {
    if (!isPostInit) {
      context.logInfo("Neuroplast sync complete.");
    }
    return;
  }

  if (context.syncOptions.dryRun) {
    context.logInfo("Dry run enabled: previewing sync changes without modifying files or state.");
  }

  const managedRefreshResult = refreshManagedStaticFiles(context, state);

  if (managedRefreshResult.scanned > 0) {
    const summaryLabel = context.syncOptions.dryRun ? "Managed file preview complete" : "Managed file refresh complete";
    context.logInfo(`${summaryLabel} (${managedRefreshResult.created} created, ${managedRefreshResult.updated} updated, ${managedRefreshResult.preserved} preserved, ${managedRefreshResult.adopted} baselines adopted, ${managedRefreshResult.unchanged} unchanged).`);
  }

  const migrationContext = createMigrationContext(context, state);
  const pendingMigrations = loadMigrations()
    .filter((migration) => {
      const isTargetVersionReached = compareSemver(migration.version, PACKAGE_VERSION) <= 0;
      const isApplied = state.appliedMigrations.includes(migration.id);
      return isTargetVersionReached && !isApplied;
    });

  if (!pendingMigrations.length) {
    context.logInfo(`No pending migrations for version ${PACKAGE_VERSION}.`);
  }

  for (const migration of pendingMigrations) {
    context.logInfo(`Applying migration ${migration.id}: ${migration.description}`);
    const result = migration.run(migrationContext);

    if (!context.syncOptions.dryRun) {
      state.appliedMigrations.push(migration.id);
    }

    context.logInfo(`Migration ${migration.id} complete (${result.updated} updated, ${result.scanned} scanned).`);
  }

  if (!context.syncOptions.dryRun) {
    finalizeManagedStaticFiles(context, state, managedRefreshResult.controlledPaths);
    state.lastSyncedVersion = PACKAGE_VERSION;
    saveState(context, state);
  } else {
    context.logInfo("Dry run enabled: no files or state were modified.");
  }

  if (!isPostInit) {
    context.logInfo("Neuroplast sync complete.");
  }
}

function refreshManagedStaticFiles(context, state) {
  const result = {
    scanned: 0,
    created: 0,
    updated: 0,
    preserved: 0,
    adopted: 0,
    unchanged: 0,
    controlledPaths: []
  };

  const controlledPathSet = new Set();
  const backupRoot = context.syncOptions.backup
    ? path.join(context.targetRoot, "neuroplast", ".backups", createTimestampLabel())
    : null;

  for (const file of refreshManagedFiles) {
    result.scanned += 1;

    const sourcePath = path.join(packageRoot, file.source);
    const destinationPath = path.join(context.targetRoot, file.destination);
    const relativeDestinationPath = normalizeRelativePath(file.destination);

    if (!fs.existsSync(sourcePath)) {
      context.logError(`Missing source file in package: ${sourcePath}`);
      continue;
    }

    trackManagedFile(state, relativeDestinationPath);

    const sourceHash = hashFileContents(fs.readFileSync(sourcePath, "utf8"));
    const baseline = getManagedFileBaseline(state, relativeDestinationPath);

    if (!fs.existsSync(destinationPath)) {
      ensureDirectory(context, path.dirname(destinationPath), context.syncOptions);

      if (!context.syncOptions.dryRun) {
        fs.copyFileSync(sourcePath, destinationPath);
      }

      context.logCreated(relativeDestinationPath, context.syncOptions.dryRun);
      result.created += 1;
      controlledPathSet.add(relativeDestinationPath);
      continue;
    }

    const currentHash = hashFileContents(fs.readFileSync(destinationPath, "utf8"));

    if (!baseline) {
      if (currentHash === sourceHash) {
        context.logInfo(`Adopted managed baseline for ${relativeDestinationPath}.`);
        result.adopted += 1;
        controlledPathSet.add(relativeDestinationPath);
      } else {
        context.logPreserved(relativeDestinationPath, context.syncOptions.dryRun, "local edits detected (no stored baseline)");
        result.preserved += 1;
      }

      continue;
    }

    if (currentHash !== baseline.contentHash) {
      context.logPreserved(relativeDestinationPath, context.syncOptions.dryRun, "local edits detected");
      result.preserved += 1;
      continue;
    }

    controlledPathSet.add(relativeDestinationPath);

    if (currentHash === sourceHash) {
      result.unchanged += 1;
      continue;
    }

    if (!context.syncOptions.dryRun) {
      maybeBackupFile(context, destinationPath, backupRoot);
      fs.copyFileSync(sourcePath, destinationPath);
    }

    context.logUpdated(relativeDestinationPath, context.syncOptions.dryRun);
    result.updated += 1;
  }

  result.controlledPaths = Array.from(controlledPathSet).sort();
  return result;
}

function finalizeManagedStaticFiles(context, state, controlledPaths) {
  for (const relativePath of controlledPaths) {
    const absolutePath = path.join(context.targetRoot, relativePath);

    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    setManagedFileBaseline(state, relativePath, {
      contentHash: hashFileContents(fs.readFileSync(absolutePath, "utf8")),
      lastSyncedVersion: PACKAGE_VERSION
    });
  }
}

function createMigrationContext(context, state) {
  const backupRoot = context.syncOptions.backup
    ? path.join(context.targetRoot, "neuroplast", ".backups", createTimestampLabel())
    : null;

  return {
    getManagedMarkdownFiles() {
      const neuroplastRoot = path.join(context.targetRoot, "neuroplast");

      if (!fs.existsSync(neuroplastRoot)) {
        return [];
      }

      return listFilesRecursive(neuroplastRoot)
        .map((absolutePath) => normalizeRelativePath(path.relative(context.targetRoot, absolutePath)))
        .filter((relativePath) => relativePath.endsWith(".md"))
        .filter((relativePath) => !relativePath.startsWith("neuroplast/.obsidian/"))
        .filter((relativePath) => !relativePath.startsWith("neuroplast/.backups/"));
    },
    updateMarkdownFile(relativePath, updater) {
      const absolutePath = path.join(context.targetRoot, relativePath);
      const current = fs.readFileSync(absolutePath, "utf8");
      const next = updater(current);

      if (next === current) {
        return false;
      }

      if (!context.syncOptions.dryRun) {
        maybeBackupFile(context, absolutePath, backupRoot);
        fs.writeFileSync(absolutePath, next, "utf8");
      }

      context.logUpdated(relativePath, context.syncOptions.dryRun);
      return true;
    },
    trackManagedFile(relativePath) {
      trackManagedFile(state, relativePath);
    },
    logCreatedFile(relativePath) {
      context.logCreated(relativePath, context.syncOptions.dryRun);
    },
    dryRun: context.syncOptions.dryRun
  };
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

module.exports = {
  runSync,
  getSyncDecision,
  loadMigrations
};
