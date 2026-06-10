# Neuroplast First-Party Harness
#plan

**Created:** 2026-05-18
**Related to:** [[project-concept/neuroplast-first-party-harness.md]]
**Changelog:** [[project-concept/changelog/2026-05-18.md]]

## Current Objective
- Persist a durable Neuroplast direction for a first-party harness that can replace adapter-dependent execution surfaces with a Neuroplast-owned runtime and VS Code extension strategy.

## Scope
- Capture the harness product boundary, architecture direction, and security posture in durable Neuroplast concept files.
- Define the recommended runtime shape for multi-provider support, first-party agents, MCP access, and LCP alignment.
- Define the shared live workspace direction for multi-developer collaboration with conflict-minimizing coordination.
- Update the canonical architecture artifact so the harness is described as a future portability layer without overstating implementation status.
- Record changelog and reusable learning updates for this planning-and-direction execution cycle.

## Non-Goals
- Do not implement the harness runtime, VS Code extension, or provider integrations in this cycle.
- Do not redefine the canonical Neuroplast workflow contract or move authority out of `/neuroplast/` and `.lcp/`.
- Do not promise absolute vulnerability elimination; instead define a security-first architecture and verification stance.

## Assumptions
- Neuroplast should remain filesystem-first, model-agnostic, and LCP-aligned even if it gains a first-party harness.
- A first-party harness should productize contract execution and orchestration, not create a second workflow contract.
- The best initial form is a VS Code-compatible extension backed by a local sidecar/runtime boundary rather than an editor-only prompt wrapper.
- The collaboration model should target a real shared live workspace rather than coordination across isolated local clones.
- Conflict reduction should use a hybrid model: hard reservations for high-risk work surfaces and soft presence awareness elsewhere.
- The live-sharing goal includes actual file edits, not only plan state or approvals.

## Sync Impact Decision
- no migration needed

## Reason
- This cycle changes repository planning, concept, learning, and architecture documentation only. It does not add or alter package-managed installed assets that require migration behavior.

## Execution Steps
1. - [x] Persist the conversational brainstorming handoff into a bounded active plan.
2. - [x] Create a project-concept artifact describing the harness problem, direction, architecture, and security model.
3. - [x] Update `ARCHITECTURE.md` so the future harness direction is reflected as an additive portability/runtime layer.
4. - [x] Update active-plan continuity artifacts for resumable follow-up work.
5. - [x] Record the execution cycle in the daily changelog and capture reusable learning notes.
6. - [x] Choose the implementation boundary between extension-only and extension-plus-sidecar with explicit trade-off acceptance.
7. - [x] Choose the collaboration model as a real shared live workspace with hybrid conflict controls.
8. - [x] Define the first capability-manifest shape for Neuroplast-owned agents, tools, approvals, trust boundaries, and collaboration privileges.
9. - [ ] Plan an MVP slice for provider abstraction, MCP brokering, local execution policy, shared-workspace synchronization, and VS Code extension packaging.

## Capability Manifest Direction
- The first manifest should be runtime-enforced and sidecar-owned, not prompt-only.
- Each agent manifest should declare:
  - `role`
  - `startup_contract`
  - `allowed_tools`
  - `file_scope`
  - `network_scope`
  - `mutation_rights`
  - `collaboration_rights`
  - `approval_requirements`
  - `audit_tags`
- The minimum first-class collaboration rights should be:
  - `presence:view`
  - `intent:announce`
  - `reservation:acquire`
  - `reservation:override`
  - `edit:apply`
  - `sync:publish`
  - `session:admin`

## Initial Role Policy
- **planner** — read-only, can view presence and announce intent, cannot acquire write reservations or apply edits.
- **orchestrator** — bounded execution, can request reservations and apply edits only within approved file scope.
- **reviewer/validator** — read-only by default, may publish review metadata but not mutate governed project files.
- **admin/operator override** — reserved for explicit human-approved recovery flows such as stale lock cleanup or emergency handoff.

## Reservation Policy Direction
- Require hard reservations for active plan files, `ARCHITECTURE.md`, migration files, and other explicitly governed shared artifacts.
- Allow soft presence plus edit-intent warnings for most ordinary code files.
- Make reservations narrow, expiring, renewable, attributable, and visible in the shared workspace.
- Require explicit override logging when a reservation is broken or superseded.

## Synchronization Direction
- Prefer deterministic sidecar-coordinated publish order over optimistic always-merge semantics.
- Treat live collaboration state as operational metadata; durable file content remains the repository truth.
- Route already-conflicting or contested edits into `neuroplast/reconcile-conflicts.md` rather than pretending they merged cleanly.

## Verification
- [x] A new durable plan exists under `/neuroplast/plans/` for the first-party harness direction.
- [x] A matching concept note exists under `/neuroplast/project-concept/`.
- [x] `ARCHITECTURE.md` documents the harness as a future additive portability/runtime direction.
- [x] Changelog and learning artifacts capture this execution cycle.
- [x] `npm run validate` passes after the documentation updates.

## Risks
- A harness can drift into editor-specific orchestration unless the filesystem contract remains the authority.
- A prompt-defined agent model would create weak security boundaries unless capabilities are enforced in runtime policy.
- MCP access creates a large trust surface unless servers, tools, and network/file privileges are explicitly brokered and audited.
- Real-time shared file editing greatly increases concurrency, consistency, and authorization complexity.
- Poorly scoped reservations could either fail to prevent conflicts or become so strict that collaboration feels blocked.

## Handoff
- Recommended next bounded step: plan the first implementation slice for sidecar capability enforcement, reservation lifecycle management, live sync publishing, and extension UX for presence/approvals.

## Related
- [[project-concept/neuroplast-first-party-harness.md]]
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/neuroplast-portability-plan-v2.md]]
- [[project-concept/lcp-alignment-implementation-model.md]]
- [[learning/first-party-harnesses-should-productize-contract-execution-without-replacing-the-contract.md]]
- [[learning/secure-ai-harnesses-need-capability-enforcement-not-prompt-only-rules.md]]
- [[learning/collaboration-capabilities-should-separate-presence-reservation-and-mutation-rights.md]]
