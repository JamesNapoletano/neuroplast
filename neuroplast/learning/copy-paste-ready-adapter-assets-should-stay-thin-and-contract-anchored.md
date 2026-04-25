# Copy-Paste-Ready Adapter Assets Should Stay Thin and Contract Anchored
#learning

## Insight
When a workflow wants better startup behavior across multiple AI tools, copy/paste-ready adapter assets can improve adoption without turning every adapter into a new execution authority. They stay trustworthy when they mirror likely destination formats but still defer all semantics to the shared workflow contract and routing artifact.

## Reusable Practice
- Keep one shared bootstrap asset as the semantic source for startup order and short-prompt routing.
- Generate destination-like wrappers such as `AGENTS.md`, `CLAUDE.md`, or tool-native skill files from that shared contract instead of duplicating behavior manually.
- Treat these assets as operational wrappers, not proof of equal runtime support or alternate routing authorities.
- Validate that the shared bootstrap asset still references the canonical contract, manifest, capabilities profile, interaction-routing artifact, and normal execution entrypoint.

## Related
- [[plans/adapter-bootstrap-assets.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-compatibility-proof.md]]
