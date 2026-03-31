# Context-Continuity Extension

## Purpose
Add reusable guidance for persisting assumptions, blockers, next steps, and handoff context into Neuroplast artifacts so work survives constrained or interrupted execution.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`

## Activation
Declare `context-continuity` in `extensions.active_bundled` inside `neuroplast/manifest.yaml`.

## Step Coverage
- `PLANNING_INSTRUCTIONS.md`
- `act.md`
- `think.md`

## Use When
- Work may span multiple sessions or agents.
- The environment has limited memory or context.
- You want plans and learnings to capture next-step continuity clearly.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
