const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const packageJson = require("../package.json");

const projectRoot = path.resolve(__dirname, "..");
const expectedFiles = collectExpectedPackEntries();

main();

function main() {
  runCommand("npm run validate", "npm", ["run", "validate"]);
  runCommand("npm test", "npm", ["test"]);

  const packJson = runCommand("npm pack --json", "npm", ["pack", "--json"]);
  const packPayload = JSON.parse(packJson.stdout);
  const packResult = Array.isArray(packPayload) ? packPayload[0] : packPayload;
  assert.ok(packResult && packResult.filename, "npm pack --json did not return a tarball filename");

  const tarballPath = path.join(projectRoot, packResult.filename);
  try {
    verifyTarballContents(tarballPath, packResult);
    smokeInstallTarball(tarballPath);
  } finally {
    if (fs.existsSync(tarballPath)) {
      fs.rmSync(tarballPath, { force: true });
    }
  }

  process.stdout.write("[release-verify] Release verification passed.\n");
}

function verifyTarballContents(tarballPath, packResult) {
  const tarEntries = Array.isArray(packResult.files)
    ? packResult.files.map((file) => String(file.path).replace(/\\/g, "/"))
    : [];

  assert.ok(tarEntries.length > 0, "npm pack --json did not include payload file metadata");

  for (const requiredEntry of expectedFiles) {
    assert.ok(tarEntries.includes(requiredEntry), `Packed tarball is missing expected file: ${requiredEntry}`);
  }

  for (const tarEntry of tarEntries) {
    assert.ok(expectedFiles.has(tarEntry), `Packed tarball includes unexpected file: ${tarEntry}`);
  }

  const forbiddenEntries = [
    "package/neuroplast/local-extensions/package-maintainer/README.md",
    "package/neuroplast/local-extensions/package-maintainer/act.md",
    "package/neuroplast/local-extensions/package-maintainer/CHANGELOG_INSTRUCTIONS.md"
  ];

  for (const forbiddenEntry of forbiddenEntries) {
    assert.ok(!tarEntries.includes(forbiddenEntry), `Packed tarball includes repo-local maintainer asset: ${forbiddenEntry}`);
  }
}

function smokeInstallTarball(tarballPath) {
  const smokeDir = fs.mkdtempSync(path.join(os.tmpdir(), "neuroplast-release-verify-"));
  try {
    runCommand("npm init -y", "npm", ["init", "-y"], { cwd: smokeDir });
    runCommand("npm install tarball", "npm", ["install", tarballPath], { cwd: smokeDir });
    runCommand("npx neuroplast init", "npx", ["--no-install", "neuroplast", "init"], { cwd: smokeDir });
    fs.writeFileSync(path.join(smokeDir, "ARCHITECTURE.md"), "# Architecture\n\nRelease verification smoke test.\n", "utf8");
    const validateJson = runCommand("npx neuroplast validate --json", "npx", ["--no-install", "neuroplast", "validate", "--json"], { cwd: smokeDir });
    const payload = JSON.parse(validateJson.stdout);
    assert.equal(payload.ok, true, "Packed install validate --json should report ok=true");
    assert.equal(payload.schemaVersion, 1, "Packed install validate --json should expose schemaVersion=1");
    assert.ok(fs.existsSync(path.join(smokeDir, "node_modules", packageJson.name, "schemas", "validate-json.schema.json")), "Installed package should include validate JSON schema");
  } finally {
    fs.rmSync(smokeDir, { recursive: true, force: true });
  }
}

function runCommand(label, command, args, options = {}) {
  const result = spawnSync(resolveCommand(command), resolveArgs(command, args), {
    cwd: options.cwd || projectRoot,
    env: {
      ...process.env,
      ...options.env
    },
    encoding: "utf8",
    shell: false
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${label} failed with code ${result.status}\n${result.stdout || ""}${result.stderr || ""}`);
  }

  return {
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

function resolveCommand(command) {
  if (process.platform === "win32" && (command === "npm" || command === "npx")) {
    return process.env.ComSpec || "cmd.exe";
  }

  return command;
}

function resolveArgs(command, args) {
  if (process.platform === "win32" && (command === "npm" || command === "npx")) {
    const scriptPath = path.join(process.env.APPDATA || "", "npm", `${command}.cmd`);
    return ["/d", "/s", "/c", quoteWindowsCommand([scriptPath, ...args])];
  }

  return args;
}

function quoteWindowsCommand(parts) {
  return parts.map(quoteWindowsArg).join(" ");
}

function quoteWindowsArg(value) {
  const stringValue = String(value);
  if (!/[\s"]/u.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replace(/(\\*)"/g, "$1$1\\\"").replace(/(\\+)$/g, "$1$1")}"`;
}

function collectExpectedPackEntries() {
  const files = new Set(["package.json"]);

  addFileIfPresent(files, "README.md");
  addFileIfPresent(files, "LICENSE");
  addTree(files, "bin");
  addTree(files, "src");
  addTree(files, "schemas");

  return files;
}

function addFileIfPresent(results, relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
    results.add(relativePath.replace(/\\/g, "/"));
  }
}

function addTree(results, relativeDir) {
  const absoluteDir = path.join(projectRoot, relativeDir);
  if (!fs.existsSync(absoluteDir) || !fs.statSync(absoluteDir).isDirectory()) {
    return;
  }

  walkDirectory(absoluteDir, (absolutePath) => {
    const relativePath = path.relative(projectRoot, absolutePath).replace(/\\/g, "/");
    results.add(relativePath);
  });
}

function walkDirectory(currentDir, visitFile) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const absolutePath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(absolutePath, visitFile);
      continue;
    }

    if (entry.isFile()) {
      visitFile(absolutePath);
    }
  }
}
