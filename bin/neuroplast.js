#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const command = args[0];

const withObsidian = args.includes("--with-obsidian");

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

if (command !== "init") {
  logError(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

const packageRoot = path.resolve(__dirname, "..");
const targetRoot = process.env.INIT_CWD || process.cwd();

const requiredDirs = [
  "neuroplast/project-concept",
  "neuroplast/project-concept/changelog",
  "neuroplast/learning",
  "neuroplast/plans"
];

const instructionFiles = [
  "conceptualize.md",
  "act.md",
  "think.md",
  "CONCEPT_INSTRUCTIONS.md",
  "CHANGELOG_INSTRUCTIONS.md",
  "PLANNING_INSTRUCTIONS.md"
];

const obsidianFiles = [
  "core-plugins.json",
  "app.json",
  "appearance.json",
  "graph.json"
];

runInit();

function runInit() {
  logInfo(`Initializing Neuroplast in: ${targetRoot}`);

  for (const dir of requiredDirs) {
    ensureDirectory(path.join(targetRoot, dir));
  }

  for (const fileName of instructionFiles) {
    const src = path.join(packageRoot, "src", "instructions", fileName);
    const dest = path.join(targetRoot, "neuroplast", fileName);
    copyIfMissing(src, dest);
  }

  if (withObsidian) {
    const obsidianTargetDir = path.join(targetRoot, "neuroplast", ".obsidian");
    ensureDirectory(obsidianTargetDir);

    for (const fileName of obsidianFiles) {
      const src = path.join(packageRoot, "src", "obsidian", ".obsidian", fileName);
      const dest = path.join(obsidianTargetDir, fileName);
      copyIfMissing(src, dest);
    }

  } else {
    logInfo("Skipping neuroplast/.obsidian config (use --with-obsidian to include it).");
  }

  logInfo("Neuroplast initialization complete.");
}

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    logCreated(path.relative(targetRoot, directoryPath) || ".");
  }
}

function copyIfMissing(sourcePath, destinationPath) {
  if (!fs.existsSync(sourcePath)) {
    logError(`Missing source file in package: ${sourcePath}`);
    return;
  }

  if (fs.existsSync(destinationPath)) {
    logSkip(path.relative(targetRoot, destinationPath));
    return;
  }

  const destinationDir = path.dirname(destinationPath);
  ensureDirectory(destinationDir);
  fs.copyFileSync(sourcePath, destinationPath);
  logCreated(path.relative(targetRoot, destinationPath));
}

function printHelp() {
  console.log(`\nNeuroplast CLI\n\nUsage:\n  neuroplast init [--with-obsidian]\n\nCommands:\n  init                 Copy Neuroplast instruction files into /neuroplast and create /neuroplast folders\n\nOptions:\n  --with-obsidian      Include neuroplast/.obsidian config files\n  -h, --help           Show this help\n`);
}

function logInfo(message) {
  console.log(`[neuroplast] ${message}`);
}

function logError(message) {
  console.error(`[neuroplast][error] ${message}`);
}

function logCreated(relativePath) {
  console.log(`[neuroplast][create] ${relativePath}`);
}

function logSkip(relativePath) {
  console.log(`[neuroplast][skip] ${relativePath}`);
}
