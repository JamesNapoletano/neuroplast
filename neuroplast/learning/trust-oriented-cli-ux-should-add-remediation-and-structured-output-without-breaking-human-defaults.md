# Trust-Oriented CLI UX Should Add Remediation And Structured Output Without Breaking Human Defaults
#learning

## Insight
Operator trust improves when CLI diagnostics explain the next corrective action directly, but human-readable defaults should remain stable while structured output is added as an opt-in automation mode.

## Reusable Practice
- Add remediation text to warnings and errors instead of only restating what failed.
- Keep default terminal output optimized for human scanning and make structured output opt-in with a dedicated flag.
- Improve preview commands by explicitly labeling dry-run mode and summarizing unchanged work separately from preserved local edits.
- Extend trust checks toward state integrity and extension contract shape before expanding command scope.

## Related
- [[plans/roadmap-phase-3-validation-and-trust-ux.md]]
- [[project-concept/changelog/2026-03-24.md]]
- [[learning/cli-refactors-go-safer-when-you-preserve-the-entrypoint-and-lock-behavior-with-black-box-tests.md]]
