# OpenCode Neuroplast Agents
#plan

**Created:** 2026-04-19
**Related to:** [[project-concept/cross-adapter-interaction-routing.md]]
**Changelog:** [[project-concept/changelog/2026-04-19.md]]

## Current Objective
- Add thin OpenCode agent assets so OpenCode can reliably invoke Neuroplast bootstrap and routing skills through a destination-like repo asset set instead of relying on skills alone.

## Scope
- Add copy/paste-ready OpenCode agent assets for `neuroplast-orchestrator` and `neuroplast-planner`.
- Keep the new agents thin and explicitly anchored to `neuroplast/WORKFLOW_CONTRACT.md`, `neuroplast/manifest.yaml`, `neuroplast/capabilities.yaml`, `neuroplast/interaction-routing.yaml`, and the existing OpenCode Neuroplast skills.
- Update bundled adapter asset documentation, managed-file wiring, validation, and tests so the new agents ship and refresh with the package.
- Update concept, changelog, and learning artifacts to describe the skills-plus-agent OpenCode adoption model.

## Non-Goals
- Do not make the OpenCode agents a second workflow contract.
- Do not duplicate canonical routing semantics inside multiple places without referencing `neuroplast/interaction-routing.yaml`.
- Do not add many specialized OpenCode agents in the first pass.

## Assumptions
- OpenCode skills alone are not sufficient for reliable startup behavior in normal use.
- OpenCode can use a small number of agent files that reference skills and runtime tools.
- `neuroplast-orchestrator` should be the general default, while `neuroplast-planner` should focus on conceptualize/plan-first flows.

## Sync Impact Decision
- no migration needed

## Reason
- This is an additive managed-asset expansion. Existing init/sync behavior already handles additive shipped files without a custom migration.

## Execution Steps
1. Add a bundled OpenCode agent asset directory under `src/adapter-assets/opencode/agents/` and installed copies under `neuroplast/adapter-assets/opencode/agents/`.
2. Create a thin `neuroplast-orchestrator` agent that always bootstraps Neuroplast context first, then uses the existing OpenCode skills for routing and act execution.
3. Create a thin `neuroplast-planner` agent that uses the same bootstrap contract but prefers conceptualization, plan inspection, and bounded plan creation.
4. Update adapter-asset docs and OpenCode guidance to explain when to use the agents versus the skills.
5. Extend validation and tests so the new OpenCode agent assets are shipped and present after `init`.
6. Run `npm run validate`, `npm test`, and `npm run release:verify`.
7. Update concept, changelog, and learning artifacts to reflect the agent-plus-skill OpenCode adoption model.

## Verification
- [ ] `npx neuroplast init` installs OpenCode agent assets under `neuroplast/adapter-assets/opencode/agents/`.
- [ ] The OpenCode asset set includes `neuroplast-orchestrator` and `neuroplast-planner` plus the existing skills.
- [ ] Docs explain that OpenCode should prefer the thin agents so the skills are reliably invoked.
- [ ] `npm run validate` passes.
- [ ] `npm test` passes.
- [ ] `npm run release:verify` passes.

## Risks
- The exact OpenCode agent metadata shape may evolve, so the shipped agent files should remain explicitly copy/paste-oriented rather than overclaiming guaranteed native support.
- If the agent format changes materially, the wrapper docs may need a follow-up compatibility note.

## Handoff
- If OpenCode later exposes a true repo startup prompt, keep the agents but simplify their wrapper logic instead of moving workflow authority into tool-only configuration.

## Follow-Up Correction
- OpenCode skill assets were initially modeled as flat markdown files. Correct the layout to match OpenCode's folder-per-skill convention: `skills/<skill-name>/SKILL.md`.
- Update validation, tests, architecture docs, and adapter asset docs so they reference the corrected skill paths.

## Related
- [[project-concept/cross-adapter-interaction-routing.md]]
- [[project-concept/interaction-routing-compatibility-proof.md]]
- [[plans/adapter-bootstrap-assets.md]]
- [[learning/copy-paste-ready-adapter-assets-should-stay-thin-and-contract-anchored.md]]
