# Secure AI Harnesses Need Capability Enforcement Not Prompt-Only Rules
#learning

## Insight
Prompt instructions can explain safety boundaries, but they are not enough to enforce them. A secure AI harness needs runtime capability enforcement, approval gates, least-privilege tool access, and auditable policy decisions.

## Reusable Practice
- Define per-agent capabilities for files, tools, network, and mutation rights.
- Require explicit approval for high-risk actions such as terminal execution, broad file writes, or new MCP trust grants.
- Treat model output, MCP output, and external content as untrusted until validated.
- Put security guarantees in runtime policy and tests, not only in agent wording.

## Related
- [[plans/neuroplast-first-party-harness.md]]
- [[project-concept/neuroplast-first-party-harness.md]]
- [[learning/planning-only-agents-need-an-explicit-stop-boundary.md]]
