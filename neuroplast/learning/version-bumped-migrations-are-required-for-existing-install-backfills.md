# Version-Bumped Migrations Are Required For Existing-Install Backfills
#learning

## Insight
If `sync` skips same-version installs, a newly added migration only reaches existing users automatically when it ships with a higher package version.

## Reusable Practice
- When adding a migration intended for users already on the current release, bump the package version first.
- Use the migration to backfill only package-managed files that older installs are missing.
- Keep repo-local files and extensions out of published migrations.

## Related
- [[plans/versioned-managed-file-sync.md]]
- [[plans/optional-workflow-extensions.md]]
- [[project-concept/changelog/2026-03-18.md]]
