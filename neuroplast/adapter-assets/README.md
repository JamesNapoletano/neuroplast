# Neuroplast Adapter Assets

These files are copy/paste-ready operational assets for AI tools that support startup prompts, shared skills, or repository-local agent instructions.

## Purpose
- Keep `neuroplast/interaction-routing.yaml` as the canonical routing contract.
- Provide destination-like files that developers can copy into tool-specific locations without inventing adapter-local behavior.
- Keep `neuroplast/adapters/` as explanatory guidance while `neuroplast/adapter-assets/` serves as the operational copy/paste surface.

## Structure
- `shared/neuroplast-bootstrap.md` — canonical startup and routing bootstrap shared by all adapter assets.
- `codex/AGENTS.md` — copy/paste-ready Codex-style repository instruction asset.
- `claude-code/CLAUDE.md` — copy/paste-ready Claude Code project instruction asset.
- `opencode/skills/<skill-name>/SKILL.md` — copy/paste-ready OpenCode skills using the folder-per-skill layout.
- `opencode/agents/*.md` — thin OpenCode agents that invoke the Neuroplast skills reliably.

## Usage
1. Choose the asset matching your tool.
2. Copy its contents into the tool's preferred repository-local or user-local destination.
3. Re-copy after Neuroplast routing or workflow startup behavior changes.

## Rules
- These assets must not redefine workflow phases, file structure, or artifact roles.
- They must load `neuroplast/WORKFLOW_CONTRACT.md`, `neuroplast/manifest.yaml`, `neuroplast/capabilities.yaml`, and `neuroplast/interaction-routing.yaml` before resolving short prompts.
- They must preserve the canonical `go ahead` / `continue` behavior: route to `neuroplast/act.md` only when a bounded active plan already exists; otherwise clarify.
