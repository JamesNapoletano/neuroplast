# Portability Phase 5 - CLI Validation and Polish
#plan

**Created:** 2026-03-18
**Related to:** [[project-concept/neuroplast-portability-plan-v2.md]]
**Changelog:** [[project-concept/changelog/2026-03-18.md]]

## Overview
Consolidate documentation and CLI behavior around the stabilized portability model while keeping the CLI focused on workflow bootstrap, sync, and future-safe validation.

## Dependencies
- [[plans/portability-phase-1-workflow-contract.md]]
- [[plans/portability-phase-2-manifest-and-frontmatter.md]]
- [[plans/portability-phase-3-capabilities-and-validation.md]]
- [[plans/portability-phase-4-environment-guides.md]]

## Tasks

### 1. Align root documentation

**Goal:** Keep user-facing docs aligned with the portability model.

**Actions:**
- [x] Update `README.md` to describe the workflow contract, metadata, and environment guide approach accurately.
- [x] Update `ARCHITECTURE.md` to reflect the canonical portability architecture.
- [x] Ensure documentation does not overstate environment support or integration depth.

---

### 2. Evaluate validation command scope

**Goal:** Add validation support only after the contract is stable.

**Actions:**
- [x] Decide whether `neuroplast validate` should be implemented.
- [x] If implemented, scope it to contract and metadata validation rather than environment orchestration.
- [x] Keep `init` and `sync` behavior unchanged unless contract validation requires small supporting updates.

---

### 3. Defer adapter CLI commands unless justified

**Goal:** Prevent premature expansion of the CLI surface area.

**Actions:**
- [x] Evaluate whether environment-specific CLI helpers are still needed after guides and validation exist.
- [x] Avoid adding commands like `neuroplast adapter <system>` unless a clear, repeated operator need is proven.
- [x] Prefer simple documentation and validation over orchestration features.

## Validation Checklist

- [x] Root documentation matches actual portability support.
- [x] CLI scope remains narrow and coherent.
- [x] Any added validation behavior enforces the canonical contract.
- [x] Environment-specific orchestration is not added prematurely.

## Related Files

- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[plans/portability-phase-1-workflow-contract.md]]
- [[plans/portability-phase-2-manifest-and-frontmatter.md]]
- [[plans/portability-phase-3-capabilities-and-validation.md]]
- [[plans/portability-phase-4-environment-guides.md]]
- [[project-concept/changelog/2026-03-18.md]]
