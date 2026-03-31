# Black-Box CLI Tests Work Best When The CLI Already Exposes A Target-Root Seam
#learning

## Insight
When a CLI is implemented as a top-level executable that writes to the filesystem and may call `process.exit()`, black-box process tests are usually more reliable than trying to unit-test internal helpers retroactively.

## Reusable Practice
- Prefer the built-in runtime test runner first when the package intentionally avoids external runtime dependencies.
- Expose one explicit target-root seam such as `INIT_CWD` so tests can run safely against temporary repositories.
- Assert exit codes, logs, filesystem effects, and persisted state together for CLI reliability work.
- Use seeded state files to simulate upgrades, downgrades, backups, and preservation paths without needing multiple published package versions in test setup.

## Related
- [[plans/roadmap-phase-1-reliability-hardening.md]]
- [[project-concept/changelog/2026-03-24.md]]
- [[learning/post-foundation-roadmaps-should-sequence-hardening-before-expansion.md]]
