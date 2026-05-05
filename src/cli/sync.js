const fs = require("fs");
const path = require("path");

const {
  PACKAGE_VERSION,
  CURRENT_CONTEXT_RELATIVE_PATH,
  packageRoot,
  refreshManagedFiles
} = require("./constants");
const { resolveActivePlan } = require("./active-plan");
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
  const checkpoint = context.output.checkpoint();
  context.phase = "sync";
  seedKnownManagedFiles(context, state);

  const syncDecision = getSyncDecision({
    lastSyncedVersion: state.lastSyncedVersion,
    currentVersion: PACKAGE_VERSION,
    force: context.syncOptions.force
  });

  const result = {
    postInit: Boolean(isPostInit),
    dryRun: context.syncOptions.dryRun,
    decision: syncDecision,
    managedRefresh: null,
    migrations: [],
    stateUpdated: false,
    summary: null
  };

  context.logInfo(syncDecision.message);

  if (!syncDecision.shouldRun) {
    if (!isPostInit) {
      context.logInfo("Neuroplast sync complete.");
    }
    result.summary = context.output.summarizeSince(checkpoint);
    return result;
  }

  if (context.syncOptions.dryRun) {
    context.logInfo("Dry run enabled: previewing sync changes without modifying files or state.");
  }

  const managedRefreshResult = refreshManagedStaticFiles(context, state);
  result.managedRefresh = managedRefreshResult;

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
    const migrationResult = migration.run(migrationContext);

    if (!context.syncOptions.dryRun) {
      state.appliedMigrations.push(migration.id);
    }

    context.logInfo(`Migration ${migration.id} complete (${migrationResult.updated} updated, ${migrationResult.scanned} scanned).`);
    result.migrations.push({
      id: migration.id,
      version: migration.version,
      description: migration.description,
      updated: migrationResult.updated,
      scanned: migrationResult.scanned
    });
  }

  if (!context.syncOptions.dryRun) {
    finalizeManagedStaticFiles(context, state, managedRefreshResult.controlledPaths);
    state.lastSyncedVersion = PACKAGE_VERSION;
    saveState(context, state);
    result.stateUpdated = true;
  } else {
    context.logInfo("Dry run enabled: no files or state were modified.");
  }

  if (!isPostInit) {
    context.logInfo("Neuroplast sync complete.");
  }

  result.summary = context.output.summarizeSince(checkpoint);
  return result;
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

  refreshGeneratedCurrentContext({
    context,
    state,
    result,
    controlledPathSet,
    backupRoot
  });

  result.controlledPaths = Array.from(controlledPathSet).sort();
  return result;
}

function refreshGeneratedCurrentContext({ context, state, result, controlledPathSet, backupRoot }) {
  result.scanned += 1;

  const relativeDestinationPath = normalizeRelativePath(CURRENT_CONTEXT_RELATIVE_PATH);
  const destinationPath = path.join(context.targetRoot, relativeDestinationPath);
  const templatePath = path.join(packageRoot, "src", "instructions", "current-context.md");

  if (!fs.existsSync(templatePath)) {
    context.logError(`Missing source file in package: ${templatePath}`);
    return;
  }

  trackManagedFile(state, relativeDestinationPath);

  const templateContent = fs.readFileSync(templatePath, "utf8");
  const templateHash = hashFileContents(templateContent);
  const generatedContent = buildCurrentContextContent(context, templateContent);
  const generatedHash = hashFileContents(generatedContent);
  const baseline = getManagedFileBaseline(state, relativeDestinationPath);

  if (!fs.existsSync(destinationPath)) {
    ensureDirectory(context, path.dirname(destinationPath), context.syncOptions);

    if (!context.syncOptions.dryRun) {
      fs.writeFileSync(destinationPath, generatedContent, "utf8");
    }

    context.logCreated(relativeDestinationPath, context.syncOptions.dryRun);
    result.created += 1;
    controlledPathSet.add(relativeDestinationPath);
    return;
  }

  const currentContent = fs.readFileSync(destinationPath, "utf8");
  const currentHash = hashFileContents(currentContent);

  if (!baseline) {
    if (currentHash === templateHash || currentHash === generatedHash) {
      context.logInfo(`Adopted managed baseline for ${relativeDestinationPath}.`);
      result.adopted += 1;
      controlledPathSet.add(relativeDestinationPath);

      if (currentHash === generatedHash) {
        result.unchanged += 1;
        return;
      }

      if (!context.syncOptions.dryRun) {
        maybeBackupFile(context, destinationPath, backupRoot);
        fs.writeFileSync(destinationPath, generatedContent, "utf8");
      }

      context.logUpdated(relativeDestinationPath, context.syncOptions.dryRun);
      result.updated += 1;
      return;
    }

    context.logPreserved(relativeDestinationPath, context.syncOptions.dryRun, "local edits detected (no stored baseline)");
    result.preserved += 1;
    return;
  }

  if (currentHash !== baseline.contentHash) {
    context.logPreserved(relativeDestinationPath, context.syncOptions.dryRun, "local edits detected");
    result.preserved += 1;
    return;
  }

  controlledPathSet.add(relativeDestinationPath);

  if (currentHash === generatedHash) {
    result.unchanged += 1;
    return;
  }

  if (!context.syncOptions.dryRun) {
    maybeBackupFile(context, destinationPath, backupRoot);
    fs.writeFileSync(destinationPath, generatedContent, "utf8");
  }

  context.logUpdated(relativeDestinationPath, context.syncOptions.dryRun);
  result.updated += 1;
}

function buildCurrentContextContent(context, templateContent) {
  const activePlan = resolveActivePlan(context);
  const latestPlan = activePlan ? activePlan.relativePath : null;
  if (!latestPlan) {
    return templateContent;
  }

  const latestChangelog = findLatestMarkdownFile(path.join(context.targetRoot, "neuroplast", "project-concept", "changelog"), context.targetRoot);
  const relatedConcept = latestPlan ? extractFirstWikiLink(readFileIfExists(path.join(context.targetRoot, latestPlan)), "project-concept/") : null;
  const planContent = latestPlan ? readFileIfExists(path.join(context.targetRoot, latestPlan)) : "";
  const objective = latestPlan
    ? extractCurrentObjective(planContent)
    : "No active plan detected. Create or update a bounded plan under `neuroplast/plans/`.";
  const nextStep = latestPlan
    ? extractNextBoundedStep(planContent)
    : "Create a current plan, then continue through the routed instruction file for the next bounded step.";
  const blockers = latestPlan ? extractSectionSummary(planContent, ["Blockers"]) : "None recorded.";
  const verification = latestPlan ? extractSectionSummary(planContent, ["Verification", "Verification For This Cycle", "Done When"]) : "Run `npx neuroplast validate` after the first bounded loop.";

  const relevantFiles = [latestPlan, relatedConcept, latestChangelog, "ARCHITECTURE.md"].filter(Boolean);
  const routeAwareEmphasis = [
    {
      intent: "act",
      contextDepth: "lean",
      focus: "objective, next bounded step, blockers, verification"
    },
    {
      intent: "inspect-current-plan",
      contextDepth: "standard",
      focus: "objective, next bounded step, blockers, related files"
    },
    {
      intent: "conceptualize",
      contextDepth: "deep",
      focus: "objective, scope assumptions, related files, recent context"
    }
  ];

  return [
    "# Current Context",
    "",
    "This file is an optional compact briefing capsule for the repository's current state.",
    "",
    "It is auto-refreshed by `neuroplast sync` when it still matches the managed baseline. Local edits are preserved.",
    "",
    "## Boundary",
    "- This file is advisory, not canonical.",
    "- `plans/`, `project-concept/`, `project-concept/changelog/`, `learning/`, and `ARCHITECTURE.md` remain the durable source of truth.",
    "- If you want to keep custom notes here, edit the file directly; future sync runs will preserve your version instead of overwriting it.",
    "",
    "## Advisory Bootstrap Modes",
    "- **lean** — load the mandatory startup contract, then `current-context.md`, the active plan, and the current step file.",
    "- **standard** — use `lean`, then add `ARCHITECTURE.md` plus the most relevant concept note or recent changelog entry.",
    "- **deep** — use `standard`, then add broader concept, learning, and adjacent plan context for reframing or higher-risk work.",
    "",
    "## Current Snapshot",
    `- **Active plan:** ${formatInlinePath(latestPlan)}`,
    `- **Active plan source:** ${activePlan.source}`,
    `- **Objective:** ${objective}`,
    `- **Next bounded step:** ${nextStep}`,
    `- **Blockers:** ${blockers}`,
    `- **Verification:** ${verification}`,
    "",
    "## Route-Aware Reading Hints",
    ...routeAwareEmphasis.map((entry) => `- **${entry.intent}** -> use \`${entry.contextDepth}\` context depth and emphasize ${entry.focus}.`),
    "",
    "## Relevant Files",
    ...relevantFiles.map((filePath) => `- ${formatInlinePath(filePath)}`),
    "",
    "## Refresh Sources",
    "- The active plan pointer in `neuroplast/plans/.active-plan` is used when present; otherwise the newest plan in `neuroplast/plans/` is used.",
    "- Related concept context is taken from the active plan when it links to a `project-concept/` note.",
    "- The newest changelog entry under `neuroplast/project-concept/changelog/` provides recent completed-context continuity.",
    "- `ARCHITECTURE.md` remains the canonical architecture anchor for any deeper context load.",
    ""
  ].join("\n");
}

function findLatestMarkdownFile(directoryPath, targetRoot) {
  if (!fs.existsSync(directoryPath)) {
    return null;
  }

  const markdownFiles = fs.readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => path.join(directoryPath, fileName))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  if (!markdownFiles.length) {
    return null;
  }

  return normalizeRelativePath(path.relative(targetRoot, markdownFiles[0]));
}

function readFileIfExists(absolutePath) {
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return "";
  }

  return fs.readFileSync(absolutePath, "utf8");
}

function extractCurrentObjective(content) {
  const section = extractNamedSection(content, ["Current Objective", "Objective"]);
  if (!section) {
    return "No explicit current objective recorded in the active plan.";
  }

  const summary = summarizeSectionLines(section, 1);
  return summary || "No explicit current objective recorded in the active plan.";
}

function extractNextBoundedStep(content) {
  const uncheckedTask = content.match(/^\s*(?:\d+\.\s*)?(?:[-*]\s*)?\[ \]\s+(.+)$/m);
  if (uncheckedTask && uncheckedTask[1]) {
    return sanitizeInlineText(uncheckedTask[1]);
  }

  const handoff = extractNamedSection(content, ["Handoff", "Next Step", "Execution Steps"]);
  const summary = summarizeSectionLines(handoff, 1);
  return summary || "No explicit next bounded step recorded.";
}

function extractSectionSummary(content, sectionNames) {
  const section = extractNamedSection(content, sectionNames);
  const summary = summarizeSectionLines(section, 2);
  return summary || "None recorded.";
}

function extractNamedSection(content, sectionNames) {
  if (!content) {
    return "";
  }

  const normalizedTargets = new Set(sectionNames.map((name) => String(name).trim().toLowerCase()));
  const lines = content.split(/\r?\n/);
  let capture = false;
  const collected = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      const headingName = headingMatch[1].trim().toLowerCase();
      if (capture) {
        break;
      }

      capture = normalizedTargets.has(headingName);
      continue;
    }

    if (capture) {
      collected.push(line);
    }
  }

  return collected.join("\n").trim();
}

function summarizeSectionLines(sectionContent, maxItems) {
  if (!sectionContent) {
    return "";
  }

  const lines = sectionContent.split(/\r?\n/)
    .map((line) => sanitizeInlineText(line))
    .filter(Boolean)
    .filter((line) => line !== "#plan");

  if (!lines.length) {
    return "";
  }

  return lines.slice(0, maxItems).join(" | ");
}

function extractFirstWikiLink(content, requiredPrefix) {
  if (!content) {
    return null;
  }

  const matches = content.match(/\[\[([^\]]+)\]\]/g) || [];
  for (const match of matches) {
    const value = match.slice(2, -2).trim();
    if (!requiredPrefix || value.startsWith(requiredPrefix)) {
      return value;
    }
  }

  return null;
}

function sanitizeInlineText(value) {
  return String(value || "")
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .replace(/^\[.\]\s+/, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .trim();
}

function formatInlinePath(filePath) {
  if (!filePath) {
    return "`None`";
  }

  return `\`${normalizeRelativePath(filePath)}\``;
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
