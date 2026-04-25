const fs = require("fs");
const path = require("path");

const { parseSimpleYaml } = require("./parsing");
const { normalizeRelative, normalizeRelativePath } = require("./shared");

const ROUTING_JSON_SCHEMA_VERSION = 1;
const ROUTING_FILE = "neuroplast/interaction-routing.yaml";

function runRoute(context) {
  const phrase = getRoutePhrase(context.args.slice(1));

  if (!phrase) {
    context.logError("Missing phrase for route command.");
    printRouteHelp();
    process.exit(1);
  }

  const routing = loadRoutingConfig(context);
  const resolution = resolvePhrase(context, routing, phrase);

  if (context.routeOptions.json) {
    process.stdout.write(JSON.stringify({
      ok: true,
      schemaVersion: ROUTING_JSON_SCHEMA_VERSION,
      phrase,
      routingFile: ROUTING_FILE,
      resolution
    }, null, 2) + "\n");
    return;
  }

  context.logInfo(`Routing file: ${ROUTING_FILE}`);
  context.logInfo(`Phrase: ${phrase}`);
  context.logInfo(`Resolution type: ${resolution.type}`);
  context.logInfo(`Intent: ${resolution.intent}`);
  if (resolution.instruction) {
    context.logInfo(`Instruction: ${resolution.instruction}`);
  }
  if (resolution.reason) {
    context.logInfo(`Reason: ${resolution.reason}`);
  }
}

function validateInteractionRouting(context, manifest, findings, createFinding) {
  const roles = manifest.document_roles || {};
  const relativePath = roles.interaction_routing;

  if (!relativePath) {
    findings.push(createFinding({
      level: "warning",
      code: "interaction_routing_role_missing",
      message: "Manifest does not declare document_roles.interaction_routing.",
      remediation: "Declare document_roles.interaction_routing in neuroplast/manifest.yaml if interaction routing is part of the repository contract."
    }));
    return;
  }

  const absolutePath = path.join(context.targetRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    findings.push(createFinding({
      level: "error",
      code: "interaction_routing_file_missing",
      message: `Missing interaction routing artifact: ${relativePath}`,
      remediation: `Create or restore ${relativePath}.`
    }));
    return;
  }

  let parsed;
  try {
    parsed = parseSimpleYaml(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    findings.push(createFinding({
      level: "error",
      code: "interaction_routing_parse_error",
      message: `Could not parse interaction routing artifact at ${relativePath} (${error.message})`,
      remediation: `Fix YAML syntax in ${relativePath} and rerun neuroplast validate.`
    }));
    return;
  }

  findings.push(createFinding({
    level: "ok",
    code: "interaction_routing_parseable",
    message: `Interaction routing artifact is parseable: ${relativePath}`
  }));

  validateRoutingStructure(parsed, findings, createFinding, relativePath);
  validateRoutingOverlays(context, manifest, parsed, findings, createFinding);
}

function validateRoutingStructure(parsed, findings, createFinding, relativePath) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    findings.push(createFinding({
      level: "error",
      code: "interaction_routing_invalid_root",
      message: `Interaction routing artifact must be a YAML object: ${relativePath}`,
      remediation: `Update ${relativePath} so it contains a mapping-based routing definition.`
    }));
    return;
  }

  if (!parsed.intents || typeof parsed.intents !== "object" || Array.isArray(parsed.intents)) {
    findings.push(createFinding({
      level: "error",
      code: "interaction_routing_intents_missing",
      message: `Interaction routing artifact must define an intents mapping: ${relativePath}`,
      remediation: `Add an intents mapping to ${relativePath}.`
    }));
    return;
  }

  const seenPhrases = new Map();

  for (const [intentName, intentConfig] of Object.entries(parsed.intents)) {
    if (!intentConfig || typeof intentConfig !== "object" || Array.isArray(intentConfig)) {
      findings.push(createFinding({
        level: "error",
        code: "interaction_routing_intent_invalid",
        message: `Interaction routing intent must be an object: ${intentName}`,
        remediation: `Update intent '${intentName}' in ${relativePath} so it is declared as a mapping.`
      }));
      continue;
    }

    if ("phrases" in intentConfig && !Array.isArray(intentConfig.phrases)) {
      findings.push(createFinding({
        level: "error",
        code: "interaction_routing_phrases_invalid",
        message: `Interaction routing phrases must be an array for intent '${intentName}'.`,
        remediation: `Update intent '${intentName}' in ${relativePath} so phrases is a YAML list.`
      }));
      continue;
    }

    for (const phrase of intentConfig.phrases || []) {
      if (typeof phrase !== "string" || !phrase.trim()) {
        findings.push(createFinding({
          level: "error",
          code: "interaction_routing_phrase_invalid",
          message: `Interaction routing phrases must be non-empty strings for intent '${intentName}'.`,
          remediation: `Remove empty or invalid phrases from intent '${intentName}' in ${relativePath}.`
        }));
        continue;
      }

      const normalized = normalizePhrase(phrase);
      if (seenPhrases.has(normalized)) {
        findings.push(createFinding({
          level: "error",
          code: "interaction_routing_phrase_duplicate",
          message: `Duplicate interaction routing phrase '${phrase}' declared for intents '${seenPhrases.get(normalized)}' and '${intentName}'.`,
          remediation: `Keep '${phrase}' mapped to only one intent in ${relativePath}.`
        }));
      } else {
        seenPhrases.set(normalized, intentName);
      }
    }
  }

  findings.push(createFinding({
    level: "ok",
    code: "interaction_routing_structure_valid",
    message: `Interaction routing artifact defines a valid intents structure: ${relativePath}`
  }));
}

function validateRoutingOverlays(context, manifest, baseRouting, findings, createFinding) {
  const config = manifest.extensions;
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return;
  }

  const protectedPhrases = new Set((baseRouting.protected_phrases || []).map(normalizePhrase));
  const overlayTargets = [
    {
      rootDir: typeof config.bundled_dir === "string" ? config.bundled_dir : "neuroplast/extensions",
      names: Array.isArray(config.active_bundled) ? config.active_bundled : [],
      label: "bundled"
    },
    {
      rootDir: typeof config.local_dir === "string" ? config.local_dir : "neuroplast/local-extensions",
      names: Array.isArray(config.active_local) ? config.active_local : [],
      label: "repo-local"
    }
  ];

  for (const target of overlayTargets) {
    for (const extensionName of target.names) {
      if (typeof extensionName !== "string" || !extensionName.trim()) {
        continue;
      }

      const overlayRelativePath = normalizeRelativePath(path.join(target.rootDir, extensionName, "interaction-routing.yaml"));
      const overlayAbsolutePath = path.join(context.targetRoot, overlayRelativePath);

      if (!fs.existsSync(overlayAbsolutePath)) {
        continue;
      }

      let overlay;
      try {
        overlay = parseSimpleYaml(fs.readFileSync(overlayAbsolutePath, "utf8"));
      } catch (error) {
        findings.push(createFinding({
          level: "error",
          code: "interaction_routing_overlay_parse_error",
          message: `Could not parse interaction routing overlay at ${overlayRelativePath} (${error.message})`,
          remediation: `Fix YAML syntax in ${overlayRelativePath} and rerun neuroplast validate.`
        }));
        continue;
      }

      findings.push(createFinding({
        level: "ok",
        code: "interaction_routing_overlay_parseable",
        message: `Interaction routing overlay is parseable: ${overlayRelativePath}`
      }));

      for (const intentConfig of Object.values(overlay.intents || {})) {
        for (const phrase of intentConfig && Array.isArray(intentConfig.phrases) ? intentConfig.phrases : []) {
          const normalized = normalizePhrase(phrase);
          if (protectedPhrases.has(normalized)) {
            findings.push(createFinding({
              level: "error",
              code: "interaction_routing_overlay_protected_phrase_override",
              message: `Interaction routing overlay attempts to override protected phrase '${phrase}': ${overlayRelativePath}`,
              remediation: `Remove '${phrase}' from ${overlayRelativePath}; protected canonical phrases must remain defined only by neuroplast/interaction-routing.yaml.`
            }));
          }
        }
      }
    }
  }
}

function resolvePhrase(context, routing, phrase) {
  const normalizedPhrase = normalizePhrase(phrase);
  const intents = routing.intents || {};

  for (const [intentName, intentConfig] of Object.entries(intents)) {
    const phrases = Array.isArray(intentConfig.phrases) ? intentConfig.phrases : [];
    if (phrases.some((entry) => normalizePhrase(entry) === normalizedPhrase)) {
      if (intentName === "act" && intentConfig.requires_active_plan) {
        const activePlan = findLatestPlan(context);
        if (!activePlan) {
          return {
            type: "clarify",
            intent: "clarify",
            instruction: null,
            reason: "No bounded active plan file exists, so routed act-style prompts must clarify instead of guessing."
          };
        }

        return {
          type: "routed_phrase",
          intent: intentName,
          instruction: intentConfig.instruction || null,
          reason: `Matched canonical act phrase and found active plan ${activePlan}.`
        };
      }

      return {
        type: "routed_phrase",
        intent: intentName,
        instruction: intentConfig.instruction || null,
        reason: `Matched canonical phrase for intent '${intentName}'.`
      };
    }
  }

  const fallbackIntent = Object.entries(intents).find(([, config]) => config && config.fallback === true);
  return {
    type: "clarify",
    intent: fallbackIntent ? fallbackIntent[0] : "clarify",
    instruction: null,
    reason: "Phrase did not match a canonical interaction-routing mapping."
  };
}

function loadRoutingConfig(context) {
  const absolutePath = path.join(context.targetRoot, ROUTING_FILE);
  if (!fs.existsSync(absolutePath)) {
    context.logError(`Missing interaction routing file: ${ROUTING_FILE}`);
    process.exit(1);
  }

  try {
    return parseSimpleYaml(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    context.logError(`Could not parse ${ROUTING_FILE} (${error.message})`);
    process.exit(1);
  }
}

function findLatestPlan(context) {
  const plansDir = path.join(context.targetRoot, "neuroplast", "plans");
  if (!fs.existsSync(plansDir)) {
    return null;
  }

  const planFiles = fs.readdirSync(plansDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => path.join(plansDir, fileName))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  if (!planFiles.length) {
    return null;
  }

  return normalizeRelative(context.targetRoot, planFiles[0]);
}

function getRoutePhrase(args) {
  const parts = args.filter((arg) => !arg.startsWith("--"));
  if (!parts.length) {
    return null;
  }

  return parts.join(" ").trim();
}

function normalizePhrase(value) {
  return String(value || "").trim().toLowerCase();
}

function printRouteHelp() {
  console.log("Usage: neuroplast route <phrase> [--json]");
}

module.exports = {
  ROUTING_JSON_SCHEMA_VERSION,
  ROUTING_FILE,
  runRoute,
  validateInteractionRouting
};
