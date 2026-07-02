const fs = require("fs");
const path = require("path");

const { getNeuroplastProfile } = require("../lcp/profile");

// The user's neuroplast/manifest.yaml is never overwritten by sync (it is
// user-maintainable — declared extensions, custom roles). But when a newer
// Neuroplast version adds a required document role, an old install's manifest
// lacks it and `validate` then fails on a role the user never chose to omit.
// This migration surgically backfills any expected document_roles that the
// user's manifest is missing, additively — it inserts missing `role: path`
// lines into the existing document_roles block and touches nothing else, so
// user customizations and comments are preserved. It is idempotent: once every
// expected role is present it does nothing.
module.exports = {
  id: "2026-07-02-backfill-document-roles",
  version: "2.0.2",
  description: "Backfill expected document_roles that an older install's manifest is missing.",
  run(context) {
    const targetRoot = process.env.INIT_CWD || process.cwd();
    const manifestPath = path.join(targetRoot, "neuroplast", "manifest.yaml");

    if (!fs.existsSync(manifestPath)) {
      return { scanned: 0, updated: 0 };
    }

    const expectedRoles = getNeuroplastProfile().expectedDocumentRoles || {};
    const original = fs.readFileSync(manifestPath, "utf8");
    const lines = original.split(/\r?\n/);

    const headerIndex = lines.findIndex((line) => /^document_roles:\s*$/.test(line));
    if (headerIndex === -1) {
      // No document_roles block to extend; leave the manifest untouched.
      return { scanned: 1, updated: 0 };
    }

    // The block runs from the header until the next non-indented, non-blank line.
    let blockEnd = headerIndex + 1;
    const presentRoles = new Set();
    for (let i = headerIndex + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.trim() === "") {
        blockEnd = i;
        continue;
      }
      if (!/^\s/.test(line)) {
        break;
      }
      const match = line.match(/^\s+([A-Za-z0-9_]+):/);
      if (match) {
        presentRoles.add(match[1]);
      }
      blockEnd = i + 1;
    }

    const additions = [];
    for (const [role, rolePath] of Object.entries(expectedRoles)) {
      if (!presentRoles.has(role)) {
        additions.push(`  ${role}: ${rolePath}`);
      }
    }

    if (additions.length === 0) {
      return { scanned: 1, updated: 0 };
    }

    const next = [...lines.slice(0, blockEnd), ...additions, ...lines.slice(blockEnd)];
    if (!context.dryRun) {
      fs.writeFileSync(manifestPath, next.join("\n"), "utf8");
    }
    if (typeof context.logUpdatedFile === "function") {
      context.logUpdatedFile(
        `neuroplast/manifest.yaml (backfilled document_roles: ${additions.map((l) => l.trim().split(":")[0]).join(", ")})`
      );
    }

    return { scanned: 1, updated: 1 };
  }
};
