# Project Mind Operating Model Reframe
#plan

## Current Objective
- Reframe Neuroplast's instruction model so it behaves more like a project mind for human + AI collaboration and less like a coding-centric execution ritual.

## Scope
- Update the core instruction contract to describe Neuroplast as a project mind.
- Reposition the instruction files around orientation, current objective framing, bounded work sessions, and durable memory.
- Refresh user-facing docs so the default usage model works for software and non-software projects.
- Record the concept, changelog, and learning updates required by the workflow.

## Problem Statement
- The current instructions over-emphasize implementation ceremony and software-style planning.
- The practical collaboration model between human and AI is implied rather than stated.
- The default reading and execution flow feels heavier than the intended role of Neuroplast as a living project mind.

## Sync Impact Decision
- no migration needed

## Reason
- This work changes managed instruction and guidance content, but it does not change required paths, manifest roles, validation structure, or sync-state semantics.

## Verification
- [ ] `npm run validate`
- [ ] `npm test`
- [ ] Review updated instruction and concept artifacts for project-mind language consistency

## Execution Steps
1. Update the canonical instruction and workflow docs in `src/` to emphasize project-mind usage over coding-specific execution.
2. Update root product documentation and architecture references to match the new operating model.
3. Sync managed files into the repository's installed Neuroplast layout.
4. Update concept, changelog, and learning artifacts to record the shift.
5. Run validation checks and confirm the repository remains consistent.

## Risks
- Over-correcting away from execution discipline could make the workflow vague.
- Leaving page- or implementation-centric language in place would make the new positioning inconsistent.
- Managed-file refresh could preserve stale local copies if the repository state has drifted from the stored baseline.

## Related
- [[project-concept/lcp-alignment-implementation-model.md]]
- [[project-concept/neuroplast-product-maturity-roadmap.md]]
- [[plans/product-differentiation-and-uniqueness-hardening.md]]
