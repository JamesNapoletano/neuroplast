# Minor Version Release 1.3.0
#plan

**Created:** 2026-04-24
**Related to:** [[project-concept/release-operations.md]]

## Overview
Package the staged interaction-routing, adapter guidance, adapter bootstrap asset, and thin OpenCode agent work into the `1.3.0` minor release and sync the canonical version statement across release-facing docs and profile artifacts.

## Sync Impact Decision
- **Decision:** no migration needed
- **Reason:** the release adds managed files and additive validation/runtime behavior that existing installs can receive through normal `sync` refreshes without a dedicated migration step.

## Tasks

### 1. Bump package version
- [x] Update `package.json` from `1.2.3` to `1.3.0`.

### 2. Sync canonical version statements
- [x] Update the canonical human-readable version statement from `Neuroplast v1.2.3 implements LCP v1` to `Neuroplast v1.3.0 implements LCP v1` across current release-facing files.
- [x] Cover README, source profile code, source manifests, shipped `.lcp` profile artifacts, and LCP-facing docs.

### 3. Record the release
- [x] Add a new dated changelog entry for the `1.3.0` release packaging pass.
- [x] Link this plan from that changelog entry and update adjacent changelog navigation.

### 4. Verify
- [x] Run `npm test`.
- [x] Run `npm run validate`.
- [x] Run `npm run release:verify`.

## Verification
- `npm test`
- `npm run validate`
- `npm run release:verify`

## Assumptions
- The staged code and documentation changes are the intended scope for the `1.3.0` release commit.
- Historical references to `1.2.3` in prior plans, changelog entries, and sync state remain as release history rather than current version statements.

## Blockers
- None currently.

## Handoff Notes
- Exclude local `.obsidian` workspace-only changes from the release commit unless explicitly requested.
- After verification, create a release-oriented commit that explains why the minor bump is needed: new routing inspection and adapter bootstrap surfaces expand the package behavior beyond a patch-level doc sync.

## Verification Results
- `npm test` -> 35/35 passing
- `npm run validate` -> 94 checks, 0 warnings, 0 errors
- `npm run release:verify` -> passed

## Related
- [[plans/interaction-routing-phase-5-compatibility-proof-and-adoption.md]]
- [[plans/adapter-bootstrap-assets.md]]
- [[plans/opencode-neuroplast-agents.md]]
- [[project-concept/changelog/2026-04-24.md]]
