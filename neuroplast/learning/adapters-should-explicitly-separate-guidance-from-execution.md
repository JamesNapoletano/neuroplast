# Adapters Should Explicitly Separate Guidance from Execution
#learning

## Insight
If an adapter only says what the environment is for, users may mistake it for an executable step. Adapters become much clearer when they explicitly separate guidance order from execution order: adapter first for orientation, contract and metadata next for authority, and instruction files last for actual execution.

## Reusable Practice
- Put a `Mandatory Start` section near the top of every adapter guide.
- Explicitly tell users and agents to read the workflow contract, manifest, and capability profile before executing any instruction file.
- Name the execution target directly so adapters are not mistaken for the executable artifact.
- Keep the adapter boundary reminder so the guide remains documentation-only.

## Related
- [[plans/adapter-mandatory-start-clarification.md]]
- [[project-concept/changelog/2026-03-18.md]]
- [[plans/portability-phase-4-environment-guides.md]]
