const fs = require("fs");
const path = require("path");

const { parseSimpleYaml } = require("../cli/parsing");
const { normalizeRelative } = require("../cli/shared");
const { getExpectedBridgeDocumentPaths } = require("./bridge");

function validateLcpBridge(context, findings, createFinding) {
  const manifestPath = path.join(context.targetRoot, ".lcp", "manifest.yaml");

  if (!fs.existsSync(manifestPath)) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_manifest_missing",
      message: "Missing LCP manifest: .lcp/manifest.yaml",
      remediation: "Create or restore .lcp/manifest.yaml so the repository exposes an explicit LCP entrypoint."
    }));
    return null;
  }

  let manifest;
  try {
    manifest = parseSimpleYaml(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_manifest_parse_error",
      message: `Could not parse LCP manifest at .lcp/manifest.yaml (${error.message})`,
      remediation: "Fix YAML syntax in .lcp/manifest.yaml and rerun neuroplast validate."
    }));
    return null;
  }

  findings.push(createFinding({
    level: "ok",
    code: "lcp_manifest_parseable",
    message: "LCP manifest is parseable: .lcp/manifest.yaml"
  }));

  const requiredFields = ["lcp_version", "kind", "id", "title", "document_paths"];
  for (const fieldName of requiredFields) {
    if (!(fieldName in manifest)) {
      findings.push(createFinding({
        level: "error",
        code: "lcp_manifest_field_missing",
        message: `Missing LCP manifest field: ${fieldName}`,
        remediation: `Add '${fieldName}' to .lcp/manifest.yaml.`
      }));
    }
  }

  if (manifest.kind && manifest.kind !== "manifest") {
    findings.push(createFinding({
      level: "error",
      code: "lcp_manifest_kind_invalid",
      message: "LCP manifest kind must be 'manifest'.",
      remediation: "Set kind: manifest in .lcp/manifest.yaml."
    }));
  }

  for (const documentPath of getExpectedBridgeDocumentPaths()) {
    const absolutePath = path.join(context.targetRoot, documentPath);
    if (!fs.existsSync(absolutePath)) {
      findings.push(createFinding({
        level: "error",
        code: "lcp_bridge_document_missing",
        message: `Missing LCP bridge document: ${documentPath}`,
        remediation: `Create or restore ${documentPath}.`
      }));
    } else {
      findings.push(createFinding({
        level: "ok",
        code: "lcp_bridge_document_exists",
        message: `LCP bridge document exists: ${documentPath}`
      }));
    }
  }

  for (const documentPath of Array.isArray(manifest.document_paths) ? manifest.document_paths : []) {
    if (typeof documentPath !== "string" || !documentPath) {
      findings.push(createFinding({
        level: "error",
        code: "lcp_manifest_document_ref_invalid",
        message: "Each LCP manifest document_paths entry must be a non-empty string path.",
        remediation: "Fix the document_paths array in .lcp/manifest.yaml."
      }));
      continue;
    }

    const absolutePath = path.join(context.targetRoot, documentPath);
    if (!fs.existsSync(absolutePath)) {
      findings.push(createFinding({
        level: "error",
        code: "lcp_manifest_document_ref_missing_target",
        message: `LCP manifest document reference does not resolve: ${documentPath}`,
        remediation: `Create or restore ${documentPath}, or remove the broken reference from .lcp/manifest.yaml.`
      }));
      continue;
    }

    findings.push(createFinding({
      level: "ok",
      code: "lcp_manifest_document_ref_resolves",
      message: `LCP manifest document reference resolves: ${normalizeRelative(context.targetRoot, absolutePath)}`
    }));
  }

  return manifest;
}

module.exports = {
  validateLcpBridge
};
