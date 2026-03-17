# Root Instruction Duplication Avoidance
#learning

## Insight
When a package has a defined runtime source (`src/instructions`) and install target (`/neuroplast/`), keeping duplicate instruction files in repository root creates ambiguity and stale references.

## Reusable Practice
- Keep exactly one canonical source directory for installable instruction templates.
- Treat generated/installed locations as runtime outputs, not authoring sources.
- Remove legacy duplicates after migration to prevent accidental edits in the wrong location.
- Record cleanup in a dated changelog and link a dedicated plan entry for traceability.

## Related
- [[plans/root-instruction-file-removal.md]]
- [[project-concept/changelog/2026-03-14.md]]
