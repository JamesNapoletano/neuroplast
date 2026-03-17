# Managed File Migration Learning: Versioned, Idempotent Sync
#learning

## Insight
For scaffold-style libraries, non-destructive init alone is insufficient once template semantics evolve. A separate versioned migration layer allows additive, one-time upgrades without re-copying full templates.

## Reusable Practice
- Keep bootstrap copy behavior and upgrade behavior separate (`init` vs `sync`).
- Persist migration state in a local state file with applied migration IDs.
- Make every migration idempotent so reruns are safe.
- Provide operator controls (`--dry-run`, optional backups) for trust and recoverability.
- Gate sync execution by package version change (including patch updates), not just major/minor changes.
- Treat downgrade sync as opt-in (`--force`) to avoid accidental backward migration effects.
- Keep framework live even when no content-altering migrations are active.

## Related
- [[plans/versioned-managed-file-sync.md]]
- [[project-concept/changelog/2026-03-17.md]]
- [[learning/npm-packaging-cli-init-pattern.md]]
