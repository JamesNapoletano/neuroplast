const path = require("path");

const LCP_BRIDGE_DIRECTORIES = [
  ".lcp",
  ".lcp/profiles",
  ".lcp/workflows",
  ".lcp/rules",
  ".lcp/reasoning",
  ".lcp/tools",
  ".lcp/knowledge",
  ".lcp/indexes"
];

// Template-managed bridge documents: shipped by Neuroplast and refreshed in place
// on sync (subject to the managed-file baseline checks).
const LCP_TEMPLATE_FILES = [
  "manifest.yaml",
  path.join("profiles", "neuroplast-default.yaml"),
  path.join("workflows", "neuroplast-loop.yaml"),
  path.join("rules", "neuroplast-boundaries.yaml"),
  path.join("reasoning", "neuroplast-execution-scaffold.yaml"),
  path.join("tools", "neuroplast-cli.yaml")
];

// Consumer-owned knowledge memory: seeded once on init, then owned by the
// repository. Sync must never overwrite these, because they accumulate durable
// memory written back via the operational binding.
const LCP_SEED_ONCE_FILES = [
  path.join("knowledge", "neuroplast-compatibility.yaml"),
  path.join("knowledge", "neuroplast-learning.yaml")
];

// Pack (lossless) and distill (lossy, high-signal) are separate derived
// artifacts per the Quantized LCP extension. They live at separate paths so
// regenerating one never clobbers the other: an operational layer that reads
// the distilled view for context assembly must not have it silently reverted
// to the larger, non-reduced pack bundle by an unrelated sync/remember call.
const LCP_INDEX_FILE = path.join("indexes", "context.lcpq");
const LCP_DISTILLED_INDEX_FILE = path.join("indexes", "context.distilled.lcpq");

function getLcpBridgeDirectories() {
  return [...LCP_BRIDGE_DIRECTORIES];
}

function getLcpTemplateFiles() {
  return [...LCP_TEMPLATE_FILES];
}

function getLcpSeedOnceFiles() {
  return [...LCP_SEED_ONCE_FILES];
}

// Every bridge document Neuroplast manages (template + seed-once), used for
// initial scaffolding and managed-file tracking.
function getLcpBridgeFiles() {
  return [...LCP_TEMPLATE_FILES, ...LCP_SEED_ONCE_FILES];
}

function toRepoRelative(fileName) {
  return path.join(".lcp", fileName).replace(/\\/g, "/");
}

function getExpectedBridgeDocumentPaths() {
  return getLcpBridgeFiles().map(toRepoRelative);
}

function getLcpManifestRelativePath() {
  return toRepoRelative("manifest.yaml");
}

function getLcpIndexRelativePath() {
  return toRepoRelative(LCP_INDEX_FILE);
}

function getLcpDistilledIndexRelativePath() {
  return toRepoRelative(LCP_DISTILLED_INDEX_FILE);
}

module.exports = {
  getLcpBridgeDirectories,
  getLcpBridgeFiles,
  getLcpTemplateFiles,
  getLcpSeedOnceFiles,
  getExpectedBridgeDocumentPaths,
  getLcpManifestRelativePath,
  getLcpIndexRelativePath,
  getLcpDistilledIndexRelativePath
};
