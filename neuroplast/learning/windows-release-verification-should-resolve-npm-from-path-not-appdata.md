# Windows Release Verification Should Resolve NPM From PATH, Not APPDATA
#learning

## Insight
Windows automation should not assume `npm.cmd` and `npx.cmd` live under `%APPDATA%\npm`, because GitHub Actions and other Node installs may expose them through `PATH` from a different location such as `C:\Program Files\nodejs`.

## Reusable Practice
- When wrapping `npm` or `npx` manually on Windows, invoke `cmd.exe /c npm.cmd ...` or `npx.cmd ...` and let the platform command search path resolve the executable.
- Avoid constructing Windows npm wrapper paths from `%APPDATA%` unless the tool specifically guarantees that install layout.
- Keep repository-local verification wrappers aligned with how `actions/setup-node` exposes Node tooling in CI.

## Related
- [[plans/windows-ci-release-verify-command-resolution-fix.md]]
- [[project-concept/release-operations.md]]
- [[project-concept/changelog/2026-04-01.md]]
