---
name: neuroplast-execute-act
description: Execute bounded work after Neuroplast routing resolves to act.md.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Neuroplast Execute Act Skill

Use this kebab-case OpenCode skill when the current request resolves to `neuroplast/act.md`.

## Rules
- Confirm the Neuroplast bootstrap has already loaded the contract, manifest, capabilities, interaction-routing artifact, and active extensions.
- Use `neuroplast/act.md` as the execution contract for bounded work.
- Keep the current plan, changelog, concept consistency, and learning updates in sync with the execution.
