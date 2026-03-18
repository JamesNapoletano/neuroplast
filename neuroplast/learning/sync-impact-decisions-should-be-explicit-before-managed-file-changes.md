# Sync Impact Decisions Should Be Explicit Before Managed File Changes
#learning

## Insight
When Neuroplast changes managed workflow assets, the riskiest failure mode is silently updating `init` behavior without adding the matching `sync` migration path for existing installs.

## Reusable Practice
- Before implementing managed-asset changes, record a sync-impact decision in the active plan.
- Use only two outcomes: `migration required` or `no migration needed`.
- If a fresh `init` would produce something that an existing install also needs, create a migration in the same execution cycle.
- If sync behavior or migration requirements changed, mention that explicitly in the changelog and update `README.md` when user-facing behavior is affected.

## Related
- [[plans/sync-migration-decision-gate.md]]
- [[plans/versioned-managed-file-sync.md]]
- [[project-concept/changelog/2026-03-18.md]]
