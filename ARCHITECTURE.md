# Neuroplast NPM Package Architecture

## System Overview
Neuroplast is an npm package that implements the Local Cognitive Protocol (LCP) as a repository-local project mind for human + AI collaboration.

Normative protocol source:

- <https://github.com/JamesNapoletano/lcp>

Neuroplast installs a Neuroplast working layout plus an LCP bridge layout into host projects.

## Architecture Layers

### Semantic Boundary

Neuroplast is organized into three layers:

1. **LCP semantic layer** — external protocol semantics defined by the LCP repository.
2. **Neuroplast compatibility profile** — `/neuroplast/`, `ARCHITECTURE.md`, and managed project-mind instruction defaults.
3. **Neuroplast implementation tooling** — CLI runtime, sync logic, migrations, validation, and state.

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
| `bin/neuroplast.js` | Thin CLI entrypoint that delegates to runtime orchestration | Node.js |
| `src/cli/runtime.js` | Command parsing, option validation, architecture scaffold install, and init orchestration | Node.js modules |
| `src/cli/sync.js` | Managed refresh, migration loading, and sync flow | Node.js modules |
| `src/cli/validate.js` | Validation workflow for LCP bridge and Neuroplast profile checks | Node.js modules |
| `src/cli/state.js` | Sync state loading, saving, and managed-file metadata | Node.js modules |
| `src/cli/filesystem.js` | Safe directory creation, copy-if-missing, and backups | Node.js modules |
| `src/cli/parsing.js` | Lightweight YAML and frontmatter parsing helpers | Node.js modules |
| `src/cli/shared.js` | Shared semver, hashing, timestamp, and path helpers | Node.js modules |
| `src/cli/constants.js` | Managed file maps and package-level runtime constants | Node.js modules |
| `src/cli/logging.js` | Stable human-readable CLI log formatting helpers | Node.js modules |
| `src/cli/output.js` | Shared human/JSON command reporting for init and sync | Node.js modules |
| `src/cli/interaction-routing.js` | Canonical phrase-resolution inspection and routing validation helpers | Node.js modules |
| `src/migrations/` | Versioned managed-file upgrade logic | Node.js modules |
| `src/lcp/` | LCP bridge/profile definitions and validation helpers | Node.js modules |
| `src/lcp-files/` | Packaged `.lcp/` bridge documents | YAML |
| `src/instructions/` | Source workflow, metadata, capabilities, and project-mind instruction files | Markdown + YAML |
| `src/extensions/` | Optional bundled workflow extensions and authoring scaffold | Markdown |
| `src/adapters/` | Optional environment guidance documents | Markdown |
| `src/adapter-assets/` | Copy/paste-ready tool-facing bootstrap assets | Markdown |
| `src/obsidian/` | Optional Obsidian config | JSON files |
| `test/` | Black-box CLI reliability tests using temp repositories | Node.js `node:test` |
| `.github/workflows/` | Automated multi-version verification and smoke packaging checks | GitHub Actions |

#### Data Flow

1. **User runs CLI** → `npx neuroplast init` or `npx neuroplast sync`
2. **`bin/neuroplast.js` executes** → delegates to `src/cli/runtime.js`
3. **Init phase (init command only)** → creates folders, copies missing managed files, and scaffolds root `ARCHITECTURE.md` when absent
4. **Validate phase (validate command only)** → checks manifest, capabilities, required paths, frontmatter, and environment-guide boundaries
5. **State loader** → reads `neuroplast/.neuroplast-state.json`
6. **Version gate** → compares `lastSyncedVersion` to current package version (major/minor/patch aware)
7. **Managed refresh phase** → safely refreshes package-managed static files when their installed copy still matches the last synced baseline
8. **Migration runner** → applies pending migrations by semver/version + migration ID
9. **State writer** → records applied migrations, managed files, and per-file baseline metadata
10. **Completion logging** → prints create/skip/update/preserve actions or emits structured JSON summaries when requested

The installed file set is meant to act as a durable project mind: orientation context in `project-concept/`, active objective and handoff state in `plans/`, dated history in `project-concept/changelog/`, and reusable lessons in `learning/`.

An optional `neuroplast/current-context.md` briefing capsule can compress the current objective, next step, blockers, verification, and relevant files for faster startup without replacing the canonical memory artifacts. When the file is still managed, `sync` can refresh it from the latest plan and nearby durable artifacts while preserving local edits.

An explicit `neuroplast/plans/.active-plan` pointer can identify the intended active plan so routing and briefing generation do not depend only on modification-time heuristics.

For bundled OpenCode wrappers, a same-session bounded planner handoff may act as temporary execution input for `neuroplast-orchestrator`, but the orchestrator must persist that handoff into `neuroplast/plans/` before broader implementation so durable continuity remains file-backed.

### Low-Level Architecture

#### File Installation Specifications

**Instruction Files (installed if missing during `init`, then safe-refreshed during `sync` when unchanged locally):**
```
src/instructions/README.md              → ./neuroplast/README.md
src/instructions/current-context.md    → ./neuroplast/current-context.md
src/instructions/manifest.yaml            → ./neuroplast/manifest.yaml
src/instructions/capabilities.yaml       → ./neuroplast/capabilities.yaml
src/instructions/WORKFLOW_CONTRACT.md   → ./neuroplast/WORKFLOW_CONTRACT.md
src/instructions/interaction-routing.yaml → ./neuroplast/interaction-routing.yaml
src/instructions/conceptualize.md     → ./neuroplast/conceptualize.md
src/instructions/reverse-engineering.md → ./neuroplast/reverse-engineering.md
src/instructions/reconcile-conflicts.md → ./neuroplast/reconcile-conflicts.md
src/instructions/act.md              → ./neuroplast/act.md
src/instructions/think.md            → ./neuroplast/think.md
src/instructions/CONCEPT_INSTRUCTIONS.md → ./neuroplast/CONCEPT_INSTRUCTIONS.md
src/instructions/CHANGELOG_INSTRUCTIONS.md → ./neuroplast/CHANGELOG_INSTRUCTIONS.md
src/instructions/PLANNING_INSTRUCTIONS.md → ./neuroplast/PLANNING_INSTRUCTIONS.md
```

**Environment Guides (installed if missing during `init`, then safe-refreshed during `sync` when unchanged locally):**
```
src/adapters/README.md                  → ./neuroplast/adapters/README.md
src/adapters/opencode.md               → ./neuroplast/adapters/opencode.md
src/adapters/claude-code.md            → ./neuroplast/adapters/claude-code.md
src/adapters/cursor.md                 → ./neuroplast/adapters/cursor.md
src/adapters/codex.md                  → ./neuroplast/adapters/codex.md
src/adapters/windsurf.md               → ./neuroplast/adapters/windsurf.md
src/adapters/vscode-copilot.md         → ./neuroplast/adapters/vscode-copilot.md
src/adapters/terminal.md               → ./neuroplast/adapters/terminal.md
```

**Adapter Bootstrap Assets (installed if missing during `init`, then safe-refreshed during `sync` when unchanged locally):**
```
src/adapter-assets/README.md → ./neuroplast/adapter-assets/README.md
src/adapter-assets/shared/neuroplast-bootstrap.md → ./neuroplast/adapter-assets/shared/neuroplast-bootstrap.md
src/adapter-assets/codex/AGENTS.md → ./neuroplast/adapter-assets/codex/AGENTS.md
src/adapter-assets/claude-code/CLAUDE.md → ./neuroplast/adapter-assets/claude-code/CLAUDE.md
src/adapter-assets/claude-code/install-plugin.js → ./neuroplast/adapter-assets/claude-code/install-plugin.js
src/adapter-assets/claude-code/plugin/.claude-plugin/plugin.json → ./neuroplast/adapter-assets/claude-code/plugin/.claude-plugin/plugin.json
src/adapter-assets/claude-code/plugin/agents/neuroplast-orchestrator.md → ./neuroplast/adapter-assets/claude-code/plugin/agents/neuroplast-orchestrator.md
src/adapter-assets/claude-code/plugin/agents/neuroplast-planner.md → ./neuroplast/adapter-assets/claude-code/plugin/agents/neuroplast-planner.md
src/adapter-assets/claude-code/plugin/skills/neuroplast-bootstrap/SKILL.md → ./neuroplast/adapter-assets/claude-code/plugin/skills/neuroplast-bootstrap/SKILL.md
src/adapter-assets/claude-code/plugin/skills/neuroplast-route-short-prompts/SKILL.md → ./neuroplast/adapter-assets/claude-code/plugin/skills/neuroplast-route-short-prompts/SKILL.md
src/adapter-assets/claude-code/plugin/skills/neuroplast-execute-act/SKILL.md → ./neuroplast/adapter-assets/claude-code/plugin/skills/neuroplast-execute-act/SKILL.md
src/adapter-assets/claude-code/plugin/README.md → ./neuroplast/adapter-assets/claude-code/plugin/README.md
src/adapter-assets/opencode/skills/README.md → ./neuroplast/adapter-assets/opencode/skills/README.md
src/adapter-assets/opencode/skills/neuroplast-bootstrap/SKILL.md → ./neuroplast/adapter-assets/opencode/skills/neuroplast-bootstrap/SKILL.md
src/adapter-assets/opencode/skills/neuroplast-route-short-prompts/SKILL.md → ./neuroplast/adapter-assets/opencode/skills/neuroplast-route-short-prompts/SKILL.md
src/adapter-assets/opencode/skills/neuroplast-execute-act/SKILL.md → ./neuroplast/adapter-assets/opencode/skills/neuroplast-execute-act/SKILL.md
src/adapter-assets/opencode/agents/neuroplast-orchestrator.md → ./neuroplast/adapter-assets/opencode/agents/neuroplast-orchestrator.md
src/adapter-assets/opencode/agents/neuroplast-planner.md → ./neuroplast/adapter-assets/opencode/agents/neuroplast-planner.md
```

**Bundled Workflow Extensions (installed if missing during `init`, then safe-refreshed during `sync` when unchanged locally; remain inactive unless declared in manifest):**
```
src/extensions/README.md → ./neuroplast/extensions/README.md
src/extensions/verification-first/README.md → ./neuroplast/extensions/verification-first/README.md
src/extensions/verification-first/PLANNING_INSTRUCTIONS.md → ./neuroplast/extensions/verification-first/PLANNING_INSTRUCTIONS.md
src/extensions/verification-first/act.md → ./neuroplast/extensions/verification-first/act.md
src/extensions/verification-first/CHANGELOG_INSTRUCTIONS.md → ./neuroplast/extensions/verification-first/CHANGELOG_INSTRUCTIONS.md
src/extensions/artifact-sync/README.md → ./neuroplast/extensions/artifact-sync/README.md
src/extensions/artifact-sync/act.md → ./neuroplast/extensions/artifact-sync/act.md
src/extensions/artifact-sync/CHANGELOG_INSTRUCTIONS.md → ./neuroplast/extensions/artifact-sync/CHANGELOG_INSTRUCTIONS.md
src/extensions/artifact-sync/think.md → ./neuroplast/extensions/artifact-sync/think.md
src/extensions/context-continuity/README.md → ./neuroplast/extensions/context-continuity/README.md
src/extensions/context-continuity/PLANNING_INSTRUCTIONS.md → ./neuroplast/extensions/context-continuity/PLANNING_INSTRUCTIONS.md
src/extensions/context-continuity/act.md → ./neuroplast/extensions/context-continuity/act.md
src/extensions/context-continuity/think.md → ./neuroplast/extensions/context-continuity/think.md
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

**Root Scaffold (created during `init` if missing):**
```
src/templates/ARCHITECTURE.md → ./ARCHITECTURE.md
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
- per-file baseline metadata for safe managed refreshes (`contentHash`, `lastSyncedVersion`)

#### Migration System

- Migrations are implemented as modules under `src/migrations/`.
- Each migration exports:
  - `id`
  - `version`
  - `description`
  - `run(context)`
- Safe refresh handles package-managed static file replacement separately from migrations.
- Safe refresh targets workflow files, bundled adapter guides, and bundled workflow extension files (not repo-local extensions or `.obsidian` config).
- Existing managed files are refreshed only when their current contents still match the stored baseline; locally edited files are preserved and reported.
- Older installs without baseline metadata only auto-adopt a managed file when its current contents already match the packaged version.
- Runner applies migrations where `migration.version <= package.version` and migration ID has not already been applied.
- Migration context resolves managed markdown scope by scanning `/neuroplast/**/*.md` (excluding `.obsidian` and `.backups`) for folder-policy enforcement tasks.
- Sync gate runs on any package version change, including patch updates.
- Downgrade path is skipped by default; `--force` allows explicit override.
- `--dry-run` previews updates without writing files/state.
- `--backup` creates pre-write snapshots under `neuroplast/.backups/<timestamp>/...`.

#### Validation System

- `validate` checks required directories, required workflow files, support files, root `ARCHITECTURE.md`, parseable manifest/capabilities YAML, instruction frontmatter structure, environment-guide boundaries, and canonical interaction-routing integrity.
- `validate` now also applies an advisory size-budget check to `neuroplast/current-context.md` when that briefing artifact is present.
- `validate` now also warns when `neuroplast/current-context.md` is older than the latest plan/changelog inputs.
- `sync` now also refreshes `neuroplast/current-context.md` from repository state when the file still matches the stored managed baseline.
- `route` now returns additive context-depth and briefing-emphasis recommendations so wrappers can match their context load to the routed intent.
- `route` and `sync` now prefer `neuroplast/plans/.active-plan` when selecting the active plan, with newest-plan fallback only when the pointer is absent.
- `init` now leaves fresh repositories validate-ready by scaffolding a minimal root `ARCHITECTURE.md` unless the repository already provides one.
- `validate` also checks any active bundled or repo-local workflow extensions declared in the manifest and enforces a minimal active-extension file convention.
- `validate --json` now includes a `schemaVersion` field and is documented as a stable machine-readable contract for the active major version via `schemas/validate-json.schema.json`.
- Validation uses a built-in lightweight YAML/frontmatter parser to avoid external runtime dependencies.
- Validation is intentionally scoped to workflow contract compliance rather than editor or environment orchestration.

#### Technical Stack

| Category | Technology | Purpose |
|-----------|------------|---------|
| Package Manager | npm | Distribution platform |
| Runtime | Node.js 18+ | CLI execution |
| Test Runner | `node:test` | Black-box CLI regression coverage |
| File Operations | fs module | Read/copy/mkdir |
| Path Handling | path module | Cross-platform paths |
| Exit Codes | process.exit() | Error signaling |

#### Verification Architecture

- Automated CLI tests run the published entrypoint as a child process against temporary repositories via `INIT_CWD`.
- Reliability coverage currently targets `init`, `sync`, `validate`, downgrade handling, backup behavior, baseline adoption, and managed-file preservation.
- Release verification is consolidated in `npm run release:verify`, which runs repository validation, black-box CLI tests, `npm pack --json` payload checks, and a packed-install smoke validation loop.
- The release verification wrapper invokes `npm` and `npx` through platform-native resolution so the same verification script works on Windows runners that expose Node tooling via `PATH` instead of `%APPDATA%\npm`.
- The `npm test` entrypoint relies on Node's built-in test discovery instead of shell-expanded globs so the same verification path works on Windows and POSIX CI runners.
- CI now runs that release verification entrypoint on supported Node versions so local maintainer checks and hosted verification stay aligned.
- Runtime maintainability is now organized into focused CLI modules so future behavior changes can be made without expanding the command surface.
- Validation supports both human-readable output with remediation guidance and optional machine-readable JSON output for automation.
- `init` and `sync` now also support optional machine-readable JSON output built from the same action stream used for human-readable logging.
- `route` now provides a narrow CLI inspection seam for canonical phrase-resolution without expanding into adapter orchestration.
- Published schema files under `schemas/` now document the machine-readable payload contracts for `init`, `sync`, `validate`, and `route` JSON modes.
- Validation now includes sync-state integrity checks plus active-extension shape validation to improve operator trust without expanding CLI scope.
- Validation now also enforces the bundled OpenCode planner asset boundary by checking its read-only tool surface and required safety-lock language so package drift is caught before release.
- Startup guidance now includes advisory `lean`, `standard`, and `deep` context depths layered on top of the mandatory bootstrap contract.
- Portability proof currently treats the terminal-only guide as the actively verified first-loop environment; other bundled guides remain documentation-only until separately exercised.

#### Release and Compatibility Policy

- Stable within a major version: CLI command names, the `/neuroplast/` root layout, root `ARCHITECTURE.md`, core manifest role paths, non-destructive init/sync behavior, and the documented `validate --json` schema contract.
- Evolving within a major version: human-readable CLI wording, additive validation findings, documentation-only guides, additive manifest fields, and new optional bundled extensions.
- Sync-sensitive changes must record a plan-level decision of `migration required` or `no migration needed` before release work is treated as complete.

#### Error Handling Strategy

| Error Type | Handling | Action |
|-----------|----------|--------|
| File exists (instruction during init) | Skip with log message | Continue |
| File locally modified (sync refresh) | Preserve with log message | Continue |
| File exists (.obsidian file) | Skip that file | Continue |
| Permission denied | Log error, continue | Non-fatal |
| Disk full | Fail fast, exit 1 | Fatal |

## Tech Stack Summary

- **Node.js** (18+ required)
- **npm** (distribution + npx command execution)
- **Built-in modules only**: `crypto`, `fs`, `path`, `process`
- **No external dependencies** (minimize install failures)

## Portability Roadmap Direction

Neuroplast's portability model is centered on the `/neuroplast/` filesystem contract rather than IDE-specific integrations.

- Root `ARCHITECTURE.md` is the canonical architecture artifact for workflow execution and future portability work.
- Planned portability layers should build on an explicit workflow contract, machine-readable manifest metadata, instruction frontmatter, a capability profile, and validation rules.
- Environment-specific guidance should remain optional and must not override the core workflow contract.
- Optional bundled environment guides live under `neuroplast/adapters/` and mirror source docs under `src/adapters/`.
- Copy/paste-ready bundled adapter bootstrap assets live under `neuroplast/adapter-assets/` and mirror source assets under `src/adapter-assets/`.
- A Claude Code installable plugin lives at `src/adapter-assets/claude-code/plugin/` (source) and `neuroplast/adapter-assets/claude-code/plugin/` (installed). It packages the bootstrap skill, routing skill, execute-act skill, orchestrator agent, and planner agent so Claude Code users can install Neuroplast workflow support without manual file copying. Plugin files and the corresponding adapter assets must be kept in sync on release.
- Those adapter bootstrap assets now also carry additive success-oriented response-shape guidance for planner and execution agents.
- The bundled OpenCode planner asset now also documents that prompt-level safety is insufficient by itself and that complete write-prevention depends on host-runtime tool gating plus fresh-session isolation when mutable lanes may have been used earlier in the session.
- Support boundaries should distinguish actively verified environments from documentation-only guides instead of implying equal evidence across every adapter.
- Optional bundled workflow extensions live under `neuroplast/extensions/`; repo-local custom extensions may live under `neuroplast/local-extensions/`.
- Bundled extensions currently ship as three separate opt-in paths: `verification-first`, `artifact-sync`, and `context-continuity`.
- Specialized shipped instruction entrypoints currently include `reverse-engineering.md` for code-grounded project-mind reconstruction and `reconcile-conflicts.md` for preservation-first conflict resolution.
- Obsidian-compatible conventions can remain supported, but they should enhance the workflow rather than define its portability model.
- Workflow extensions should remain opt-in and additive so maintainer- or repo-specific policy does not leak into the base instruction set.
- This repository keeps `package-maintainer` as a repo-local extension rather than shipping it as a bundled extension.
- CLI scope remains focused on `init`, `sync`, and `validate` rather than environment orchestration.
- `neuroplast/WORKFLOW_CONTRACT.md` is the canonical installed workflow contract that future portability layers should reference.
- `neuroplast/manifest.yaml` is the canonical installed machine-readable map of workflow structure and document roles.
- `neuroplast/capabilities.yaml` is the advisory installed capability profile for constrained-environment execution.

## Emerging First-Party Harness Direction

- A future first-party Neuroplast harness is now an explicit product direction for reducing dependence on third-party execution surfaces without changing the filesystem-first contract.
- The preferred shape is a VS Code-compatible extension plus a local runtime/sidecar boundary, where the extension owns user interaction and approvals while the runtime owns provider abstraction, policy enforcement, MCP brokering, shared-workspace coordination, and auditable execution.
- This harness direction is additive to the current package architecture: `.lcp/`, `/neuroplast/`, and `ARCHITECTURE.md` remain authoritative, while the harness would operationalize those artifacts.
- LCP remains the semantic source, Neuroplast remains the implementation profile and durable project mind, and MCP remains a tool/resource transport layer rather than a workflow authority.
- The security stance for any first-party harness should be capability-based and least-privilege by default, with explicit approvals, secret isolation, schema validation, and audited tool use rather than prompt-only safety language.
- The collaboration direction for that harness is now a real shared live workspace with hybrid conflict controls: hard reservations for high-risk governed artifacts and softer presence/edit-intent awareness for lower-risk files.
- The next design seam for that harness is an explicit sidecar-enforced capability manifest plus a collaboration permission model that separates presence, reservation, edit, publish, and override rights instead of treating them as one generic write permission.
