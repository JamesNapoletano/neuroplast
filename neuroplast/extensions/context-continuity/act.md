# Context-Continuity Act Extension
#instruction

## Purpose
Keep execution resumable by persisting blockers, partial progress, and next steps in repository artifacts.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/act.md`

## Additional Steps
1. Read and follow `neuroplast/act.md` first.
2. If execution is interrupted, partially complete, or waiting on a blocker, record the current state in the active plan before stopping.
3. Prefer durable repository context over session-only explanations when handing work off.

## Validation Checklist
- [ ] Blockers and partial progress are captured in the active plan when relevant.
- [ ] Handoff context is written to files rather than left only in conversation state.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
