# Portability Phase 3 - Capabilities and Validation
#plan

**Created:** 2026-03-18
**Related to:** [[project-concept/neuroplast-portability-plan-v2.md]]
**Changelog:** [[project-concept/changelog/2026-03-18.md]]

## Overview
Define how Neuroplast adapts to constrained environments and how portability compliance is validated after the workflow contract and metadata model are in place.

## Dependencies
- [[plans/portability-phase-1-workflow-contract.md]]
- [[plans/portability-phase-2-manifest-and-frontmatter.md]]

## Tasks

### 1. Add a capability profile

**Goal:** Provide a structured way for operators and tools to declare environment limits.

**Actions:**
- [x] Add `neuroplast/capabilities.yaml`.
- [x] Define fields for file access, terminal access, long context, multi-step execution, and memory-related capabilities.
- [x] Document that capability values are advisory and may be user-maintained.

---

### 2. Define graceful degradation rules

**Goal:** Keep the workflow usable even when an environment lacks certain capabilities.

**Actions:**
- [x] Document fallback behavior for environments without terminal access.
- [x] Document fallback behavior for limited context or no multi-step execution.
- [x] Ensure constrained-mode behavior still preserves the canonical file contract.

---

### 3. Define portability validation

**Goal:** Establish explicit rules that can later be checked manually or by CLI.

**Actions:**
- [x] Define validation rules for required folders, files, manifest integrity, and metadata schema.
- [x] Define validation rules for architecture naming consistency and workflow path conventions.
- [x] Define validation rules that prevent adapter docs from conflicting with the workflow contract.

## Validation Checklist

- [x] `neuroplast/capabilities.yaml` exists with documented schema.
- [x] Graceful degradation rules are explicit.
- [x] Portability validation rules are documented and testable.
- [x] No validation rule conflicts with the workflow contract or manifest.

## Related Files

- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[plans/portability-phase-1-workflow-contract.md]]
- [[plans/portability-phase-2-manifest-and-frontmatter.md]]
- [[project-concept/changelog/2026-03-18.md]]
