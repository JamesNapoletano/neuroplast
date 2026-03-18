# Workflow Metadata Boundaries
#learning

## Insight
Portable workflow metadata works best when the machine-readable layer describes workflow structure and document roles, not model behavior. Mixing workflow rules with provider-tuning hints makes the contract less stable and harder to reuse across environments.

## Reusable Practice
- Keep manifest fields focused on workflow structure, required files, document roles, and portability profile.
- Keep instruction frontmatter focused on step role, dependencies, write targets, outputs, and optionality.
- Treat review hints and tags as advisory metadata rather than hard contract rules.
- Exclude model-specific fields such as token limits, temperature, or vendor names from the canonical workflow metadata layer.

## Related
- [[plans/portability-phase-2-manifest-and-frontmatter.md]]
- [[project-concept/changelog/2026-03-18.md]]
- [[project-concept/neuroplast-portability-plan-v2.md]]
