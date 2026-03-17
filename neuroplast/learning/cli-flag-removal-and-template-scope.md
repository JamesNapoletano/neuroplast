# CLI Flag Removal and Template Scope
#learning

## Insight
When a CLI flag controls inclusion of machine-local state, removing the flag should be paired with removing the corresponding source template file to keep behavior and payload aligned.

## Reusable Practice
- Treat shared templates as deterministic defaults and avoid packaging machine-specific editor state.
- During flag removal, update all active surfaces together: parser logic, copy list, help text, README usage, architecture mapping, and concept requirements.
- Validate with a real CLI help run (`<cli> --help`) after edits so docs and runtime behavior stay in sync.

## Related
- [[plans/remove-include-workspace-option.md]]
- [[project-concept/changelog/2026-03-14.md]]
