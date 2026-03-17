# Learning: Keep CLI Output Paths Explicit and Centralized
#learning

## Insight
When bootstrap CLIs install templates, users infer structure from folder names. If files are copied to a different root than expected, it feels like a partial install even when publish payload is correct.

## Reusable Practice
- Keep destination path contracts explicit in one place in the CLI (single clear join root).
- Align README, architecture docs, and project concept docs immediately after path changes.
- Validate behavior with both packaging checks (`npm pack --dry-run`) and runtime smoke tests.
- Test at least one default run and one optional-flag run to confirm path behavior.

## Related
- [[plans/init-output-under-neuroplast-folder.md]]
- [[project-concept/changelog/2026-03-14.md]]
