const path = require("path");

const {
  PACKAGE_VERSION,
  ACTIVE_PLAN_POINTER_RELATIVE_PATH,
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
const { runQuantize, runRemember } = require("./lcp");

function main({ argv = process.argv, env = process.env, cwd = process.cwd() } = {}) {
  const args = argv.slice(2);
  const context = createContext(args, env, cwd);

  if (!context.command || context.command === "help" || context.command === "--help" || context.command === "-h") {
    printHelp();
    process.exit(0);
  }

  const knownCommands = new Set(["init", "sync", "validate", "route", "quantize", "remember"]);
  if (!knownCommands.has(context.command)) {
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

  if (context.command === "quantize") {
    runQuantize(context);
    return;
  }

  if (context.command === "remember") {
    runRemember(context);
    return;
  }

  runValidate(context);
}

const JSON_CAPABLE_COMMANDS = new Set(["init", "sync", "quantize", "remember"]);

function createContext(args, env, cwd) {
  const flagSet = new Set(args.slice(1));
  const command = args[0];
  const outputJson = flagSet.has("--json") && JSON_CAPABLE_COMMANDS.has(command);
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
    quantizeOptions: parseQuantizeOptions(args, flagSet),
    rememberOptions: parseRememberOptions(args, flagSet),
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

  copyIfMissing(
    context,
    path.join(context.packageRoot, "src", "instructions", "plans", ".active-plan"),
    path.join(context.targetRoot, ACTIVE_PLAN_POINTER_RELATIVE_PATH),
    {
      ...context.syncOptions,
      trackManagedFile: (relativePath) => trackManagedFile(state, relativePath)
    }
  );

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

// Flags that consume the following token as a value.
const VALUE_FLAGS_BY_COMMAND = {
  quantize: new Set(["--min-confidence"]),
  remember: new Set(["--id", "--note", "--title", "--confidence", "--supersedes", "--origin"])
};

function getArgumentValidationError(command, rawArgs) {
  const allowedFlagsByCommand = {
    init: new Set(["--with-obsidian", "--dry-run", "--json"]),
    sync: new Set(["--dry-run", "--backup", "--force", "--json"]),
    validate: new Set(["--json"]),
    route: new Set(["--json"]),
    quantize: new Set(["--distill", "--include-deprecated", "--dry-run", "--json", "--min-confidence"]),
    remember: new Set(["--dry-run", "--json", "--id", "--note", "--title", "--confidence", "--supersedes", "--origin"])
  };

  const allowedFlags = allowedFlagsByCommand[command] || new Set();
  const valueFlags = VALUE_FLAGS_BY_COMMAND[command] || new Set();
  let hasRoutePhrase = false;

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
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

    if (valueFlags.has(arg)) {
      if (i + 1 >= rawArgs.length || rawArgs[i + 1].startsWith("-")) {
        return `Option ${arg} for ${command} requires a value.`;
      }
      i += 1; // Skip the consumed value token.
    }
  }

  if (command === "route" && !hasRoutePhrase) {
    return "Route command requires a phrase argument.";
  }

  return null;
}

function readValueFlag(args, name) {
  const index = args.indexOf(name);
  if (index === -1 || index + 1 >= args.length) {
    return null;
  }
  return args[index + 1];
}

function parseQuantizeOptions(args, flagSet) {
  const minConfidenceRaw = readValueFlag(args, "--min-confidence");
  const minConfidence = minConfidenceRaw === null ? null : Number.parseFloat(minConfidenceRaw);
  return {
    distill: flagSet.has("--distill"),
    includeDeprecated: flagSet.has("--include-deprecated"),
    minConfidence: Number.isFinite(minConfidence) ? minConfidence : null,
    dryRun: flagSet.has("--dry-run")
  };
}

function parseRememberOptions(args, flagSet) {
  const confidenceRaw = readValueFlag(args, "--confidence");
  const confidence = confidenceRaw === null ? null : Number.parseFloat(confidenceRaw);
  return {
    id: readValueFlag(args, "--id"),
    note: readValueFlag(args, "--note"),
    title: readValueFlag(args, "--title"),
    supersedes: readValueFlag(args, "--supersedes"),
    origin: readValueFlag(args, "--origin"),
    confidence: Number.isFinite(confidence) ? confidence : null,
    dryRun: flagSet.has("--dry-run")
  };
}

function printHelp() {
  console.log(`\nNeuroplast CLI\n\nUsage:\n  neuroplast init [--with-obsidian] [--dry-run] [--json]\n  neuroplast sync [--dry-run] [--backup] [--force] [--json]\n  neuroplast validate [--json]\n  neuroplast route <phrase> [--json]\n  neuroplast quantize [--distill] [--min-confidence N] [--include-deprecated] [--dry-run] [--json]\n  neuroplast remember --id <id> [--note <text>] [--title <t>] [--confidence N] [--supersedes <id>] [--origin <o>] [--dry-run] [--json]\n\nCommands:\n  init                 Copy Neuroplast workflow files, scaffold ARCHITECTURE.md if missing, and create managed folders\n  sync                 Apply versioned migrations and safe refreshes to managed Neuroplast and LCP bridge files\n  validate             Validate the LCP v2.0 context, Neuroplast profile, metadata, and environment-guide boundaries\n  route                Inspect canonical interaction-routing resolution for a phrase\n  quantize             Write a derived quantized bundle: .lcp/indexes/context.lcpq (pack), or .lcp/indexes/context.distilled.lcpq with --distill\n  remember             Write a durable learning back as an LCP memory entry and regenerate both derived indexes\n\nOptions:\n  --with-obsidian      Include neuroplast/.obsidian config files (init only)\n  --dry-run            Preview actions without writing files\n  --backup             Create backups before sync file updates\n  --force              Run sync even when version is unchanged or downgraded\n  --distill            Produce a lossy, high-signal quantized bundle (quantize only)\n  --min-confidence N   Drop memory entries below confidence N when distilling (quantize only)\n  --include-deprecated Keep deprecated memory entries when distilling (quantize only)\n  --id <id>            Stable id for the memory entry (remember only)\n  --note <text>        Note body; read from stdin when omitted (remember only)\n  --title <t>          Human-readable title for the entry (remember only)\n  --confidence N       Authoring confidence 0 (speculative) to 1 (established); assess deliberately, defaults to 0.8 if omitted (remember only)\n  --supersedes <id>    Mark a prior entry superseded and link this one to it (remember only)\n  --origin <o>         Provenance origin label for the entry, defaults to work-cycle (remember only)\n  --json               Emit machine-readable output (init, sync, validate, route, quantize, remember)\n  -h, --help           Show this help\n`);
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
