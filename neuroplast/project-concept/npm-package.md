# Neuroplast NPM Package - Project Concept
#project-concept

## Overview
Convert the neuroplast workflow system into an installable npm package that automatically places its contract, instruction files, and optional configuration into any project it is installed into.

## Problem Statement
The neuroplast repository contains valuable workflow instructions, a canonical workflow contract, and optional Obsidian-compatible configuration that would benefit from being easily bootstrapped into new projects without manual copying.

The package should not feel coding-only. It should install a reusable project mind that works for software and non-software repositories alike.

## Solution
Create an npm package with an explicit CLI initializer that:
1. Copies the machine-readable manifest (`manifest.yaml`) to `/neuroplast/`
2. Copies the advisory capability profile (`capabilities.yaml`) to `/neuroplast/`
3. Copies the workflow contract (`WORKFLOW_CONTRACT.md`) to `/neuroplast/`
4. Copies instruction files (`act.md`, `conceptualize.md`, etc.) to `/neuroplast/`
5. Optionally installs `.obsidian/` configuration under `/neuroplast/.obsidian/`
6. Ships optional environment guidance docs under `/neuroplast/adapters/`
7. Ships optional bundled workflow extension scaffolding under `/neuroplast/extensions/`
8. Supports repo-local custom workflow extensions declared in the manifest
9. Creates the expected `/neuroplast/` folder structure
10. Applies one-time versioned migrations to managed files (via `sync`) when future template behavior changes require controlled updates
11. Validates workflow contract, metadata, and active extension declarations via `validate`
12. Scaffolds a minimal root `ARCHITECTURE.md` during `init` when the repository does not already provide one
13. Emits optional machine-readable JSON output for `init`, `sync`, and `validate` so wrapper tooling can consume command results without scraping human logs
14. Ships published JSON schema artifacts for each machine-readable CLI mode so automation consumers can validate payload shape explicitly

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
- **Non-destructive init**: `init` only creates files that do not exist
- **Creates folders**: `/neuroplast/` structure
- **Managed updates**: `init` runs sync once per version; users can also run `npx neuroplast sync`
- **Safe refreshes**: `sync` recreates missing managed package files, refreshes unchanged ones, and preserves locally edited copies
- **Version sensitivity**: Sync checks every package upgrade, including patch updates
- **Downgrade safety**: Downgrades skip sync by default; operator can opt in via `--force`
- **First-run practicality**: `init` also creates a minimal root `ARCHITECTURE.md` so a fresh repository can complete the initial validation loop without extra manual scaffolding
- **Automation support**: `init --json`, `sync --json`, and `validate --json` provide machine-readable command results for CI and wrapper tooling
- **Contract visibility**: schema files under `/schemas/` document the current JSON payload contracts for machine-readable command output

### Files to Install
| Source | Destination | Condition |
|--------|------------|-----------|
| `manifest.yaml` | `<project>/neuroplast/` | if not exists |
| `capabilities.yaml` | `<project>/neuroplast/` | if not exists |
| `WORKFLOW_CONTRACT.md` | `<project>/neuroplast/` | if not exists |
| `conceptualize.md` | `<project>/neuroplast/` | if not exists |
| `act.md` | `<project>/neuroplast/` | if not exists |
| `think.md` | `<project>/neuroplast/` | if not exists |
| `CONCEPT_INSTRUCTIONS.md` | `<project>/neuroplast/` | if not exists |
| `CHANGELOG_INSTRUCTIONS.md` | `<project>/neuroplast/` | if not exists |
| `PLANNING_INSTRUCTIONS.md` | `<project>/neuroplast/` | if not exists |
| `extensions/README.md` | `<project>/neuroplast/extensions/` | if not exists |
| `adapters/*.md` | `<project>/neuroplast/adapters/` | if not exists |
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
- Treat `WORKFLOW_CONTRACT.md` plus root `ARCHITECTURE.md` as the canonical portability and architecture anchors
- Scaffold `ARCHITECTURE.md` only when missing so operator-authored architecture files remain authoritative
- Treat `manifest.yaml` as the canonical machine-readable workflow map
- Treat `capabilities.yaml` as the advisory machine-readable capability profile for graceful degradation
- Treat bundled extension scaffolding and repo-local workflow extensions as optional additive layers declared in the manifest
- Treat `adapters/` docs as optional usage guidance only
- Persist migration state in `neuroplast/.neuroplast-state.json`
- Persist per-file baseline metadata for package-managed static files so sync can distinguish unchanged installs from local edits
- Keep validation focused on contract, metadata, and active extension integrity rather than environment orchestration
- Use semver-ordered migration modules (`src/migrations/*`) with idempotent update logic
- Keep full-file safe refreshes separate from content-transforming migrations
- For folder-policy migrations (for example Obsidian tag enforcement), evaluate all governed markdown files under `/neuroplast/` (excluding `.obsidian` and `.backups`), not only state-tracked bootstrap files
- Keep migration layer active even when there are no currently enabled content migrations
