function parseFrontmatter(content) {
  if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
    return null;
  }

  const normalized = content.replace(/\r\n/g, "\n");
  const endIndex = normalized.indexOf("\n---\n", 4);

  if (endIndex === -1) {
    throw new Error("Unterminated frontmatter block");
  }

  const yamlContent = normalized.slice(4, endIndex);
  return parseSimpleYaml(yamlContent);
}

function parseSimpleYaml(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const root = {};
  const stack = [{ indent: -1, container: root }];

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const indent = rawLine.length - rawLine.trimStart().length;
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1].container;

    if (trimmed.startsWith("- ")) {
      if (!Array.isArray(current)) {
        throw new Error(`Unexpected list item on line ${index + 1}`);
      }

      current.push(parseScalar(trimmed.slice(2).trim()));
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) {
      throw new Error(`Invalid mapping entry on line ${index + 1}`);
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const valuePart = trimmed.slice(separatorIndex + 1).trim();

    if (Array.isArray(current)) {
      throw new Error(`Unexpected mapping entry inside array on line ${index + 1}`);
    }

    if (!valuePart) {
      const nextLine = findNextMeaningfulLine(lines, index + 1);
      const nextTrimmed = nextLine ? nextLine.trimStart() : "";
      const nextIndent = nextLine ? nextLine.length - nextLine.trimStart().length : indent;
      const container = nextLine && nextIndent > indent && nextTrimmed.startsWith("- ") ? [] : {};
      current[key] = container;
      stack.push({ indent, container });
      continue;
    }

    current[key] = parseScalar(valuePart);
  }

  return root;
}

function findNextMeaningfulLine(lines, startIndex) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (trimmed && !trimmed.startsWith("#")) {
      return lines[index];
    }
  }

  return null;
}

function parseScalar(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === "[]") {
    return [];
  }

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  if (/^-?\d+$/.test(value)) {
    return Number.parseInt(value, 10);
  }

  return value;
}

module.exports = {
  parseFrontmatter,
  parseSimpleYaml
};
