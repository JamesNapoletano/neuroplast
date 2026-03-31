# Bundled Extensions Need A Minimal Shape Contract
#learning

## Insight
Optional extensions become hard to trust when activation only checks that a directory exists. A small, explicit shape contract makes extensions easier to ship, validate, and document without turning them into a second workflow system.

## Reusable Practice
- Require each active extension to include a `README.md` at the extension root.
- Require the README to restate the additive boundary so the extension cannot masquerade as an alternate contract.
- Require at least one canonical step file so activation always maps to real overlay behavior.
- Keep extension files at the extension root and reuse canonical phase filenames so step-loading stays predictable.

## Related
- [[plans/roadmap-phase-4-extension-system-mvp.md]]
- [[plans/phase-4-bundled-extensions-implementation.md]]
- [[learning/active-extensions-should-load-by-step-not-by-memory.md]]
- [[project-concept/changelog/2026-03-30.md]]
