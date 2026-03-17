# NPM Packaging Learning: Prefer Explicit Init CLI Over Postinstall
#learning

## Insight
For scaffold-style packages that create files in host repositories, an explicit CLI command (`npx <package> init`) is more predictable than `postinstall` hooks.

## Reusable Practice
- Use a `bin` entrypoint for initialization logic and keep behavior explicit.
- Resolve host project root via `INIT_CWD` fallback to `process.cwd()` for compatibility with npm invocation contexts.
- Keep initialization non-destructive by default: skip existing files and log every skip/create action.
- Put installable templates under `src/` and control publish payload via `package.json#files`.
- Treat machine-specific files (like `.obsidian/workspace.json`) as opt-in, not default.

## Related
- [[plans/npm-package-implementation.md]]
- [[project-concept/changelog/2026-03-13.md]]
- [[learning/path-standardization.md]]
