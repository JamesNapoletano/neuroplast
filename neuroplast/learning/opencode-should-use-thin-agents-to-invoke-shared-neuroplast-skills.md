# OpenCode Should Use Thin Agents to Invoke Shared Neuroplast Skills
#learning

## Insight
When a tool supports reusable skills but does not guarantee they run first, thin agents are a good reliability layer. They can invoke the shared bootstrap and routing skills without becoming a second workflow contract.

## Reusable Practice
- Keep the skills as the reusable execution surface.
- Add only a small number of thin agents whose job is to invoke those skills in the right order.
- Make the agent files defer to `neuroplast/WORKFLOW_CONTRACT.md`, `neuroplast/manifest.yaml`, `neuroplast/capabilities.yaml`, and `neuroplast/interaction-routing.yaml` instead of duplicating semantics.
- Prefer one default execution agent and one planning-first agent before adding narrower agent types.

## Related
- [[plans/opencode-neuroplast-agents.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-compatibility-proof.md]]
