# Active Extensions Should Load By Step, Not By Memory
#learning

## Insight
Extensions feel awkward when operators have to remember them manually for each phase. They feel seamless when activation happens once in the manifest and loading follows a predictable per-step convention.

## Reusable Practice
- Declare active extensions once in `neuroplast/manifest.yaml`.
- For each workflow phase, load the matching file from every active extension if it exists.
- Use stable step-to-file names so agents and operators can apply the rule consistently.
- Keep the core workflow unchanged; make the loading rule do the integration work.

## Related
- [[project-concept/migration-guide-1.1.1.md]]
- [[plans/optional-workflow-extensions.md]]
- [[project-concept/changelog/2026-03-18.md]]
