# First-Run Workflows Should Scaffold Required Root Artifacts
#learning

## Insight
If a bootstrap command creates a workflow contract that immediately requires a root artifact, adoption improves when the command scaffolds that artifact instead of forcing a manual step before the first successful validation loop.

## Reusable Practice
- Let initialization create minimal required root artifacts when they are structural prerequisites, not user-authored content with hidden defaults.
- Keep the scaffold intentionally small so operator-authored architecture remains authoritative.
- Preserve non-destructive behavior by skipping the scaffold whenever the repository already provides the canonical file.
- Lock the onboarding path with black-box tests that cover fresh install success and existing-file preservation.

## Related
- [[plans/first-run-architecture-scaffold.md]]
- [[project-concept/changelog/2026-04-12.md]]
