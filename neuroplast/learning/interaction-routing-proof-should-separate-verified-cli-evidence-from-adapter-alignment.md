# Interaction Routing Proof Should Separate Verified CLI Evidence From Adapter Alignment
#learning

## Insight
Shared routing semantics can be genuinely portable before every adapter is independently proven. Trust stays higher when the repository distinguishes deterministic CLI/file-based evidence from adapter-guide alignment instead of implying equal verification everywhere.

## Reusable Practice
- Treat the file contract and CLI inspection seam as the primary proof surface.
- Mark adapter guides as documentation-only until maintainers rerun them as proof paths.
- Add new adapters as thin wrappers over the same routing contract, not as new evidence by default.
- Tie release checks to routing semantics, route JSON schema, and adapter drift review when the contract changes.

## Related
- [[project-concept/interaction-routing-compatibility-proof.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[learning/portability-claims-need-a-single-verified-path-before-broad-environment-coverage.md]]
