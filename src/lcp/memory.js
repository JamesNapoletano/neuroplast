"use strict";

const fs = require("fs");

const { parseYaml, stringifyYaml } = require("./yaml");

// LCP v2.0 memory model helpers (see lcp/docs/spec/memory.md). A knowledge
// artifact carries an `entries` array; each entry is a discrete unit of durable
// memory with lifecycle (`status`), `supersedes`, `confidence`, and
// `provenance`. This module loads/saves artifacts, validates lifecycle
// integrity, selects the active working set (context assembly + distill), and
// performs additive write-back (upsert / supersede). It also projects learning
// entries to and from the human-readable `neuroplast/learning/*.md` view.

const VALID_STATUSES = ["active", "deprecated", "superseded"];

function loadArtifact(absolutePath) {
  const parsed = parseYaml(fs.readFileSync(absolutePath, "utf8"));
  if (!Array.isArray(parsed.entries)) {
    parsed.entries = [];
  }
  return parsed;
}

function saveArtifact(absolutePath, artifact) {
  fs.writeFileSync(absolutePath, stringifyYaml(artifact), "utf8");
}

// Lifecycle integrity checks. States are advisory to authoring and normative to
// consumers, so violations are reported, not silently corrected. Returns an
// array of { level, code, message }.
function validateMemoryEntries(entries) {
  const findings = [];
  if (!Array.isArray(entries)) {
    return findings;
  }

  const byId = new Map();
  for (const entry of entries) {
    if (entry && typeof entry === "object" && entry.id) {
      if (byId.has(entry.id)) {
        findings.push({
          level: "error",
          code: "memory_entry_duplicate_id",
          message: `Duplicate memory entry id: ${entry.id}`
        });
      } else {
        byId.set(entry.id, entry);
      }
    }
  }

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    if (entry.status && !VALID_STATUSES.includes(entry.status)) {
      findings.push({
        level: "error",
        code: "memory_entry_status_invalid",
        message: `Memory entry ${entry.id || "(anonymous)"} has invalid status: ${entry.status}`
      });
    }
    const supersedes = Array.isArray(entry.supersedes) ? entry.supersedes : [];
    for (const targetId of supersedes) {
      if (!byId.has(targetId)) {
        // The target may live in another artifact; report as a warning, not an error.
        findings.push({
          level: "warning",
          code: "memory_entry_supersedes_dangling",
          message: `Memory entry ${entry.id || "(anonymous)"} supersedes unknown entry id: ${targetId}`
        });
        continue;
      }
      const target = byId.get(targetId);
      const status = target.status || "active";
      if (status === "active") {
        findings.push({
          level: "error",
          code: "memory_entry_active_but_superseded",
          message: `Memory entry ${targetId} is still 'active' but is superseded by ${entry.id || "(anonymous)"}; set it to 'superseded'.`
        });
      }
    }
  }

  for (const cycleId of findSupersedeCycles(byId)) {
    findings.push({
      level: "warning",
      code: "memory_entry_supersedes_cycle",
      message: `Memory supersession chain forms a cycle involving: ${cycleId}`
    });
  }

  return findings;
}

function findSupersedeCycles(byId) {
  const cycles = new Set();
  const state = new Map(); // id -> 0 visiting, 1 done

  function visit(id, stack) {
    if (state.get(id) === 1) {
      return;
    }
    if (stack.has(id)) {
      cycles.add(id);
      return;
    }
    stack.add(id);
    const entry = byId.get(id);
    const supersedes = entry && Array.isArray(entry.supersedes) ? entry.supersedes : [];
    for (const next of supersedes) {
      if (byId.has(next)) {
        visit(next, stack);
      }
    }
    stack.delete(id);
    state.set(id, 1);
  }

  for (const id of byId.keys()) {
    visit(id, new Set());
  }
  return cycles;
}

// Context-assembly lifecycle filter: exclude superseded (and deprecated unless
// opted in), and drop entries below a confidence threshold when one is given.
function selectActiveEntries(entries, options = {}) {
  const { includeDeprecated = false, minConfidence = null } = options;
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries.filter((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }
    const status = entry.status || "active";
    if (status === "superseded") {
      return false;
    }
    if (status === "deprecated" && !includeDeprecated) {
      return false;
    }
    if (minConfidence !== null && typeof entry.confidence === "number" && entry.confidence < minConfidence) {
      return false;
    }
    return true;
  });
}

// Additive write-back. Insert a new entry, or replace an existing one by id
// in place. Replacement is for authoring fixes; semantic revisions should use
// supersedeEntry so history is preserved.
function upsertEntry(artifact, entry) {
  if (!Array.isArray(artifact.entries)) {
    artifact.entries = [];
  }
  const index = artifact.entries.findIndex((existing) => existing && existing.id === entry.id);
  if (index === -1) {
    artifact.entries.push(entry);
  } else {
    artifact.entries[index] = entry;
  }
  return artifact;
}

// Revise memory additively: mark the prior entry superseded and append the new
// entry naming it in `supersedes` (see memory.md §Supersession).
function supersedeEntry(artifact, priorId, newEntry) {
  if (!Array.isArray(artifact.entries)) {
    artifact.entries = [];
  }
  const prior = artifact.entries.find((existing) => existing && existing.id === priorId);
  if (prior) {
    prior.status = "superseded";
  }
  const supersedes = new Set(Array.isArray(newEntry.supersedes) ? newEntry.supersedes : []);
  supersedes.add(priorId);
  const entry = { ...newEntry, supersedes: Array.from(supersedes) };
  artifact.entries.push(entry);
  return artifact;
}

// ---------------------------------------------------------------------------
// Learning-note parsing. Neuroplast has no memory of its own outside the LCP
// knowledge artifact — `remember` writes directly into it. This parser exists
// for two callers only: `remember`, which lets a caller paste a note with an
// optional leading H1/#learning header and stores just the body; and the
// v2.0 upgrade migration, which reads pre-2.0 neuroplast/learning/*.md notes
// one final time to fold their content into the artifact.
// ---------------------------------------------------------------------------

const LEARNING_TAG = "#learning";

function parseLearningNote(markdown) {
  const normalized = String(markdown).replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  let title = "";
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (!title && trimmed.startsWith("# ")) {
      title = trimmed.slice(2).trim();
      bodyStart = i + 1;
      continue;
    }
    if (title && trimmed === LEARNING_TAG) {
      bodyStart = i + 1;
      break;
    }
    if (title && trimmed !== "" && trimmed !== LEARNING_TAG) {
      bodyStart = i;
      break;
    }
  }

  const body = lines.slice(bodyStart).join("\n").trim();
  return { title, body };
}

// Build a learning memory entry from a parsed note.
function learningEntryFromNote(slug, note, { updatedAt, confidence = 0.8, origin = "learning-migration" } = {}) {
  return {
    id: slug,
    status: "active",
    confidence,
    title: note.title || slug,
    note: note.body,
    provenance: {
      origin,
      method: "captured-during-work-cycle"
    },
    updated_at: updatedAt
  };
}

module.exports = {
  VALID_STATUSES,
  loadArtifact,
  saveArtifact,
  validateMemoryEntries,
  selectActiveEntries,
  upsertEntry,
  supersedeEntry,
  parseLearningNote,
  learningEntryFromNote
};
