const fs = require("fs");
const path = require("path");

const { normalizeRelative, normalizeRelativePath } = require("./shared");

const ACTIVE_PLAN_POINTER = "neuroplast/plans/.active-plan";

function resolveActivePlan(context) {
  const pointer = readActivePlanPointer(context);
  if (pointer && fs.existsSync(path.join(context.targetRoot, pointer.relativePath))) {
    return {
      relativePath: pointer.relativePath,
      source: "pointer"
    };
  }

  const latestPlan = findLatestPlanFile(context);
  if (!latestPlan) {
    return null;
  }

  return {
    relativePath: latestPlan.relativePath,
    source: "latest_mtime"
  };
}

function readActivePlanPointer(context) {
  const pointerPath = path.join(context.targetRoot, ACTIVE_PLAN_POINTER);
  if (!fs.existsSync(pointerPath)) {
    return null;
  }

  const raw = fs.readFileSync(pointerPath, "utf8").trim();
  if (!raw) {
    return null;
  }

  const absolutePlanPath = path.resolve(path.dirname(pointerPath), raw);
  const relativePath = normalizeRelative(context.targetRoot, absolutePlanPath);
  if (!relativePath.startsWith("neuroplast/plans/") || !relativePath.endsWith(".md")) {
    return null;
  }

  return {
    relativePath: normalizeRelativePath(relativePath),
    pointerPath: ACTIVE_PLAN_POINTER
  };
}

function findLatestPlanFile(context) {
  const plansDir = path.join(context.targetRoot, "neuroplast", "plans");
  if (!fs.existsSync(plansDir)) {
    return null;
  }

  const planFiles = fs.readdirSync(plansDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const absolutePath = path.join(plansDir, fileName);
      return {
        absolutePath,
        relativePath: normalizeRelative(context.targetRoot, absolutePath),
        mtimeMs: fs.statSync(absolutePath).mtimeMs
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  return planFiles[0] || null;
}

module.exports = {
  ACTIVE_PLAN_POINTER,
  resolveActivePlan,
  readActivePlanPointer,
  findLatestPlanFile
};
