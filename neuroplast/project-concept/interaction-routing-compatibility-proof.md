# Interaction Routing Compatibility Proof
#project-concept

## Overview
Document the current evidence boundary for Neuroplast interaction routing and provide maintainers and consuming repositories with a concrete adoption model that does not overclaim equal proof across every adapter.

## Current Proof Boundary

### Actively Verified Path
- **Terminal-only** is the current actively verified interaction-routing proof path.
- Evidence includes:
  - `neuroplast/interaction-routing.yaml` shipped as a managed workflow artifact
  - `neuroplast route <phrase>` for deterministic phrase inspection
  - `neuroplast validate` checks for routing artifact integrity and protected-phrase safety
  - black-box CLI tests covering routed `act`, routed `conceptualize`, clarify fallback, missing routing artifacts, and protected-phrase override rejection

### Documentation-Only Paths
- OpenCode
- Claude Code
- Cursor
- Codex CLI
- Windsurf
- VS Code + Copilot

These paths are aligned to the same routing contract, but they are not yet maintained as independently rerun proof paths.

### Copy/Paste-Ready Bootstrap Assets
- Codex now has a destination-like `neuroplast/adapter-assets/codex/AGENTS.md` wrapper.
- Claude Code now has a destination-like `neuroplast/adapter-assets/claude-code/CLAUDE.md` wrapper.
 - OpenCode now has kebab-case skill assets under `neuroplast/adapter-assets/opencode/skills/<skill-name>/SKILL.md`.
- OpenCode now also has thin agent wrappers under `neuroplast/adapter-assets/opencode/agents/` for `neuroplast-orchestrator` and `neuroplast-planner`.

These assets are operational wrappers for easy adoption, not independently verified proof paths or alternate routing authorities.

## What Is Actually Proven Today
- The canonical phrase-routing model is stable enough to inspect from files and CLI alone.
- Shared phrases like `go ahead`, `continue`, `plan this`, and `what's next?` have one documented meaning across bundled adapters.
- Extension overlays cannot override protected canonical phrases without validation failure.
- Wrapper tooling can inspect route decisions through `route --json` without scraping adapter-specific chat behavior.

## What Is Not Yet Proven
- That every documented adapter auto-loads routing context in the same frictionless way.
- That every adapter runtime exposes identical permissions, startup prompts, or conversation-state behavior.
- That documentation-only adapter guides have been rerun as maintained first-loop proof paths.

## Maintainer Adoption Guidance
- Treat the terminal-only path plus `neuroplast route` as the canonical verification baseline.
- Keep adapter guides thin and contract-aligned; do not let them become behavior forks.
- When a new adapter is added, copy the shared routing expectations and only change capability notes, startup UX, and limitations.
- Do not upgrade an adapter from documentation-only to actively verified until maintainers rerun and document a real proof path.
- When routing semantics, protected phrases, or route JSON output change, rerun `npm test`, `npm run validate`, and review adapter docs for drift before release.

## Consumer Adoption Guidance
- Prefer explicit step or file requests when integrating Neuroplast into another tool.
- Use the copy/paste-ready assets under `neuroplast/adapter-assets/` when you want destination-like bootstrap material for Codex, Claude Code, or OpenCode.
- For OpenCode specifically, prefer the thin agent wrappers so the bootstrap and routing skills are invoked reliably.
- Use `npx neuroplast route "<phrase>" --json` if your wrapper needs deterministic phrase inspection.
- Avoid extension overlays unless you truly need repo-local phrases.
- Never redefine protected canonical phrases in extension overlays.
- Expect graceful fallback to clarification when a routed `act` phrase has no bounded active objective.

## Compatibility Expectations
- Stable within the current major version:
  - canonical protected phrase meanings
  - existence and role of `neuroplast/interaction-routing.yaml`
  - the presence of `neuroplast route` as a narrow inspection seam
  - `route --json` schema contract for the active `schemaVersion`
- May evolve additively within the current major version:
  - more documentation-only adapter guides
  - more examples and adoption notes
  - additional non-protected extension overlay guidance

## Related
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[plans/interaction-routing-phase-5-compatibility-proof-and-adoption.md]]
- [[learning/portability-claims-need-a-single-verified-path-before-broad-environment-coverage.md]]
