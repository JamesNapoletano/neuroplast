# Interaction Routing Metadata Shape
#project-concept

## Overview
Define where interaction-routing metadata should live, how extensions may contribute routing overlays, and which validation boundaries should apply before any runtime or CLI support is added.

## Decision Summary
- Canonical interaction-routing metadata should **not** be embedded directly inside the core `neuroplast/manifest.yaml` structure.
- The preferred declaration surface is a **new additive machine-readable artifact** located alongside the existing Neuroplast workflow files.
- The recommended future artifact path is `neuroplast/interaction-routing.yaml`.
- `neuroplast/manifest.yaml` should remain the workflow map and discovery surface, not the primary home of phrase-routing semantics.

## Why Not Put Routing Semantics In `manifest.yaml`
- The manifest already defines workflow structure, document roles, portability profile, and extension activation.
- Phase-1 routing semantics are behavioral contract data rather than core workflow topology.
- Keeping routing semantics out of the main manifest preserves the current metadata boundary and reduces schema creep in a file that every install already depends on.
- Existing repositories should stay valid when no routing artifact exists yet.

## Recommended Declaration Model

### Canonical Artifact
Use a dedicated artifact for the shared routing contract:

`neuroplast/interaction-routing.yaml`

This artifact should eventually contain:
- the canonical shared intent set
- phrase-to-intent mappings
- precedence rules
- ambiguity and fallback rules
- overlay loading rules for active extensions

### Manifest Relationship
The manifest should continue to act as the workflow discovery map. When routing support is implemented, the manifest may add an additive document-role pointer such as:

- `document_roles.interaction_routing: neuroplast/interaction-routing.yaml`

and possibly an additive optional feature marker such as:

- `optional_features: interaction-routing`

This keeps routing discoverable without making it a required file for existing installs.

## Extension Participation Model

### Canonical Rule
Extensions may contribute routing overlays, but only additively.

### Recommended Overlay File
If an active extension wants to add routing metadata, it should use a root-level artifact such as:

- `neuroplast/extensions/<name>/interaction-routing.yaml`
- `neuroplast/local-extensions/<name>/interaction-routing.yaml`

### Why Root-Level Instead Of Step-Level
- Interaction routing happens **before** the current workflow step is selected.
- The existing step-file convention remains correct for execution overlays, but it is too late for pre-step phrase resolution.
- A root-level routing overlay keeps loading predictable while preserving the existing per-step extension model for execution guidance.

### Overlay Boundary Rules
- Extension overlays may add repo-specific or role-specific phrases.
- Extension overlays may narrow behavior for extension-owned phrases.
- Extension overlays must not redefine canonical meanings for shared phrases like `go ahead`, `continue`, or `what's next?`.
- Extension overlays must not create new workflow phases.
- If an extension needs stronger behavior changes than additive overlays allow, that work belongs outside the core routing contract.

## Validation Expectations

### Normative Validation Targets
Future validation should detect:
- malformed routing artifacts
- unresolved routing artifact paths declared by the manifest
- malformed extension routing overlay files
- duplicate phrase declarations within the same routing layer
- extension attempts to override protected canonical phrases
- invalid intent targets outside the shared canonical intent set

### Advisory Validation Targets
Future validation may warn about:
- overly broad or ambiguous extension phrases
- missing examples or descriptive notes in routing overlays
- overlay phrases that are likely to confuse operators even if technically valid

## CLI and Runtime Implication
- CLI support is **not required** to complete the metadata-shape decision.
- A deterministic CLI inspection or resolution seam would still be useful later.
- That work belongs in Phase 4 after the declaration model is stable.

## Compatibility Strategy
- Existing repositories remain valid when the routing artifact is absent.
- Routing support should be introduced as an additive capability, not as a required migration.
- The core manifest remains parseable and meaningful without routing support.
- Adapter guides should reference the routing artifact only after it becomes part of the shipped contract.

## Related
- [[project-concept/interaction-routing-canonical-contract.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[plans/interaction-routing-phase-2-manifest-and-extension-shape.md]]
- [[learning/workflow-metadata-boundaries.md]]
- [[learning/active-extensions-should-load-by-step-not-by-memory.md]]
