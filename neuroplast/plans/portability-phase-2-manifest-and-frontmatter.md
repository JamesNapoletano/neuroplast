# Portability Phase 2 - Manifest and Frontmatter
#plan

**Created:** 2026-03-18
**Related to:** [[project-concept/neuroplast-portability-plan-v2.md]]
**Changelog:** [[project-concept/changelog/2026-03-18.md]]

## Overview
Add machine-readable metadata that expresses the workflow contract without coupling Neuroplast to any specific model or tool vendor.

## Dependencies
- [[plans/portability-phase-1-workflow-contract.md]]

## Tasks

### 1. Add a canonical manifest

**Goal:** Create one machine-readable map of the Neuroplast workflow.

**Actions:**
- [x] Add `neuroplast/manifest.yaml`.
- [x] Define workflow version, contract version, required directories, required instruction files, optional features, and document roles.
- [x] Ensure manifest terminology matches the workflow contract exactly.

---

### 2. Add lightweight instruction frontmatter

**Goal:** Make instruction files self-describing without adding provider-specific tuning data.

**Actions:**
- [x] Add YAML frontmatter to instruction templates in `src/instructions/`.
- [x] Mirror the same frontmatter expectations in installed `/neuroplast/` workflow files as needed.
- [x] Use stable fields such as `role`, `step`, `requires`, `writes_to`, `outputs`, `optional`, and `human_review`.

---

### 3. Define metadata boundaries

**Goal:** Keep workflow metadata portable and stable.

**Actions:**
- [x] Exclude provider-tuning fields such as token budgets, model names, or temperature.
- [x] Document which metadata is normative versus advisory.
- [x] Ensure metadata supports both human understanding and machine parsing.

## Validation Checklist

- [x] `neuroplast/manifest.yaml` exists and reflects the workflow contract.
- [x] Instruction files have consistent frontmatter schema.
- [x] Metadata fields are workflow-oriented rather than vendor-oriented.
- [x] Manifest and frontmatter vocabulary remain aligned.

## Related Files

- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[plans/portability-phase-1-workflow-contract.md]]
- [[project-concept/changelog/2026-03-18.md]]
