# Action-Stream Reporting Makes Human And Machine CLI Output Easier To Keep Aligned
#learning

## Insight
When a CLI needs both readable terminal logs and structured automation output, it is safer to build both modes from the same underlying action stream than to maintain separate reporting paths.

## Reusable Practice
- Record command events once, then render them as human logs by default or as JSON when automation mode is requested.
- Keep structured output opt-in so interactive operator UX stays stable.
- Include command options, summary counts, and result-specific metadata in machine-readable payloads so wrappers do not have to infer behavior from raw events alone.
- Cover both modes with black-box tests to prevent silent drift between human and machine output paths.

## Related
- [[plans/structured-init-sync-json-output.md]]
- [[project-concept/changelog/2026-04-12.md]]
