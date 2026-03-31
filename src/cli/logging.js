function logInfo(message) {
  console.log(`[neuroplast] ${message}`);
}

function logError(message) {
  console.error(`[neuroplast][error] ${message}`);
}

function logCreated(relativePath, preview = false) {
  const prefix = preview ? "[neuroplast][create][dry-run]" : "[neuroplast][create]";
  console.log(`${prefix} ${relativePath}`);
}

function logSkip(relativePath, preview = false) {
  const prefix = preview ? "[neuroplast][skip][dry-run]" : "[neuroplast][skip]";
  console.log(`${prefix} ${relativePath}`);
}

function logUpdated(relativePath, preview = false) {
  const prefix = preview ? "[neuroplast][update][dry-run]" : "[neuroplast][update]";
  console.log(`${prefix} ${relativePath}`);
}

function logPreserved(relativePath, preview = false, reason = "local edits detected") {
  const prefix = preview ? "[neuroplast][preserve][dry-run]" : "[neuroplast][preserve]";
  console.log(`${prefix} ${relativePath} (${reason})`);
}

function logValidationOk(message) {
  console.log(`[neuroplast][validate][ok] ${message}`);
}

function logValidationWarning(message) {
  console.warn(`[neuroplast][validate][warning] ${message}`);
}

function logValidationError(message) {
  console.error(`[neuroplast][validate][error] ${message}`);
}

module.exports = {
  logInfo,
  logError,
  logCreated,
  logSkip,
  logUpdated,
  logPreserved,
  logValidationOk,
  logValidationWarning,
  logValidationError
};
