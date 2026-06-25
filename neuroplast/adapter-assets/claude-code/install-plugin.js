#!/usr/bin/env node
/**
 * Installs the Neuroplast Claude Code plugin via the official `claude plugin` CLI.
 * Run from your project root after `npx neuroplast init`:
 *
 *   node neuroplast/adapter-assets/claude-code/install-plugin.js
 *
 * This registers the directory containing this script as a local "directory"
 * marketplace (named `neuroplast-local` per .claude-plugin/marketplace.json),
 * then installs the `neuroplast` plugin from it. Both steps are idempotent —
 * the CLI detects and reports already-installed state.
 *
 * Because the CLI caches plugin content at install time, refresh the cache
 * after editing plugin files: `claude plugin update neuroplast@neuroplast-local`
 * picks up a version bump, but same-version edits require uninstall+reinstall.
 */

const path = require("path");
const { spawnSync } = require("child_process");

// The directory containing this script is the marketplace root —
// it holds .claude-plugin/marketplace.json which declares the `neuroplast` plugin.
const MARKETPLACE_DIR = __dirname;
const MARKETPLACE_NAME = "neuroplast-local";
const PLUGIN_REF = `neuroplast@${MARKETPLACE_NAME}`;

function hasClaudeCli() {
  const result = spawnSync("claude", ["--version"], { encoding: "utf8" });
  return result.status === 0;
}

function runClaude(args) {
  const result = spawnSync("claude", args, { encoding: "utf8", stdio: "inherit" });
  if (result.error) {
    console.error(`[neuroplast] Failed to run 'claude ${args.join(" ")}': ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`[neuroplast] 'claude ${args.join(" ")}' exited with code ${result.status}.`);
    process.exit(result.status || 1);
  }
}

function installPlugin() {
  if (!hasClaudeCli()) {
    console.error(`[neuroplast] The 'claude' CLI was not found on your PATH.`);
    console.error(`[neuroplast] Install Claude Code first: https://docs.claude.com/claude-code`);
    process.exit(1);
  }

  console.log(`[neuroplast] Adding local marketplace from ${MARKETPLACE_DIR} ...`);
  runClaude(["plugin", "marketplace", "add", MARKETPLACE_DIR]);

  console.log(`[neuroplast] Installing plugin ${PLUGIN_REF} ...`);
  runClaude(["plugin", "install", PLUGIN_REF]);

  console.log(`[neuroplast] Neuroplast Claude Code plugin installed successfully.`);
  console.log(`[neuroplast] Start a new Claude Code session to load the plugin.`);
  console.log(`[neuroplast] To pick up updated plugin files later:`);
  console.log(`[neuroplast]   after a version bump:   claude plugin update ${PLUGIN_REF}`);
  console.log(`[neuroplast]   same-version edits:     claude plugin uninstall ${PLUGIN_REF} && claude plugin install ${PLUGIN_REF}`);
}

installPlugin();
