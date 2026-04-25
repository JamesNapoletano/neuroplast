# Neuroplast Working Files

This folder is the installed day-to-day Neuroplast working surface inside a repository.

If you open `/neuroplast/` and want to know what to do next, start here.

The package root `README.md` explains Neuroplast as a product. This README explains how to use the installed `/neuroplast/` files in practice.

## Fast Start
- Human: read this file, then open `WORKFLOW_CONTRACT.md` and the step file you need.
- AI system: load `WORKFLOW_CONTRACT.md`, `manifest.yaml`, `capabilities.yaml`, `interaction-routing.yaml`, and any active extensions before acting.
- Everyone: treat `project-concept/`, `plans/`, `project-concept/changelog/`, and `learning/` as the shared memory surface.

## Open These First
- `WORKFLOW_CONTRACT.md` — canonical workflow contract
- `manifest.yaml` — machine-readable map of the workflow layout
- `capabilities.yaml` — environment capability profile and graceful degradation guidance
- `interaction-routing.yaml` — canonical short-prompt routing rules
- Any active extensions declared in `manifest.yaml`
- The current step file you actually need to use

If you are an AI system, treat the files above as the startup contract before acting. If you are a human scanning the folder, use them to confirm how this repository wants work to be performed and recorded.

## Choose the Right Starting File
- `act.md` — normal bounded execution once the project mind already has enough context
- `conceptualize.md` — new work, ambiguous work, or major reframing
- `reverse-engineering.md` — reconstruct project context from an existing repository before normal execution
- `reconcile-conflicts.md` — resolve merge conflicts or competing edits before continuing normal work

## First Practical Loop
1. Run `npx neuroplast init` in the repository if the files are not already present.
2. Read the contract, manifest, capability profile, routing file, and any active extensions.
3. Review the root `ARCHITECTURE.md`.
4. Add or update one concept artifact under `project-concept/`.
5. Create or update one active plan under `plans/`.
6. Execute one bounded step through `act.md`.
7. Record the result in `project-concept/changelog/` and reusable lessons in `learning/`.
8. Run `npx neuroplast validate`.

## Common Prompt Meanings
- `go ahead` / `continue` — continue through `act.md` only if a bounded active plan already exists
- `plan this` / `reframe this` — use `conceptualize.md`
- `what's next?` — inspect the current plan and summarize the next bounded step

When possible, prefer explicit file requests like `use neuroplast/act.md` over short prompts.

## Durable Memory Surface
- `project-concept/` — durable project understanding and orientation
- `plans/` — active objective, scope, blockers, and handoff state
- `project-concept/changelog/` — dated history of completed work cycles
- `learning/` — reusable, non-sensitive lessons

These folders are not just storage. They are the durable shared memory that lets humans and AI systems resume work safely across sessions.

## Extra Installed Folders
- `adapters/` — documentation-only environment guides
- `adapter-assets/` — copy/paste-ready tool-facing bootstrap assets
- `extensions/` — bundled additive workflow extensions
- `local-extensions/` — optional repo-local extensions when a repository creates them

## Keeping the Files Current
- Run `npx neuroplast validate` to check the installed contract and metadata.
- Run `npx neuroplast sync` after package updates to refresh managed files without overwriting local edits.
