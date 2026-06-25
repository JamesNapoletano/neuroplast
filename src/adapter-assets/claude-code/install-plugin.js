#!/usr/bin/env node
/**
 * Registers the Neuroplast Claude Code plugin permanently in ~/.claude/.
 * Run from your project root after `npx neuroplast init`:
 *
 *   node neuroplast/adapter-assets/claude-code/install-plugin.js
 *
 * Idempotent — safe to run multiple times.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const PLUGIN_KEY = "neuroplast@local";
const PLUGIN_DIR = path.resolve(__dirname, "plugin");
const CLAUDE_DIR = path.join(os.homedir(), ".claude");
const SETTINGS_PATH = path.join(CLAUDE_DIR, "settings.json");
const INSTALLED_PLUGINS_PATH = path.join(CLAUDE_DIR, "plugins", "installed_plugins.json");

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    console.error(`[neuroplast] Could not parse ${filePath} — aborting.`);
    process.exit(1);
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function installPlugin() {
  if (!fs.existsSync(PLUGIN_DIR)) {
    console.error(`[neuroplast] Plugin directory not found: ${PLUGIN_DIR}`);
    console.error(`[neuroplast] Make sure you have run 'npx neuroplast init' first.`);
    process.exit(1);
  }

  if (!fs.existsSync(CLAUDE_DIR)) {
    console.error(`[neuroplast] ~/.claude directory not found at ${CLAUDE_DIR}`);
    console.error(`[neuroplast] Make sure Claude Code is installed before running this script.`);
    process.exit(1);
  }

  // Update installed_plugins.json
  const installedPlugins = readJson(INSTALLED_PLUGINS_PATH, { version: 2, plugins: {} });
  if (!installedPlugins.plugins) installedPlugins.plugins = {};

  if (installedPlugins.plugins[PLUGIN_KEY]) {
    const existing = installedPlugins.plugins[PLUGIN_KEY][0];
    if (existing && existing.installPath === PLUGIN_DIR) {
      console.log(`[neuroplast] Plugin already registered at ${PLUGIN_DIR} — skipping installed_plugins.json update.`);
    } else {
      installedPlugins.plugins[PLUGIN_KEY] = buildEntry();
      writeJson(INSTALLED_PLUGINS_PATH, installedPlugins);
      console.log(`[neuroplast] Updated plugin install path in installed_plugins.json.`);
    }
  } else {
    installedPlugins.plugins[PLUGIN_KEY] = buildEntry();
    writeJson(INSTALLED_PLUGINS_PATH, installedPlugins);
    console.log(`[neuroplast] Registered plugin in installed_plugins.json.`);
  }

  // Update settings.json
  const settings = readJson(SETTINGS_PATH, {});
  if (!settings.enabledPlugins) settings.enabledPlugins = {};

  if (settings.enabledPlugins[PLUGIN_KEY] === true) {
    console.log(`[neuroplast] Plugin already enabled in settings.json — skipping.`);
  } else {
    settings.enabledPlugins[PLUGIN_KEY] = true;
    writeJson(SETTINGS_PATH, settings);
    console.log(`[neuroplast] Enabled plugin in settings.json.`);
  }

  console.log(`[neuroplast] Neuroplast Claude Code plugin installed successfully.`);
  console.log(`[neuroplast] Plugin path: ${PLUGIN_DIR}`);
  console.log(`[neuroplast] Start a new Claude Code session to load the plugin.`);
}

function buildEntry() {
  const now = new Date().toISOString();
  return [
    {
      scope: "user",
      installPath: PLUGIN_DIR,
      version: resolvePluginVersion(),
      installedAt: now,
      lastUpdated: now
    }
  ];
}

function resolvePluginVersion() {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(PLUGIN_DIR, ".claude-plugin", "plugin.json"), "utf8"));
    return manifest.version || "0.1.0";
  } catch {
    return "0.1.0";
  }
}

installPlugin();
