# Structured Init/Sync JSON Output
#plan

**Created:** 2026-04-12
**Related to:** [[project-concept/npm-package.md]]
**Changelog:** [[project-concept/changelog/2026-04-12.md]]

## Goal
Add opt-in machine-readable JSON output for `init` and `sync` without changing the human-readable default CLI experience.

## Tasks
- [x] Add a shared action/event reporter that can suppress human logs and emit structured JSON payloads for `init` and `sync`. → Verify: `--json` emits parseable JSON without human log prefixes.
- [x] Extend CLI option validation so `--json` is accepted for `init` and `sync`. → Verify: valid command/flag combinations pass and invalid ones still fail clearly.
- [x] Return command-specific JSON result metadata for initialization and sync decisions. → Verify: payload includes command, options, summary, events, and result details.
- [x] Document the new machine-readable command output in README, architecture, and concept artifacts. → Verify: docs show how to use `init --json` and `sync --json`.
- [x] Add black-box tests for `init --json` and `sync --json`. → Verify: tests assert payload shape and key behavior.
- [x] Run project validation and tests after implementation. → Verify: `npm test` and `npm run validate` pass.

## Sync Impact
**Decision:** no migration needed

**Reason:** This change adds optional reporting output for command automation without changing managed-file refresh semantics or installed file content requirements.

## Done When
- [x] `init --json` emits a parseable action-oriented payload.
- [x] `sync --json` emits a parseable action-oriented payload.
- [x] Human-readable defaults remain unchanged when `--json` is not used.
- [x] Docs, changelog, and learning records reflect the new capability.
