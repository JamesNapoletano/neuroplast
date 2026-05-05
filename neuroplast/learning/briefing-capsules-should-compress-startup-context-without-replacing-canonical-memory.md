# Briefing Capsules Should Compress Startup Context Without Replacing Canonical Memory
#learning

## Insight
When a workflow relies on rich durable memory, the best way to reduce startup cost is usually to add a compact current-state briefing artifact that points back to canonical files, not to shrink or overload the canonical artifacts themselves.

## Reusable Practice
- Keep the contract, plans, changelog, and learning notes as the durable source of truth.
- Use compact briefing artifacts only for current-state compression: active objective, next step, blockers, verification, and relevant files.
- Treat summary artifacts as additive and refreshable so they never silently replace the canonical memory surface.
- Design context-efficiency improvements at the workflow-behavior layer instead of adding provider-specific metadata to canonical files.

## Related
- [[plans/context-efficiency-and-success-reliability.md]]
- [[project-concept/context-efficiency-and-success-reliability.md]]
- [[learning/project-mind-workflows-need-an-active-objective-and-durable-shared-memory.md]]
