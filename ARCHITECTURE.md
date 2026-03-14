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
| `src/instructions/` | Source instruction files | Markdown |
| `src/obsidian/` | Optional Obsidian config | JSON files |

#### Data Flow

1. **User runs CLI** → `npx neuroplast init`
2. **`bin/neuroplast.js` executes** → reads CLI arguments for flags
3. **File checker** → determines which files don't exist
4. **Directory creator** → creates `/neuroplast/` folders
5. **File copier** → copies source files to host project
6. **Completion logging** → prints installed files

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
