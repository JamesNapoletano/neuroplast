# Canonical version statements should be synced across shipped docs and profiles
#learning

## Insight
When `package.json` version changes, the canonical human-readable version statement must be updated everywhere it is shipped or generated, not just in README.

## Why it matters
- Users may read stale version claims even when the package metadata is correct.
- Generated or packaged profile artifacts can drift from source expectations.
- Release confidence drops when docs and runtime-adjacent metadata disagree.

## Practice
On every release version bump, search for the canonical version statement across:
- `README.md`
- shipped profile artifacts under `.lcp/` and `src/lcp-files/`
- source-generated profile code under `src/lcp/`
- workflow manifests or compatibility statements under `src/instructions/`
- LCP/compatibility documentation under `docs/`

## Related
- [[plans/minor-version-doc-sync-1.2.0.md]]
- [[project-concept/changelog/2026-04-02.md]]
