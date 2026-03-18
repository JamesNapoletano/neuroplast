# Adapter Mandatory Start Clarification
#plan

**Created:** 2026-03-18
**Related to:** [[project-concept/neuroplast-portability-plan-v2.md]]
**Changelog:** [[project-concept/changelog/2026-03-18.md]]

## Overview
Make adapter guides explicitly instruct operators and agents to start from the canonical workflow contract, manifest, and capability profile before executing any workflow step.

## Tasks

### 1. Add a mandatory-start section to the adapter template
- [ ] Update the shared adapter README template to require reading the contract, manifest, and capabilities profile first.

### 2. Update all bundled adapter guides
- [ ] Add a `Mandatory Start` section to each source adapter guide.
- [ ] Mirror the same clarification in installed adapter guides under `/neuroplast/adapters/`.
- [ ] Make the execution order explicit: adapter -> contract/metadata -> instruction file.

### 3. Re-validate guidance boundaries
- [ ] Run `neuroplast validate`.
- [ ] Update changelog and learning notes with the clarification pattern.

## Validation Checklist
- [ ] All adapter guides explicitly instruct the user or agent to read the contract first.
- [ ] The guides still remain documentation-only and non-authoritative.
- [ ] Validation passes after the updates.

## Related Files
- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[plans/portability-phase-4-environment-guides.md]]
- [[project-concept/changelog/2026-03-18.md]]
