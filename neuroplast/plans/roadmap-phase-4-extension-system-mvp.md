# Roadmap Phase 4 - Extension System MVP
#plan

**Created:** 2026-03-24
**Related to:** [[project-concept/neuroplast-product-maturity-roadmap.md]]
**Changelog:** [[project-concept/changelog/2026-03-24.md]], [[project-concept/changelog/2026-03-30.md]]

## Overview
Turn the extension model into a practical product feature by shipping at least one useful bundled extension path, tightening extension validation, and documenting extension authoring clearly.

## Dependencies
- [[plans/roadmap-phase-1-reliability-hardening.md]]
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
- [[plans/optional-workflow-extensions.md]]

## Tasks

### 1. Complete extension validation and structure
- [x] Verify active extensions by expected step files, not only directory existence.
- [x] Define a minimal extension file convention for bundled and repo-local extensions.
- [x] Confirm extension boundaries remain additive and non-overriding.

### 2. Ship real extension value
- [x] Add at least one bundled extension example with clear use-case value.
- [ ] Keep maintainer-only workflow policy repo-local unless it proves broadly reusable.
- [x] Ensure packaged defaults remain safe when no extensions are enabled.

### 3. Improve extension authoring guidance
- [x] Add maintainer-facing docs for creating bundled and local extensions.
- [x] Explain activation, per-step overlay loading, and compatibility expectations.
- [x] Link extension docs from the main product roadmap and extension README files.

## Success Criteria
- [x] Bundled extensions provide real workflow value beyond scaffolding.
- [x] Validation can catch malformed active extension setups.
- [x] Users can add an extension from documentation alone.

## Risks
- Overly opinionated extensions could leak maintainer policy into the base workflow.
- Extension compatibility rules can become confusing without tight validation.

## Related Files
- `src/extensions/`
- `neuroplast/extensions/`
- `neuroplast/local-extensions/`
- [[plans/optional-workflow-extensions.md]]
- [[project-concept/changelog/2026-03-24.md]]
- [[plans/phase-4-bundled-extensions-implementation.md]]
- [[project-concept/changelog/2026-03-30.md]]
