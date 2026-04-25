# Behavioral Routing Metadata Should Live In An Additive Artifact, Not The Core Manifest
#learning

## Insight
When a repository already has a core manifest that defines workflow structure and document roles, adding behavior-oriented routing semantics directly into that file creates schema pressure and weakens portability boundaries. A dedicated additive artifact keeps discovery simple without overloading the canonical workflow map.

## Reusable Practice
- Keep the primary manifest focused on workflow structure, roles, activation, and portability profile.
- Put phrase-routing semantics in a separate additive machine-readable artifact.
- Let the manifest point to that artifact rather than absorb its full schema.
- Use root-level extension overlays for metadata that must be loaded before step selection.
- Add CLI inspection only after the additive artifact is stable enough to validate deterministically.
- Reserve CLI support for later phases once the metadata shape is stable.

## Related
- [[project-concept/interaction-routing-metadata-shape.md]]
- [[project-concept/interaction-routing-canonical-contract.md]]
- [[plans/interaction-routing-phase-2-manifest-and-extension-shape.md]]
- [[learning/workflow-metadata-boundaries.md]]
