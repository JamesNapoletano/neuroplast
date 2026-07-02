const fs = require("fs");
const path = require("path");

const memory = require("../lcp/memory");

// Neuroplast holds no memory of its own outside the LCP knowledge artifact:
// `.lcp/knowledge/neuroplast-learning.yaml` is the sole durable store, and
// `remember` now regenerates both derived quantized indexes (pack + distill)
// directly from it. The rendered neuroplast/learning/*.md view this migration
// removes predates that binding; keeping it around would be a second, stale
// copy of memory that nothing maintains going forward. Any note not yet folded
// into the artifact (e.g. hand-authored between the 2026-06-30 migration and
// this one) is migrated first so no content is lost.
module.exports = {
  id: "2026-07-01-remove-learning-view",
  version: "2.0.1",
  description: "Fold any remaining neuroplast/learning/*.md notes into LCP memory and remove the rendered learning view.",
  run(context) {
    const targetRoot = process.env.INIT_CWD || process.cwd();
    let scanned = 0;
    let updated = 0;

    // The user's own neuroplast/manifest.yaml is never overwritten by sync (it
    // has no shipped baseline), so a stale `required_directories` /
    // `document_roles.learning_dir` entry from a pre-2.0.1 install would
    // otherwise survive forever and fail validate even after the folder is
    // gone. Patch it unconditionally; the folder-removal steps below run
    // independently of whether this patch found anything to do.
    scanned += 1;
    if (patchUserManifest(targetRoot, context)) {
      updated += 1;
    }

    const learningDest = path.join(targetRoot, ".lcp", "knowledge", "neuroplast-learning.yaml");
    const learningDir = path.join(targetRoot, "neuroplast", "learning");

    if (!fs.existsSync(learningDir)) {
      return { scanned, updated };
    }

    const artifact = fs.existsSync(learningDest)
      ? memory.loadArtifact(learningDest)
      : { lcp_version: "2.0", kind: "knowledge_artifact", id: "neuroplast-learning", title: "Neuroplast durable learning memory", content_type: "learning", entries: [], scope: { root: "." } };

    const existingIds = new Set((artifact.entries || []).map((entry) => entry && entry.id));
    let migratedCount = 0;

    const noteFiles = fs.readdirSync(learningDir).filter((name) => name.endsWith(".md")).sort();
    for (const fileName of noteFiles) {
      scanned += 1;
      const slug = fileName.replace(/\.md$/, "");
      if (existingIds.has(slug)) {
        continue;
      }
      const absolute = path.join(learningDir, fileName);
      const note = memory.parseLearningNote(fs.readFileSync(absolute, "utf8"));
      const updatedAt = fileMtimeIso(absolute);
      const entry = memory.learningEntryFromNote(slug, note, { updatedAt });
      memory.upsertEntry(artifact, entry);
      existingIds.add(slug);
      migratedCount += 1;
    }

    if (migratedCount > 0) {
      artifact.updated_at = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
      if (!context.dryRun) {
        ensureDirectory(path.dirname(learningDest), context.dryRun);
        memory.saveArtifact(learningDest, artifact);
      }
      if (typeof context.logCreatedFile === "function") {
        context.logCreatedFile(`.lcp/knowledge/neuroplast-learning.yaml (+${migratedCount} entries)`);
      }
      updated += migratedCount;
    }

    scanned += 1;
    if (!context.dryRun) {
      fs.rmSync(learningDir, { recursive: true, force: true });
    }
    if (typeof context.logUpdatedFile === "function") {
      context.logUpdatedFile("neuroplast/learning (removed: superseded by .lcp/knowledge/neuroplast-learning.yaml)");
    }
    updated += 1;

    return { scanned, updated };
  }
};

// Surgically strip the two stale learning-folder references from the user's
// own neuroplast/manifest.yaml, line by line, rather than a full YAML
// parse/re-emit round trip — that would risk dropping comments or reformatting
// content the user customized. Returns true if the file was changed.
function patchUserManifest(targetRoot, context) {
  const manifestPath = path.join(targetRoot, "neuroplast", "manifest.yaml");
  if (!fs.existsSync(manifestPath)) {
    return false;
  }

  const original = fs.readFileSync(manifestPath, "utf8");
  const lines = original.split(/\r?\n/);
  const kept = lines.filter((line) => {
    const trimmed = line.trim();
    if (/^-\s*["']?neuroplast\/learning["']?\s*$/.test(trimmed)) {
      return false;
    }
    if (/^learning_dir:\s*["']?neuroplast\/learning["']?\s*$/.test(trimmed)) {
      return false;
    }
    return true;
  });

  if (kept.length === lines.length) {
    return false;
  }

  if (!context.dryRun) {
    fs.writeFileSync(manifestPath, kept.join("\n"), "utf8");
  }
  if (typeof context.logUpdatedFile === "function") {
    context.logUpdatedFile("neuroplast/manifest.yaml (removed stale neuroplast/learning references)");
  }
  return true;
}

function fileMtimeIso(absolutePath) {
  try {
    return fs.statSync(absolutePath).mtime.toISOString().replace(/\.\d{3}Z$/, "Z");
  } catch (error) {
    return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  }
}

function ensureDirectory(directoryPath, dryRun) {
  if (fs.existsSync(directoryPath)) {
    return;
  }
  if (!dryRun) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}
