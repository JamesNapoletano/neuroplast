"use strict";

const fs = require("fs");
const path = require("path");

const { parseYaml } = require("./yaml");
const { selectActiveEntries } = require("./memory");
const { getLcpManifestRelativePath } = require("./bridge");

// Context assembly — the read half of the operational binding
// (lcp/docs/extensions/operational-binding.md), implementing the procedure in
// lcp/docs/spec/context-assembly.md. It turns the full LCP context into a
// prioritized working view for a given profile, scope, and task intent. The
// view is derived and disposable: it is always reconstructable from the source
// documents and never persisted as hidden state.

function loadFullContext(targetRoot) {
  const manifestRel = getLcpManifestRelativePath();
  const manifestPath = path.join(targetRoot, manifestRel);
  const manifest = parseYaml(fs.readFileSync(manifestPath, "utf8"));

  const documents = [];
  for (const ref of Array.isArray(manifest.documents) ? manifest.documents : []) {
    if (!ref || typeof ref.path !== "string") {
      continue;
    }
    const absolute = path.join(targetRoot, ref.path);
    if (!fs.existsSync(absolute)) {
      continue;
    }
    documents.push({
      id: ref.id || null,
      path: ref.path,
      document: parseYaml(fs.readFileSync(absolute, "utf8"))
    });
  }
  return { manifest, documents };
}

// Precedence weighting used for ordering. Hard constraints surface before
// permissive guidance; reasoning scaffolds and memory come last. Ties fall back
// to the document id for deterministic, reproducible views.
const KIND_PRIORITY = {
  rule: 0,
  profile: 1,
  workflow: 2,
  tool_description: 3,
  knowledge_artifact: 4,
  reasoning_scaffold: 5
};

function scopeMatches(documentScope, requestScope) {
  if (!requestScope || !documentScope) {
    return true;
  }
  // Profile narrowing: if the request names profiles and the document scopes to
  // profiles, keep only documents whose scope includes a requested profile.
  if (Array.isArray(requestScope.profiles) && Array.isArray(documentScope.profiles)) {
    const wanted = new Set(requestScope.profiles);
    if (!documentScope.profiles.some((profile) => wanted.has(profile))) {
      return false;
    }
  }
  return true;
}

function assembleView(targetRoot, options = {}) {
  const { profiles = null, scope = null, intent = null, includeDeprecated = false, minConfidence = null } = options;
  const { manifest, documents } = loadFullContext(targetRoot);

  const activeProfiles = profiles
    || (Array.isArray(manifest.active_profiles) ? manifest.active_profiles : []);
  const requestScope = scope || (activeProfiles.length ? { profiles: activeProfiles } : null);

  const selected = [];
  for (const entry of documents) {
    const document = entry.document;
    if (!scopeMatches(document.scope, requestScope)) {
      continue;
    }

    const view = {
      id: entry.id || document.id,
      path: entry.path,
      kind: document.kind,
      title: document.title,
      summary: document.summary || null
    };

    if (document.kind === "knowledge_artifact") {
      // Apply the lifecycle filter so superseded (and, by default, deprecated)
      // memory never reaches the working view.
      view.entries = selectActiveEntries(document.entries, { includeDeprecated, minConfidence });
    }

    selected.push(view);
  }

  selected.sort((a, b) => {
    const pa = KIND_PRIORITY[a.kind] === undefined ? 99 : KIND_PRIORITY[a.kind];
    const pb = KIND_PRIORITY[b.kind] === undefined ? 99 : KIND_PRIORITY[b.kind];
    if (pa !== pb) {
      return pa - pb;
    }
    return String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0;
  });

  return {
    manifestId: manifest.id,
    profiles: activeProfiles,
    intent: intent || null,
    documents: selected
  };
}

module.exports = {
  loadFullContext,
  assembleView
};
