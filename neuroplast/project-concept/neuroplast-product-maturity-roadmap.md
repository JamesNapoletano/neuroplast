# Neuroplast Product Maturity Roadmap
#project-concept

## Overview
Define the next implementation phases for Neuroplast now that the portability contract, metadata model, environment guides, and baseline validation flow are in place.

## Problem Statement
Neuroplast has a stable filesystem-first core, but the next growth step requires stronger reliability, clearer operator trust, more complete extension value, better portability proof, and more repeatable release/adoption practices.

## Direction
Prioritize foundational hardening first, then improve maintainability and trust UX, then expand extension and portability value, and finally formalize release and adoption workflows.

## Phased Roadmap
1. [[plans/roadmap-phase-1-reliability-hardening.md]]
2. [[plans/roadmap-phase-2-cli-maintainability.md]]
3. [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
4. [[plans/roadmap-phase-4-extension-system-mvp.md]]
5. [[plans/roadmap-phase-5-portability-proof.md]]
6. [[plans/roadmap-phase-6-release-and-adoption-layer.md]]

## Success Criteria
- Core CLI changes are protected by automated checks before new feature expansion.
- `sync` and `validate` behavior becomes easier to trust in real repositories.
- Extensions move from scaffolding to a validated, useful product feature.
- Portability claims are backed by concrete examples and support boundaries.
- Release and adoption practices become repeatable for maintainers and teams.

## Current Phase 4 Implementation Notes
- Bundled workflow extensions now ship as three separate opt-in paths: `verification-first`, `artifact-sync`, and `context-continuity`.
- Active extension validation now expects a documented extension root with `README.md`, additive boundary language, and at least one canonical step file.

## Current Phase 5 Implementation Notes
- Portability proof now treats the terminal-only guide as the canonical actively verified first-loop environment.
- README and adapter docs now publish an explicit support matrix that distinguishes actively verified environments from documentation-only guides.
- Onboarding now points new users to a short first successful loop that demonstrates `init`, contract-first reading, `validate`, and later `sync` usage.

## Related
- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[plans/product-maturity-roadmap-phases.md]]
- [[project-concept/changelog/2026-03-24.md]]
- [[plans/phase-4-bundled-extensions-implementation.md]]
