# Roadmap Phase 1 - Reliability Hardening
#plan

**Created:** 2026-03-24
**Related to:** [[project-concept/neuroplast-product-maturity-roadmap.md]]
**Changelog:** [[project-concept/changelog/2026-03-24.md]]

## Overview
Add the automated verification foundation needed to change Neuroplast safely. This phase should reduce regression risk around `init`, `sync`, `validate`, migrations, and managed-file preservation.

## Dependencies
- Existing CLI behavior in `bin/neuroplast.js`
- Current packaging scripts in `package.json`

## Tasks

### 1. Establish a test harness
- [x] Choose a Node-native test approach that keeps package runtime dependencies minimal.
- [x] Create fixture repositories for clean init, upgraded installs, downgraded installs, and locally modified managed files.
- [x] Add helpers for temporary workspace setup and teardown.

### 2. Cover critical CLI behavior
- [x] Add tests for `init` default behavior.
- [x] Add tests for `init --with-obsidian`.
- [x] Add tests for `sync`, `sync --dry-run`, `sync --backup`, and downgrade handling.
- [x] Add tests for `validate` success and common failure cases.
- [x] Add tests for managed-file baseline adoption and local-edit preservation.

### 3. Add CI execution
- [x] Run the test suite in CI on supported Node versions.
- [x] Add at least one package smoke check that exercises the CLI in a temporary install.
- [x] Fail CI on regression in CLI behavior or validation output expectations.

## Success Criteria
- [x] Core CLI flows run under automated tests.
- [x] Managed-file safety behavior is verified by fixtures.
- [x] CI blocks regressions before release work continues.

## Execution Notes
- Node's built-in `node:test` runner was selected to preserve the package's no-runtime-dependencies design.
- Phase 1 fixtures are implemented as temporary repositories created by shared test helpers, with seeded state used for upgrade, downgrade, backup, baseline-adoption, and local-edit scenarios.
- CI now runs `npm test`, `npm run validate`, and a packed-package smoke install across supported Node versions.

## Risks
- The custom YAML/frontmatter parser may reveal edge cases once tested broadly.
- Fixture-heavy CLI tests may become noisy without shared helpers.

## Related Files
- `bin/neuroplast.js`
- `package.json`
- `test/cli-reliability.test.js`
- `test/helpers/cli-harness.js`
- `.github/workflows/ci.yml`
- [[plans/roadmap-phase-2-cli-maintainability.md]]
- [[project-concept/changelog/2026-03-24.md]]
