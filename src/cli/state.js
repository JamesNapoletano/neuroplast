const fs = require("fs");
const path = require("path");

const { STATE_FILE, getRefreshManagedFilePaths, knownManagedFiles, PACKAGE_VERSION } = require("./constants");
const { ensureDirectory } = require("./filesystem");
const { normalizeRelativePath } = require("./shared");

function createEmptyState() {
  return {
    schemaVersion: 2,
    installedVersion: null,
    lastSyncedVersion: null,
    appliedMigrations: [],
    managedFiles: [],
    managedFileState: {}
  };
}

function loadState(context) {
  const statePath = path.join(context.targetRoot, STATE_FILE);

  if (!fs.existsSync(statePath)) {
    return createEmptyState();
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
    context.logError(`Could not parse ${STATE_FILE}; creating a fresh state file.`);
    return createEmptyState();
  }
}

function saveState(context, state) {
  const statePath = path.join(context.targetRoot, STATE_FILE);
  ensureDirectory(context, path.dirname(statePath), context.syncOptions);
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

function seedKnownManagedFiles(context, state) {
  for (const relativeFilePath of knownManagedFiles) {
    const absolutePath = path.join(context.targetRoot, relativeFilePath);
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

module.exports = {
  loadState,
  saveState,
  seedKnownManagedFiles,
  trackManagedFile,
  getManagedFileBaseline,
  setManagedFileBaseline,
  normalizeManagedFileState,
  serializeManagedFileState,
  pruneManagedFileState,
  sortObjectByKeys
};
