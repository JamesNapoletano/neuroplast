const fs = require("fs");
const path = require("path");

const { STATE_FILE } = require("./constants");
const { parseFrontmatter, parseSimpleYaml } = require("./parsing");
const { normalizeRelative } = require("./shared");
const { validateLcpBridge } = require("../lcp/validate");
const { getNeuroplastProfile } = require("../lcp/profile");
const { validateInteractionRouting } = require("./interaction-routing");

const VALIDATE_JSON_SCHEMA_VERSION = 1;

function runValidate(context) {
  const findings = [];
  const manifestPath = path.join(context.targetRoot, "neuroplast", "manifest.yaml");
  const capabilitiesPath = path.join(context.targetRoot, "neuroplast", "capabilities.yaml");
  const contractPath = path.join(context.targetRoot, "neuroplast", "WORKFLOW_CONTRACT.md");
  const profile = getNeuroplastProfile();

  if (!isJsonMode(context)) {
    context.logInfo(`Validating Neuroplast contract in: ${context.targetRoot}`);
  }

  validateLcpBridge(context, findings, createFinding);

  const manifest = validateYamlFile(context, {
    filePath: manifestPath,
    label: "manifest",
    findings
  });

  validateYamlFile(context, {
    filePath: capabilitiesPath,
    label: "capabilities profile",
    findings
  });

  validateExists(context, contractPath, "workflow contract", findings);
  validateExists(context, path.join(context.targetRoot, profile.rootArchitecturePath), "root architecture file", findings);

  if (manifest) {
    validateManifestStructure(manifest, findings);
    validateRequiredPaths(context, manifest, findings, profile);
    validateDocumentRoles(context, manifest, findings, profile);
    validateInstructionFrontmatter(context, manifest, findings);
    validateEnvironmentGuides(context, manifest, findings);
    validateAdapterAssets(context, findings);
    validateWorkflowExtensions(context, manifest, findings);
    validateInteractionRouting(context, manifest, findings, createFinding);
  }

  validateSyncStateIntegrity(context, findings);

  const errorCount = findings.filter((finding) => finding.level === "error").length;
  const warningCount = findings.filter((finding) => finding.level === "warning").length;

  if (isJsonMode(context)) {
    process.stdout.write(JSON.stringify({
      ok: errorCount === 0,
      schemaVersion: VALIDATE_JSON_SCHEMA_VERSION,
      summary: {
        checks: findings.length,
        warnings: warningCount,
        errors: errorCount
      },
      findings
    }, null, 2) + "\n");

    if (errorCount > 0) {
      process.exit(1);
    }

    return;
  }

  for (const finding of findings) {
    if (finding.level === "error") {
      context.logValidationError(formatFindingMessage(finding));
    } else if (finding.level === "warning") {
      context.logValidationWarning(formatFindingMessage(finding));
    } else {
      context.logValidationOk(finding.message);
    }
  }

  if (errorCount > 0) {
    context.logError(`Validation failed (${errorCount} error(s), ${warningCount} warning(s)).`);
    process.exit(1);
  }

  context.logInfo(`Validation complete (${findings.length} checks, ${warningCount} warning(s), 0 errors).`);
}

function validateYamlFile(context, { filePath, label, findings }) {
  if (!fs.existsSync(filePath)) {
    findings.push(createFinding({
      level: "error",
      code: `${slugifyLabel(label)}_missing`,
      message: `Missing ${label}: ${normalizeRelative(context.targetRoot, filePath)}`,
      remediation: `Create or restore ${normalizeRelative(context.targetRoot, filePath)}.`
    }));
    return null;
  }

  try {
    const parsed = parseSimpleYaml(fs.readFileSync(filePath, "utf8"));
    findings.push(createFinding({
      level: "ok",
      code: `${slugifyLabel(label)}_parseable`,
      message: `${label} is parseable: ${normalizeRelative(context.targetRoot, filePath)}`
    }));
    return parsed;
  } catch (error) {
    findings.push(createFinding({
      level: "error",
      code: `${slugifyLabel(label)}_parse_error`,
      message: `Could not parse ${label} at ${normalizeRelative(context.targetRoot, filePath)} (${error.message})`,
      remediation: `Fix YAML syntax in ${normalizeRelative(context.targetRoot, filePath)} and rerun neuroplast validate.`
    }));
    return null;
  }
}

function validateExists(context, absolutePath, label, findings) {
  if (!fs.existsSync(absolutePath)) {
    findings.push(createFinding({
      level: "error",
      code: `${slugifyLabel(label)}_missing`,
      message: `Missing ${label}: ${normalizeRelative(context.targetRoot, absolutePath)}`,
      remediation: `Create or restore ${normalizeRelative(context.targetRoot, absolutePath)}.`
    }));
    return false;
  }

  findings.push(createFinding({
    level: "ok",
    code: `${slugifyLabel(label)}_exists`,
    message: `${label} exists: ${normalizeRelative(context.targetRoot, absolutePath)}`
  }));
  return true;
}

function validateManifestStructure(manifest, findings) {
  const requiredArrayFields = [
    "required_directories",
    "required_instruction_files",
    "required_support_files",
    "validation_targets"
  ];

  for (const fieldName of requiredArrayFields) {
    if (!Array.isArray(manifest[fieldName])) {
      findings.push(createFinding({
        level: "error",
        code: "manifest_field_not_array",
        message: `Manifest field must be an array: ${fieldName}`,
        remediation: `Update neuroplast/manifest.yaml so '${fieldName}' is declared as a YAML list.`
      }));
    } else {
      findings.push(createFinding({
        level: "ok",
        code: "manifest_field_array",
        message: `Manifest field is present and array-typed: ${fieldName}`
      }));
    }
  }

  if (!manifest.document_roles || typeof manifest.document_roles !== "object" || Array.isArray(manifest.document_roles)) {
    findings.push(createFinding({
      level: "error",
      code: "manifest_document_roles_invalid",
      message: "Manifest field must be an object: document_roles",
      remediation: "Update neuroplast/manifest.yaml so document_roles is a YAML mapping."
    }));
  } else {
    findings.push(createFinding({
      level: "ok",
      code: "manifest_document_roles_present",
      message: "Manifest document_roles object is present."
    }));
  }
}

function validateRequiredPaths(context, manifest, findings, profile) {
  for (const relativeDir of manifest.required_directories || profile.requiredDirectories || []) {
    validateExists(context, path.join(context.targetRoot, relativeDir), `required directory ${relativeDir}`, findings);
  }

  for (const relativeFile of manifest.required_instruction_files || profile.requiredInstructionFiles || []) {
    validateExists(context, path.join(context.targetRoot, relativeFile), `required instruction file ${relativeFile}`, findings);
  }

  for (const relativeFile of manifest.required_support_files || profile.requiredSupportFiles || []) {
    validateExists(context, path.join(context.targetRoot, relativeFile), `required support file ${relativeFile}`, findings);
  }
}

function validateDocumentRoles(context, manifest, findings, profile) {
  const roles = manifest.document_roles || {};
  const expectedRoles = profile.expectedDocumentRoles;

  for (const [roleName, expectedPath] of Object.entries(expectedRoles)) {
    if (roles[roleName] !== expectedPath) {
      findings.push(createFinding({
        level: "error",
        code: "manifest_document_role_mismatch",
        message: `Manifest document role mismatch for ${roleName}: expected ${expectedPath}`,
        remediation: `Set document_roles.${roleName} to '${expectedPath}' in neuroplast/manifest.yaml.`
      }));
      continue;
    }

    findings.push(createFinding({
      level: "ok",
      code: "manifest_document_role_match",
      message: `Manifest document role matches expected path for ${roleName}.`
    }));
    validateExists(context, path.join(context.targetRoot, expectedPath), `document role ${roleName}`, findings);
  }
}

function validateInstructionFrontmatter(context, manifest, findings) {
  const requiredFields = ["role", "step", "requires", "writes_to", "outputs", "optional"];

  for (const relativeFile of manifest.required_instruction_files || []) {
    const absolutePath = path.join(context.targetRoot, relativeFile);

    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const content = fs.readFileSync(absolutePath, "utf8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter || !frontmatter.neuroplast || typeof frontmatter.neuroplast !== "object") {
      findings.push(createFinding({
        level: "error",
        code: "instruction_frontmatter_missing",
        message: `Missing or invalid Neuroplast frontmatter: ${relativeFile}`,
        remediation: `Restore the required Neuroplast YAML frontmatter block in ${relativeFile}.`
      }));
      continue;
    }

    const metadata = frontmatter.neuroplast;
    let isValid = true;

    for (const fieldName of requiredFields) {
      if (!(fieldName in metadata)) {
        findings.push(createFinding({
          level: "error",
          code: "instruction_frontmatter_field_missing",
          message: `Missing frontmatter field '${fieldName}' in ${relativeFile}`,
          remediation: `Add '${fieldName}' to the Neuroplast frontmatter block in ${relativeFile}.`
        }));
        isValid = false;
      }
    }

    if (metadata.requires && !Array.isArray(metadata.requires)) {
      findings.push(createFinding({
        level: "error",
        code: "instruction_frontmatter_requires_invalid",
        message: `Frontmatter field 'requires' must be an array in ${relativeFile}`,
        remediation: `Update the Neuroplast frontmatter in ${relativeFile} so 'requires' is a YAML list.`
      }));
      isValid = false;
    }

    if (metadata.writes_to && !Array.isArray(metadata.writes_to)) {
      findings.push(createFinding({
        level: "error",
        code: "instruction_frontmatter_writes_to_invalid",
        message: `Frontmatter field 'writes_to' must be an array in ${relativeFile}`,
        remediation: `Update the Neuroplast frontmatter in ${relativeFile} so 'writes_to' is a YAML list.`
      }));
      isValid = false;
    }

    if (metadata.outputs && !Array.isArray(metadata.outputs)) {
      findings.push(createFinding({
        level: "error",
        code: "instruction_frontmatter_outputs_invalid",
        message: `Frontmatter field 'outputs' must be an array in ${relativeFile}`,
        remediation: `Update the Neuroplast frontmatter in ${relativeFile} so 'outputs' is a YAML list.`
      }));
      isValid = false;
    }

    if (metadata.optional !== undefined && typeof metadata.optional !== "boolean") {
      findings.push(createFinding({
        level: "error",
        code: "instruction_frontmatter_optional_invalid",
        message: `Frontmatter field 'optional' must be a boolean in ${relativeFile}`,
        remediation: `Update the Neuroplast frontmatter in ${relativeFile} so 'optional' is true or false.`
      }));
      isValid = false;
    }

    if (isValid) {
      findings.push(createFinding({
        level: "ok",
        code: "instruction_frontmatter_valid",
        message: `Instruction frontmatter is valid: ${relativeFile}`
      }));
    }
  }
}

function validateEnvironmentGuides(context, manifest, findings) {
  const guidesDir = manifest.document_roles && manifest.document_roles.environment_guides_dir;

  if (!guidesDir) {
    findings.push(createFinding({
      level: "warning",
      code: "environment_guides_dir_missing",
      message: "Manifest does not declare environment_guides_dir.",
      remediation: "Declare document_roles.environment_guides_dir in neuroplast/manifest.yaml if environment guides are expected."
    }));
    return;
  }

  const absoluteGuidesDir = path.join(context.targetRoot, guidesDir);
  if (!fs.existsSync(absoluteGuidesDir)) {
    findings.push(createFinding({
      level: "error",
      code: "environment_guides_dir_missing_on_disk",
      message: `Missing environment guides directory: ${guidesDir}`,
      remediation: `Create or restore ${guidesDir} so bundled environment guides resolve from the manifest role path.`
    }));
    return;
  }

  const guideFiles = fs.readdirSync(absoluteGuidesDir)
    .filter((fileName) => fileName.endsWith(".md"));

  for (const fileName of guideFiles) {
    const absolutePath = path.join(absoluteGuidesDir, fileName);
    const relativePath = normalizeRelative(context.targetRoot, absolutePath);
    const content = fs.readFileSync(absolutePath, "utf8");
    const requiredReferences = [
      "neuroplast/WORKFLOW_CONTRACT.md",
      "neuroplast/manifest.yaml",
      "neuroplast/capabilities.yaml"
    ];

    let isValid = true;

    for (const reference of requiredReferences) {
      if (!content.includes(reference)) {
        findings.push(createFinding({
          level: "error",
          code: "environment_guide_reference_missing",
          message: `Environment guide missing canonical reference '${reference}': ${relativePath}`,
          remediation: `Add '${reference}' to ${relativePath} so the guide stays anchored to the canonical workflow files.`
        }));
        isValid = false;
      }
    }

    if (!content.includes("must not override the Neuroplast workflow contract")) {
      findings.push(createFinding({
        level: "error",
        code: "environment_guide_boundary_missing",
        message: `Environment guide missing non-authoritative boundary reminder: ${relativePath}`,
        remediation: `Add the required boundary reminder to ${relativePath} so the guide does not present itself as authoritative.`
      }));
      isValid = false;
    }

    if (isValid) {
      findings.push(createFinding({
        level: "ok",
        code: "environment_guide_valid",
        message: `Environment guide is aligned to the workflow contract: ${relativePath}`
      }));
    }
  }
}

function validateAdapterAssets(context, findings) {
  const adapterAssetsDir = path.join(context.targetRoot, "neuroplast", "adapter-assets");

  if (!fs.existsSync(adapterAssetsDir)) {
    findings.push(createFinding({
      level: "warning",
      code: "adapter_assets_dir_missing",
      message: "Adapter bootstrap assets directory not found: neuroplast/adapter-assets",
      remediation: "Run neuroplast init or neuroplast sync to install the copy/paste-ready adapter assets if you want tool-native startup wrappers."
    }));
    return;
  }

  const requiredAssets = [
    "shared/neuroplast-bootstrap.md",
    "codex/AGENTS.md",
    "claude-code/CLAUDE.md",
    "opencode/skills/README.md",
    "opencode/skills/neuroplast-bootstrap/SKILL.md",
    "opencode/skills/neuroplast-route-short-prompts/SKILL.md",
    "opencode/skills/neuroplast-execute-act/SKILL.md",
    "opencode/agents/neuroplast-orchestrator.md",
    "opencode/agents/neuroplast-planner.md"
  ];

  let allPresent = true;
  for (const relativeAsset of requiredAssets) {
    const absolutePath = path.join(adapterAssetsDir, ...relativeAsset.split("/"));
    if (!fs.existsSync(absolutePath)) {
      findings.push(createFinding({
        level: "error",
        code: "adapter_asset_missing",
        message: `Missing adapter bootstrap asset: neuroplast/adapter-assets/${relativeAsset}`,
        remediation: `Restore neuroplast/adapter-assets/${relativeAsset} from the packaged source tree.`
      }));
      allPresent = false;
    }
  }

  const sharedBootstrapPath = path.join(adapterAssetsDir, "shared", "neuroplast-bootstrap.md");
  if (fs.existsSync(sharedBootstrapPath)) {
    const sharedContent = fs.readFileSync(sharedBootstrapPath, "utf8");
    const requiredReferences = [
      "neuroplast/WORKFLOW_CONTRACT.md",
      "neuroplast/manifest.yaml",
      "neuroplast/capabilities.yaml",
      "neuroplast/interaction-routing.yaml",
      "neuroplast/act.md"
    ];

    let sharedValid = true;
    for (const reference of requiredReferences) {
      if (!sharedContent.includes(reference)) {
        findings.push(createFinding({
          level: "error",
          code: "adapter_asset_reference_missing",
          message: `Shared adapter bootstrap asset is missing canonical reference '${reference}': neuroplast/adapter-assets/shared/neuroplast-bootstrap.md`,
          remediation: `Add '${reference}' to neuroplast/adapter-assets/shared/neuroplast-bootstrap.md.`
        }));
        sharedValid = false;
      }
    }

    if (sharedValid) {
      findings.push(createFinding({
        level: "ok",
        code: "adapter_assets_shared_bootstrap_valid",
        message: "Shared adapter bootstrap asset is aligned with the canonical workflow files: neuroplast/adapter-assets/shared/neuroplast-bootstrap.md"
      }));
    }
  }

  if (allPresent) {
    findings.push(createFinding({
      level: "ok",
      code: "adapter_assets_present",
      message: "Copy/paste-ready adapter bootstrap assets are present: neuroplast/adapter-assets"
    }));
  }
}

function validateWorkflowExtensions(context, manifest, findings) {
  const config = manifest.extensions;

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    findings.push(createFinding({
      level: "warning",
      code: "extension_config_missing",
      message: "Manifest does not declare workflow extension configuration.",
      remediation: "Declare the extensions block in neuroplast/manifest.yaml if bundled or repo-local extensions are expected."
    }));
    return;
  }

  const bundledDir = typeof config.bundled_dir === "string" ? config.bundled_dir : "neuroplast/extensions";
  const localDir = typeof config.local_dir === "string" ? config.local_dir : "neuroplast/local-extensions";
  const activeBundled = Array.isArray(config.active_bundled) ? config.active_bundled : [];
  const activeLocal = Array.isArray(config.active_local) ? config.active_local : [];

  validateExists(context, path.join(context.targetRoot, bundledDir), "bundled workflow extensions directory", findings);

  for (const extensionName of activeBundled) {
    if (typeof extensionName !== "string" || !extensionName.trim()) {
      findings.push(createFinding({
        level: "error",
        code: "bundled_extension_name_invalid",
        message: "Manifest bundled extensions must contain non-empty string names.",
        remediation: "Remove empty bundled extension entries from neuroplast/manifest.yaml."
      }));
      continue;
    }

      const extensionPath = path.join(context.targetRoot, bundledDir, extensionName);
      if (!fs.existsSync(extensionPath) || !fs.statSync(extensionPath).isDirectory()) {
        findings.push(createFinding({
          level: "error",
          code: "bundled_extension_missing",
          message: `Missing active bundled workflow extension: ${normalizeRelative(context.targetRoot, extensionPath)}`,
          remediation: `Create ${normalizeRelative(context.targetRoot, extensionPath)} or remove '${extensionName}' from extensions.active_bundled.`
      }));
      continue;
    }

      findings.push(createFinding({
        level: "ok",
        code: "bundled_extension_exists",
        message: `Active bundled workflow extension exists: ${normalizeRelative(context.targetRoot, extensionPath)}`
      }));
      validateExtensionShape(context, extensionPath, findings);
    }

  if (activeLocal.length > 0) {
    validateExists(context, path.join(context.targetRoot, localDir), "repo-local workflow extensions directory", findings);
  }

  for (const extensionName of activeLocal) {
    if (typeof extensionName !== "string" || !extensionName.trim()) {
      findings.push(createFinding({
        level: "error",
        code: "local_extension_name_invalid",
        message: "Manifest local extensions must contain non-empty string names.",
        remediation: "Remove empty local extension entries from neuroplast/manifest.yaml."
      }));
      continue;
    }

      const extensionPath = path.join(context.targetRoot, localDir, extensionName);
      if (!fs.existsSync(extensionPath) || !fs.statSync(extensionPath).isDirectory()) {
        findings.push(createFinding({
          level: "error",
          code: "local_extension_missing",
          message: `Missing active repo-local workflow extension: ${normalizeRelative(context.targetRoot, extensionPath)}`,
          remediation: `Create ${normalizeRelative(context.targetRoot, extensionPath)} or remove '${extensionName}' from extensions.active_local.`
      }));
      continue;
    }

      findings.push(createFinding({
        level: "ok",
        code: "local_extension_exists",
        message: `Active repo-local workflow extension exists: ${normalizeRelative(context.targetRoot, extensionPath)}`
      }));
      validateExtensionShape(context, extensionPath, findings);
    }
}

function validateSyncStateIntegrity(context, findings) {
  const statePath = path.join(context.targetRoot, STATE_FILE);

  if (!fs.existsSync(statePath)) {
    findings.push(createFinding({
      level: "warning",
      code: "sync_state_missing",
      message: `Sync state file not found: ${normalizeRelative(context.targetRoot, statePath)}`,
      remediation: "Run neuroplast init or neuroplast sync to establish managed-file state tracking."
    }));
    return;
  }

  let state;
  try {
    state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch (error) {
    findings.push(createFinding({
      level: "error",
      code: "sync_state_parse_error",
      message: `Could not parse sync state at ${normalizeRelative(context.targetRoot, statePath)} (${error.message})`,
      remediation: `Fix JSON syntax in ${normalizeRelative(context.targetRoot, statePath)} or remove the file and rerun neuroplast sync.`
    }));
    return;
  }

  findings.push(createFinding({
    level: "ok",
    code: "sync_state_parseable",
    message: `Sync state is parseable: ${normalizeRelative(context.targetRoot, statePath)}`
  }));

  if (!Number.isInteger(state.schemaVersion)) {
    findings.push(createFinding({
      level: "warning",
      code: "sync_state_schema_invalid",
      message: "Sync state schemaVersion should be an integer.",
      remediation: "Regenerate the sync state by rerunning neuroplast sync if the file was edited manually."
    }));
  }

  if (!Array.isArray(state.managedFiles)) {
    findings.push(createFinding({
      level: "error",
      code: "sync_state_managed_files_invalid",
      message: "Sync state managedFiles must be an array.",
      remediation: "Restore neuroplast/.neuroplast-state.json from a valid run or rerun neuroplast sync."
    }));
    return;
  }

  if (state.managedFileState && (typeof state.managedFileState !== "object" || Array.isArray(state.managedFileState))) {
    findings.push(createFinding({
      level: "error",
      code: "sync_state_managed_file_state_invalid",
      message: "Sync state managedFileState must be an object.",
      remediation: "Restore neuroplast/.neuroplast-state.json from a valid run or rerun neuroplast sync."
    }));
    return;
  }

  const trackedPaths = new Set(state.managedFiles);
  for (const relativePath of Object.keys(state.managedFileState || {})) {
    if (!trackedPaths.has(relativePath)) {
      findings.push(createFinding({
        level: "warning",
        code: "sync_state_orphaned_baseline",
        message: `Sync state contains baseline metadata for an untracked file: ${relativePath}`,
        remediation: "Rerun neuroplast sync to reconcile managed file tracking metadata."
      }));
    }
  }
}

function validateExtensionShape(context, extensionPath, findings) {
  const allowedFiles = new Set(getCanonicalExtensionFiles());
  const stepFiles = new Set(getCanonicalExtensionStepFiles());
  const relativeExtensionPath = normalizeRelative(context.targetRoot, extensionPath);
  const entries = fs.readdirSync(extensionPath, { withFileTypes: true });
  let hasReadme = false;
  let readmeHasBoundaryReminder = false;
  const recognizedStepFiles = [];

  for (const entry of entries) {
    const relativePath = normalizeRelative(context.targetRoot, path.join(extensionPath, entry.name));

    if (entry.isDirectory()) {
      findings.push(createFinding({
        level: "warning",
        code: "extension_nested_directory_present",
        message: `Active workflow extension includes a nested directory that will not be step-loaded automatically: ${relativePath}`,
        remediation: "Keep active extension step files at the extension root and move extra documentation behind the extension README if needed."
      }));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (entry.name === "README.md") {
      hasReadme = true;
      const readmeContent = fs.readFileSync(path.join(extensionPath, entry.name), "utf8");
      readmeHasBoundaryReminder = readmeContent.includes("must not override the Neuroplast workflow contract");
    }

    if (stepFiles.has(entry.name)) {
      recognizedStepFiles.push(entry.name);
    }

    if (!entry.isFile() || !entry.name.endsWith(".md") || allowedFiles.has(entry.name)) {
      continue;
    }

    findings.push(createFinding({
      level: "warning",
      code: "extension_step_shape_unrecognized",
      message: `Active workflow extension includes a markdown file that will not be step-loaded automatically: ${relativePath}`,
      remediation: "Use canonical phase filenames for step-specific extension files or move extra notes behind README-linked documentation."
    }));
  }

  if (!hasReadme) {
    findings.push(createFinding({
      level: "error",
      code: "extension_readme_missing",
      message: `Active workflow extension is missing README.md: ${relativeExtensionPath}`,
      remediation: `Add ${relativeExtensionPath}/README.md describing the extension purpose, activation, and additive boundary.`
    }));
  } else if (!readmeHasBoundaryReminder) {
    findings.push(createFinding({
      level: "error",
      code: "extension_boundary_missing",
      message: `Active workflow extension README is missing the non-overriding boundary reminder: ${relativeExtensionPath}/README.md`,
      remediation: `Add the required boundary reminder to ${relativeExtensionPath}/README.md so the extension stays explicitly additive.`
    }));
  }

  if (recognizedStepFiles.length === 0) {
    findings.push(createFinding({
      level: "error",
      code: "extension_step_files_missing",
      message: `Active workflow extension does not provide any canonical step files: ${relativeExtensionPath}`,
      remediation: `Add at least one canonical step file (${getCanonicalExtensionStepFiles().join(", ")}) to ${relativeExtensionPath}.`
    }));
    return;
  }

  findings.push(createFinding({
    level: "ok",
    code: "extension_shape_valid",
    message: `Active workflow extension follows the minimal file convention: ${relativeExtensionPath}`
  }));
}

function getCanonicalExtensionFiles() {
  return [
    "README.md",
    ...getCanonicalExtensionStepFiles()
  ];
}

function getCanonicalExtensionStepFiles() {
  return [
    "conceptualize.md",
    "PLANNING_INSTRUCTIONS.md",
    "act.md",
    "CONCEPT_INSTRUCTIONS.md",
    "CHANGELOG_INSTRUCTIONS.md",
    "think.md"
  ];
}

function createFinding({ level, code, message, remediation = null }) {
  return { level, code, message, remediation };
}

function formatFindingMessage(finding) {
  if (!finding.remediation) {
    return finding.message;
  }

  return `${finding.message} Next step: ${finding.remediation}`;
}

function isJsonMode(context) {
  return Boolean(context.validationOptions && context.validationOptions.json);
}

function slugifyLabel(label) {
  return String(label).replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "").toLowerCase();
}

module.exports = {
  VALIDATE_JSON_SCHEMA_VERSION,
  runValidate
};
