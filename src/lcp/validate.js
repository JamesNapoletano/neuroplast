const fs = require("fs");
const path = require("path");

const { normalizeRelative } = require("../cli/shared");
const { parseYaml } = require("./yaml");
const { validateAgainstSchemaFile, schemaFileForKind } = require("./schema");
const { validateMemoryEntries } = require("./memory");
const { getLcpManifestRelativePath, getLcpIndexRelativePath, getLcpDistilledIndexRelativePath } = require("./bridge");
const quantize = require("./quantize");

const SUPPORTED_LCP_MAJOR = "2";

// Validate the repository's LCP v2.0 context: the manifest, every document it
// references, the knowledge memory lifecycle, and the optional quantized index.
// Validation is schema-true — it loads the parsed documents and checks them
// against the vendored LCP v2.0 JSON Schemas, rather than asserting a fixed
// hand-coded shape.
function validateLcpBridge(context, findings, createFinding) {
  const manifestRel = getLcpManifestRelativePath();
  const manifestPath = path.join(context.targetRoot, manifestRel);

  if (!fs.existsSync(manifestPath)) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_manifest_missing",
      message: `Missing LCP manifest: ${manifestRel}`,
      remediation: `Create or restore ${manifestRel} so the repository exposes an explicit LCP entrypoint.`
    }));
    return null;
  }

  let manifest;
  try {
    manifest = parseYaml(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_manifest_parse_error",
      message: `Could not parse LCP manifest at ${manifestRel} (${error.message})`,
      remediation: `Fix YAML syntax in ${manifestRel} and rerun neuroplast validate.`
    }));
    return null;
  }

  findings.push(createFinding({
    level: "ok",
    code: "lcp_manifest_parseable",
    message: `LCP manifest is parseable: ${manifestRel}`
  }));

  validateAgainstKindSchema(manifest, "manifest", manifestRel, findings, createFinding);
  validateLcpVersion(manifest, manifestRel, findings, createFinding);

  if (!Array.isArray(manifest.documents)) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_manifest_documents_invalid",
      message: "LCP manifest must declare a 'documents' array of {id, path} references.",
      remediation: `Add a v2.0 'documents' list to ${manifestRel}.`
    }));
    return manifest;
  }

  for (const ref of manifest.documents) {
    validateDocument(context, ref, findings, createFinding);
  }

  validateQuantizedIndex(context, manifestPath, findings, createFinding);

  return manifest;
}

function validateLcpVersion(document, relativePath, findings, createFinding) {
  const version = document.lcp_version;
  if (typeof version !== "string") {
    findings.push(createFinding({
      level: "error",
      code: "lcp_version_missing",
      message: `LCP document is missing lcp_version: ${relativePath}`,
      remediation: `Declare lcp_version: "2.0" in ${relativePath}.`
    }));
    return;
  }
  const major = version.split(".")[0];
  if (major === SUPPORTED_LCP_MAJOR) {
    return;
  }

  const majorNumber = Number.parseInt(major, 10);
  const supportedNumber = Number.parseInt(SUPPORTED_LCP_MAJOR, 10);

  // Per lcp/docs/spec/semantics.md (Versioning and compatibility): v2.0 re-baselines
  // the v1.0 foundation, so a legacy v1 document is still structurally understood —
  // report a warning and let sync migrate it. A major this consumer does not
  // implement (a future generation, or an unparseable value) is an error, because
  // its semantics cannot be interpreted correctly.
  if (Number.isInteger(majorNumber) && majorNumber >= 1 && majorNumber < supportedNumber) {
    findings.push(createFinding({
      level: "warning",
      code: "lcp_version_legacy",
      message: `LCP document targets a legacy protocol generation ${version}: ${relativePath}`,
      remediation: `Upgrade ${relativePath} to lcp_version: "2.0" (run neuroplast sync to apply the v2.0 migration).`
    }));
    return;
  }

  findings.push(createFinding({
    level: "error",
    code: "lcp_version_unsupported",
    message: `LCP document targets protocol generation ${version}, which this consumer does not implement (supports major ${SUPPORTED_LCP_MAJOR}): ${relativePath}`,
    remediation: `Author ${relativePath} against lcp_version: "2.0", or use an LCP consumer that implements protocol generation ${major}.`
  }));
}

function validateDocument(context, ref, findings, createFinding) {
  if (!ref || typeof ref !== "object" || typeof ref.path !== "string" || !ref.path) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_manifest_document_ref_invalid",
      message: "Each LCP manifest documents entry must be an object with a non-empty 'path'.",
      remediation: "Fix the documents array in the LCP manifest so every entry has { id, path }."
    }));
    return;
  }

  const absolutePath = path.join(context.targetRoot, ref.path);
  if (!fs.existsSync(absolutePath)) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_manifest_document_ref_missing_target",
      message: `LCP manifest document reference does not resolve: ${ref.path}`,
      remediation: `Create or restore ${ref.path}, or remove the broken reference from the LCP manifest.`
    }));
    return;
  }

  let document;
  try {
    document = parseYaml(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_document_parse_error",
      message: `Could not parse LCP document at ${ref.path} (${error.message})`,
      remediation: `Fix YAML syntax in ${ref.path} and rerun neuroplast validate.`
    }));
    return;
  }

  findings.push(createFinding({
    level: "ok",
    code: "lcp_manifest_document_ref_resolves",
    message: `LCP manifest document reference resolves: ${ref.path}`
  }));

  validateAgainstKindSchema(document, document.kind, ref.path, findings, createFinding);
  validateLcpVersion(document, ref.path, findings, createFinding);

  if (document.kind === "knowledge_artifact") {
    validateKnowledgeMemory(document, ref.path, findings, createFinding);
  }
}

function validateAgainstKindSchema(document, kind, relativePath, findings, createFinding) {
  const schemaFile = schemaFileForKind(kind);
  if (!schemaFile) {
    findings.push(createFinding({
      level: "error",
      code: "lcp_document_kind_invalid",
      message: `LCP document has missing or unknown kind '${kind}': ${relativePath}`,
      remediation: `Set a valid LCP 'kind' in ${relativePath}.`
    }));
    return;
  }

  const errors = validateAgainstSchemaFile(document, schemaFile);
  if (errors.length) {
    for (const error of errors) {
      findings.push(createFinding({
        level: "error",
        code: "lcp_document_schema_invalid",
        message: `LCP ${kind} schema violation in ${relativePath}: ${error}`,
        remediation: `Update ${relativePath} to satisfy the LCP v2.0 ${kind} schema.`
      }));
    }
    return;
  }

  findings.push(createFinding({
    level: "ok",
    code: "lcp_document_schema_valid",
    message: `LCP ${kind} validates against the v2.0 schema: ${relativePath}`
  }));
}

function validateKnowledgeMemory(document, relativePath, findings, createFinding) {
  const memoryFindings = validateMemoryEntries(document.entries);
  if (!memoryFindings.length) {
    findings.push(createFinding({
      level: "ok",
      code: "lcp_memory_lifecycle_valid",
      message: `LCP memory lifecycle is consistent: ${relativePath}`
    }));
    return;
  }
  for (const finding of memoryFindings) {
    findings.push(createFinding({
      level: finding.level,
      code: finding.code,
      message: `${finding.message} (${relativePath})`,
      remediation: "Use additive supersession (add a new entry and mark the prior one 'superseded') so memory history stays consistent."
    }));
  }
}

// Pack (lossless) and distill (lossy, high-signal) are separate derived
// artifacts at separate paths (see lcp/bridge.js). The distilled index is what
// an operational layer reads for context assembly, so both are checked with
// distinct finding codes: a stale or missing pack does not imply the same for
// distill, and vice versa.
function validateQuantizedIndex(context, manifestPath, findings, createFinding) {
  checkQuantizedIndexFile(context, manifestPath, findings, createFinding, {
    label: "pack",
    indexRel: getLcpIndexRelativePath(),
    missingCode: "lcp_quantized_index_missing",
    unreadableCode: "lcp_quantized_index_unreadable",
    staleCode: "lcp_quantized_index_stale",
    currentCode: "lcp_quantized_index_current",
    regenerateHint: "neuroplast quantize (or neuroplast sync)"
  });

  checkQuantizedIndexFile(context, manifestPath, findings, createFinding, {
    label: "distilled",
    indexRel: getLcpDistilledIndexRelativePath(),
    missingCode: "lcp_distilled_index_missing",
    unreadableCode: "lcp_distilled_index_unreadable",
    staleCode: "lcp_distilled_index_stale",
    currentCode: "lcp_distilled_index_current",
    regenerateHint: "neuroplast quantize --distill (or neuroplast sync)"
  });
}

function checkQuantizedIndexFile(context, manifestPath, findings, createFinding, options) {
  const { label, indexRel, missingCode, unreadableCode, staleCode, currentCode, regenerateHint } = options;
  const indexPath = path.join(context.targetRoot, indexRel);

  if (!fs.existsSync(indexPath)) {
    findings.push(createFinding({
      level: "warning",
      code: missingCode,
      message: `No ${label} LCP index found: ${indexRel}`,
      remediation: `Run ${regenerateHint} to generate the .lcpq context bundle.`
    }));
    return;
  }

  let result;
  try {
    result = quantize.check(manifestPath, fs.readFileSync(indexPath, "utf8"));
  } catch (error) {
    findings.push(createFinding({
      level: "error",
      code: unreadableCode,
      message: `Could not read ${label} LCP index at ${indexRel} (${error.message})`,
      remediation: `Regenerate it with ${regenerateHint}.`
    }));
    return;
  }

  if (!result.current) {
    findings.push(createFinding({
      level: "warning",
      code: staleCode,
      message: `${label[0].toUpperCase()}${label.slice(1)} LCP index is stale: ${indexRel} was built from ${result.storedHash}, sources are now ${result.currentHash}.`,
      remediation: `Regenerate it with ${regenerateHint}.`
    }));
    return;
  }

  findings.push(createFinding({
    level: "ok",
    code: currentCode,
    message: `${label[0].toUpperCase()}${label.slice(1)} LCP index is current: ${indexRel}`
  }));
}

module.exports = {
  validateLcpBridge
};
