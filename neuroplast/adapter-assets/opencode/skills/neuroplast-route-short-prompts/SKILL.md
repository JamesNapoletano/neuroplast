---
name: neuroplast-route-short-prompts
description: Apply canonical Neuroplast short-prompt routing from the interaction-routing artifact.
allowed-tools: Read, Glob, Grep
---

# Neuroplast Route Short Prompts Skill

Use this kebab-case OpenCode skill to apply canonical Neuroplast short-prompt routing.

## Rules
- Check `neuroplast/interaction-routing.yaml` before interpreting short prompts.
- `go ahead` / `continue` / related act phrases -> `neuroplast/act.md` if a bounded active plan exists in files or a usable bounded planner handoff exists in the active conversation.
- `plan this` / `reframe this` / related conceptualize phrases -> `neuroplast/conceptualize.md`.
- `what's next?` / related plan-inspection phrases -> inspect the current plan and summarize the next bounded step.
- If routing remains ambiguous, clarify instead of guessing.
