# Neuroplast Portability Plan V2
#project-concept

## Overview
Define Neuroplast as a portable, filesystem-first workflow specification that can operate across AI-assisted development environments without requiring IDE-specific integrations.

## Problem Statement
Neuroplast already works well as an npm-delivered workflow bootstrap, but its long-term portability depends on a clearer contract for how files, workflow steps, metadata, and environment guidance fit together.

## Solution
Establish a canonical workflow contract under `/neuroplast/`, add machine-readable metadata around that contract, and treat environment-specific guidance as optional documentation rather than core behavior.

## Portability Definition
Portability in Neuroplast means:
1. The workflow can be understood from files alone.
2. The workflow can be executed without IDE-specific integration.
3. Tool-specific guidance can exist without changing the core workflow.
4. The system behaves consistently across environments with different capabilities.

## Non-Goals
- Build deep integrations for every AI editor or agent runtime.
- Depend on proprietary APIs or SDKs.
- Guarantee identical execution quality across all AI systems.
- Expand the CLI into environment orchestration before the workflow contract is stable.

## Core Direction
- Keep the filesystem as the primary interface.
- Define a canonical workflow contract for `/neuroplast/`.
- Add stable machine-readable metadata with minimal YAML frontmatter and a manifest.
- Add a capability profile so constrained environments can degrade gracefully.
- Keep environment guides optional and non-authoritative.
- Standardize on root `ARCHITECTURE.md` as the canonical architecture artifact.
- Preserve Obsidian compatibility without making it a hard dependency.

## Phased Implementation
1. [[plans/portability-phase-1-workflow-contract.md]]
2. [[plans/portability-phase-2-manifest-and-frontmatter.md]]
3. [[plans/portability-phase-3-capabilities-and-validation.md]]
4. [[plans/portability-phase-4-environment-guides.md]]
5. [[plans/portability-phase-5-cli-validation-and-polish.md]]

## Success Criteria
- A new user can understand the workflow from files alone.
- A human or AI can execute the workflow without IDE-specific integration.
- The same `/neuroplast/` folder contract works across multiple environments.
- Environment guides help usage without changing core behavior.
- Workflow metadata is both human-readable and machine-readable.
- Validation can detect contract drift.

## Related
- [[plans/portability-phase-1-workflow-contract.md]]
- [[plans/portability-phase-2-manifest-and-frontmatter.md]]
- [[plans/portability-phase-3-capabilities-and-validation.md]]
- [[plans/portability-phase-4-environment-guides.md]]
- [[plans/portability-phase-5-cli-validation-and-polish.md]]
- [[project-concept/changelog/2026-03-18.md]]
