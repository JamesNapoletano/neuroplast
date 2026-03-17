# Governed Folder Scan Prevents State-Gated Migration Gaps
#learning

## Insight
When migrations are intended to enforce folder-wide policy, deriving scope only from state-tracked bootstrap files can miss valid user-managed documents in governed folders.

## Reusable Practice
- Match migration discovery scope to policy scope (folder rules should scan governed folders).
- Keep exclusions explicit for non-content domains (for example `.obsidian`, `.backups`).
- Preserve idempotency and dry-run behavior so broad scans remain safe.
- Keep fallback compatibility when expanding migration context APIs.

## Related
- [[plans/sync-governed-folder-tag-backfill.md]]
- [[plans/obsidian-tag-enforcement-and-migration.md]]
- [[project-concept/changelog/2026-03-17.md]]
