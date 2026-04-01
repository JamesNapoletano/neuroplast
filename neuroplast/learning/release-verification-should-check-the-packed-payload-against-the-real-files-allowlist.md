# Release Verification Should Check the Packed Payload Against the Real Files Allowlist
#learning

## Insight
Release smoke tests are more trustworthy when payload verification is derived from the actual shipped file allowlist instead of a hand-maintained expected list.

## Reusable Practice
- Build package payload expectations from the real published roots such as `bin/`, `src/`, `schemas/`, `README.md`, and `LICENSE`.
- Compare `npm pack --json` entries against that derived set so both missing and unexpected files are caught.
- Explicitly assert that repo-local maintainer-only assets stay out of the package payload.
- Run the same release verification entrypoint locally and in CI to avoid drift between maintainer and hosted checks.

## Related
- [[plans/roadmap-phase-6-release-and-adoption-layer.md]]
- [[project-concept/release-operations.md]]
- [[learning/npm-release-metadata-and-payload-checks.md]]
