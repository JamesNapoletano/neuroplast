"use strict";

// Block-style YAML parser/serializer scoped to the LCP document subset Neuroplast
// authors and reads: mappings, nested mappings, block sequences whose items are
// scalars or mappings, literal block scalars (`|` / `|-`) for multi-line memory
// note bodies, and the scalar types LCP documents use (strings, quoted strings,
// integers, floats, booleans, null, empty `[]`/`{}`). It does not support flow
// collections (beyond empty), anchors, tags, or folded scalars beyond a loose
// pass, none of which appear in LCP core documents.
//
// Parsing and serializing round-trip semantically: parse → stringify → parse
// yields an equal value, which is what the `.lcpq` expand round-trip relies on
// (the spec requires parse-equality, not byte-equality).

function parseYaml(text) {
  const normalized = String(text == null ? "" : text).replace(/\r\n/g, "\n").replace(/\t/g, "  ");
  const lines = normalized.split("\n");
  const ctx = { lines, i: 0 };

  skipBlank(ctx);
  if (ctx.i >= lines.length) {
    return {};
  }
  const value = parseNode(ctx, indentOf(lines[ctx.i]));
  return value === undefined ? {} : value;
}

function indentOf(raw) {
  return raw.length - raw.trimStart().length;
}

function isBlankOrComment(raw) {
  const stripped = stripComment(raw).trim();
  return stripped === "";
}

function skipBlank(ctx) {
  while (ctx.i < ctx.lines.length && isBlankOrComment(ctx.lines[ctx.i])) {
    ctx.i += 1;
  }
}

function parseNode(ctx, indent) {
  const text = stripComment(ctx.lines[ctx.i]).trim();
  if (text === "-" || text.startsWith("- ")) {
    return parseSequence(ctx, indent);
  }
  return parseMapping(ctx, indent);
}

function parseMapping(ctx, indent) {
  const map = {};
  parseMappingInto(ctx, indent, map);
  return map;
}

function parseMappingInto(ctx, indent, map) {
  while (true) {
    skipBlank(ctx);
    if (ctx.i >= ctx.lines.length) {
      break;
    }
    const raw = ctx.lines[ctx.i];
    const lineIndent = indentOf(raw);
    if (lineIndent < indent) {
      break;
    }
    if (lineIndent > indent) {
      throw new Error(`Unexpected indentation on line ${ctx.i + 1}`);
    }
    const text = stripComment(raw).trim();
    if (text === "-" || text.startsWith("- ")) {
      throw new Error(`Unexpected sequence item in mapping on line ${ctx.i + 1}`);
    }

    const { key, value } = splitKeyValue(text, ctx.i + 1);
    ctx.i += 1;
    map[key] = parseValue(ctx, indent, value);
  }
}

function parseValue(ctx, parentIndent, inlineValue) {
  const blockHeader = blockScalarHeader(inlineValue);
  if (blockHeader) {
    return parseBlockScalar(ctx, parentIndent, blockHeader);
  }
  if (inlineValue !== "") {
    return parseScalar(inlineValue);
  }
  // Empty inline value: a nested mapping/sequence indented deeper, or null.
  skipBlank(ctx);
  if (ctx.i < ctx.lines.length) {
    const nextIndent = indentOf(ctx.lines[ctx.i]);
    if (nextIndent > parentIndent) {
      return parseNode(ctx, nextIndent);
    }
  }
  return null;
}

function parseSequence(ctx, indent) {
  const list = [];
  while (true) {
    skipBlank(ctx);
    if (ctx.i >= ctx.lines.length) {
      break;
    }
    const raw = ctx.lines[ctx.i];
    const lineIndent = indentOf(raw);
    if (lineIndent < indent) {
      break;
    }
    if (lineIndent > indent) {
      throw new Error(`Unexpected indentation on line ${ctx.i + 1}`);
    }
    const text = stripComment(raw).trim();
    if (!(text === "-" || text.startsWith("- "))) {
      break;
    }

    const remainder = text === "-" ? "" : text.slice(2).trim();

    if (remainder === "") {
      ctx.i += 1;
      skipBlank(ctx);
      if (ctx.i < ctx.lines.length && indentOf(ctx.lines[ctx.i]) > indent) {
        list.push(parseNode(ctx, indentOf(ctx.lines[ctx.i])));
      } else {
        list.push(null);
      }
      continue;
    }

    if (isKeyValue(remainder)) {
      const childIndent = indent + 2;
      const map = {};
      const { key, value } = splitKeyValue(remainder, ctx.i + 1);
      ctx.i += 1;
      map[key] = parseValue(ctx, childIndent, value);
      parseMappingInto(ctx, childIndent, map);
      list.push(map);
      continue;
    }

    const header = blockScalarHeader(remainder);
    if (header) {
      ctx.i += 1;
      list.push(parseBlockScalar(ctx, indent, header));
      continue;
    }

    list.push(parseScalar(remainder));
    ctx.i += 1;
  }
  return list;
}

function blockScalarHeader(value) {
  const match = /^([|>])([-+]?)$/.exec(value.trim());
  if (!match) {
    return null;
  }
  return { style: match[1], chomp: match[2] || "clip" };
}

function parseBlockScalar(ctx, parentIndent, header) {
  const collected = [];
  while (ctx.i < ctx.lines.length) {
    const raw = ctx.lines[ctx.i];
    if (raw.trim() === "") {
      collected.push("");
      ctx.i += 1;
      continue;
    }
    if (indentOf(raw) > parentIndent) {
      collected.push(raw);
      ctx.i += 1;
      continue;
    }
    break;
  }

  // Drop trailing blank lines captured before the next sibling.
  while (collected.length && collected[collected.length - 1] === "") {
    collected.pop();
  }
  if (collected.length === 0) {
    return "";
  }

  const blockIndent = Math.min(
    ...collected.filter((line) => line.trim() !== "").map((line) => indentOf(line))
  );
  const contentLines = collected.map((line) => (line === "" ? "" : line.slice(blockIndent)));

  if (header.style === ">") {
    // Loose folding: join non-blank runs with spaces, blank lines become newlines.
    return foldLines(contentLines);
  }
  let content = contentLines.join("\n");
  if (header.chomp !== "+") {
    content = content.replace(/\n+$/, "");
  }
  return content;
}

function foldLines(contentLines) {
  const out = [];
  let buffer = [];
  for (const line of contentLines) {
    if (line === "") {
      if (buffer.length) {
        out.push(buffer.join(" "));
        buffer = [];
      }
      out.push("");
    } else {
      buffer.push(line);
    }
  }
  if (buffer.length) {
    out.push(buffer.join(" "));
  }
  return out.join("\n").replace(/\n+$/, "");
}

function splitKeyValue(text, lineNumber) {
  if (!isKeyValue(text)) {
    throw new Error(`Invalid mapping entry on line ${lineNumber}: ${text}`);
  }
  const separatorIndex = findKeySeparator(text);
  const key = unquoteKey(text.slice(0, separatorIndex).trim());
  const value = text.slice(separatorIndex + 1).trim();
  return { key, value };
}

function isKeyValue(text) {
  return findKeySeparator(text) !== -1;
}

// A key separator is the first top-level `:` followed by end-of-line or
// whitespace and not inside a quoted string.
function findKeySeparator(text) {
  let quote = null;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quote) {
      if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === ":" && (i + 1 >= text.length || text[i + 1] === " ")) {
      return i;
    }
  }
  return -1;
}

function unquoteKey(key) {
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    return key.slice(1, -1);
  }
  return key;
}

function stripComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quote) {
      if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "#" && (i === 0 || line[i - 1] === " " || line[i - 1] === "\t")) {
      return line.slice(0, i);
    }
  }
  return line;
}

function parseScalar(value) {
  if (value === "" || value === "~" || value === "null") {
    return value === "" ? "" : null;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value === "[]") {
    return [];
  }
  if (value === "{}") {
    return {};
  }
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    return value.slice(1, -1).replace(/\\"/g, '"');
  }
  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (/^-?\d+$/.test(value)) {
    return Number.parseInt(value, 10);
  }
  if (/^-?\d*\.\d+$/.test(value)) {
    return Number.parseFloat(value);
  }
  return value;
}

function stringifyYaml(value) {
  if (value === null || value === undefined) {
    return "null\n";
  }
  if (typeof value !== "object") {
    return `${formatScalar(value)}\n`;
  }
  const lines = [];
  emitNode(value, 0, lines);
  return `${lines.join("\n")}\n`;
}

function emitNode(node, indent, lines) {
  if (Array.isArray(node)) {
    emitSequence(node, indent, lines);
    return;
  }
  emitMapping(node, indent, lines);
}

function emitMapping(map, indent, lines) {
  const pad = " ".repeat(indent);
  for (const key of Object.keys(map)) {
    const value = map[key];
    const renderedKey = formatKey(key);
    if (value === null || value === undefined) {
      lines.push(`${pad}${renderedKey}: null`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${pad}${renderedKey}: []`);
      } else {
        lines.push(`${pad}${renderedKey}:`);
        emitSequence(value, indent + 2, lines);
      }
    } else if (typeof value === "object") {
      if (Object.keys(value).length === 0) {
        lines.push(`${pad}${renderedKey}: {}`);
      } else {
        lines.push(`${pad}${renderedKey}:`);
        emitMapping(value, indent + 2, lines);
      }
    } else if (typeof value === "string" && value.includes("\n")) {
      emitBlockScalar(renderedKey, value, indent, lines);
    } else {
      lines.push(`${pad}${renderedKey}: ${formatScalar(value)}`);
    }
  }
}

function emitBlockScalar(renderedKey, value, indent, lines) {
  const pad = " ".repeat(indent);
  const childPad = " ".repeat(indent + 2);
  lines.push(`${pad}${renderedKey}: |-`);
  for (const line of value.replace(/\n+$/, "").split("\n")) {
    lines.push(line === "" ? "" : `${childPad}${line}`);
  }
}

function emitSequence(list, indent, lines) {
  const pad = " ".repeat(indent);
  for (const item of list) {
    if (item !== null && typeof item === "object" && !Array.isArray(item)) {
      const keys = Object.keys(item);
      if (keys.length === 0) {
        lines.push(`${pad}- {}`);
        continue;
      }
      const childLines = [];
      emitMapping(item, indent + 2, childLines);
      const first = childLines[0].slice(indent + 2);
      lines.push(`${pad}- ${first}`);
      for (let i = 1; i < childLines.length; i += 1) {
        lines.push(childLines[i]);
      }
    } else if (Array.isArray(item)) {
      lines.push(`${pad}-`);
      emitSequence(item, indent + 2, lines);
    } else if (item === null || item === undefined) {
      lines.push(`${pad}- null`);
    } else if (typeof item === "string" && item.includes("\n")) {
      const childLines = [];
      emitBlockScalar("value", item, indent + 2, childLines);
      // Hoist the block header onto the dash line.
      const first = childLines[0].slice(indent + 2).replace(/^value: /, "");
      lines.push(`${pad}- ${first}`);
      for (let i = 1; i < childLines.length; i += 1) {
        lines.push(childLines[i]);
      }
    } else {
      lines.push(`${pad}- ${formatScalar(item)}`);
    }
  }
}

function formatKey(key) {
  if (/^[A-Za-z0-9_][A-Za-z0-9_./-]*$/.test(key)) {
    return key;
  }
  return `"${String(key).replace(/"/g, '\\"')}"`;
}

function formatScalar(value) {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number") {
    return String(value);
  }
  const text = String(value);
  if (needsQuoting(text)) {
    return `"${text.replace(/"/g, '\\"')}"`;
  }
  return text;
}

function needsQuoting(text) {
  if (text === "") {
    return true;
  }
  if (/^(true|false|null|~)$/i.test(text)) {
    return true;
  }
  if (/^-?\d+$/.test(text) || /^-?\d*\.\d+$/.test(text)) {
    return true;
  }
  if (/^[\s]|[\s]$/.test(text)) {
    return true;
  }
  // Quote any string containing a colon (timestamps, namespaced ids) or a hash,
  // so the block grammar never mistakes them for structure on reparse.
  if (text.includes(":") || /(\s#)|(^#)/.test(text)) {
    return true;
  }
  if (/^[-?:,[\]{}&*!|>'"%@`]/.test(text)) {
    return true;
  }
  return false;
}

module.exports = {
  parseYaml,
  stringifyYaml
};
