"use strict";

const fs = require("fs");
const path = require("path");

// Compact JSON-Schema (draft 2020-12 subset) validator, scoped to the keywords
// the vendored LCP v2.0 schemas actually use: type, const, enum, required,
// properties, items, allOf, anyOf, $ref (to sibling schema files), minimum,
// maximum, minLength, and a lenient `format` for date-time/uri. It intentionally
// ignores additionalProperties (LCP schemas are additive/permissive) and any
// keyword not listed, so unknown constraints never produce false errors.

const SCHEMA_DIR = path.resolve(__dirname, "..", "..", "schemas", "lcp");
const schemaCache = new Map();

function loadSchema(fileName) {
  if (schemaCache.has(fileName)) {
    return schemaCache.get(fileName);
  }
  const absolute = path.join(SCHEMA_DIR, fileName);
  const schema = JSON.parse(fs.readFileSync(absolute, "utf8"));
  schemaCache.set(fileName, schema);
  return schema;
}

function resolveRef(ref) {
  // Refs in the vendored schemas are sibling files like "./reference.schema.json".
  const fileName = ref.replace(/^\.\//, "");
  return loadSchema(fileName);
}

function validateAgainstSchemaFile(value, schemaFileName) {
  const schema = loadSchema(schemaFileName);
  const errors = [];
  validateNode(value, schema, "", errors);
  return errors;
}

function validateNode(value, schema, pointer, errors) {
  if (!schema || typeof schema !== "object") {
    return;
  }

  if (schema.$ref) {
    validateNode(value, resolveRef(schema.$ref), pointer, errors);
    return;
  }

  if (Array.isArray(schema.allOf)) {
    for (const sub of schema.allOf) {
      validateNode(value, sub, pointer, errors);
    }
  }

  if (Array.isArray(schema.anyOf)) {
    const branchErrors = [];
    const matched = schema.anyOf.some((sub) => {
      const localErrors = [];
      validateNode(value, sub, pointer, localErrors);
      if (localErrors.length) {
        branchErrors.push(localErrors);
        return false;
      }
      return true;
    });
    if (!matched) {
      errors.push(`${pointer || "(root)"} does not match any allowed schema variant`);
    }
  }

  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${pointer || "(root)"} must equal "${schema.const}"`);
  }

  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    errors.push(`${pointer || "(root)"} must be one of: ${schema.enum.join(", ")}`);
  }

  if (schema.type && !matchesType(value, schema.type)) {
    errors.push(`${pointer || "(root)"} must be of type ${schema.type}`);
    return; // Type mismatch: deeper checks are not meaningful.
  }

  if (typeof value === "string") {
    if (typeof schema.minLength === "number" && value.length < schema.minLength) {
      errors.push(`${pointer || "(root)"} must be at least ${schema.minLength} character(s)`);
    }
    if (schema.format === "date-time" && value && !isLooseDateTime(value)) {
      errors.push(`${pointer || "(root)"} must be an RFC 3339 date-time`);
    }
  }

  if (typeof value === "number") {
    if (typeof schema.minimum === "number" && value < schema.minimum) {
      errors.push(`${pointer || "(root)"} must be >= ${schema.minimum}`);
    }
    if (typeof schema.maximum === "number" && value > schema.maximum) {
      errors.push(`${pointer || "(root)"} must be <= ${schema.maximum}`);
    }
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (Array.isArray(schema.required)) {
      for (const key of schema.required) {
        if (!(key in value)) {
          errors.push(`${pointer || "(root)"} is missing required property "${key}"`);
        }
      }
    }
    if (schema.properties) {
      for (const [key, subSchema] of Object.entries(schema.properties)) {
        if (key in value) {
          validateNode(value[key], subSchema, `${pointer}/${key}`, errors);
        }
      }
    }
  }

  if (Array.isArray(value) && schema.items) {
    value.forEach((item, index) => {
      validateNode(item, schema.items, `${pointer}/${index}`, errors);
    });
  }
}

function matchesType(value, type) {
  switch (type) {
    case "object":
      return value !== null && typeof value === "object" && !Array.isArray(value);
    case "array":
      return Array.isArray(value);
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number";
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "null":
      return value === null;
    default:
      return true;
  }
}

function isLooseDateTime(value) {
  // Accept RFC 3339-ish timestamps; the YAML layer stores them as strings.
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/.test(value);
}

const SCHEMA_FILE_BY_KIND = {
  manifest: "manifest.schema.json",
  profile: "profile.schema.json",
  workflow: "workflow.schema.json",
  rule: "rule.schema.json",
  reasoning_scaffold: "reasoning-scaffold.schema.json",
  tool_description: "tool-description.schema.json",
  knowledge_artifact: "knowledge-artifact.schema.json"
};

function schemaFileForKind(kind) {
  return SCHEMA_FILE_BY_KIND[kind] || null;
}

module.exports = {
  validateAgainstSchemaFile,
  schemaFileForKind,
  SCHEMA_DIR
};
