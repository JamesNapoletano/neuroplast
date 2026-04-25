---
name: neuroplast-bootstrap
description: Load Neuroplast contract, manifest, capabilities, interaction routing, and active extensions before interpreting requests.
allowed-tools: Read, Glob, Grep
---

# Neuroplast Bootstrap Skill

Use this kebab-case OpenCode skill to establish the Neuroplast startup contract.

## Responsibilities
- Read `neuroplast/WORKFLOW_CONTRACT.md`, `neuroplast/manifest.yaml`, `neuroplast/capabilities.yaml`, and `neuroplast/interaction-routing.yaml` before interpreting requests.
- Read any active workflow extensions declared in `neuroplast/manifest.yaml`.
- Resolve the current instruction from explicit file requests, explicit step requests, or canonical routed phrases.

## Routing Rules
- `go ahead` / `continue` imply `neuroplast/act.md` only when a bounded active plan already exists; otherwise clarify.
- Prefer explicit instruction-file requests when possible.
- Preserve the canonical meanings from `neuroplast/interaction-routing.yaml` and do not invent adapter-local variants.
