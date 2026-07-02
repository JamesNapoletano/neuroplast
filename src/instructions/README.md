# Neuroplast Working Files

This folder is the day-to-day working area for Neuroplast inside a repository.

If you are a person opening `/neuroplast/` and wondering how to use it, start here.

Neuroplast helps you and an AI keep the project's context, plans, decisions, and progress in the repo instead of only in chat or memory.

## Start Here as a Human
1. Read `current-context.md` if it exists.
2. Check `plans/` to see what is active.
3. Open `ARCHITECTURE.md` if you need the bigger picture.
4. Choose the step file that matches what you are doing next.

If you only remember one idea, remember this: `project-concept/`, `plans/`, `project-concept/changelog/`, and `.lcp/knowledge/neuroplast-learning.yaml` are the shared memory of the project.

## Which File Should I Use?
- `act.md` — use this when the work is already understood and you are ready to do the next bounded step.
- `conceptualize.md` — use this when the work is new, unclear, or needs reframing before execution.
- `reverse-engineering.md` — use this when the repo already exists but the project mind needs to be rebuilt from what is actually in the repository.
- `reconcile-conflicts.md` — use this when there are merge conflicts or competing edits that need to be resolved before normal work continues.

## How People Usually Use Neuroplast

### When starting work
- Read `current-context.md` if present.
- Check the active plan in `plans/`.
- Read `ARCHITECTURE.md` or the most relevant concept note if you need orientation.

### When planning something new
- Start with `conceptualize.md`.
- Capture the idea clearly in `project-concept/`.
- Turn it into a bounded active plan in `plans/`.

### When continuing existing work
- Start with the current plan.
- Use `act.md` to execute the next bounded step.
- Keep the plan updated as you go.

### When finishing a task
- Record what changed in `project-concept/changelog/`.
- Capture reusable lessons with `npx neuroplast remember` (writes to `.lcp/knowledge/neuroplast-learning.yaml`).
- Run `npx neuroplast validate`.

## First Practical Loop
1. Run `npx neuroplast init` if these files are not installed yet.
2. Read this README, then `current-context.md` if present.
3. Review the root `ARCHITECTURE.md`.
4. Decide whether you need to conceptualize, act, reverse-engineer, or reconcile conflicts.
5. Add or update project understanding in `project-concept/`.
6. Create or update the active plan in `plans/`.
7. Execute one bounded step.
8. Record the result in the changelog and capture any reusable learning.
9. Run `npx neuroplast validate`.

## What the Main Folders Are For
- `current-context.md` — a quick snapshot of the current objective, if the repo uses it
- `project-concept/` — durable understanding of what the project is and why it works the way it does
- `plans/` — the active objective, scope, blockers, and handoff state
- `project-concept/changelog/` — dated history of completed work
- `.lcp/knowledge/neuroplast-learning.yaml` — reusable, non-sensitive lessons from previous work, as durable LCP memory (no separate `learning/` folder)

These folders are not just storage. They are how people and AI systems pick work back up without guessing.

## Common Prompt Meanings
- `go ahead` / `continue` — continue through `act.md` only if a bounded active plan already exists
- `plan this` / `reframe this` — use `conceptualize.md`
- `what's next?` — inspect the current plan and summarize the next bounded step

When possible, prefer explicit requests like `use neuroplast/act.md` over short prompts.

## AI Startup Contract
If you are an AI system, load these before acting:
- `WORKFLOW_CONTRACT.md`
- `manifest.yaml`
- `capabilities.yaml`
- `interaction-routing.yaml`
- `current-context.md` if present
- any active extensions declared in `manifest.yaml`
- the step file you actually need to use

## Advisory Context Depths
- **lean** — mandatory startup contract + `current-context.md` + active plan + current step file
- **standard** — `lean` + `ARCHITECTURE.md` + the most relevant concept note or recent changelog entry
- **deep** — `standard` + broader concept, learning, and adjacent plan context for reframing or higher-risk work

Use the smallest depth that still lets the human or AI act safely.

## Extra Installed Folders
- `adapters/` — documentation-only environment guides
- `adapter-assets/` — copy/paste-ready tool-facing bootstrap assets
- `extensions/` — bundled additive workflow extensions
- `local-extensions/` — optional repo-local extensions when a repository creates them

## Keeping the Files Current
- Run `npx neuroplast validate` to check the installed contract and metadata.
- Run `npx neuroplast sync` after package updates to refresh managed files without overwriting local edits.
