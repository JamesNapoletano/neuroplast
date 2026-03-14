# Neuroplast

An npm-delivered workflow bootstrap for AI-assisted product planning, architecture design, execution, changelog tracking, and continuous learning notes.

## Quick Start

Initialize Neuroplast in any project directory:

```bash
npx neuroplast init
```

Include shared Obsidian config files:

```bash
npx neuroplast init --with-obsidian
```

The initializer is non-destructive: existing files are skipped and never overwritten.

By default, instruction files are written under `/neuroplast/` in your target project.

## What This Repository Is

This repository contains instruction files that guide an AI agent through a repeatable process:

1. Conceptualize a project
2. Produce architecture/planning artifacts
3. Execute implementation steps
4. Record changelog updates
5. Capture reusable lessons learned

It is set up as a workflow package template rather than a traditional code application.

## Current Repository Contents

Source-of-truth package files in this repository:

- `src/instructions/` — canonical instruction templates copied by `neuroplast init`
  - `conceptualize.md`
  - `PLANNING_INSTRUCTIONS.md`
  - `act.md`
  - `CONCEPT_INSTRUCTIONS.md`
  - `CHANGELOG_INSTRUCTIONS.md`
  - `think.md`
- `src/obsidian/.obsidian/` — optional shared Obsidian config templates
- `bin/neuroplast.js` — CLI initializer that creates folders and copies templates
- `.gitignore` — currently ignores `.obsidian/workspace.json`

Installed output in target projects (created by `npx neuroplast init`):

- `neuroplast/conceptualize.md`
- `neuroplast/PLANNING_INSTRUCTIONS.md`
- `neuroplast/act.md`
- `neuroplast/CONCEPT_INSTRUCTIONS.md`
- `neuroplast/CHANGELOG_INSTRUCTIONS.md`
- `neuroplast/think.md`
- `neuroplast/.obsidian/` (optional via `--with-obsidian`)

## Intended Folder Structure (Created During Workflow)

The instruction files reference these folders, which are expected to be created as part of the process:

- `/neuroplast/project-concept/`
- `/neuroplast/project-concept/changelog/`
- `/neuroplast/learning/`
- `/neuroplast/plans/`

## Workflow Overview

### 1) Conceptualization

Start from `neuroplast/conceptualize.md`, which points to planning rules in `neuroplast/PLANNING_INSTRUCTIONS.md`.

### 2) Planning Outputs

Generate layered planning documents:

- Per-page high-level specs
- Per-page mid-level architecture
- One global tech stack architecture file

Use Obsidian wiki-links (`[[File Name]]`) to connect documents.

### 3) Execution

Follow `neuroplast/act.md` in order:

- Read project concept artifacts
- Ensure `ARCHITECTURE.md` exists in the repository root
- Create a plan in `/neuroplast/plans/`
- Execute plan with references to `/neuroplast/learning/`
- Run concept/changelog/think instructions

### 4) Changelog Discipline

`neuroplast/CHANGELOG_INSTRUCTIONS.md` expects date-based changelog files (`YYYY-MM-DD.md`) under `/neuroplast/project-concept/changelog/` with links to associated plans.

### 5) Learning Capture

`neuroplast/think.md` defines how to store non-sensitive lessons in `/neuroplast/learning` by category.

## Prerequisites

- [Obsidian](https://obsidian.md/) recommended for wiki-link navigation and graph-based note workflow
- Git for versioning

## Notes and Caveats

- Some referenced files/folders are not present yet in the current repo (they are expected to be created by following the workflow).
- Keep architecture references consistent as `ARCHITECTURE.md`.
- This repo currently functions as a process framework and documentation system.

## Suggested Next Steps

1. Create the `/neuroplast/...` folders referenced above.
2. Add an initial project concept in `/neuroplast/project-concept/`.
3. Start daily changelog files in `/neuroplast/project-concept/changelog/`.
4. Add a root architecture file matching your preferred naming convention.
