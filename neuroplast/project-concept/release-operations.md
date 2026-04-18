# Neuroplast Release Operations
#project-concept

## Purpose
Provide a repeatable maintainer runbook for local verification, sync-sensitive changes, troubleshooting, and publish preparation.

## Pre-Release Checklist
1. Confirm the active plan records a sync-impact decision: `migration required` or `no migration needed`.
2. If `migration required`, verify the migration shipped in the same change and is covered by tests.
3. Run `npm run release:verify`.
4. If `package.json` version changed, search for the canonical human-readable version statement across README, `docs/`, `src/lcp/`, `src/lcp-files/`, `src/instructions/`, and any managed `.lcp/` profile artifacts, then update all current release-facing references in the same change.
5. Review documentation updates for any user-facing workflow changes.
6. If compatibility expectations changed, update [[project-concept/release-and-compatibility-policy.md]] and README together.
7. If upgrade guidance changed materially, add or update a migration guide in `/neuroplast/project-concept/`.

## What `npm run release:verify` Covers
- repository contract validation via `npm run validate`
- black-box CLI regression coverage via `npm test`
- `npm pack --json` payload verification against expected shipped managed assets
- a packed-install smoke test that runs `init` and `validate --json`

## Sync-Sensitive Change Review
Treat these as sync-sensitive and review them explicitly before release:
- files under `src/instructions/`
- files under `src/adapters/`
- files under `src/extensions/`
- files under `src/obsidian/`
- files under `src/migrations/`
- managed-file lists or validation contracts in `src/cli/`

## Troubleshooting

### `release:verify` fails during payload checks
- Confirm the expected managed-file lists still match the source package layout.
- If you intentionally added a shipped asset, update the release verification expectations in the same change.
- If a repo-local maintainer file appears in the tarball, tighten `package.json#files` or relocate the asset outside shipped paths.

### packed smoke install fails
- Confirm the packed tarball still includes `bin/neuroplast.js`, `src/`, `README.md`, `LICENSE`, and `schemas/validate-json.schema.json`.
- Re-run `npm pack --json` locally and compare payload entries against expected managed assets.
- Check whether the smoke repo needs an `ARCHITECTURE.md` before `validate` runs.

### `release:verify` fails on Windows with `The system cannot find the path specified.`
- Check whether repository-local verification scripts are hardcoding `%APPDATA%\npm\npm.cmd` or `%APPDATA%\npm\npx.cmd`.
- Prefer invoking `npm.cmd` and `npx.cmd` through `cmd.exe` so Windows resolves them from `PATH`, which matches GitHub Actions `setup-node` behavior.
- Re-run `npm run release:verify` after the wrapper uses platform-native command resolution.

### `npm test` fails on Windows CI with a literal `*.test.js` path
- Avoid npm scripts that depend on shell glob expansion for test file selection.
- Prefer `node --test` so Node discovers tests directly across Windows and POSIX runners.
- If explicit targeting is required, pass concrete file paths instead of wildcard patterns.

### `validate --json` compatibility changes are needed
- Avoid silent breaking changes.
- Update `schemas/validate-json.schema.json`, tests, README, and compatibility policy together.
- If the payload shape changes incompatibly, treat it as a major-version concern or explicitly version the schema transition.

## Release Notes Expectations
Include these items when applicable:
- upgrade command guidance (`sync`, `sync --dry-run`, or none)
- migration summary
- compatibility-policy changes
- CI or automation guidance changes for `validate --json`

## Related
- [[plans/roadmap-phase-6-release-and-adoption-layer.md]]
- [[project-concept/release-and-compatibility-policy.md]]
- [[plans/npm-release-readiness.md]]
