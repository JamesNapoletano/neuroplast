const path = require("path");

const {
  PACKAGE_VERSION,
  packageRoot,
  requiredDirs,
  workflowFiles,
  obsidianFiles,
  adapterFiles,
  extensionFiles,
  lcpBridgeFiles
} = require("./constants");
const {
  logInfo,
  logError,
  logCreated,
  logSkip,
  logUpdated,
  logPreserved,
  logValidationOk,
  logValidationWarning,
  logValidationError
} = require("./logging");
const { ensureDirectory, copyIfMissing } = require("./filesystem");
const { loadState, saveState, trackManagedFile } = require("./state");
const { runSync } = require("./sync");
const { runValidate } = require("./validate");

function main({ argv = process.argv, env = process.env, cwd = process.cwd() } = {}) {
  const args = argv.slice(2);
  const context = createContext(args, env, cwd);

  if (!context.command || context.command === "help" || context.command === "--help" || context.command === "-h") {
    printHelp();
    process.exit(0);
  }

  if (context.command !== "init" && context.command !== "sync" && context.command !== "validate") {
    context.logError(`Unknown command: ${context.command}`);
    printHelp();
    process.exit(1);
  }

  if (context.command === "init") {
    runInit(context);
    runSync(context, { isPostInit: true });
    return;
  }

  if (context.command === "sync") {
    runSync(context, { isPostInit: false });
    return;
  }

  runValidate(context);
}

function createContext(args, env, cwd) {
  const flagSet = new Set(args.slice(1));

  return {
    args,
    command: args[0],
    withObsidian: flagSet.has("--with-obsidian"),
    syncOptions: {
      dryRun: flagSet.has("--dry-run"),
      backup: flagSet.has("--backup"),
      force: flagSet.has("--force")
    },
    validationOptions: {
      json: flagSet.has("--json")
    },
    PACKAGE_VERSION,
    packageRoot,
    targetRoot: env.INIT_CWD || cwd,
    logInfo,
    logError,
    logCreated,
    logSkip,
    logUpdated,
    logPreserved,
    logValidationOk,
    logValidationWarning,
    logValidationError
  };
}

function runInit(context) {
  const state = loadState(context);

  context.logInfo(`Initializing Neuroplast in: ${context.targetRoot}`);

  for (const dir of requiredDirs) {
    ensureDirectory(context, path.join(context.targetRoot, dir), context.syncOptions);
  }

  for (const fileName of workflowFiles) {
    copyIfMissing(
      context,
      path.join(context.packageRoot, "src", "instructions", fileName),
      path.join(context.targetRoot, "neuroplast", fileName),
      {
        ...context.syncOptions,
        trackManagedFile: (relativePath) => trackManagedFile(state, relativePath)
      }
    );
  }

  const adaptersTargetDir = path.join(context.targetRoot, "neuroplast", "adapters");
  ensureDirectory(context, adaptersTargetDir, context.syncOptions);

  for (const fileName of adapterFiles) {
    copyIfMissing(
      context,
      path.join(context.packageRoot, "src", "adapters", fileName),
      path.join(adaptersTargetDir, fileName),
      {
        ...context.syncOptions,
        trackManagedFile: (relativePath) => trackManagedFile(state, relativePath)
      }
    );
  }

  const extensionsTargetDir = path.join(context.targetRoot, "neuroplast", "extensions");
  ensureDirectory(context, extensionsTargetDir, context.syncOptions);

  for (const fileName of extensionFiles) {
    copyIfMissing(
      context,
      path.join(context.packageRoot, "src", "extensions", fileName),
      path.join(extensionsTargetDir, fileName),
      {
        ...context.syncOptions,
        trackManagedFile: (relativePath) => trackManagedFile(state, relativePath)
      }
    );
  }

  for (const fileName of lcpBridgeFiles) {
    copyIfMissing(
      context,
      path.join(context.packageRoot, "src", "lcp-files", fileName),
      path.join(context.targetRoot, ".lcp", fileName),
      {
        ...context.syncOptions,
        trackManagedFile: (relativePath) => trackManagedFile(state, relativePath)
      }
    );
  }

  if (context.withObsidian) {
    const obsidianTargetDir = path.join(context.targetRoot, "neuroplast", ".obsidian");
    ensureDirectory(context, obsidianTargetDir, context.syncOptions);

    for (const fileName of obsidianFiles) {
      copyIfMissing(
        context,
        path.join(context.packageRoot, "src", "obsidian", ".obsidian", fileName),
        path.join(obsidianTargetDir, fileName),
        {
          ...context.syncOptions,
          trackManagedFile: (relativePath) => trackManagedFile(state, relativePath)
        }
      );
    }
  } else {
    context.logInfo("Skipping neuroplast/.obsidian config (use --with-obsidian to include it).");
  }

  if (!context.syncOptions.dryRun) {
    state.installedVersion = PACKAGE_VERSION;
    saveState(context, state);
  }

  context.logInfo("Neuroplast initialization complete.");
}

function printHelp() {
  console.log(`\nNeuroplast CLI\n\nUsage:\n  neuroplast init [--with-obsidian] [--dry-run]\n  neuroplast sync [--dry-run] [--backup] [--force]\n  neuroplast validate [--json]\n\nCommands:\n  init                 Copy Neuroplast workflow files, LCP bridge files, and create managed folders\n  sync                 Apply versioned migrations and safe refreshes to managed Neuroplast and LCP bridge files\n  validate             Validate the LCP bridge, Neuroplast profile, metadata, and environment-guide boundaries\n\nOptions:\n  --with-obsidian      Include neuroplast/.obsidian config files (init only)\n  --dry-run            Preview actions without writing files\n  --backup             Create backups before sync file updates\n  --force              Run sync even when version is unchanged or downgraded\n  --json               Emit machine-readable validation output (validate only)\n  -h, --help           Show this help\n`);
}

module.exports = {
  main
};
