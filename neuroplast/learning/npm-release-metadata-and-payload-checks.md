# NPM Release Learning: Metadata + Payload Checklist Before First Publish
#learning

## Insight
For first-time public npm releases, metadata completeness and payload minimization are as important as CLI correctness.

## Reusable Practice
- Add `publishConfig.access="public"` in `package.json` even when publish command includes `--access public`.
- Ensure `license` field and root `LICENSE` file are both present and aligned.
- Keep `package.json#files` limited to runtime essentials (`bin`, template `src`, docs/license as needed).
- Run `npm pack --dry-run` before publish and inspect tarball contents for duplicates.
- Keep first stable release at `1.0.0` when behavior and interfaces are already intentional and documented.
- Lock in final package name before first publish and update all user-facing install examples in the same change.

## Related
- [[plans/npm-release-readiness.md]]
- [[plans/package-rename-to-neuroplast.md]]
- [[project-concept/changelog/2026-03-14.md]]
- [[learning/npm-packaging-cli-init-pattern.md]]
