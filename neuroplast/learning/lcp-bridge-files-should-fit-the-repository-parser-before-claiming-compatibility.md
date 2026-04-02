# LCP Bridge Files Should Fit the Repository Parser Before Claiming Compatibility
#learning

## Insight
When introducing a standards-alignment bridge into an existing repository, the bridge documents must fit the implementation's actual parser and validator constraints. A formally plausible format is not enough if the local loader cannot parse it.

## Reusable Practice
- Validate new compatibility artifacts against the repository's real parser, not only against the intended external standard shape.
- When an implementation uses a deliberately limited parser, prefer a bridge format that is locally robust and clearly documented over a richer format that cannot yet be consumed safely.
- Separate protocol-facing bridge validation from implementation-profile validation so failures are easier to localize.

## Related
- [[plans/lcp-alignment-and-dual-layout-compatibility.md]]
- [[project-concept/changelog/2026-04-02.md]]
