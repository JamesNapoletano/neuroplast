# Neuroplast

An Obsidian-based workflow vault for AI-assisted product planning, architecture design, execution, changelog tracking, and continuous learning notes.

## What This Repository Is

This repository contains instruction files that guide an AI agent through a repeatable process:

1. Conceptualize a project
2. Produce architecture/planning artifacts
3. Execute implementation steps
4. Record changelog updates
5. Capture reusable lessons learned

It is set up as a knowledge/workflow system rather than a traditional code application.

## Current Repository Contents

- `conceptualize.md` — entry point for concept/planning behavior
- `PLANNING_INSTRUCTIONS.md` — detailed architecture planning format (high/mid/low layers)
- `act.md` — execution sequence instructions
- `CONCEPT_INSTRUCTIONS.md` — when to update architecture/concept docs
- `CHANGELOG_INSTRUCTIONS.md` — daily changelog process and linking rules
- `think.md` — learning capture rules for `/brain/learning`
- `.obsidian/` — Obsidian workspace and theme configuration
- `.gitignore` — currently ignores `.obsidian/workspace.json`

## Intended Folder Structure (Created During Workflow)

The instruction files reference these folders, which are expected to be created as part of the process:

- `/brain/project-concept/`
- `/brain/project-concept/changelog/`
- `/brain/learning/`
- `/brain/plans/`

## Workflow Overview

### 1) Conceptualization

Start from `conceptualize.md`, which points to planning rules in `PLANNING_INSTRUCTIONS.md`.

### 2) Planning Outputs

Generate layered planning documents:

- Per-page high-level specs
- Per-page mid-level architecture
- One global tech stack architecture file

Use Obsidian wiki-links (`[[File Name]]`) to connect documents.

### 3) Execution

Follow `act.md` in order:

- Read project concept artifacts
- Ensure `ARCHITECTURE.md` exists in the repository root
- Create a plan in `/brain/plans/`
- Execute plan with references to `/brain/learning/`
- Run concept/changelog/think instructions

### 4) Changelog Discipline

`CHANGELOG_INSTRUCTIONS.md` expects date-based changelog files (`YYYY-MM-DD.md`) under `/brain/project-concept/changelog/` with links to associated plans.

### 5) Learning Capture

`think.md` defines how to store non-sensitive lessons in `/brain/learning` by category.

## Prerequisites

- [Obsidian](https://obsidian.md/) recommended for wiki-link navigation and graph-based note workflow
- Git for versioning

## Notes and Caveats

- Some referenced files/folders are not present yet in the current repo (they are expected to be created by following the workflow).
- Keep architecture references consistent as `ARCHITECTURE.md`.
- This repo currently functions as a process framework and documentation system.

## Suggested Next Steps

1. Create the `/brain/...` folders referenced above.
2. Add an initial project concept in `/brain/project-concept/`.
3. Start daily changelog files in `/brain/project-concept/changelog/`.
4. Add a root architecture file matching your preferred naming convention.
