# Cross-Adapter Interaction Routing
#project-concept

## Overview
Define a portable interaction-routing layer for Neuroplast so short operator prompts such as `go ahead`, `continue`, and `what's next?` can resolve to the correct workflow behavior across adapters without making any adapter the source of truth.

## Problem Statement
Neuroplast already has a stable filesystem-first contract, a machine-readable manifest, additive extensions, and documentation-only environment guides. What it does not yet have is a shared semantic layer for mapping natural-language operator prompts to the next workflow action. Without that layer, adapters must either guess, drift, or hardcode their own behavior.

## Direction
Treat interaction routing as an additive intent-resolution layer that sits above the existing workflow phases and below any adapter-specific UX. The workflow contract, manifest, capabilities profile, active extensions, and canonical instruction files remain authoritative. Adapters only load and explain the shared routing rules.

## Current Canonical Contract
- The phase-1 routing contract is now defined in [[project-concept/interaction-routing-canonical-contract.md]].
- The initial shared intent set is intentionally small: `act`, `conceptualize`, `inspect-current-plan`, and `clarify`.
- Resolution precedence is explicit file execution -> explicit step selection -> canonical routed phrase -> clarification fallback.
- `go ahead`-style prompts only imply `act` when a bounded active objective already exists.

## Current Metadata Shape
- The phase-2 metadata-shape decision is now defined in [[project-concept/interaction-routing-metadata-shape.md]].
- Canonical routing semantics should live in a dedicated additive artifact rather than directly inside `neuroplast/manifest.yaml`.
- The recommended future file is `neuroplast/interaction-routing.yaml`, with manifest discovery handled through an additive document-role pointer.
- Active extensions may use root-level `interaction-routing.yaml` overlays because routing happens before step-specific extension loading.

## Current Adapter Alignment
- Bundled adapter guides now describe the same short-prompt routing expectations.
- They prefer explicit file or step requests over short aliases.
- They treat `go ahead` / `continue` as `act` only when a bounded active objective exists.
- They treat `what's next?` as plan inspection rather than automatic execution.
- They tell the operator to clarify ambiguous prompts instead of guessing.

## Current CLI and Validation Seam
- The canonical routing artifact now exists at `neuroplast/interaction-routing.yaml`.
- `neuroplast route <phrase>` now exposes a narrow deterministic inspection seam for canonical phrase resolution.
- `neuroplast route --json` now exposes a machine-readable payload for wrappers and adapter shims.
- Validation now checks the routing artifact and blocks extension overlays from overriding protected shared phrases.

## Current Proof and Adoption Layer
- The current evidence boundary is documented in [[project-concept/interaction-routing-compatibility-proof.md]].
- Terminal-only plus the route/validate/test seam is the actively verified proof path for interaction routing.
- Bundled adapter guides, including Codex CLI, are aligned to the same routing contract but remain documentation-only until separately rerun.
- Copy/paste-ready adapter bootstrap assets now ship under `neuroplast/adapter-assets/` so teams can seed destination-like tool instructions without making those assets the canonical routing source.
- OpenCode now also has thin agent wrappers under `neuroplast/adapter-assets/opencode/agents/` so the existing Neuroplast skills have a reliable invocation surface.
- The OpenCode wrapper split is now explicit: `neuroplast-planner` is a strict read-only planner that ends with a handoff-ready plan in chat, while `neuroplast-orchestrator` owns bounded execution and repository writes.

## Non-Goals
- Redefine the canonical workflow phase order.
- Make adapter guides authoritative for execution behavior.
- Require deep vendor-specific integrations for every environment.
- Expand the CLI into general chat orchestration before the routing contract is stable.

## Proposed Routing Principles
- Keep the filesystem contract as the execution source of truth.
- Prefer explicit step references over inferred natural-language routing.
- Treat ambiguous prompts as clarification points rather than silent guesses.
- Allow extensions to add bounded phrase overlays without overriding canonical intent meanings.
- Preserve portability by keeping the routing layer understandable from files alone.

## Phased Implementation
1. [[plans/interaction-routing-phase-1-canonical-contract.md]]
2. [[plans/interaction-routing-phase-2-manifest-and-extension-shape.md]]
3. [[plans/interaction-routing-phase-3-adapter-alignment.md]]
4. [[plans/interaction-routing-phase-4-cli-resolution-and-validation.md]]
5. [[plans/interaction-routing-phase-5-compatibility-proof-and-adoption.md]]

## Success Criteria
- A shared routing model exists for common operator prompts.
- Adapters stay documentation-only while still feeling more seamless in practice.
- Optional extensions can participate safely without forking semantics.
- Any CLI support remains narrow, testable, and compatible with the filesystem-first model.
- Portability claims for routing are backed by evidence and explicit support boundaries.

## Related
- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[project-concept/lcp-alignment-implementation-model.md]]
- [[project-concept/interaction-routing-canonical-contract.md]]
- [[project-concept/interaction-routing-metadata-shape.md]]
- [[project-concept/interaction-routing-compatibility-proof.md]]
- [[project-concept/neuroplast-product-maturity-roadmap.md]]
- [[plans/interaction-routing-phase-3-adapter-alignment.md]]
- [[plans/interaction-routing-phase-4-cli-resolution-and-validation.md]]
- [[plans/interaction-routing-phase-5-compatibility-proof-and-adoption.md]]
- [[plans/roadmap-phase-5-portability-proof.md]]
- [[plans/roadmap-phase-6-release-and-adoption-layer.md]]
