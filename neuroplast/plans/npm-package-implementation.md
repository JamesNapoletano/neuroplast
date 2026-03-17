# Neuroplast NPM Package Implementation Plan
#plan

**Created:** 2026-03-13
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-03-13.md]]

## Overview
This plan implements neuroplast as an installable npm package with an explicit CLI initializer (`neuroplast init`) that populates host projects with workflow files in a non-destructive way.

## Tasks

### 1. Prepare Source File Structure

**Goal:** Create `src/` directory with organized source files for installation.

```
src/
├── instructions/
│   ├── conceptualize.md
│   ├── act.md
│   ├── think.md
│   ├── CONCEPT_INSTRUCTIONS.md
│   ├── CHANGELOG_INSTRUCTIONS.md
│   └── PLANNING_INSTRUCTIONS.md
├── obsidian/
│   └── .obsidian/
│       ├── core-plugins.json
│       ├── app.json
│       ├── appearance.json
│       ├── graph.json
│       └── workspace.json
```

**Actions:**
- [x] Create `src/instructions/` directory
- [x] Copy instruction markdown files to `src/instructions/`
- [x] Create `src/obsidian/.obsidian/` nested structure
- [x] Copy `.obsidian/*.json` files to proper location

---

### 2. Create `package.json`

**Goal:** Define npm package metadata and CLI entrypoint.

**File:** `package.json`

**Content requirements:**
- `name`, `version`, `description`, `license`
- `bin` command mapping (`neuroplast`)
- `files` allowlist for publish payload
- `engines.node` requirement
- convenience scripts for local testing

**Actions:**
- [x] Create `package.json` with metadata
- [x] Configure CLI via `bin`
- [x] Add relevant keywords for discoverability

---

### 3. Implement CLI Initializer (`bin/neuroplast.js`)

**Goal:** Core initialization logic that copies files and creates folders.

**File:** `bin/neuroplast.js`

**Requirements:**
- Node.js built-in modules only (`fs`, `path`, `process`)
- Check file existence before copying (non-destructive)
- Parse command-line args for `init`, `--with-obsidian`, and `--include-workspace`
- Resolve host project root using `INIT_CWD` fallback to `process.cwd()`
- Create required folder structure
- Log actions to console
- Handle errors gracefully

**Actions:**
- [x] Implement folder creation function (`mkdirSync` recursive)
- [x] Implement file copy function with existence check
- [x] Implement instruction files installation
- [x] Implement optional obsidian config installation
- [x] Add logging and error handling
- [x] Test in isolated directory

---

### 4. Update `.gitignore`

**Goal:** Prevent installing `node_modules` and other npm artifacts.

**Actions:**
- [x] Add `node_modules/` to `.gitignore`
- [x] Keep existing workspace ignore behavior

---

### 5. Test Installation

**Goal:** Verify package installs correctly.

**Test scenarios:**
- [x] `neuroplast init` in clean directory
- [x] Re-run `neuroplast init` with existing files (skip behavior)
- [x] `neuroplast init --with-obsidian`
- [x] `neuroplast init --with-obsidian --include-workspace`

---

## Validation Checklist

- [x] All source files organized in `src/` structure
- [x] `package.json` is valid JSON with correct metadata
- [x] `package.json` includes CLI `bin` and publish `files`
- [x] `bin/neuroplast.js` creates folders: `/neuroplast/project-concept/`, `/neuroplast/project-concept/changelog/`, `/neuroplast/learning/`, `/neuroplast/plans/`
- [x] Instruction files copied to root correctly
- [x] Optional obsidian flag works as expected
- [x] Non-destructive behavior (no overwrites)
- [x] Logging output is clear

## Decision Notes

- Chosen delivery model is explicit CLI initialization instead of `postinstall`.
- Rationale: avoids unexpected side effects and improves reliability of flags/options.

---

## Dependencies

This implementation has **zero external dependencies**:
- `fs` (built-in)
- `path` (built-in)
- `process` (built-in)

---

## Related Files

- [[project-concept/npm-package.md]] - Project concept
- [[CHANGELOG_INSTRUCTIONS.md]] - For changelog updates after completion
