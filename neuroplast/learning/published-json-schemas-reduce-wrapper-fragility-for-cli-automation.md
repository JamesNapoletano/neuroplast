# Published JSON Schemas Reduce Wrapper Fragility For CLI Automation
#learning

## Insight
Machine-readable CLI modes become more trustworthy when the repository publishes schema artifacts for each payload and tests the implementation against the documented top-level contract.

## Reusable Practice
- Publish a schema file for every supported JSON command mode, not only the oldest automation endpoint.
- Treat missing `code` or `remediation` fields in validation findings as contract bugs, even if human-readable output still looks acceptable.
- Add black-box tests that assert documented payload keys so wrapper regressions are caught before release.
- Keep schema documentation in README and architecture notes so automation consumers do not need to reverse-engineer payloads from examples.

## Related
- [[plans/json-schema-contract-hardening.md]]
- [[project-concept/changelog/2026-04-12.md]]
