# Optional Workflow Extensions
#plan

**Created:** 2026-03-18
**Related to:** [[project-concept/neuroplast-portability-plan-v2.md]]
**Changelog:** [[project-concept/changelog/2026-03-18.md]]

## Overview
Add an opt-in workflow extension layer so Neuroplast can support both bundled reusable augmentations and repo-local custom augmentations without changing the canonical instruction set for all installs.

## Tasks

### 1. Define extension model
- [ ] Add extension concepts to the workflow contract and manifest.
- [ ] Distinguish bundled extensions from repo-local extensions.
- [ ] Keep extensions additive and non-overriding relative to the canonical workflow contract.

### 2. Add extension file structure
- [ ] Add bundled extension templates under `src/extensions/`.
- [ ] Add installed bundled extension docs under `neuroplast/extensions/`.
- [ ] Keep `package-maintainer` repo-local only under `neuroplast/local-extensions/`.

### 3. Add CLI and validation support
- [ ] Install bundled extensions during `init` without forcing them into the canonical execution path.
- [ ] Extend validation to verify declared active extensions when present.
- [ ] Preserve compatibility for repos that do not use extensions.
- [ ] Ensure published package defaults do not activate maintainer-only extensions.

### 4. Update documentation and learnings
- [ ] Document how to declare active bundled and repo-local extensions.
- [ ] Update README and architecture docs for extension behavior.
- [ ] Record a reusable learning about keeping maintainer policy out of the base workflow.

## Validation Checklist
- [ ] Canonical instructions remain generic for all installs.
- [ ] Bundled and repo-local extension paths are both supported.
- [ ] Maintainer-only extension behavior remains local to this repository.
- [ ] Validation passes with no extensions enabled.
- [ ] Validation passes when local extensions are declared.

## Related Files
- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[plans/portability-phase-4-environment-guides.md]]
- [[plans/portability-phase-5-cli-validation-and-polish.md]]
- [[project-concept/changelog/2026-03-18.md]]
