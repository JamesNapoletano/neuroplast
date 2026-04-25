# Interaction Routing Phase 5 - Compatibility Proof and Adoption
#plan

**Created:** 2026-04-18
**Related to:** [[project-concept/cross-adapter-interaction-routing.md]]
**Changelog:** [[project-concept/changelog/2026-04-18.md]]

## Overview
Prove that the interaction-routing model works across current environments and extension configurations, then package the result into clear adoption guidance for maintainers and consuming repositories.

## Dependencies
- [[plans/interaction-routing-phase-1-canonical-contract.md]]
- [[plans/interaction-routing-phase-2-manifest-and-extension-shape.md]]
- [[plans/interaction-routing-phase-3-adapter-alignment.md]]
- [[plans/interaction-routing-phase-4-cli-resolution-and-validation.md]]
- [[plans/roadmap-phase-6-release-and-adoption-layer.md]]

## Work Type
Proof artifacts, documentation, and release/adoption guidance.

## Tasks

### 1. Prove behavior across environments
- [x] Exercise the shared phrase model across the currently documented environments.
- [x] Distinguish actively verified routing paths from documentation-only guidance.
- [x] Show graceful fallback when an environment cannot auto-load or execute the shared routing layer.

### 2. Publish adoption guidance
- [x] Document how maintainers should wire the shared routing contract into adapter-specific project instructions.
- [x] Document how consuming repositories should add or avoid phrase overlays.
- [x] Clarify what users can expect from `go ahead`-style prompts in different capability profiles.

### 3. Protect long-term compatibility
- [x] Define compatibility expectations for routing metadata and any CLI inspection surface.
- [x] Add release-check expectations when routing semantics or shipped adapter guidance changes.
- [x] Keep proof claims evidence-backed rather than aspirational.

## Success Criteria
- [x] Portability claims for interaction routing are evidence-backed.
- [x] Maintainers have a clear rollout path for current and future adapters.
- [x] Consumers understand support boundaries and fallback behavior.

## Execution Notes
- Added `[[project-concept/interaction-routing-compatibility-proof.md]]` as the evidence-boundary and adoption artifact for interaction routing.
- Added a Codex CLI adapter guide as another thin wrapper over the shared routing contract while keeping its support status documentation-only.
- Updated support matrices and user docs to distinguish the actively verified terminal-only proof path from contract-aligned documentation-only adapters.
- Recorded release-check and consumer guidance so routing claims remain tied to CLI/file-based evidence rather than adapter optimism.

## Risks
- Portability claims may outrun the proof path if too many adapters are treated as equally verified.
- Adoption guidance may become confusing if routing remains partly implicit.

## Related Files
- `README.md`
- `neuroplast/adapters/`
- `.lcp/`
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-compatibility-proof.md]]
- [[project-concept/neuroplast-product-maturity-roadmap.md]]
