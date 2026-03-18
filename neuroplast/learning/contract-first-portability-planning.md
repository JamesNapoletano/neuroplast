# Contract-First Portability Planning
#learning

## Insight
When making a workflow system portable across tools, stabilize the core file contract and architecture naming first; otherwise environment guides, metadata, and convenience commands drift into conflicting secondary systems.

## Reusable Practice
- Define the canonical workflow contract before adding adapter or environment-specific guidance.
- Standardize core artifact names early so planning and execution docs do not split around competing conventions.
- Add machine-readable metadata only after the contract vocabulary is stable.
- Treat environment guides as documentation layers unless repeated operator needs justify CLI support later.

## Related
- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[plans/portability-phase-1-workflow-contract.md]]
- [[project-concept/changelog/2026-03-18.md]]
