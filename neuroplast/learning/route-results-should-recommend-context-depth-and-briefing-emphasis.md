# Route Results Should Recommend Context Depth And Briefing Emphasis
#learning

## Insight
When a routing layer already knows the likely intent, it can cheaply recommend how much context to load and which briefing fields matter most. That lowers redundant context reads without changing canonical routing behavior.

## Reusable Practice
- Return additive context-depth recommendations from phrase routing rather than forcing wrappers to infer them.
- Keep recommendations intent-scoped, such as `lean` for execution and `deep` for conceptualization.
- Mirror the same emphasis guidance in compact briefing artifacts so humans and tools see the same reading strategy.
- Treat the recommendation as advisory metadata, not as a new routing contract.

## Related
- [[plans/context-efficiency-and-success-reliability.md]]
- [[project-concept/context-efficiency-and-success-reliability.md]]
- [[learning/stale-briefings-should-warn-against-newer-plan-and-changelog-inputs.md]]
