# Auto-Refreshed Briefings Should Derive From Active Plans And Preserve Local Edits
#learning

## Insight
Compact current-state briefings stay useful when they derive from the active plan and nearby durable artifacts, but they must preserve local edits so operators can intentionally take over the briefing without fighting sync.

## Reusable Practice
- Generate current-state briefings from the newest active plan first, then enrich them with nearby changelog and concept context.
- Treat the generated briefing as advisory and file-backed, not as a hidden runtime cache.
- Preserve local edits once the operator changes the briefing file directly.
- Keep generated briefings small enough that validation can warn about drift toward bloated context.

## Related
- [[plans/context-efficiency-and-success-reliability.md]]
- [[project-concept/context-efficiency-and-success-reliability.md]]
- [[learning/briefing-capsules-should-compress-startup-context-without-replacing-canonical-memory.md]]
