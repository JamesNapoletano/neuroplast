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
- Treat prompt instructions as advisory unless the host runtime also enforces a read-only tool allowlist and isolates planner sessions from earlier mutable lanes.

## Distinct-Learning Check
- This learning now covers both attested planner safety language and the need for runtime-side enforcement; no second materially distinct learning note is required.

## Related
- [[plans/opencode-planner-automatic-safety-lock.md]]
- [[learning/planning-only-agents-need-an-explicit-stop-boundary.md]]
