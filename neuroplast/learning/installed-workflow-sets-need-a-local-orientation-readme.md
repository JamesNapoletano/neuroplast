# Installed Workflow Sets Need A Local Orientation README
#learning

## Insight
When a package deposits a whole working folder into consumer repositories, the package-level README is not enough for people who open the installed folder first.

## Why It Matters
Users and AI tools often encounter the installed `/neuroplast/` directory before they revisit the package repository. A short local README reduces startup friction and makes the correct entrypoints, durable-memory folders, and maintenance commands obvious in context.

## Reusable Practice
- Add a concise local README at the root of any installed workflow surface that is meant to be used directly inside consumer repositories.
- Keep that README practical: what to open first, which entrypoint to choose, where durable state lives, and which commands keep the installed files healthy.
- Treat the local README as a convenience orientation layer, not as a replacement for the canonical contract artifacts.

## Related
- [[neuroplast/README.md]]
- [[README.md]]
- [[plans/installed-neuroplast-readme-practicality.md]]
