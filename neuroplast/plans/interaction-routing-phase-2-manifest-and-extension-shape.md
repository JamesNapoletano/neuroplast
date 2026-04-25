# Interaction Routing Phase 2 - Manifest and Extension Shape
#plan

**Created:** 2026-04-18
**Related to:** [[project-concept/cross-adapter-interaction-routing.md]]
**Changelog:** [[project-concept/changelog/2026-04-18.md]]

## Overview
Define where interaction-routing metadata should live and how bundled or repo-local extensions can participate without overriding the core workflow contract.

## Dependencies
- [[plans/interaction-routing-phase-1-canonical-contract.md]]
- [[plans/roadmap-phase-4-extension-system-mvp.md]]
- [[plans/optional-workflow-extensions.md]]

## Work Type
Docs and metadata-shape design, with validation follow-up planning.

## Tasks

### 1. Choose the declaration surface
- [x] Decide whether canonical routing metadata belongs in `neuroplast/manifest.yaml`, a new routing artifact, or another additive machine-readable surface.
- [x] Keep existing repositories valid when routing metadata is absent.
- [x] Ensure the chosen shape fits current metadata-boundary rules.

### 2. Define extension participation rules
- [x] Specify how active bundled and repo-local extensions can add phrase overlays for a step.
- [x] Prevent extensions from overriding canonical intent meanings.
- [x] Keep step-based loading predictable and aligned with the existing extension model.

### 3. Define validation expectations
- [x] Identify the validation findings needed for conflicting, malformed, or unsafe routing declarations.
- [x] Separate normative routing declarations from advisory examples and adapter tips.
- [x] Record whether CLI support is needed to inspect resolved mappings.

## Success Criteria
- [x] Routing declarations are additive and machine-readable.
- [x] Existing installs remain valid without migration pressure.
- [x] Extension overlays remain predictable and non-overriding.

## Execution Notes
- Added `[[project-concept/interaction-routing-metadata-shape.md]]` as the phase-2 metadata design artifact.
- Chose a dedicated additive artifact (`neuroplast/interaction-routing.yaml`) over embedding routing semantics directly in `neuroplast/manifest.yaml`.
- Proposed manifest participation as an additive document-role pointer rather than a required schema rewrite.
- Defined root-level `interaction-routing.yaml` overlays for active bundled or repo-local extensions because routing happens before step selection.
- Recorded future validation targets and deferred deterministic CLI inspection to Phase 4.

## Risks
- Overloading the manifest could make the core workflow map harder to reason about.
- Weak extension boundaries could let repo-local behavior leak into base semantics.

## Related Files
- `neuroplast/manifest.yaml`
- `neuroplast/extensions/`
- `neuroplast/local-extensions/`
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-metadata-shape.md]]
- [[learning/active-extensions-should-load-by-step-not-by-memory.md]]
