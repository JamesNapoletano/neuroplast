# Local Extensions Can Enforce Repo-Specific Sync Surfaces Bundled Extensions Cannot
#learning

The bundled `artifact-sync` extension is intentionally generic — it checks that behavior-changing work updates supporting docs, but it has no knowledge of repo-specific artifact chains.

When a repository ships its own installable plugin (or other multi-location artifact), the sync surface is specific to that repo: canonical source → installed copy → user-installed copy → parallel adapter assets. A local extension is the right place to encode that surface explicitly so it isn't lost in a future session.

The pattern:
- Local extension `act.md` overlay names each sync surface and the mechanism for keeping it current.
- `CHANGELOG_INSTRUCTIONS.md` overlay requires noting which files changed and whether user reinstall is needed.
- `think.md` overlay captures cross-adapter alignment patterns as reusable learning.

This keeps repo-maintainer policy out of the bundled workflow contract while still making it durable and machine-readable.

## Related
- [[learning/optional-extensions-prevent-maintainer-policy-from-leaking-into-core-workflows.md]]
- [[learning/copy-paste-ready-adapter-assets-should-stay-thin-and-contract-anchored.md]]
