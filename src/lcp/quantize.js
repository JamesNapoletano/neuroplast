"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { parseYaml, stringifyYaml } = require("./yaml");

// Native port of the LCP reference `.lcpq` quantizer (lcp/scripts/lcpq.py),
// implementing the Quantized LCP extension (lcp/docs/extensions/quantized-lcp.md).
// A `.lcpq` bundle collapses a manifest plus the documents it references into a
// single self-describing, short-keyed artifact a model can read directly.
//
// - pack: lossless; expand round-trips back to the source documents.
// - distill: lossy; applies the memory lifecycle to keep only high-signal,
//   current memory, then compacts.
//
// The encoding matches the reference format byte-for-byte at the structural
// level (sigils, key dictionary, bundle defaults, minified JSON records), so a
// bundle Neuroplast writes is readable by the reference tool and vice versa.

const FORMAT_GEN = "2";
const DEFAULT_MIN_CONFIDENCE = 0.5;
const DROPPED_STATUS_BASE = ["superseded"];

function contextRoot(manifestPath) {
  const normalized = path.normalize(manifestPath);
  return path.dirname(path.dirname(normalized)) || ".";
}

function loadContext(manifestPath) {
  const root = contextRoot(manifestPath);
  const manifestRel = normalizeSlashes(path.relative(root, manifestPath));

  const manifestRaw = fs.readFileSync(path.join(root, manifestRel), "utf8");
  const manifest = parseYaml(manifestRaw);

  const records = [manifest];
  const paths = [manifestRel];
  const rawBlobs = [manifestRaw];

  for (const ref of Array.isArray(manifest.documents) ? manifest.documents : []) {
    const docPath = ref && ref.path;
    if (!docPath) {
      continue;
    }
    const absolute = path.join(root, docPath);
    const raw = fs.readFileSync(absolute, "utf8");
    records.push(parseYaml(raw));
    paths.push(normalizeSlashes(docPath));
    rawBlobs.push(raw);
  }

  return { records, paths, rawBlobs, root };
}

function normalizeSlashes(value) {
  return String(value).replace(/\\/g, "/");
}

function sourceHash(rawBlobs) {
  const hash = crypto.createHash("sha256");
  for (const blob of rawBlobs) {
    hash.update(blob, "utf8");
  }
  return "sha256:" + hash.digest("hex").slice(0, 12);
}

// --- key dictionary -------------------------------------------------------

function* shortCodes() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  for (let n = 1; ; n += 1) {
    const indices = new Array(n).fill(0);
    while (true) {
      yield indices.map((i) => letters[i]).join("");
      let pos = n - 1;
      while (pos >= 0) {
        indices[pos] += 1;
        if (indices[pos] < letters.length) {
          break;
        }
        indices[pos] = 0;
        pos -= 1;
      }
      if (pos < 0) {
        break;
      }
    }
  }
}

function collectKeyCounts(obj, counts) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      collectKeyCounts(item, counts);
    }
  } else if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      counts.set(key, (counts.get(key) || 0) + 1);
      collectKeyCounts(value, counts);
    }
  }
}

function buildDictionary(objs) {
  const counts = new Map();
  for (const obj of objs) {
    collectKeyCounts(obj, counts);
  }
  const ordered = Array.from(counts.keys()).sort((a, b) => {
    const diff = counts.get(b) - counts.get(a);
    return diff !== 0 ? diff : a < b ? -1 : a > b ? 1 : 0;
  });
  const gen = shortCodes();
  const mapping = new Map();
  for (const long of ordered) {
    mapping.set(long, gen.next().value);
  }
  return mapping;
}

function remapKeys(obj, mapping) {
  if (Array.isArray(obj)) {
    return obj.map((item) => remapKeys(item, mapping));
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [key, value] of Object.entries(obj)) {
      out[mapping.get(key)] = remapKeys(value, mapping);
    }
    return out;
  }
  return obj;
}

// --- encoding -------------------------------------------------------------

function mini(obj) {
  return JSON.stringify(obj);
}

function encode(records, paths, rawBlobs, mode, root = ".", filters = null) {
  const versions = records.filter((r) => r && typeof r === "object").map((r) => r.lcp_version);
  const defaultVersion = mostCommon(versions.filter((v) => v !== undefined));

  const bundle = {};
  const factored = [];
  for (const record of records) {
    const copy = { ...record };
    if (defaultVersion !== null && copy.lcp_version === defaultVersion) {
      delete copy.lcp_version;
    }
    factored.push(copy);
  }
  if (defaultVersion !== null) {
    bundle.lcp_version = defaultVersion;
  }

  const mapping = buildDictionary([...factored, ...(Object.keys(bundle).length ? [bundle] : [])]);

  const meta = {
    mode,
    source_manifest: paths[0],
    generated_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    source_hash: sourceHash(rawBlobs),
    doc_count: factored.length,
    root,
    paths
  };
  if (filters !== null) {
    meta.filters = filters;
  }

  const dictPairs = Array.from(mapping.entries()).map(([long, short]) => `${short}=${long}`);
  const lines = [`LCPQ/${FORMAT_GEN} ${mode}`];
  lines.push("M " + mini(meta));
  lines.push("K " + dictPairs.join(" "));
  lines.push("B " + mini(remapKeys(bundle, mapping)));
  for (const record of factored) {
    lines.push("D " + mini(remapKeys(record, mapping)));
  }
  return lines.join("\n") + "\n";
}

function mostCommon(values) {
  if (!values.length) {
    return null;
  }
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  let best = null;
  let bestCount = -1;
  for (const [value, count] of counts.entries()) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

// --- distill --------------------------------------------------------------

function distillRecords(records, minConfidence, includeDeprecated) {
  const droppedStatus = [...DROPPED_STATUS_BASE];
  if (!includeDeprecated) {
    droppedStatus.push("deprecated");
  }

  const out = [];
  for (const record of records) {
    if (!record || typeof record !== "object" || record.kind !== "knowledge_artifact") {
      out.push(record);
      continue;
    }
    const copy = { ...record };
    const kept = [];
    for (const entry of Array.isArray(copy.entries) ? copy.entries : []) {
      const status = entry.status || "active";
      if (droppedStatus.includes(status)) {
        continue;
      }
      if (typeof entry.confidence === "number" && entry.confidence < minConfidence) {
        continue;
      }
      const reduced = { ...entry };
      delete reduced.provenance;
      kept.push(reduced);
    }
    copy.entries = kept;
    out.push(copy);
  }

  const filters = {
    min_confidence: minConfidence,
    dropped_status: droppedStatus,
    dropped_fields: ["provenance"]
  };
  return { records: out, filters };
}

// --- decoding -------------------------------------------------------------

function decode(text) {
  const lines = text.split(/\r?\n/);
  if (!lines.length || !lines[0].startsWith("LCPQ/")) {
    throw new Error("not a .lcpq file (missing LCPQ header)");
  }
  const header = lines[0].split(/\s+/);
  const mode = header[1] || "pack";

  let meta = {};
  const inv = new Map();
  let bundle = {};
  const records = [];

  for (const line of lines.slice(1)) {
    if (!line) {
      continue;
    }
    const spaceIndex = line.indexOf(" ");
    const sigil = spaceIndex === -1 ? line : line.slice(0, spaceIndex);
    const payload = spaceIndex === -1 ? "" : line.slice(spaceIndex + 1);
    if (sigil === "M") {
      meta = JSON.parse(payload);
    } else if (sigil === "K") {
      for (const pair of payload.split(/\s+/).filter(Boolean)) {
        const eq = pair.indexOf("=");
        inv.set(pair.slice(0, eq), pair.slice(eq + 1));
      }
    } else if (sigil === "B") {
      bundle = remapKeys(JSON.parse(payload), inv);
    } else if (sigil === "D") {
      const record = remapKeys(JSON.parse(payload), inv);
      for (const [key, value] of Object.entries(bundle)) {
        if (!(key in record)) {
          record[key] = value;
        }
      }
      records.push(record);
    }
  }
  return { mode, meta, records };
}

// --- commands -------------------------------------------------------------

function pack(manifestPath) {
  const { records, paths, rawBlobs, root } = loadContext(manifestPath);
  return encode(records, paths, rawBlobs, "pack", root);
}

function distill(manifestPath, { minConfidence = DEFAULT_MIN_CONFIDENCE, includeDeprecated = false } = {}) {
  const { records, paths, rawBlobs, root } = loadContext(manifestPath);
  const { records: distilled, filters } = distillRecords(records, minConfidence, includeDeprecated);
  return encode(distilled, paths, rawBlobs, "distill", root, filters);
}

const DISTILL_BANNER =
  "# DISTILLED view — derived and NOT authoritative. Source .lcp documents are canonical.\n";

// Reconstruct documents from a bundle. Returns [{ path, content }].
function expand(bundleText) {
  const { mode, meta, records } = decode(bundleText);
  const paths = Array.isArray(meta.paths) ? meta.paths : records.map(() => null);
  const banner = mode === "distill" ? DISTILL_BANNER : "";
  return records.map((record, index) => {
    const rel = paths[index] || `${record.id || "doc"}.yaml`;
    return { path: rel, content: banner + stringifyYaml(record) };
  });
}

function check(manifestPath, bundleText) {
  const { rawBlobs } = loadContext(manifestPath);
  const current = sourceHash(rawBlobs);
  const { meta } = decode(bundleText);
  const stored = meta.source_hash;
  return { current: current === stored, currentHash: current, storedHash: stored };
}

function stat(bundleText) {
  const { meta } = decode(bundleText);
  const root = meta.root || ".";
  let sourceBytes = 0;
  for (const rel of Array.isArray(meta.paths) ? meta.paths : []) {
    try {
      sourceBytes += fs.statSync(path.join(root, rel)).size;
    } catch (error) {
      // Missing source; skip in the rough estimate.
    }
  }
  const packedBytes = Buffer.byteLength(bundleText, "utf8");
  const fileCount = Array.isArray(meta.paths) ? meta.paths.length : 0;
  const reduction = sourceBytes ? 100 * (1 - packedBytes / sourceBytes) : 0;
  return {
    mode: meta.mode,
    sourceFiles: fileCount,
    sourceBytes,
    packedBytes,
    approxSourceTokens: Math.round(sourceBytes / 4),
    approxPackedTokens: Math.round(packedBytes / 4),
    reductionPercent: Number(reduction.toFixed(1))
  };
}

module.exports = {
  FORMAT_GEN,
  DEFAULT_MIN_CONFIDENCE,
  contextRoot,
  loadContext,
  sourceHash,
  encode,
  decode,
  pack,
  distill,
  expand,
  check,
  stat
};
