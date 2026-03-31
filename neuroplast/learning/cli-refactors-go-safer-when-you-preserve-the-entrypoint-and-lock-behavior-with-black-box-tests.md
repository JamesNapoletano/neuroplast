# CLI Refactors Go Safer When You Preserve The Entrypoint And Lock Behavior With Black-Box Tests
#learning

## Insight
Large CLI files can be split into maintainable modules with low regression risk when the published entrypoint stays stable and behavior is guarded by end-to-end process tests.

## Reusable Practice
- Keep the shipped executable path stable and move orchestration behind it instead of changing the public command surface during maintainability refactors.
- Extract modules by operational concern first: runtime, sync, validation, state, filesystem, parsing, shared helpers, constants, and logging.
- Preserve log text and output ordering while refactoring when tests or operators may already rely on them.
- Reuse existing black-box tests unchanged as the main regression gate before adding narrower unit coverage.

## Related
- [[plans/roadmap-phase-2-cli-maintainability.md]]
- [[plans/roadmap-phase-1-reliability-hardening.md]]
- [[project-concept/changelog/2026-03-24.md]]
- [[learning/black-box-cli-tests-work-best-when-the-cli-already-exposes-a-target-root-seam.md]]
