const path = require("path");
const fs = require("fs");
const packageJson = require("../../package.json");
const { getLcpBridgeDirectories, getLcpBridgeFiles } = require("../lcp/bridge");

const PACKAGE_VERSION = packageJson.version;
const STATE_FILE = "neuroplast/.neuroplast-state.json";
const packageRoot = path.resolve(__dirname, "..", "..");

const requiredDirs = [
  "neuroplast/project-concept",
  "neuroplast/project-concept/changelog",
  "neuroplast/learning",
  "neuroplast/plans",
  ...getLcpBridgeDirectories()
];

const workflowFiles = [
  "manifest.yaml",
  "capabilities.yaml",
  "WORKFLOW_CONTRACT.md",
  "interaction-routing.yaml",
  "conceptualize.md",
  "reverse-engineering.md",
  "reconcile-conflicts.md",
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
  "codex.md",
  "windsurf.md",
  "vscode-copilot.md",
  "terminal.md"
];

const adapterAssetFiles = listManagedFilesRelative(path.join(packageRoot, "src", "adapter-assets"));

const extensionFiles = listManagedExtensionFiles();
const lcpBridgeFiles = getLcpBridgeFiles();

const knownManagedFiles = [
  ...workflowFiles.map((fileName) => path.join("neuroplast", fileName)),
  ...adapterFiles.map((fileName) => path.join("neuroplast", "adapters", fileName)),
  ...adapterAssetFiles.map((fileName) => path.join("neuroplast", "adapter-assets", fileName)),
  ...extensionFiles.map((fileName) => path.join("neuroplast", "extensions", fileName)),
  ...obsidianFiles.map((fileName) => path.join("neuroplast", ".obsidian", fileName)),
  ...lcpBridgeFiles.map((fileName) => path.join(".lcp", fileName))
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
  ...adapterAssetFiles.map((fileName) => ({
    source: path.join("src", "adapter-assets", fileName),
    destination: path.join("neuroplast", "adapter-assets", fileName)
  })),
  ...extensionFiles.map((fileName) => ({
    source: path.join("src", "extensions", fileName),
    destination: path.join("neuroplast", "extensions", fileName)
  })),
  ...lcpBridgeFiles.map((fileName) => ({
    source: path.join("src", "lcp-files", fileName),
    destination: path.join(".lcp", fileName)
  }))
];

function getRefreshManagedFilePaths() {
  return refreshManagedFiles.map((file) => String(file.destination).replace(/\\/g, "/"));
}

module.exports = {
  PACKAGE_VERSION,
  STATE_FILE,
  packageRoot,
  requiredDirs,
  workflowFiles,
  obsidianFiles,
  adapterFiles,
  adapterAssetFiles,
  extensionFiles,
  lcpBridgeFiles,
  knownManagedFiles,
  refreshManagedFiles,
  getRefreshManagedFilePaths
};

function listManagedExtensionFiles() {
  const extensionsRoot = path.join(packageRoot, "src", "extensions");

  return listManagedFilesRelative(extensionsRoot);
}

function listManagedFilesRelative(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  return listFilesRelative(rootDir);
}

function listFilesRelative(rootDir) {
  const results = [];

  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const absolutePath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      for (const nestedPath of listFilesRelative(absolutePath)) {
        results.push(path.join(entry.name, nestedPath));
      }
      continue;
    }

    if (entry.isFile()) {
      results.push(entry.name);
    }
  }

  return results.sort((a, b) => a.localeCompare(b));
}
