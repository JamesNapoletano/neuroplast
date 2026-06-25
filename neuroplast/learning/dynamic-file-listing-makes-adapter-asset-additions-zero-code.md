# Dynamic File Listing Makes Adapter Asset Additions Zero-Code
#learning

When `src/cli/constants.js` builds `adapterAssetFiles` via `listManagedFilesRelative`, it walks the entire `src/adapter-assets/` tree recursively. Adding new files or subdirectories under `src/adapter-assets/` requires no code change — the listing picks them up automatically on the next `init` or `sync` run.

This means the sync-impact decision for new adapter assets is almost always **no migration needed**, and the test file-count assertions are the only thing that need updating.

Verify with a node one-liner before assuming coverage:
```
node -e "const {adapterAssetFiles} = require('./src/cli/constants'); console.log(adapterAssetFiles.join('\n'))"
```

## Related
- [[learning/sync-impact-decisions-should-be-explicit-before-managed-file-changes.md]]
- [[learning/source-and-installed-workflow-instructions-should-be-kept-in-lockstep.md]]
