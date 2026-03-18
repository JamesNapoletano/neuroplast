# Neuroplast 1.1.1 Migration Guide
#project-concept

## Purpose
Summarize what changed in the 1.1.1 upgrade path and what `sync` now backfills for older installs.

## Upgrade Notes
- `sync` now includes a backfill migration for package-managed files added after the original 1.1.0 migration set.
- The backfill covers `manifest.yaml`, `capabilities.yaml`, `WORKFLOW_CONTRACT.md`, bundled environment guides, and bundled extension scaffolding.
- The migration is non-destructive and only creates missing package-managed files.
- Repo-local extensions are not part of the published package and are not backfilled by package migrations.

## Extension Notes
- `package-maintainer` is repo-local in this repository and lives under `neuroplast/local-extensions/package-maintainer/`.
- Published installs can declare their own `extensions.active_local` entries for repo-specific extensions.
- Published installs may also opt into bundled extensions declared under `extensions.active_bundled` when such bundled extensions exist.
- Active extensions should be treated as seamless per-step overlays: load the matching extension file for the current phase when it exists.

## Operator Checklist
- Update to Neuroplast 1.1.1.
- Run `npx neuroplast sync --dry-run` to preview changes.
- Run `npx neuroplast sync` to backfill missing package-managed files.
- If your repo uses local extensions, verify `neuroplast/manifest.yaml` declares them under `extensions.active_local`.

## Related
- [[project-concept/changelog/2026-03-18.md]]
- [[plans/versioned-managed-file-sync.md]]
- [[plans/optional-workflow-extensions.md]]
