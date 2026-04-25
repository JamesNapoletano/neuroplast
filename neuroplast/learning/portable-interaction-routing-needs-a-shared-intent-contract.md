# Portable Interaction Routing Needs a Shared Intent Contract
#learning

## Insight
Short prompts like `go ahead` feel universal to operators, but they are not universal runtime commands. Cross-adapter consistency only becomes realistic when the repository defines a shared phrase-to-intent contract before any adapter-specific automation tries to make those prompts feel seamless.

## Reusable Practice
- Define natural-language routing at the shared contract layer, not inside adapter guides.
- Keep explicit step files and workflow metadata authoritative for execution.
- Resolve explicit file references and explicit step names before any natural-language aliasing.
- Treat `go ahead`-style prompts as permission to execute only when a bounded active objective already exists.
- Treat adapters as loaders and explainers of shared routing semantics, not owners of them.
- Let extensions add bounded phrase overlays only when they cannot override canonical intent meanings.
- Add a narrow CLI seam only after the routing contract is stable enough to validate and test.

## Related
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-canonical-contract.md]]
- [[plans/interaction-routing-phase-1-canonical-contract.md]]
- [[plans/interaction-routing-phase-2-manifest-and-extension-shape.md]]
- [[learning/adapters-should-explicitly-separate-guidance-from-execution.md]]
- [[learning/active-extensions-should-load-by-step-not-by-memory.md]]
