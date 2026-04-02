const path = require("path");

const LCP_BRIDGE_DIRECTORIES = [
  ".lcp",
  ".lcp/profiles",
  ".lcp/workflows",
  ".lcp/rules",
  ".lcp/reasoning",
  ".lcp/tools",
  ".lcp/knowledge"
];

const LCP_BRIDGE_FILES = [
  "manifest.yaml",
  path.join("profiles", "neuroplast-default.yaml"),
  path.join("workflows", "neuroplast-loop.yaml"),
  path.join("rules", "neuroplast-boundaries.yaml"),
  path.join("reasoning", "neuroplast-execution-scaffold.yaml"),
  path.join("tools", "neuroplast-cli.yaml"),
  path.join("knowledge", "neuroplast-compatibility.yaml")
];

function getLcpBridgeDirectories() {
  return [...LCP_BRIDGE_DIRECTORIES];
}

function getLcpBridgeFiles() {
  return [...LCP_BRIDGE_FILES];
}

function getExpectedBridgeDocumentPaths() {
  return getLcpBridgeFiles().map((fileName) => path.join(".lcp", fileName).replace(/\\/g, "/"));
}

module.exports = {
  getLcpBridgeDirectories,
  getLcpBridgeFiles,
  getExpectedBridgeDocumentPaths
};
