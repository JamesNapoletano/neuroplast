# Portability Phase 1 - Workflow Contract
#plan

**Created:** 2026-03-18
**Related to:** [[project-concept/neuroplast-portability-plan-v2.md]]
**Changelog:** [[project-concept/changelog/2026-03-18.md]]

## Overview
Stabilize the canonical Neuroplast workflow contract so all later portability work is built on a single filesystem-first definition.

## Tasks

### 1. Define the canonical workflow contract

**Goal:** Make the `/neuroplast/` folder contract explicit and portable.

**Actions:**
- [x] Create `neuroplast/WORKFLOW_CONTRACT.md`.
- [x] Define workflow phases, expected file layout, required inputs/outputs, and update rules.
- [x] Document safe-write behavior and non-destructive expectations.

---

### 2. Normalize workflow terminology

**Goal:** Ensure instructions, architecture docs, and roadmap language use the same phase names and contract vocabulary.

**Actions:**
- [x] Align phase naming across `README.md`, `ARCHITECTURE.md`, and instruction files.
- [x] Clarify which artifacts are required for concept, plan, act, changelog, and think loops.
- [x] Remove ambiguous wording around system adapters versus guidance docs.

---

### 3. Standardize the architecture artifact

**Goal:** Remove naming conflicts around architecture references.

**Actions:**
- [x] Standardize on root `ARCHITECTURE.md` as the canonical architecture artifact.
- [x] Update planning and execution docs that still reference `Tech Stack Architecture.md` as the primary architecture file.
- [x] Keep any secondary planning architecture artifacts clearly non-canonical.

---

### 4. Clarify required versus optional conventions

**Goal:** Preserve portability while keeping helpful conventions available.

**Actions:**
- [x] Distinguish required workflow rules from optional Obsidian-enhanced conventions.
- [x] Document wiki-links and tag conventions as compatible defaults rather than hard platform requirements where appropriate.
- [x] Confirm the contract remains usable in plain markdown and terminal-driven environments.

## Validation Checklist

- [x] `neuroplast/WORKFLOW_CONTRACT.md` exists.
- [x] Root `ARCHITECTURE.md` is the canonical architecture reference across the workflow.
- [x] Workflow phases and artifact roles are defined consistently.
- [x] Required versus optional conventions are explicit.

## Related Files

- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[project-concept/changelog/2026-03-18.md]]
- [[ARCHITECTURE]]
