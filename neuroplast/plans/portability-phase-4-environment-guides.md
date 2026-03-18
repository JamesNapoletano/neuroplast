# Portability Phase 4 - Environment Guides
#plan

**Created:** 2026-03-18
**Related to:** [[project-concept/neuroplast-portability-plan-v2.md]]
**Changelog:** [[project-concept/changelog/2026-03-18.md]]

## Overview
Add environment-specific guidance documents that help users apply the same Neuroplast contract in different AI-assisted development environments without forking behavior.

## Dependencies
- [[plans/portability-phase-1-workflow-contract.md]]
- [[plans/portability-phase-2-manifest-and-frontmatter.md]]

## Tasks

### 1. Create environment guidance structure

**Goal:** Provide a stable home for optional environment docs.

**Actions:**
- [x] Add `neuroplast/adapters/` or an equivalent guidance directory.
- [x] Define a shared template for environment docs.
- [x] Keep all environment docs documentation-only.

---

### 2. Add initial environment guides

**Goal:** Cover major supported workflows without changing the contract.

**Actions:**
- [x] Add guidance docs for OpenCode, Claude Code, Cursor, Windsurf, VS Code + Copilot, and terminal-only use.
- [x] Include recommended prompts, entrypoints, and known limitations for each environment.
- [x] Reference the canonical workflow contract from every environment guide.

---

### 3. Prevent behavioral drift

**Goal:** Ensure environment guidance never becomes a second workflow system.

**Actions:**
- [x] Document that guides cannot override file structure, workflow phase order, or required artifacts.
- [x] Review all guide content for contract conflicts.
- [x] Keep environment-specific advice scoped to usage patterns only.

## Validation Checklist

- [x] Environment guides exist in a dedicated location.
- [x] Every guide references the canonical workflow contract.
- [x] No guide introduces a different file layout or workflow order.
- [x] Environment docs remain optional rather than authoritative.

## Related Files

- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[plans/portability-phase-1-workflow-contract.md]]
- [[plans/portability-phase-2-manifest-and-frontmatter.md]]
- [[project-concept/changelog/2026-03-18.md]]
