# On-Demand Conflict Reconciliation Should Be a Specialized Entrypoint
#learning

## Practice
When a workflow needs explicit rescue behavior for merge conflicts or competing edits, add a dedicated instruction entrypoint instead of forcing the behavior into everyday execution.

## Why
Conflict resolution is a different mode from normal implementation. It requires preservation-first judgment across multiple competing inputs rather than forward progress on a single plan. A dedicated entrypoint keeps `act.md` simple for normal bounded work while still giving humans and AI a clear, explicit place to start when conflicts already exist.

## How To Apply
- Add a specialized instruction that starts by loading the core contract, manifest, and capability profile.
- Tell the operator to use that instruction only when the immediate task is reconciliation rather than implementation.
- Make the instruction preserve unique facts from each side, meld compatible truth, and keep uncertainty explicit instead of guessing.
- Update shipped inventories, validation rules, adapter guidance, and tests in the same change when the instruction becomes part of the managed instruction set.

## Related
- [[neuroplast/reconcile-conflicts.md]]
- [[neuroplast/act.md]]
- [[learning/reverse-engineering-should-feed-existing-conceptualization-not-replace-it.md]]
- [[plans/on-demand-conflict-reconciliation-instruction.md]]
