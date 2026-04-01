# Product Differentiation and Uniqueness Hardening
#plan

**Created:** 2026-03-31
**Related to:** [[project-concept/neuroplast-product-maturity-roadmap.md]], [[project-concept/neuroplast-portability-plan-v2.md]]
**Changelog:** [[project-concept/changelog/2026-03-31.md]]

## Overview
Address the current risk that Neuroplast can be perceived as a prompt pack, template scaffold, or documentation-heavy workflow wrapper by sharpening product positioning around its strongest differentiators and reducing low-leverage reinvention.

## Problem Statement
Recent review surfaced three main risks:
- Neuroplast's most visible value can still look like reusable markdown guidance rather than a durable product surface.
- Some implementation choices overlap existing scaffolding and documentation patterns without yet proving why Neuroplast should own them.
- Portability and differentiation claims are stronger in principle than in evidence, which weakens trust.

## Strategic Direction
Keep and strengthen the pieces that feel product-like: the filesystem contract, managed sync behavior, machine-readable validation, and bounded extensions. De-emphasize or simplify work that mainly rephrases standard planning habits unless it clearly increases trust, portability, or upgrade safety.

## Tasks

### 1. Sharpen product positioning
- [ ] Rewrite top-level positioning so Neuroplast is described first as a portable AI workflow substrate, not a planning-document bundle.
- [ ] Add a clear "what Neuroplast is / is not" framing to reduce confusion with prompt packs, templates, and Obsidian notebooks.
- [ ] Define the primary promise in user-facing docs as safe continuity across tools, sessions, and package upgrades.

### 2. Separate core value from commodity ceremony
- [ ] Audit each major repository surface (`instructions`, `adapters`, `extensions`, `sync`, `validate`) for whether it creates differentiated product value or mostly restates standard engineering practice.
- [ ] Mark low-leverage documentation patterns for reduction, consolidation, or removal.
- [ ] Keep the narrow CLI and contract-first model as the standard for deciding future scope.

### 3. Reduce unnecessary wheel reinvention
- [ ] Review custom parsing, validation, and metadata enforcement logic and document which parts are essential to the no-dependency contract versus merely convenient to have in-house.
- [ ] Decide whether any custom subsystem should be simplified, constrained, or explicitly justified in architecture/docs.
- [ ] Avoid building broader environment orchestration or generic project-management features unless they directly strengthen the filesystem contract.

### 4. Turn differentiation into proof
- [ ] Treat `validate --json` as a first-class integration surface and document concrete downstream uses for CI, wrappers, and future adapters.
- [ ] Add at least one stronger proof artifact showing why Neuroplast is more useful than static prompt packs in a real consumer repository.
- [ ] Create a concise comparison artifact covering Neuroplast vs prompt packs, templates, and notebook-only workflows.

### 5. Tighten evidence boundaries
- [ ] Continue treating terminal-first as the canonical verified path until another environment is actively re-verified.
- [ ] Reduce or postpone environment-specific guidance that cannot yet be defended with maintained proof.
- [ ] Prefer explicit support boundaries over broad compatibility language in README and adapter docs.

### 6. Make extensions carry differentiated value
- [ ] Reframe bundled extensions as opinionated capability modules that improve verification discipline, artifact continuity, and multi-session execution.
- [ ] Evaluate each bundled extension against a simple rule: it should change workflow outcomes, not just add more reading.
- [ ] Keep maintainer-only policy repo-local unless it demonstrates broad reuse outside this repository.

## Execution Sequence
1. Clarify product positioning and anti-positioning.
2. Audit repository surfaces for differentiated value versus commodity ceremony.
3. Convert the strongest differentiators into proof artifacts and comparison material.
4. Tighten evidence boundaries and trim unsupported claims.
5. Use the results to drive README, roadmap, and extension prioritization updates.

## Success Criteria
- [ ] A new reader can quickly understand why Neuroplast is not just a prompt pack or scaffold.
- [ ] The README emphasizes contract, sync, validation, and continuity before planning ceremony.
- [ ] Differentiation claims are backed by proof artifacts, not only descriptions.
- [ ] Scope decisions become easier because new work is judged against clear core-value boundaries.

## Sync Impact
**Decision:** no migration needed

**Reason:** This plan defines positioning, product-focus, and proof work only. It does not change managed-file refresh semantics, folder structure, or sync-state expectations for installed repositories.

## Risks
- Over-correcting toward positioning work could delay concrete product proof.
- Removing too much guidance could weaken onboarding if proof artifacts are not added first.
- Broad comparison language can become marketing copy unless it is backed by maintained examples.

## Related Files
- `README.md`
- `ARCHITECTURE.md`
- `src/cli/sync.js`
- `src/cli/validate.js`
- `src/cli/parsing.js`
- `src/adapters/README.md`
- `src/extensions/README.md`
- [[plans/roadmap-phase-4-extension-system-mvp.md]]
- [[plans/roadmap-phase-5-portability-proof.md]]
- [[plans/roadmap-phase-6-release-and-adoption-layer.md]]
- [[project-concept/changelog/2026-03-31.md]]
