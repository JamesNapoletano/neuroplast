# Baseline-Aware Sync Refresh Preserves Local Managed File Edits
#learning

## Insight
Package-managed scaffold files can be safely refreshed without destructive overwrites when sync records the last known packaged baseline per file and compares current content against that baseline.

## Reusable Practice
- Treat package-managed full-file refreshes separately from content-transforming migrations.
- Store per-file baseline metadata for managed files that may be refreshed by sync.
- Refresh an existing file only when its current contents still match the last synced baseline.
- For older installs with no baseline metadata yet, adopt a file into managed refresh only when its current contents already match the packaged file exactly.
- Preserve and report locally edited files instead of overwriting them silently.

## Related
- [[plans/safe-managed-file-refresh-sync.md]]
- [[plans/versioned-managed-file-sync.md]]
- [[learning/versioned-managed-file-migrations.md]]
- [[project-concept/changelog/2026-03-19.md]]
