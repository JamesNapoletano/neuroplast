# Cross-Platform NPM Test Scripts Should Avoid Shell Glob Expansion
#learning

## Insight
An npm test command that relies on shell wildcard expansion can pass on POSIX runners and fail on Windows when the wildcard is forwarded as a literal file path.

## Reusable Practice
- Prefer `node --test` for Node's built-in test discovery when the repository layout already follows default test locations.
- If explicit test selection is needed, pass concrete file paths rather than wildcard patterns that depend on the invoking shell.
- Keep release verification entrypoints aligned with the same cross-platform command used in CI.

## Related
- [[plans/windows-ci-test-discovery-fix.md]]
- [[project-concept/release-operations.md]]
- [[learning/release-verification-should-check-the-packed-payload-against-the-real-files-allowlist.md]]
