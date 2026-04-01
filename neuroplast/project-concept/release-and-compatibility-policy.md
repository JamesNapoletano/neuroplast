# Neuroplast Release and Compatibility Policy
#project-concept

## Purpose
Define what Neuroplast treats as stable, how consumers should evaluate upgrades, and how maintainers should communicate release-impacting changes.

## Compatibility Policy

### Stable Within a Major Version
- CLI command names: `init`, `sync`, and `validate`
- The `/neuroplast/` root layout and required folder paths
- Root `ARCHITECTURE.md` as the canonical architecture artifact
- Core manifest document-role paths and required workflow files
- Non-destructive `init` behavior for existing files
- Non-destructive `sync` behavior for locally edited managed files
- `validate --json` top-level schema contract as documented in `schemas/validate-json.schema.json`

### May Evolve Within a Major Version
- Human-readable CLI log wording and formatting
- Additional warning or ok finding codes in validation output
- Bundled adapter wording and documentation-only environment guides
- New additive manifest metadata fields
- New optional bundled workflow extensions
- Additional managed package files that are introduced through compatible sync behavior

## Validate JSON Contract
- `npx neuroplast validate --json` is intended for CI and wrapper tooling.
- The stable machine-readable contract is versioned by `schemaVersion` in the JSON payload.
- Schema version `1` is documented in `schemas/validate-json.schema.json` and is treated as stable within the current major package version.
- Additive expansion is allowed only when it does not break the documented schema for the active major version.
- A future breaking change to the JSON payload shape must either:
  - ship in a new major version, or
  - introduce a new schema version with clear migration guidance before consumers are expected to depend on it.

## Deprecation Expectations
- Consumer-facing behavior should not be removed abruptly when a warning period is practical.
- If a contract-level behavior is being phased out, maintainers should:
  1. document the deprecation in README and release notes,
  2. explain the replacement path,
  3. preserve backward-compatible behavior for at least one release when practical.

## Migration Expectations
- Changes to managed assets must record a sync-impact decision in the active plan: `migration required` or `no migration needed`.
- If package-managed files or sync behavior change in a way older installs cannot safely absorb automatically, the release must include a migration in the same execution cycle.
- Upgrade notes should explain whether consumers need to run `npx neuroplast sync`, `npx neuroplast sync --dry-run`, or no follow-up command.

## Upgrade Notes Standard
Every release with user-visible workflow impact should document:
- what changed,
- whether any compatibility expectation changed,
- whether a migration was required,
- whether `sync` should be run,
- whether CI consumers of `validate --json` need to review schema-version guidance.

## Maintainer Boundary
- Repo-local maintainer workflow material such as `package-maintainer` remains outside the published package payload.
- Published compatibility commitments should stay focused on the shipped CLI, shipped managed assets, and documented file contract.

## Related
- [[plans/roadmap-phase-6-release-and-adoption-layer.md]]
- [[project-concept/migration-guide-1.1.1.md]]
- [[project-concept/neuroplast-product-maturity-roadmap.md]]
