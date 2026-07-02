const fs = require("fs");
const path = require("path");

const { ensureDirectory } = require("./filesystem");
const { getLcpManifestRelativePath, getLcpIndexRelativePath, getLcpDistilledIndexRelativePath } = require("../lcp/bridge");
const quantize = require("../lcp/quantize");
const memory = require("../lcp/memory");

// Operational binding — the runtime commands that read assembled LCP context and
// write durable memory back. `quantize` produces the derived .lcpq bundles;
// `remember` performs additive memory write-back directly into the LCP
// knowledge artifact. Neuroplast holds no memory of its own outside `.lcp/` —
// it is a workflow layered on the LCP context, not a second memory store.

function resolveManifestPath(context) {
  return path.join(context.targetRoot, getLcpManifestRelativePath());
}

function runQuantize(context) {
  const manifestPath = resolveManifestPath(context);
  const options = context.quantizeOptions || {};

  // Pack and distill are separate derived artifacts at separate paths (see
  // regenerateQuantizedIndex); a manual `quantize` run writes only the file for
  // the requested mode, so it never clobbers the other mode's current bundle.
  const indexRel = options.distill ? getLcpDistilledIndexRelativePath() : getLcpIndexRelativePath();
  const indexPath = path.join(context.targetRoot, indexRel);

  if (!fs.existsSync(manifestPath)) {
    context.logError(`Missing LCP manifest: ${getLcpManifestRelativePath()}. Run neuroplast init first.`);
    process.exit(1);
  }

  const bundle = options.distill
    ? quantize.distill(manifestPath, {
        minConfidence: typeof options.minConfidence === "number" ? options.minConfidence : quantize.DEFAULT_MIN_CONFIDENCE,
        includeDeprecated: Boolean(options.includeDeprecated)
      })
    : quantize.pack(manifestPath);

  const stats = quantize.stat(bundle);

  if (!options.dryRun) {
    ensureDirectory(context, path.dirname(indexPath), options);
    fs.writeFileSync(indexPath, bundle, "utf8");
  }

  const result = {
    mode: options.distill ? "distill" : "pack",
    index: indexRel,
    dryRun: Boolean(options.dryRun),
    stats
  };

  if (context.outputJson) {
    context.writeJsonResult({ quantize: result });
  } else {
    context.logInfo(
      `Quantized LCP context (${result.mode}) -> ${indexRel} ` +
        `(${stats.sourceFiles} docs, ${stats.packedBytes} bytes, ~${stats.reductionPercent}% vs source).`
    );
  }

  return result;
}

// Regenerate both derived quantized indexes as part of sync/remember, if a
// manifest is present. Pack (lossless) and distill (lossy, high-signal) are
// written to separate paths every time, so neither ever silently reverts the
// other — the distilled bundle an operational layer reads for context
// assembly stays current independent of when pack was last regenerated.
// Returns a small status object; never throws on a missing manifest.
function regenerateQuantizedIndex(context) {
  const manifestPath = resolveManifestPath(context);
  if (!fs.existsSync(manifestPath)) {
    return { regenerated: false, reason: "manifest-missing" };
  }

  const dryRun = Boolean(context.syncOptions && context.syncOptions.dryRun);

  const indexRel = getLcpIndexRelativePath();
  const indexPath = path.join(context.targetRoot, indexRel);
  const packBundle = quantize.pack(manifestPath);

  const distilledRel = getLcpDistilledIndexRelativePath();
  const distilledPath = path.join(context.targetRoot, distilledRel);
  const distilledBundle = quantize.distill(manifestPath);

  if (!dryRun) {
    ensureDirectory(context, path.dirname(indexPath), context.syncOptions || {});
    fs.writeFileSync(indexPath, packBundle, "utf8");
    ensureDirectory(context, path.dirname(distilledPath), context.syncOptions || {});
    fs.writeFileSync(distilledPath, distilledBundle, "utf8");
  }
  context.logUpdated(indexRel, dryRun);
  context.logUpdated(distilledRel, dryRun);
  return { regenerated: true, index: indexRel, distilledIndex: distilledRel };
}

function runRemember(context) {
  const manifestPath = resolveManifestPath(context);
  if (!fs.existsSync(manifestPath)) {
    context.logError("Missing LCP manifest. Run neuroplast init first.");
    process.exit(1);
  }

  const options = context.rememberOptions || {};
  if (!options.id) {
    context.logError("neuroplast remember requires --id <entry-id>.");
    process.exit(1);
  }

  const rawNote = (options.note != null ? options.note : readStdin()).trim();
  if (!rawNote) {
    context.logError("neuroplast remember requires note content via --note or stdin.");
    process.exit(1);
  }
  // Separate an optional leading H1/#learning header from the body so the stored
  // entry holds only the body; the title is carried in its own `title` field.
  const parsedNote = memory.parseLearningNote(rawNote);
  const noteBody = parsedNote.body || rawNote;

  const learningArtifactPath = path.join(context.targetRoot, ".lcp", "knowledge", "neuroplast-learning.yaml");
  const artifact = fs.existsSync(learningArtifactPath)
    ? memory.loadArtifact(learningArtifactPath)
    : { lcp_version: "2.0", kind: "knowledge_artifact", id: "neuroplast-learning", title: "Neuroplast durable learning memory", content_type: "learning", entries: [], scope: { root: "." } };

  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const entry = {
    id: options.id,
    status: "active",
    confidence: typeof options.confidence === "number" ? options.confidence : 0.8,
    title: options.title || parsedNote.title || options.id,
    note: noteBody,
    provenance: {
      origin: options.origin || "work-cycle",
      method: "captured-during-work-cycle"
    },
    updated_at: now
  };

  let action;
  if (options.supersedes) {
    memory.supersedeEntry(artifact, options.supersedes, entry);
    action = "superseded";
  } else {
    memory.upsertEntry(artifact, entry);
    action = "upserted";
  }
  artifact.updated_at = now;

  if (!options.dryRun) {
    ensureDirectory(context, path.dirname(learningArtifactPath), {});
    memory.saveArtifact(learningArtifactPath, artifact);
  }

  const indexResult = options.dryRun ? { regenerated: false } : regenerateQuantizedIndex(context);

  const result = { action, id: entry.id, supersedes: options.supersedes || null, index: indexResult, dryRun: Boolean(options.dryRun) };
  if (context.outputJson) {
    context.writeJsonResult({ remember: result });
  } else {
    context.logInfo(`Recorded learning '${entry.id}' (${action}) in .lcp/knowledge/neuroplast-learning.yaml.`);
  }
  return result;
}

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch (error) {
    return "";
  }
}

module.exports = {
  runQuantize,
  runRemember,
  regenerateQuantizedIndex
};
