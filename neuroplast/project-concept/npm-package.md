# Neuroplast NPM Package - Project Concept
#project-concept

## Overview
Convert the neuroplast Obsidian workflow vault into an installable npm package that automatically places its instruction files and configuration into any project it is installed into.

## Problem Statement
The neuroplast repository contains valuable workflow instructions and Obsidian configurations that would benefit from being easily bootstrapped into new projects without manual copying.

## Solution
Create an npm package with an explicit CLI initializer that:
1. Copies instruction files (`act.md`, `conceptualize.md`, etc.) to `/neuroplast/`
2. Optionally installs `.obsidian/` configuration under `/neuroplast/.obsidian/`
3. Creates the expected `/neuroplast/` folder structure
4. Applies one-time versioned migrations to managed files (via `sync`) when future template behavior changes require controlled updates

## Key Requirements

### Package Structure
```
neuroplast/
├── package.json              # NPM metadata + CLI mapping
├── bin/neuroplast.js         # Explicit init command logic
├── src/                      # Source files to be installed
│   ├── instructions/         # Markdown instruction files
│   ├── obsidian/             # .obsidian config (optional)
└── README.md                 # Package documentation
```

### Installation Behavior
  - **Default**: `npx neuroplast init` installs instruction files to `/neuroplast/`
  - **Optional flag**: `--with-obsidian` to include `/neuroplast/.obsidian/` config
- **Non-destructive**: Only creates files that don't exist (no overwrites)
- **Creates folders**: `/neuroplast/` structure
- **Managed updates**: `init` runs sync migrations once per version; users can also run `npx neuroplast sync`
- **Version sensitivity**: Sync checks every package upgrade, including patch updates
- **Downgrade safety**: Downgrades skip sync by default; operator can opt in via `--force`

### Files to Install
| Source | Destination | Condition |
|--------|------------|-----------|
| `conceptualize.md` | `<project>/neuroplast/` | if not exists |
| `act.md` | `<project>/neuroplast/` | if not exists |
| `think.md` | `<project>/neuroplast/` | if not exists |
| `CONCEPT_INSTRUCTIONS.md` | `<project>/neuroplast/` | if not exists |
| `CHANGELOG_INSTRUCTIONS.md` | `<project>/neuroplast/` | if not exists |
| `PLANNING_INSTRUCTIONS.md` | `<project>/neuroplast/` | if not exists |
| `.obsidian/` | `<project>/neuroplast/.obsidian/` | only with flag |

## Usage Scenarios
1. **New project bootstrap**: `npx neuroplast init` → get workflow files
2. **Obsidian setup**: `npx neuroplast init --with-obsidian` → setup with shared config

## Technical Approach
- Use Node.js built-ins only (`fs`, `path`, `process`) for file operations
- Check file existence before copying
- Create folders with `mkdir -p` behavior
- Log installation actions to console
- Resolve target directory via `INIT_CWD` fallback to `process.cwd()`
- Handle errors gracefully without destructive behavior
- Persist migration state in `neuroplast/.neuroplast-state.json`
- Use semver-ordered migration modules (`src/migrations/*`) with idempotent update logic
- For folder-policy migrations (for example Obsidian tag enforcement), evaluate all governed markdown files under `/neuroplast/` (excluding `.obsidian` and `.backups`), not only state-tracked bootstrap files
- Keep migration layer active even when there are no currently enabled content migrations
