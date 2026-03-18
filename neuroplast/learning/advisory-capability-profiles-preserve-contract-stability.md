# Advisory Capability Profiles Preserve Contract Stability
#learning

## Insight
Capability profiles should influence execution strategy, not redefine the workflow itself. Treating environment limits as advisory keeps the core contract stable while still allowing graceful degradation.

## Reusable Practice
- Keep capability profiles machine-readable but advisory.
- Use capability limits to adjust sequencing, scope size, and fallback behavior rather than changing paths or artifact roles.
- Record blocked steps and fallback paths in the active plan when the environment cannot execute everything directly.
- Put validation targets in the manifest and higher-level validation rules in the workflow contract so future CLI validation can reuse the same source of truth.

## Related
- [[plans/portability-phase-3-capabilities-and-validation.md]]
- [[project-concept/changelog/2026-03-18.md]]
- [[project-concept/neuroplast-portability-plan-v2.md]]
