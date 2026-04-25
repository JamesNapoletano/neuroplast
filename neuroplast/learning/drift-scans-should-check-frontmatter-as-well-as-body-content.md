# Drift Scans Should Check Frontmatter As Well As Body Content
#learning

## Insight
Instruction drift scans should compare frontmatter metadata as carefully as markdown body text, because a single metadata field like `optional` can change the workflow contract even when the prose still matches.

## Why It Matters
Workflow files encode behavior in both narrative guidance and machine-readable frontmatter. A parity check that only looks for visible prose changes can miss contract-relevant metadata drift.

## Practice
- Compare full file contents, not just selected body sections, when checking source and installed instruction parity.
- Treat frontmatter mismatches as first-class workflow drift.
- Validate the repository after fixing either prose or metadata mismatches.

## Related
- [[src/instructions/reverse-engineering.md]]
- [[neuroplast/reverse-engineering.md]]
