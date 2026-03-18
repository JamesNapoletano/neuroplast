const fs = require("fs");
const path = require("path");

const MANAGED_BACKFILL_FILES = [
  { source: ["src", "instructions", "manifest.yaml"], destination: ["neuroplast", "manifest.yaml"] },
  { source: ["src", "instructions", "capabilities.yaml"], destination: ["neuroplast", "capabilities.yaml"] },
  { source: ["src", "instructions", "WORKFLOW_CONTRACT.md"], destination: ["neuroplast", "WORKFLOW_CONTRACT.md"] },
  { source: ["src", "adapters", "README.md"], destination: ["neuroplast", "adapters", "README.md"] },
  { source: ["src", "adapters", "opencode.md"], destination: ["neuroplast", "adapters", "opencode.md"] },
  { source: ["src", "adapters", "claude-code.md"], destination: ["neuroplast", "adapters", "claude-code.md"] },
  { source: ["src", "adapters", "cursor.md"], destination: ["neuroplast", "adapters", "cursor.md"] },
  { source: ["src", "adapters", "windsurf.md"], destination: ["neuroplast", "adapters", "windsurf.md"] },
  { source: ["src", "adapters", "vscode-copilot.md"], destination: ["neuroplast", "adapters", "vscode-copilot.md"] },
  { source: ["src", "adapters", "terminal.md"], destination: ["neuroplast", "adapters", "terminal.md"] },
  { source: ["src", "extensions", "README.md"], destination: ["neuroplast", "extensions", "README.md"] }
];

module.exports = {
  id: "2026-03-18-managed-file-backfill",
  version: "1.1.1",
  description: "Backfill newly introduced managed workflow files for existing installs.",
  run(context) {
    const packageRoot = path.resolve(__dirname, "..", "..");
    const targetRoot = process.env.INIT_CWD || process.cwd();
    let scanned = 0;
    let updated = 0;

    for (const file of MANAGED_BACKFILL_FILES) {
      scanned += 1;

      const sourcePath = path.join(packageRoot, ...file.source);
      const destinationPath = path.join(targetRoot, ...file.destination);
      const relativeDestination = file.destination.join("/");

      if (!fs.existsSync(sourcePath)) {
        continue;
      }

      if (typeof context.trackManagedFile === "function") {
        context.trackManagedFile(relativeDestination);
      }

      if (fs.existsSync(destinationPath)) {
        continue;
      }

      ensureDirectory(path.dirname(destinationPath), context.dryRun);

      if (!context.dryRun) {
        fs.copyFileSync(sourcePath, destinationPath);
      }

      if (typeof context.logCreatedFile === "function") {
        context.logCreatedFile(relativeDestination);
      }

      updated += 1;
    }

    return { scanned, updated };
  }
};

function ensureDirectory(directoryPath, dryRun) {
  if (fs.existsSync(directoryPath)) {
    return;
  }

  if (!dryRun) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}
