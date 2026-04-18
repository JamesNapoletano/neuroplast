# Reverse-Engineering Should Feed Existing Conceptualization, Not Replace It
#learning

## Practice
When adding a new workflow entrypoint that extracts context from a codebase (reverse-engineering, discovery, audit-style passes), design it as a **specialized upstream step** that feeds the existing canonical instruction rather than producing its own parallel artifact set.

## Why
Neuroplast already defines the durable artifact shapes in `PLANNING_INSTRUCTIONS.md` (Layer 1 Orientation, Layer 2 Detailed Context, root `ARCHITECTURE.md`). A reverse-engineering instruction that writes its own bespoke outputs would split the project mind into two incompatible shapes and force consumers to reconcile them. Routing the pass through `conceptualize.md` keeps a single canonical output surface and lets the reverse-engineering phase focus on what it is actually unique at: **producing evidence anchored in code paths and symbols.**

## How To Apply
- Give the new instruction a narrow purpose: gather code-grounded evidence, record open questions, stop.
- Emit exactly one intermediate artifact (e.g., an evidence note) under `/neuroplast/project-concept/` that uses the same tagging and file conventions as normal concept artifacts.
- End the instruction's step sequence with an explicit handoff to the existing canonical instruction (here, `conceptualize.md`), so the durable orientation/detailed-context/architecture files are produced by the same code path everything else in the workflow uses.
- Keep the new file optional and repo-local first (outside `required_instruction_files`) until the shape is validated on a real codebase; once the pattern proves itself, promote it to `src/instructions/`, add it to the required manifest/profile lists, and update init/sync/test wiring in the same change.

## Follow-through
- Promoting an instruction from repo-local to required is not just a file move; the managed install list, validation contract, README inventories, architecture inventories, and CLI tests must all change together.
- Keep the instruction specialized even after promotion. Required availability does not mean everyday default entrypoint.

## Related
- [[neuroplast/reverse-engineering.md]]
- [[neuroplast/conceptualize.md]]
- [[neuroplast/PLANNING_INSTRUCTIONS.md]]
- [[plans/required-reverse-engineering-instruction-shipping.md]]
