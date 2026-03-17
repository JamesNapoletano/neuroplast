# Neuroplast NPM Package Architecture

## System Overview
Neuroplast is an npm package that provides an explicit CLI initializer (`neuroplast init`) to install workflow instruction files and folder structures into host projects.

## Architecture Layers

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         HOST PROJECT                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   neuroplast package install    │   │
│  │                                 │   │
│  │  npx neuroplast init            │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│                 ▼                       │
│  ┌─────────────────────────────────┐   │
│  │   CLI Initializer               │   │
│  │   (bin/neuroplast.js)           │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│         ┌───────┴───────┐              │
│         ▼               ▼              │
│  ┌──────────┐   ┌──────────┐          │
│  │Instructions│  │Config    │          │
│  │ Files     │   │ (.opt)   │          │
│  └──────────┘   └──────────┘          │
│                                         │
└─────────────────────────────────────────┘
```

### Mid-Level Architecture

#### Component Breakdown

| Component | Responsibility | Technology |
|-- ------- |- --------------|- ----------|
| `package.json` | Package metadata, CLI command mapping | NPM standard |
| `bin/neuroplast.js` | Main initialization logic, file copying | Node.js fs/path |
| `src/migrations/` | Versioned managed-file upgrade logic | Node.js modules |
| `src/instructions/` | Source instruction files | Markdown |
| `src/obsidian/` | Optional Obsidian config | JSON files |

#### Data Flow

1. **User runs CLI** → `npx neuroplast init` or `npx neuroplast sync`
2. **`bin/neuroplast.js` executes** → reads command and flags
3. **Init phase (init command only)** → creates folders + copies missing files
4. **State loader** → reads `neuroplast/.neuroplast-state.json`
5. **Version gate** → compares `lastSyncedVersion` to current package version (major/minor/patch aware)
6. **Migration runner** → applies pending migrations by semver/version + migration ID
7. **State writer** → records applied migrations and managed files
8. **Completion logging** → prints create/skip/update actions

### Low-Level Architecture

#### File Installation Specifications

**Instruction Files (always installed if missing):**
```
src/instructions/conceptualize.md     → ./neuroplast/conceptualize.md
src/instructions/act.md              → ./neuroplast/act.md
src/instructions/think.md            → ./neuroplast/think.md
src/instructions/CONCEPT_INSTRUCTIONS.md → ./neuroplast/CONCEPT_INSTRUCTIONS.md
src/instructions/CHANGELOG_INSTRUCTIONS.md → ./neuroplast/CHANGELOG_INSTRUCTIONS.md
src/instructions/PLANNING_INSTRUCTIONS.md → ./neuroplast/PLANNING_INSTRUCTIONS.md
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

#### Technical Stack

| Category | Technology | Purpose |
|-- -------|- ----------|- --------|
| Package Manager | npm | Distribution platform |
| Runtime | Node.js 18+ | CLI execution |
| File Operations | fs module | Read/copy/mkdir |
| Path Handling | path module | Cross-platform paths |
| Exit Codes | process.exit() | Error signaling |

#### Error Handling Strategy

| Error Type | Handling | Action |
|-- ---------|- --------|- -------|
| File exists (instruction) | Skip with log message | Continue |
| File exists (.obsidian file) | Skip that file | Continue |
| Permission denied | Log error, continue | Non-fatal |
| Disk full | Fail fast, exit 1 | Fatal |

## Tech Stack Summary

- **Node.js** (18+ required)
- **npm** (distribution + npx command execution)
- **Built-in modules only**: `fs`, `path`, `process`
- **No external dependencies** (minimize install failures)
