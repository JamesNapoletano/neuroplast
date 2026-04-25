# Adapter Bootstrap Assets
#plan

**Created:** 2026-04-19
**Related to:** [[project-concept/cross-adapter-interaction-routing.md]]
**Changelog:** [[project-concept/changelog/2026-04-19.md]]

## Current Objective
- Add copy/paste-ready adapter bootstrap assets that match destination formats for Codex, Claude Code, and OpenCode so developers can load Neuroplast startup and short-prompt routing behavior consistently across tools.

## Scope
- Add a shared bootstrap asset as the semantic source for adapter startup and routing behavior.
- Add copy/paste-ready tool-facing assets for Codex (`AGENTS.md`), Claude Code (`CLAUDE.md`), and OpenCode kebab-case skills.
- Update package-managed file wiring so these assets ship during `init`/`sync`.
- Update documentation, architecture, and validation/release expectations to distinguish documentation-only environment guides from operational copy/paste assets.
- Add tests that protect the managed-file counts and the presence of the new assets.

## Non-Goals
- Do not install files directly into vendor-managed global AI directories.
- Do not make adapter docs authoritative for execution behavior.
- Do not add adapter-specific routing semantics that diverge from `neuroplast/interaction-routing.yaml`.

## Assumptions
- Copy/paste-ready repo assets are sufficient for adoption as long as they closely match likely destination formats.
- OpenCode can start with skills-first assets using kebab-case names; agent assets can be added later if skill-only bootstrapping proves insufficient.
- The shared bootstrap text should stay human-readable markdown even when embedded in destination-like files.

## Sync Impact Decision
- no migration needed

## Reason
- This change adds new managed assets to the shipped package and managed refresh set, but the existing init/sync behavior already handles additive shipped files without a custom migration.

## Execution Steps
1. Add a new shipped `src/adapter-assets/` source tree plus installed `neuroplast/adapter-assets/` copies.
2. Create one shared bootstrap asset describing mandatory startup reads, active-extension loading, and canonical short-prompt routing behavior.
3. Create tool-facing copy/paste assets for Codex, Claude Code, and OpenCode that match destination naming conventions as closely as practical.
4. Update managed-file constants, README, and architecture documentation to include the new asset family and its purpose.
5. Extend tests to reflect the new managed-file counts and to assert the adapter assets are installed during `init`.
6. Run `npm run validate`, `npm test`, and `npm run release:verify`.
7. Update concept, changelog, and learning artifacts for the new cross-tool bootstrap adoption model.

## Verification
- [ ] `npx neuroplast init` installs `neuroplast/adapter-assets/`.
- [ ] The installed asset set includes Codex `AGENTS.md`, Claude Code `CLAUDE.md`, and OpenCode kebab-case skill files.
- [ ] README and architecture docs explain the difference between environment guides and copy/paste-ready adapter assets.
- [ ] `npm run validate` passes.
- [ ] `npm test` passes.
- [ ] `npm run release:verify` passes.

## Risks
- Destination formats may drift as upstream tools evolve.
- A shared bootstrap asset could be copied without the tool-facing wrapper, so docs must explain the intended usage clearly.
- OpenCode may eventually need agents in addition to skills, so the first shipped asset set should leave room for expansion.

## Handoff
- If OpenCode skill-only bootstrapping proves insufficient in real use, add agent-shaped assets in a follow-up plan rather than overloading the first release.

## Related
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-compatibility-proof.md]]
- [[project-concept/release-operations.md]]
- [[learning/adapters-should-explicitly-separate-guidance-from-execution.md]]
