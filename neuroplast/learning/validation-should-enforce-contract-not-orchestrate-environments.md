# Validation Should Enforce Contract, Not Orchestrate Environments
#learning

## Insight
Once a portable workflow has a stable contract, manifest, capability profile, and environment guides, the safest CLI expansion is validation. Validation strengthens the contract without dragging the CLI into system-specific orchestration.

## Reusable Practice
- Add validation only after the workflow contract and metadata model are stable enough to check consistently.
- Keep validation focused on required paths, parseable metadata, frontmatter shape, and non-authoritative guide boundaries.
- Avoid adapter commands unless a repeated operator need proves they add value beyond documentation and validation.
- Prefer a narrow CLI with strong guarantees over a broad CLI with environment-specific behavior.

## Related
- [[plans/portability-phase-5-cli-validation-and-polish.md]]
- [[project-concept/changelog/2026-03-18.md]]
- [[project-concept/neuroplast-portability-plan-v2.md]]
