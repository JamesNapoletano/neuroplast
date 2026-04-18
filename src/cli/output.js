const {
  logInfo: baseLogInfo,
  logError: baseLogError,
  logCreated: baseLogCreated,
  logSkip: baseLogSkip,
  logUpdated: baseLogUpdated,
  logPreserved: baseLogPreserved,
  logValidationOk: baseLogValidationOk,
  logValidationWarning: baseLogValidationWarning,
  logValidationError: baseLogValidationError
} = require("./logging");

const INIT_SYNC_JSON_SCHEMA_VERSION = 1;

function createCommandOutput({ jsonMode = false, getPhase = () => null } = {}) {
  const events = [];

  function record(type, details = {}) {
    if (!jsonMode) {
      return;
    }

    events.push({ type, phase: getPhase(), ...details });
  }

  return {
    jsonMode,
    checkpoint() {
      return events.length;
    },
    summarizeSince(index = 0) {
      return summarizeEvents(events.slice(index));
    },
    buildPayload({ command, packageVersion, targetRoot, options, result }) {
      const summary = summarizeEvents(events);
      return {
        ok: summary.errors === 0,
        schemaVersion: INIT_SYNC_JSON_SCHEMA_VERSION,
        command,
        packageVersion,
        targetRoot,
        options,
        summary,
        result,
        events
      };
    },
    writePayload(payload) {
      process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
    },
    logInfo(message) {
      record("info", { message });
      if (!jsonMode) {
        baseLogInfo(message);
      }
    },
    logError(message) {
      record("error", { message });
      if (!jsonMode) {
        baseLogError(message);
      }
    },
    logCreated(relativePath, preview = false) {
      record("create", { path: relativePath, preview });
      if (!jsonMode) {
        baseLogCreated(relativePath, preview);
      }
    },
    logSkip(relativePath, preview = false) {
      record("skip", { path: relativePath, preview });
      if (!jsonMode) {
        baseLogSkip(relativePath, preview);
      }
    },
    logUpdated(relativePath, preview = false) {
      record("update", { path: relativePath, preview });
      if (!jsonMode) {
        baseLogUpdated(relativePath, preview);
      }
    },
    logPreserved(relativePath, preview = false, reason = "local edits detected") {
      record("preserve", { path: relativePath, preview, reason });
      if (!jsonMode) {
        baseLogPreserved(relativePath, preview, reason);
      }
    },
    logValidationOk(message) {
      record("validate-ok", { message });
      if (!jsonMode) {
        baseLogValidationOk(message);
      }
    },
    logValidationWarning(message) {
      record("validate-warning", { message });
      if (!jsonMode) {
        baseLogValidationWarning(message);
      }
    },
    logValidationError(message) {
      record("validate-error", { message });
      if (!jsonMode) {
        baseLogValidationError(message);
      }
    }
  };
}

function summarizeEvents(events) {
  const summary = {
    events: events.length,
    info: 0,
    errors: 0,
    created: 0,
    skipped: 0,
    updated: 0,
    preserved: 0
  };

  for (const event of events) {
    if (event.type === "info") {
      summary.info += 1;
    } else if (event.type === "error") {
      summary.errors += 1;
    } else if (event.type === "create") {
      summary.created += 1;
    } else if (event.type === "skip") {
      summary.skipped += 1;
    } else if (event.type === "update") {
      summary.updated += 1;
    } else if (event.type === "preserve") {
      summary.preserved += 1;
    }
  }

  return summary;
}

module.exports = {
  INIT_SYNC_JSON_SCHEMA_VERSION,
  createCommandOutput,
  summarizeEvents
};
