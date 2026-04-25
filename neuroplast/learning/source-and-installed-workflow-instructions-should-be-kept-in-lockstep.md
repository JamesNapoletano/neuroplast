# Source And Installed Workflow Instructions Should Be Kept In Lockstep
#learning

## Insight
When Neuroplast maintains both source instruction files and a live installed `/neuroplast/` copy in the repository, wording changes should be checked in both places so entrypoint guidance does not drift.

## Why It Matters
A small source-only wording regression can silently weaken the workflow contract even when the installed copy still looks correct, which creates ambiguity about what future packaged installs should receive.

## Practice
- Review both the source instruction and the installed mirror whenever changing managed workflow wording.
- Compare entrypoint guidance against `WORKFLOW_CONTRACT.md` when the change affects routing or phase selection.
- Treat source/installed mismatches as bounded alignment work and record them in plan and changelog artifacts.

## Related
- [[src/instructions/act.md]]
- [[neuroplast/act.md]]
- [[neuroplast/WORKFLOW_CONTRACT.md]]
