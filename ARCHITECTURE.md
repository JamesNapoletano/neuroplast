# Neuroplast NPM Package Architecture

## System Overview
Neuroplast is an npm package that provides an explicit CLI initializer (`neuroplast init`) to install workflow instruction files and folder structures into host projects.

## Architecture Layers

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         HOST PROJECT                    │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │   neuroplast package install    │   │
│   │                                 │   │
│   │  npx neuroplast init            │   │
│   └──────────────┬──────────────────┘   │
│                  │                      │
│                  ▼                      │
│   ┌─────────────────────────────────┐   │
│   │   CLI Initializer               │   │
│   │   (bin/neuroplast.js)           │   │
│   └──────────────┬──────────────────┘   │
│                  │                      │
│          ┌───────┴───────┐              │
│          ▼               ▼              │
│    ┌──────────┐   ┌──────────┐          │
│    │Instructions│ │Config    │          │
│    │ Files     │  │ (.opt)   │          │
│    └──────────┘   └──────────┘          │
│                                         │
└─────────────────────────────────────────┘
```

### Mid-Level Architecture

#### Component Breakdown

| Component | Responsibility | Technology |
|-----------|----------------|------------|
| `package.json` | Package metadata, CLI command mapping | NPM standard |
| `bin/neuroplast.js` | Main initialization logic, file copying | Node.js fs/path |
| `src/migrations/` | Versioned managed-file upgrade logic | Node.js modules |
| `src/instructions/` | Source workflow, metadata, capabilities, and instruction files | Markdown + YAML |
| `src/extensions/` | Optional bundled workflow extension scaffolding | Markdown |
| `src/adapters/` | Optional environment guidance documents | Markdown |
| `src/obsidian/` | Optional Obsidian config | JSON files |

#### Data Flow

1. **User runs CLI** → `npx neuroplast init` or `npx neuroplast sync`
2. **`bin/neuroplast.js` executes** → reads command and flags
3. **Init phase (init command only)** → creates folders + copies missing files
4. **Validate phase (validate command only)** → checks manifest, capabilities, required paths, frontmatter, and environment-guide boundaries
5. **State loader** → reads `neuroplast/.neuroplast-state.json`
6. **Version gate** → compares `lastSyncedVersion` to current package version (major/minor/patch aware)
7. **Migration runner** → applies pending migrations by semver/version + migration ID
8. **State writer** → records applied migrations and managed files
9. **Completion logging** → prints create/skip/update actions

### Low-Level Architecture

#### File Installation Specifications

**Instruction Files (always installed if missing):**
```
src/instructions/manifest.yaml            → ./neuroplast/manifest.yaml
src/instructions/capabilities.yaml       → ./neuroplast/capabilities.yaml
src/instructions/WORKFLOW_CONTRACT.md   → ./neuroplast/WORKFLOW_CONTRACT.md
src/instructions/conceptualize.md     → ./neuroplast/conceptualize.md
src/instructions/act.md              → ./neuroplast/act.md
src/instructions/think.md            → ./neuroplast/think.md
src/instructions/CONCEPT_INSTRUCTIONS.md → ./neuroplast/CONCEPT_INSTRUCTIONS.md
src/instructions/CHANGELOG_INSTRUCTIONS.md → ./neuroplast/CHANGELOG_INSTRUCTIONS.md
src/instructions/PLANNING_INSTRUCTIONS.md → ./neuroplast/PLANNING_INSTRUCTIONS.md
```

**Environment Guides (always installed if missing):**
```
src/adapters/README.md                  → ./neuroplast/adapters/README.md
src/adapters/opencode.md               → ./neuroplast/adapters/opencode.md
src/adapters/claude-code.md            → ./neuroplast/adapters/claude-code.md
src/adapters/cursor.md                 → ./neuroplast/adapters/cursor.md
src/adapters/windsurf.md               → ./neuroplast/adapters/windsurf.md
src/adapters/vscode-copilot.md         → ./neuroplast/adapters/vscode-copilot.md
src/adapters/terminal.md               → ./neuroplast/adapters/terminal.md
```

**Bundled Workflow Extension Scaffolding (always installed if missing, remain inactive unless declared in manifest):**
```
src/extensions/README.md → ./neuroplast/extensions/README.md
```

**Optional Obsidian Config (with `--with-obsidian` flag):**
```
src/obsidian/.obsidian/core-plugins.json → neuroplast/.obsidian/core-plugins.json
src/obsidian/.obsidian/app.json          → neuroplast/.obsidian/app.json
src/obsidian/.obsidian/appearance.json   → neuroplast/.obsidian/appearance.json
src/obsidian/.obsidian/graph.json        → neuroplast/.obsidian/graph.json
```

**Folder Structure (always created):**
```
./neuroplast/project-concept/
./neuroplast/project-concept/changelog/
./neuroplast/learning/
./neuroplast/plans/
```

#### Managed Update State

Neuroplast stores managed update state in:

```
./neuroplast/.neuroplast-state.json
```

State tracks:

- schema version
- installed package version
- last synced package version
- applied migration IDs
- known managed files

#### Migration System

- Migrations are implemented as modules under `src/migrations/`.
- Each migration exports:
  - `id`
  - `version`
  - `description`
  - `run(context)`
- Runner applies migrations where `migration.version <= package.version` and migration ID has not already been applied.
- Migration context resolves managed markdown scope by scanning `/neuroplast/**/*.md` (excluding `.obsidian` and `.backups`) for folder-policy enforcement tasks.
- Sync gate runs on any package version change, including patch updates.
- Downgrade path is skipped by default; `--force` allows explicit override.
- `--dry-run` previews updates without writing files/state.
- `--backup` creates pre-write snapshots under `neuroplast/.backups/<timestamp>/...`.

#### Validation System

- `validate` checks required directories, required workflow files, support files, root `ARCHITECTURE.md`, parseable manifest/capabilities YAML, instruction frontmatter structure, and environment-guide boundaries.
- `validate` also checks any active bundled or repo-local workflow extensions declared in the manifest.
- Validation uses a built-in lightweight YAML/frontmatter parser to avoid external runtime dependencies.
- Validation is intentionally scoped to workflow contract compliance rather than editor or environment orchestration.

#### Technical Stack

| Category | Technology | Purpose |
|-----------|------------|---------|
| Package Manager | npm | Distribution platform |
| Runtime | Node.js 18+ | CLI execution |
| File Operations | fs module | Read/copy/mkdir |
| Path Handling | path module | Cross-platform paths |
| Exit Codes | process.exit() | Error signaling |

#### Error Handling Strategy

| Error Type | Handling | Action |
|-----------|----------|--------|
| File exists (instruction) | Skip with log message | Continue |
| File exists (.obsidian file) | Skip that file | Continue |
| Permission denied | Log error, continue | Non-fatal |
| Disk full | Fail fast, exit 1 | Fatal |

## Tech Stack Summary

- **Node.js** (18+ required)
- **npm** (distribution + npx command execution)
- **Built-in modules only**: `fs`, `path`, `process`
- **No external dependencies** (minimize install failures)

## Portability Roadmap Direction

Neuroplast's portability model is centered on the `/neuroplast/` filesystem contract rather than IDE-specific integrations.

- Root `ARCHITECTURE.md` is the canonical architecture artifact for workflow execution and future portability work.
- Planned portability layers should build on an explicit workflow contract, machine-readable manifest metadata, instruction frontmatter, a capability profile, and validation rules.
- Environment-specific guidance should remain optional and must not override the core workflow contract.
- Optional bundled environment guides live under `neuroplast/adapters/` and mirror source docs under `src/adapters/`.
- Optional bundled workflow extension scaffolding lives under `neuroplast/extensions/`; repo-local custom extensions may live under `neuroplast/local-extensions/`.
- Obsidian-compatible conventions can remain supported, but they should enhance the workflow rather than define its portability model.
- Workflow extensions should remain opt-in and additive so maintainer- or repo-specific policy does not leak into the base instruction set.
- This repository keeps `package-maintainer` as a repo-local extension rather than shipping it as a bundled extension.
- CLI scope remains focused on `init`, `sync`, and `validate` rather than environment orchestration.
- `neuroplast/WORKFLOW_CONTRACT.md` is the canonical installed workflow contract that future portability layers should reference.
- `neuroplast/manifest.yaml` is the canonical installed machine-readable map of workflow structure and document roles.
- `neuroplast/capabilities.yaml` is the advisory installed capability profile for constrained-environment execution.
