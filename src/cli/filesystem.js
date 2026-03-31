const fs = require("fs");
const path = require("path");

const { normalizeRelativePath } = require("./shared");

function ensureDirectory(context, directoryPath, options = {}) {
  if (!fs.existsSync(directoryPath)) {
    if (!options.dryRun) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    context.logCreated(path.relative(context.targetRoot, directoryPath) || ".", options.dryRun);
  }
}

function copyIfMissing(context, sourcePath, destinationPath, options = {}) {
  if (!fs.existsSync(sourcePath)) {
    context.logError(`Missing source file in package: ${sourcePath}`);
    return;
  }

  const relativeDestinationPath = normalizeRelativePath(path.relative(context.targetRoot, destinationPath));

  if (typeof options.trackManagedFile === "function") {
    options.trackManagedFile(relativeDestinationPath);
  }

  if (fs.existsSync(destinationPath)) {
    context.logSkip(path.relative(context.targetRoot, destinationPath), options.dryRun);
    return;
  }

  ensureDirectory(context, path.dirname(destinationPath), options);

  if (!options.dryRun) {
    fs.copyFileSync(sourcePath, destinationPath);
  }

  context.logCreated(path.relative(context.targetRoot, destinationPath), options.dryRun);
}

function maybeBackupFile(context, absolutePath, backupRoot) {
  if (!backupRoot) {
    return;
  }

  const relativePath = path.relative(context.targetRoot, absolutePath);
  const backupPath = path.join(backupRoot, relativePath);
  ensureDirectory(context, path.dirname(backupPath), context.syncOptions);

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(absolutePath, backupPath);
    context.logInfo(`Backup created: ${path.relative(context.targetRoot, backupPath)}`);
  }
}

module.exports = {
  ensureDirectory,
  copyIfMissing,
  maybeBackupFile
};
