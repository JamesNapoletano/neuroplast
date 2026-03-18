# Optional Extensions Prevent Maintainer Policy From Leaking Into Core Workflows
#learning

## Insight
Repo- or maintainer-specific workflow rules should not be added to the canonical instruction set when they are not appropriate for every Neuroplast install.

## Reusable Practice
- Keep the core workflow contract generic and portable.
- Put specialized guidance in opt-in workflow extensions.
- Support both bundled reusable extensions and repo-local custom extensions.
- Declare active extensions in `neuroplast/manifest.yaml` so operators know what extra guidance to load.
- Keep maintainer-only policies in repo-local extensions when they should not ship to every install.

## Related
- [[plans/optional-workflow-extensions.md]]
- [[project-concept/changelog/2026-03-18.md]]
