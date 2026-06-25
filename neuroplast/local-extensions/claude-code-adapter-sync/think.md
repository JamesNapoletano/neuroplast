# Claude Code Adapter Sync — Think Extension
#instruction

## Purpose
Capture reusable lessons from cycles that touched Claude Code adapter assets or cross-adapter alignment.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/think.md`

## Additional Steps

1. Read and follow `neuroplast/think.md` first.

2. If the current cycle touched plugin or adapter assets, consider capturing:
   - Any format differences between Claude Code and OpenCode assets that required non-obvious handling.
   - Which parts of the agents/skills are format-specific vs. semantically shared, so future cross-adapter updates are scoped correctly.
   - Whether the `npx neuroplast sync` propagation caught any edge case (e.g., a hidden file, a nested directory).
   - Any installed-copy drift that was discovered — how it was found and fixed.

3. Do not record file paths or current state as a learning note — those belong in the plan and changelog. Learning notes should capture patterns, invariants, and heuristics that apply to future cycles.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
