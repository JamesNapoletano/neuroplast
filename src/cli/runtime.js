const path = require("path");

const {
  PACKAGE_VERSION,
  packageRoot,
  requiredDirs,
  workflowFiles,
  obsidianFiles,
  adapterFiles,
  adapterAssetFiles,
  extensionFiles,
  lcpBridgeFiles
} = require("./constants");
const { createCommandOutput } = require("./output");
const { ensureDirectory, copyIfMissing } = require("./filesystem");
const { loadState, saveState, trackManagedFile } = require("./state");
const { runSync } = require("./sync");
const { runValidate } = require("./validate");
const { runRoute } = require("./interaction-routing");

function main({ argv = process.argv, env = process.env, cwd = process.cwd() } = {}) {
  const args = argv.slice(2);
  const context = createContext(args, env, cwd);

  if (!context.command || context.command === "help" || context.command === "--help" || context.command === "-h") {
    printHelp();
    process.exit(0);
  }

  if (context.command !== "init" && context.command !== "sync" && context.command !== "validate" && context.command !== "route") {
    context.logError(`Unknown command: ${context.command}`);
    printHelp();
    process.exit(1);
  }

  const validationError = getArgumentValidationError(context.command, context.args.slice(1));
  if (validationError) {
    context.logError(validationError);
    printHelp();
    process.exit(1);
  }

  if (context.command === "init") {
    const initResult = runInit(context);
    const syncResult = runSync(context, { isPostInit: true });

    if (context.outputJson) {
      context.writeJsonResult({ init: initResult, sync: syncResult });
    }
    return;
  }

  if (context.command === "sync") {
    const syncResult = runSync(context, { isPostInit: false });

    if (context.outputJson) {
      context.writeJsonResult({ sync: syncResult });
    }
    return;
  }

  if (context.command === "route") {
    runRoute(context);
    return;
  }

  runValidate(context);
}

function createContext(args, env, cwd) {
  const flagSet = new Set(args.slice(1));
  const command = args[0];
  const outputJson = flagSet.has("--json") && (command === "init" || command === "sync");
  let context;
  const output = createCommandOutput({
    jsonMode: outputJson,
    getPhase: () => (context && context.phase) || command || null
  });

  context = {
    args,
    command,
    outputJson,
    phase: command || null,
    withObsidian: flagSet.has("--with-obsidian"),
    syncOptions: {
      dryRun: flagSet.has("--dry-run"),
      backup: flagSet.has("--backup"),
      force: flagSet.has("--force"),
      json: flagSet.has("--json")
    },
    validationOptions: {
      json: flagSet.has("--json")
    },
    routeOptions: {
      json: flagSet.has("--json")
    },
    PACKAGE_VERSION,
    packageRoot,
    targetRoot: env.INIT_CWD || cwd,
    logInfo: output.logInfo,
    logError: output.logError,
    logCreated: output.logCreated,
    logSkip: output.logSkip,
    logUpdated: output.logUpdated,
    logPreserved: output.logPreserved,
    logValidationOk: output.logValidationOk,
    logValidationWarning: output.logValidationWarning,
    logValidationError: output.logValidationError,
    output,
    writeJsonResult(result) {
      output.writePayload(output.buildPayload({
        command: context.command,
        packageVersion: PACKAGE_VERSION,
        targetRoot: context.targetRoot,
        options: getCommandOptions(context),
        result
      }));
    }
  };

  return context;
}

function runInit(context) {
  const state = loadState(context);
  const checkpoint = context.output.checkpoint();
  context.phase = "init";

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

  const adapterAssetsTargetDir = path.join(context.targetRoot, "neuroplast", "adapter-assets");
  ensureDirectory(context, adapterAssetsTargetDir, context.syncOptions);

  for (const fileName of adapterAssetFiles) {
    copyIfMissing(
      context,
      path.join(context.packageRoot, "src", "adapter-assets", fileName),
      path.join(adapterAssetsTargetDir, fileName),
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

  copyIfMissing(
    context,
    path.join(context.packageRoot, "src", "templates", "ARCHITECTURE.md"),
    path.join(context.targetRoot, "ARCHITECTURE.md"),
    context.syncOptions
  );

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

  return {
    withObsidian: context.withObsidian,
    dryRun: context.syncOptions.dryRun,
    summary: context.output.summarizeSince(checkpoint)
  };
}

function getArgumentValidationError(command, rawArgs) {
  const allowedFlagsByCommand = {
    init: new Set(["--with-obsidian", "--dry-run", "--json"]),
    sync: new Set(["--dry-run", "--backup", "--force", "--json"]),
    validate: new Set(["--json"]),
    route: new Set(["--json"])
  };

  const allowedFlags = allowedFlagsByCommand[command] || new Set();
  let hasRoutePhrase = false;

  for (const arg of rawArgs) {
    if (!arg.startsWith("-")) {
      if (command === "route") {
        hasRoutePhrase = true;
        continue;
      }

      return `Unexpected positional argument for ${command}: ${arg}`;
    }

    if (!allowedFlags.has(arg)) {
      return `Unsupported option for ${command}: ${arg}`;
    }
  }

  if (command === "route" && !hasRoutePhrase) {
    return "Route command requires a phrase argument.";
  }

  return null;
}

function printHelp() {
  console.log(`\nNeuroplast CLI\n\nUsage:\n  neuroplast init [--with-obsidian] [--dry-run] [--json]\n  neuroplast sync [--dry-run] [--backup] [--force] [--json]\n  neuroplast validate [--json]\n  neuroplast route <phrase> [--json]\n\nCommands:\n  init                 Copy Neuroplast workflow files, scaffold ARCHITECTURE.md if missing, and create managed folders\n  sync                 Apply versioned migrations and safe refreshes to managed Neuroplast and LCP bridge files\n  validate             Validate the LCP bridge, Neuroplast profile, metadata, and environment-guide boundaries\n  route                Inspect canonical interaction-routing resolution for a phrase\n\nOptions:\n  --with-obsidian      Include neuroplast/.obsidian config files (init only)\n  --dry-run            Preview actions without writing files\n  --backup             Create backups before sync file updates\n  --force              Run sync even when version is unchanged or downgraded\n  --json               Emit machine-readable output (init, sync, validate, or route)\n  -h, --help           Show this help\n`);
}

function getCommandOptions(context) {
  const options = {
    json: context.outputJson || (context.command === "route" && context.routeOptions.json)
  };

  if (context.command === "init") {
    options.withObsidian = context.withObsidian;
    options.dryRun = context.syncOptions.dryRun;
  }

  if (context.command === "sync") {
    options.dryRun = context.syncOptions.dryRun;
    options.backup = context.syncOptions.backup;
    options.force = context.syncOptions.force;
  }

  if (context.command === "route") {
    options.json = context.routeOptions.json;
  }

  return options;
}

module.exports = {
  main
};
