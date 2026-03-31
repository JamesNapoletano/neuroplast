const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function hashFileContents(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function compareSemver(a, b) {
  const aParts = String(a).split(".").map((part) => Number.parseInt(part, 10) || 0);
  const bParts = String(b).split(".").map((part) => Number.parseInt(part, 10) || 0);
  const maxLength = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < maxLength; i += 1) {
    const diff = (aParts[i] || 0) - (bParts[i] || 0);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

function normalizeRelativePath(filePath) {
  return String(filePath).replace(/\\/g, "/");
}

function normalizeRelative(targetRoot, filePath) {
  return normalizeRelativePath(path.relative(targetRoot, filePath));
}

function createTimestampLabel() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function listFilesRecursive(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(absolutePath));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

module.exports = {
  hashFileContents,
  compareSemver,
  normalizeRelative,
  normalizeRelativePath,
  createTimestampLabel,
  listFilesRecursive
};
