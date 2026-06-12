# File-Based Integration Docs Must State Where the Bootstrap File Installs
#learning

## Insight
When a tool integration is purely file-based (the host auto-loads a well-known file like a root `CLAUDE.md`, `AGENTS.md`, or skill file), the integration guide must state explicitly **where** the bootstrap file has to live for the host to pick it up. A guide can fully describe the bootstrap file's contents and still leave the integration non-functional if it never says "copy it to the repository root." The "how to wire it up" step is the install location, not the file body.

## Why It Matters
The Claude Code adapter guide described the bootstrap asset and its startup sequence but never told users to copy it to the repo root, so following the guide literally produced no working integration. Naming the destination path turned documentation into an actionable setup.

## How To Apply
- For any file-based adapter, include an explicit install step with the exact destination path and a copy command per supported OS.
- State plainly when there is no plugin/MCP/runtime to install, so users do not look for a non-existent setup surface.
- Edit the shippable source-of-truth (e.g. `src/adapters/*`) and then re-sync the installed working copy, so source and installed versions do not drift.

## Related
- [[environment-guides-should-document-usage-not-behavior]]
- [[copy-paste-ready-adapter-assets-should-stay-thin-and-contract-anchored]]
- [[installed-readmes-work-better-when-they-start-with-immediate-next-steps]]
