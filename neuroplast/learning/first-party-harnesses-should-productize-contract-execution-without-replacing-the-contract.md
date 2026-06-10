# First-Party Harnesses Should Productize Contract Execution Without Replacing the Contract
#learning

## Insight
When a workflow product grows its own harness, the harness should operationalize the existing contract instead of becoming a second source of truth. The durable filesystem contract remains the authority, while the harness improves execution, routing, visibility, and enforcement.

## Reusable Practice
- Keep `.lcp/` and `/neuroplast/` as the canonical project-mind surface.
- Treat the harness as an additive runtime and UX layer.
- Store workflow semantics in contract files, not in provider-specific adapter behavior.
- Use the harness to improve reliability, approvals, and orchestration without moving durable memory into editor-only state.

## Related
- [[plans/neuroplast-first-party-harness.md]]
- [[project-concept/neuroplast-first-party-harness.md]]
- [[project-concept/lcp-alignment-implementation-model.md]]
