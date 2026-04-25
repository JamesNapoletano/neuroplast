# Conflict Reconciliation Instructions Should Name Project Files Explicitly
#learning

## Insight
If a conflict-resolution instruction is meant to reconcile both workflow artifacts and ordinary repository files, it should name project files explicitly in the purpose, execution steps, file-type guidance, validation checklist, and stop condition.

## Why It Matters
Instructions that mention project files only in passing can drift into reconciling documentation about a conflict without clearly requiring the underlying source, test, config, or content files to be reconciled as first-class outputs.

## Practice
- Name ordinary project files explicitly wherever the instruction defines scope and completion criteria.
- Distinguish reconciling the conflicted project file itself from updating Neuroplast artifacts that describe the reconciled result.
- Add file-type guidance for source, test, config, script, asset, and product-doc conflicts so the operator preserves valid behavior as well as prose.

## Related
- [[neuroplast/reconcile-conflicts.md]]
