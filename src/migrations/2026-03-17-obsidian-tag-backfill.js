module.exports = {
  id: "2026-03-17-obsidian-tag-backfill",
  version: "1.1.0",
  description: "Backfill required Obsidian tags in governed markdown files.",
  run(context) {
    const markdownFiles = context.getManagedMarkdownFiles();
    let scanned = 0;
    let updated = 0;

    for (const relativePath of markdownFiles) {
      const requiredTag = getRequiredTag(relativePath);
      if (!requiredTag) {
        continue;
      }

      scanned += 1;

      const didUpdate = context.updateMarkdownFile(relativePath, (content) =>
        ensureTagUnderTitle(content, requiredTag)
      );

      if (didUpdate) {
        updated += 1;
      }
    }

    return { scanned, updated };
  }
};

function getRequiredTag(relativePath) {
  const normalizedPath = String(relativePath).replace(/\\/g, "/");

  if (!normalizedPath.startsWith("neuroplast/") || !normalizedPath.endsWith(".md")) {
    return null;
  }

  if (normalizedPath.startsWith("neuroplast/learning/")) {
    return "#learning";
  }

  if (normalizedPath.startsWith("neuroplast/project-concept/changelog/")) {
    return "#changelog";
  }

  if (normalizedPath.startsWith("neuroplast/project-concept/")) {
    return "#project-concept";
  }

  if (normalizedPath.startsWith("neuroplast/plans/")) {
    return "#plan";
  }

  if (/^neuroplast\/[^/]+\.md$/.test(normalizedPath)) {
    return "#instruction";
  }

  return null;
}

function ensureTagUnderTitle(content, requiredTag) {
  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  const hasTrailingNewline = /\r?\n$/.test(content);
  const lines = content.split(/\r?\n/);

  if (hasTrailingNewline && lines[lines.length - 1] === "") {
    lines.pop();
  }

  if (!lines.length || !lines[0].startsWith("# ")) {
    return content;
  }

  const rest = lines
    .slice(1)
    .filter((line) => line.trim() !== requiredTag);

  while (rest.length > 0 && rest[0].trim() === "") {
    rest.shift();
  }

  while (rest.length > 0 && rest[rest.length - 1].trim() === "") {
    rest.pop();
  }

  const nextLines = [lines[0], requiredTag, "", ...rest];
  return nextLines.join(eol) + (hasTrailingNewline ? eol : "");
}
