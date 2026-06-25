# Plugin Install Scripts Should Resolve Paths Relative to the Script, Not CWD
#learning

When writing an install script that registers a co-located artifact (like a plugin directory), use `__dirname` to resolve the target path rather than `process.cwd()`. Users run the script from their project root, so `cwd` gives the repo root — but the artifact is relative to where the script itself lives.

Using `__dirname` means the script works correctly regardless of where the user runs it from, and no path argument is needed. The installed copy of the script always sits next to the plugin directory it registers.

This also makes the idempotency check reliable: the script can compare `installPath` against `path.resolve(__dirname, "plugin")` and know with certainty whether the current registration points to the right place.

## Related
- [[learning/dynamic-file-listing-makes-adapter-asset-additions-zero-code.md]]
