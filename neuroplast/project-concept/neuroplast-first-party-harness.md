# Neuroplast First-Party Harness
#project-concept

## Overview
Define a first-party Neuroplast harness that can execute Neuroplast workflows without depending on OpenCode, Codex, Claude Code, or other adapter-owned harnesses.

## Problem Statement
Neuroplast already has a durable filesystem-first workflow contract, but the current execution experience still depends heavily on third-party tool surfaces and adapter guidance. That makes startup behavior, tool access, agent rules, and security boundaries partly dependent on vendor-specific runtime behavior rather than Neuroplast-owned enforcement.

## Direction
Build a Neuroplast-owned harness as an additive portability/runtime layer. The harness should load the existing Neuroplast and LCP contract, orchestrate first-party Neuroplast agents, support multiple model providers, broker MCP access safely, and present itself through a VS Code-compatible extension so it works across VS Code forks.

The chosen collaboration direction is a true shared live workspace, not only separate local clones with coordination hints. The harness should support multiple developers working in the same live workspace while reducing collisions through hybrid conflict controls.

## Product Boundary
- Keep `.lcp/` and `/neuroplast/` as the canonical source of truth.
- Treat the harness as the execution and orchestration surface, not a replacement workflow.
- Keep provider integration, agent orchestration, and tool brokering outside the core contract so Neuroplast remains model-agnostic and filesystem-first.

## Recommended Architecture
### Runtime Shape
- **Preferred shape:** VS Code extension plus local sidecar/runtime process.
- **Extension responsibilities:** chat and command UX, plan visibility, approvals, workspace integration, secret storage, and local operator controls.
- **Sidecar responsibilities:** provider adapters, policy enforcement, agent execution, MCP brokering, audit logging, higher-risk tool mediation, and shared-workspace coordination.

### Why This Shape
- It creates a cleaner trust boundary than an all-in-extension monolith.
- It reduces dependence on any single provider or editor chat runtime.
- It allows capability enforcement to live in code and policy, not only in prompt text.
- It gives Neuroplast a central local coordination boundary for live collaboration, reservations, presence, and synchronization.

## Major Subsystems
- **Bootstrap and routing engine** — loads `WORKFLOW_CONTRACT.md`, `manifest.yaml`, `capabilities.yaml`, `interaction-routing.yaml`, active extensions, and the current plan context before resolving work.
- **Provider abstraction layer** — normalizes multiple AI providers behind one capability model for chat, tool use, streaming, and structured outputs.
- **Neuroplast agent engine** — runs first-party agents with explicit capabilities, startup rules, and handoff contracts.
- **Policy and approval engine** — enforces allow/deny rules for tool use, file mutations, terminal commands, MCP servers, and network access.
- **MCP broker** — discovers servers, validates tool schemas, prompts for trust grants, and logs invocations.
- **LCP bridge layer** — reads and writes `.lcp/` and `/neuroplast/` artifacts without redefining protocol semantics.
- **Shared workspace coordinator** — manages live session state, developer presence, file/surface reservations, synchronization order, and conflict warnings.
- **Audit and session state layer** — records approvals, mutations, tool calls, and bounded session history.

## Shared Workspace Direction
### Collaboration Model
- The target model is a **shared live workspace** where multiple developers can work concurrently through the Neuroplast harness.
- The first-class goal is to minimize conflicts before they become git conflicts or silent overwrites.
- Live collaboration should cover actual file edits, not only plans, locks, or chat state.

### Conflict Strategy
- Use a **hybrid model**:
  - **hard reservations/locks** for high-risk surfaces such as active plan files, architecture artifacts, migration files, and other explicitly governed shared artifacts
  - **soft presence and edit-intent awareness** for lower-risk files so collaborators can see active work before colliding
- Reservations should be narrow, time-bounded, and auditable.
- The harness should surface who is editing what, who holds a reservation, and when a conflict-risk handoff is needed.

### Synchronization Direction
- The sidecar should coordinate live updates so multiple collaborators see the same current workspace state.
- Shared synchronization should preserve durable file-backed truth rather than move authority into transient chat or editor memory.
- The initial design should prefer deterministic synchronization and explicit reservation semantics over ambitious CRDT-style universal merging.

### Collaboration Security
- Live collaboration introduces new trust boundaries for identity, authorization, change attribution, and rollback.
- Shared workspace actions should be attributable to a user or approved agent.
- The system should separate read presence, edit intent, reservation rights, and mutation rights as distinct capabilities.

## Agent Model Direction
- Prefer **capability-based agents** over prompt-only agents.
- Every first-party agent should declare:
  - role
  - startup contract
  - allowed tools
  - permitted file scope
  - mutation policy
  - collaboration privileges
  - escalation or approval requirements
- Baseline roles should include:
  - planner (read-only)
  - orchestrator (bounded execution)
  - validator/reviewer
  - security-sensitive specialist roles only when capability grants are explicit

### Initial Capability Manifest Shape
The first useful agent manifest should be small, explicit, and runtime-enforced by the sidecar.

```yaml
agent:
  role: orchestrator
  startup_contract:
    - neuroplast/WORKFLOW_CONTRACT.md
    - neuroplast/manifest.yaml
    - neuroplast/capabilities.yaml
    - neuroplast/interaction-routing.yaml
  allowed_tools:
    - provider:chat
    - provider:structured-output
    - mcp:approved-tools-only
    - workspace:read
    - workspace:write-scoped
  file_scope:
    allow:
      - neuroplast/plans/**
      - neuroplast/project-concept/**
      - ARCHITECTURE.md
    deny:
      - secrets/**
  network_scope:
    - approved-provider-endpoints
    - approved-mcp-endpoints
  mutation_rights:
    - write_scoped_files
  collaboration_rights:
    - presence:view
    - intent:announce
    - reservation:acquire
    - edit:apply
    - sync:publish
  approval_requirements:
    terminal: explicit
    broad_write: explicit
    new_mcp_server: explicit
  audit_tags:
    - execution
    - workspace-mutation
```

The planner equivalent should omit mutation and reservation rights entirely.

## Collaboration Permission Model
- Separate these permissions instead of collapsing them into one "write" concept:
  - **presence** — see who is active
  - **intent** — announce planned edits
  - **reservation** — claim a governed artifact or protected file surface
  - **edit** — apply a file change
  - **publish** — make coordinated live updates visible to other collaborators
  - **override** — break or transfer reservations under explicit policy
  - **admin** — perform recovery actions on collaboration state
- Human operators should hold the top recovery authority; agents should only get the minimum subset needed for their role.

## Initial Reservation Policy
- **Hard reservation required on day one:**
  - active plan file referenced by `neuroplast/plans/.active-plan`
  - `ARCHITECTURE.md`
  - migration files
  - shared workflow/governed artifacts explicitly marked as single-writer surfaces
- **Soft coordination on day one:**
  - most application code files
  - documentation files outside governed shared-memory surfaces
- Reservations should have:
  - owner identity
  - scope
  - acquisition time
  - expiry/lease time
  - renewal history
  - override reason when broken

## Live Synchronization Model
- The sidecar should coordinate publish order and workspace event sequencing.
- Presence and reservation state may be live and ephemeral, but durable project state still lives in repository files.
- Live updates should be attributed to a human user or approved agent identity.
- When two edit streams cannot be safely serialized, the harness should stop automatic forward progress and direct the session into explicit conflict reconciliation.

## MCP and LCP Role Separation
- **LCP** remains the semantic and workflow-alignment layer.
- **Neuroplast** remains the repository-local implementation and durable project mind.
- **MCP** should be treated as a transport for tools and resources, not as a workflow authority.
- The harness should never allow MCP tools or provider behavior to silently override Neuroplast contract boundaries.

## VS Code Extension Direction
- Use standard VS Code extension APIs so the harness can run in VS Code forks.
- Distribute through VSIX/OpenVSX-friendly packaging rather than proprietary editor-only channels.
- Prefer command palette actions, tree views, chat panels, and minimal webview usage.
- Avoid provider-specific editor APIs that would make the harness non-portable.

## Security Direction
### Core Principles
- Default deny for tool use, terminal execution, file mutation, network access, and MCP calls.
- Capability isolation per agent role.
- Explicit human approval for higher-risk actions.
- Secrets stored only in secure local secret storage or OS keychain-backed surfaces.
- Auditable local event logs for approvals, tool calls, and mutations.
- Shared workspace permissions should separate presence, reservation, edit, and administrative override rights.

### Required Hardening Areas
- Separate trusted Neuroplast instructions from untrusted workspace and tool output.
- Treat model output as untrusted until validated against policy and schemas.
- Require per-server and per-tool trust grants for MCP.
- Use strict schema validation and response normalization at provider boundaries.
- Harden webviews with strict CSP and avoid unsafe dynamic execution.
- Keep dependencies minimal and verify them continuously.
- Protect collaboration state against unauthorized lock acquisition, spoofed identity, stale session takeovers, and lost-update races.

### Security Outcome Goal
The harness should aim for a security-first, testable, least-privilege architecture rather than an unrealistic claim of perfect invulnerability.

## MVP Direction
1. VS Code-compatible extension shell.
2. Local runtime/sidecar with provider abstraction.
3. Bootstrap + routing engine grounded in Neuroplast files.
4. Planner and orchestrator as first-party capability-based agents.
5. Shared workspace coordinator with presence, reservations, and live synchronization for file edits.
6. MCP broker with approval gates and audit logging.
7. Local policy engine for tools, files, network, terminal execution, and collaboration rights.
8. Security verification suite covering prompt injection, secret handling, permission bypass, hostile MCP tools, live-collaboration race conditions, and audit integrity.

## Non-Goals
- Build a cloud-dependent orchestration service as the default path.
- Make the harness a new normative protocol separate from LCP.
- Replace the portable filesystem contract with editor-only state.
- Overclaim security without continuous verification evidence.

## Open Questions
- What is the smallest useful capability manifest for Neuroplast-owned agents?
- Which actions, if any, should be allowed without explicit confirmation?
- Should MCP support be built in directly or provided through a plugin registration model?
- Which file classes should require hard reservations on day one?
- How should shared identity and session trust be established inside a live workspace?

## Success Criteria
- Neuroplast can run with its own first-party harness instead of depending on third-party harness behavior.
- Multiple model providers can be swapped without changing the Neuroplast workflow contract.
- MCP access is bounded, approval-gated, and auditable.
- The extension works across VS Code-compatible environments.
- Security enforcement depends on runtime policy and capability boundaries, not only on prompt wording.
- Multiple developers can collaborate in one live Neuroplast workspace with visible presence, controlled reservations, and materially fewer conflicting edits.

## Related
- [[plans/neuroplast-first-party-harness.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[project-concept/lcp-alignment-implementation-model.md]]
- [[ARCHITECTURE]]
