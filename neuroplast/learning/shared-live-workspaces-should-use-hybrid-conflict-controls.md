# Shared Live Workspaces Should Use Hybrid Conflict Controls
#learning

## Insight
When a tool supports a real shared live workspace, conflict prevention should not rely on one mechanism everywhere. High-risk governed artifacts benefit from hard reservations, while ordinary file collaboration works better with softer presence and edit-intent awareness.

## Reusable Practice
- Use hard reservations for critical shared artifacts such as active plans, architecture references, migrations, and other governed files.
- Use softer presence indicators and edit-intent warnings for broader collaborative editing.
- Treat reservation rights, edit rights, and administrative override rights as separate capabilities.
- Prefer deterministic synchronization and visible attribution before attempting ambitious always-merge collaboration semantics.

## Related
- [[plans/neuroplast-first-party-harness.md]]
- [[project-concept/neuroplast-first-party-harness.md]]
- [[learning/secure-ai-harnesses-need-capability-enforcement-not-prompt-only-rules.md]]
