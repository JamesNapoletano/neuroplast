# Newline Sentinel Handling for Idempotent Markdown Migrations
#learning

## Insight
Splitting text by newline when content ends with a newline introduces a trailing empty sentinel element. If reconstruction appends a newline again, migrations can create blank-line-only churn.

## Reusable Practice
- Detect and remove split sentinel empty lines before reconstructing content.
- Normalize trailing blank lines in reconstructed body for deterministic output.
- Preserve original newline presence (`hasTrailingNewline`) exactly once at final write.
- Re-run dry-run migration checks to confirm idempotency on compliant files.

## Related
- [[plans/fix-sync-trailing-blank-lines.md]]
- [[plans/sync-governed-folder-tag-backfill.md]]
- [[project-concept/changelog/2026-03-17.md]]
