# Explicit Active-Plan Pointers Are More Reliable Than Newest-File Heuristics
#learning

## Insight
When multiple plan files can be updated for adjacent work, selecting the active plan by newest modification time is brittle. A small explicit pointer is a more trustworthy signal and still allows backward-compatible fallback.

## Reusable Practice
- Add a small explicit pointer file for the active plan instead of overloading timestamps.
- Validate that the pointer resolves to an existing markdown plan under `neuroplast/plans/`.
- Keep newest-file fallback only as a compatibility path when the pointer is absent.
- Reuse the same active-plan selector across routing, briefing generation, and related validation.

## Related
- [[plans/context-efficiency-and-success-reliability.md]]
- [[project-concept/context-efficiency-and-success-reliability.md]]
- [[learning/route-results-should-recommend-context-depth-and-briefing-emphasis.md]]
