# Planner Safety Locks Should Be Always-On And Attested
#learning

## Insight
Planner-only agents are most reliable when safety boundaries are framed as always-on, non-negotiable runtime behavior instead of optional guidance. Requiring explicit planner-mode start/end attestations makes boundary compliance auditable in logs and easier to verify during mixed-agent sessions.

## Reusable Practice
- Add an always-on safety-lock section directly in planner agent assets.
- Explicitly forbid file mutations, execution behavior, and mutation-capable command flows.
- Require a planner-mode start attestation and end-of-response safety attestation.
- Route all implementation requests from planner mode to the execution agent explicitly.
- Pair prompt-level boundaries with read-only tool surfaces where possible.

## Distinct-Learning Check
- This cycle produced one primary reusable learning focused on planner safety enforcement patterns; no second materially distinct learning required a separate note.

## Related
- [[plans/opencode-planner-automatic-safety-lock.md]]
- [[learning/planning-only-agents-need-an-explicit-stop-boundary.md]]
