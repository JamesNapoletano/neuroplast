# Collaboration Capabilities Should Separate Presence Reservation And Mutation Rights
#learning

## Insight
In a shared live workspace, collaboration safety improves when the system treats visibility, coordination, and mutation as different permissions. Bundling presence, reservation, and editing into one broad write grant makes least-privilege enforcement much harder.

## Reusable Practice
- Model presence, intent, reservation, edit, publish, and override as separate capabilities.
- Keep planner-style roles limited to visibility and intent when possible.
- Require stronger approval and auditing for reservation overrides than for normal edits.
- Let the sidecar enforce collaboration rights at runtime instead of relying on agent wording alone.

## Related
- [[plans/neuroplast-first-party-harness.md]]
- [[project-concept/neuroplast-first-party-harness.md]]
- [[learning/shared-live-workspaces-should-use-hybrid-conflict-controls.md]]
