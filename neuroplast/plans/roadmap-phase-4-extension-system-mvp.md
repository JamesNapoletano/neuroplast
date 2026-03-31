# Roadmap Phase 4 - Extension System MVP
#plan

**Created:** 2026-03-24
**Related to:** [[project-concept/neuroplast-product-maturity-roadmap.md]]
**Changelog:** [[project-concept/changelog/2026-03-24.md]]

## Overview
Turn the extension model into a practical product feature by shipping at least one useful bundled extension path, tightening extension validation, and documenting extension authoring clearly.

## Dependencies
- [[plans/roadmap-phase-1-reliability-hardening.md]]
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
- [[plans/optional-workflow-extensions.md]]

## Tasks

### 1. Complete extension validation and structure
- [ ] Verify active extensions by expected step files, not only directory existence.
- [ ] Define a minimal extension file convention for bundled and repo-local extensions.
- [ ] Confirm extension boundaries remain additive and non-overriding.

### 2. Ship real extension value
- [ ] Add at least one bundled extension example with clear use-case value.
- [ ] Keep maintainer-only workflow policy repo-local unless it proves broadly reusable.
- [ ] Ensure packaged defaults remain safe when no extensions are enabled.

### 3. Improve extension authoring guidance
- [ ] Add maintainer-facing docs for creating bundled and local extensions.
- [ ] Explain activation, per-step overlay loading, and compatibility expectations.
- [ ] Link extension docs from the main product roadmap and extension README files.

## Success Criteria
- [ ] Bundled extensions provide real workflow value beyond scaffolding.
- [ ] Validation can catch malformed active extension setups.
- [ ] Users can add an extension from documentation alone.

## Risks
- Overly opinionated extensions could leak maintainer policy into the base workflow.
- Extension compatibility rules can become confusing without tight validation.

## Related Files
- `src/extensions/`
- `neuroplast/extensions/`
- `neuroplast/local-extensions/`
- [[plans/optional-workflow-extensions.md]]
- [[project-concept/changelog/2026-03-24.md]]
