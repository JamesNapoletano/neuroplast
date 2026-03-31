const path = require("path");
const packageJson = require("../../package.json");

const PACKAGE_VERSION = packageJson.version;
const STATE_FILE = "neuroplast/.neuroplast-state.json";
const packageRoot = path.resolve(__dirname, "..", "..");

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
  extensionFiles,
  knownManagedFiles,
  refreshManagedFiles,
  getRefreshManagedFilePaths
};
