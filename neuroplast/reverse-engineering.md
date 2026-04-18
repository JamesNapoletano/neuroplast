---
neuroplast:
  role: instruction
  step: reverse-engineer
  requires:
    - neuroplast/WORKFLOW_CONTRACT.md
    - neuroplast/PLANNING_INSTRUCTIONS.md
    - neuroplast/conceptualize.md
  writes_to:
    - neuroplast/project-concept
    - neuroplast/project-concept/changelog
    - neuroplast/learning
    - ARCHITECTURE.md
  outputs:
    - neuroplast/project-concept/codebase-reverse-engineering-evidence.md
    - neuroplast/project-concept/*.md
    - ARCHITECTURE.md
  optional: true
  human_review: recommended
  tags:
    - instruction
---

# Reverse-Engineering Instructions (AI-Operator Format)
#instruction

## Purpose
Reconstruct a project mind from an existing codebase when the durable context in `/neuroplast/project-concept/` is missing, stale, or does not yet match what the code actually does. Collect code-grounded evidence about work surfaces, runtime behavior, state, and external interfaces, then hand that evidence to `conceptualize.md` so it becomes normal orientation, detailed-context, and architecture artifacts instead of a freestanding dump.

Reverse-engineering is a specialized pre-conceptualization mode. It does not replace `conceptualize.md`, it feeds it.

## When To Use
- A codebase exists but the project mind has not been captured yet.
- Existing `/neuroplast/project-concept/` artifacts have drifted from the code and need to be rebuilt from evidence.
- A new human or AI operator is onboarding to an unfamiliar repository and needs durable, shareable context rather than one-off explanations.

## When Not To Use
- The project mind already reflects the code. Start with `act.md` instead.
- The work is a new initiative or a materially changed scope without a codebase to examine. Start with `conceptualize.md` instead.

## Inputs
- `WORKFLOW_CONTRACT.md`
- `PLANNING_INSTRUCTIONS.md`
- `conceptualize.md`
- The repository's code, configuration, and documentation (primary evidence source)
- Any existing files under `/neuroplast/project-concept/`, `/neuroplast/plans/`, and `/neuroplast/learning/` (treat as secondary evidence; do not assume they are current)
- Current human operator goals, scope boundaries, and any known no-go areas

## Outputs
- One evidence artifact: `neuroplast/project-concept/codebase-reverse-engineering-evidence.md`
- All Layer 1 and Layer 2 project-mind artifacts produced by the downstream `conceptualize.md` run, per `PLANNING_INSTRUCTIONS.md`
- An updated or new root `ARCHITECTURE.md` when the reverse-engineering pass materially changes the canonical structure
- Concept files include `#project-concept` directly under the H1 title, per the Obsidian tagging policy

## Evidence Artifact Template
The evidence artifact is a single, self-contained note that captures what the code reveals. It must follow this shape so `conceptualize.md` can translate each inferred surface into a normal Orientation + Detailed Context pair.

```md
# Codebase Reverse-Engineering Evidence
#project-concept
## Scanned Surface
- Top-level files, docs, package/build manifests, language footprint, entry points, test roots, CI configuration
## Inferred Work Surfaces
- Candidate subject / area — evidence paths and short behavior note
## Runtime and Control Flow Notes
- Observed loops, request paths, CLI commands, schedulers, background jobs
## State and Data Model Notes
- Persistent stores, schemas, on-disk artifacts, migrations, caches
## External Interfaces
- APIs, CLIs, SDKs, protocols, third-party integrations
## Open Questions for the Human
- Ambiguities that code inspection alone cannot resolve
## Handoff to conceptualize.md
- For each Inferred Work Surface: target Orientation file name and Detailed Context file name
```

## Steps
1. Read `WORKFLOW_CONTRACT.md` fully before writing files.
2. Read `PLANNING_INSTRUCTIONS.md` and `conceptualize.md` fully so the pass stays compatible with the canonical downstream outputs.
3. Ensure required folders exist:
   - `/neuroplast/project-concept/`
   - `/neuroplast/project-concept/changelog/`
   - `/neuroplast/learning/`
   - `/neuroplast/plans/`
4. Inventory the repository at the top level: README and docs, package or build manifests, language footprint, entry points, CLI or binary targets, test roots, CI configuration. Record the raw observations; do not yet synthesize conclusions.
5. Walk the code breadth-first and identify candidate work surfaces: major modules, bounded contexts, data stores, external interfaces, runtime loops, and scheduled work.
6. For each candidate surface, collect code-grounded evidence: representative file paths, key symbols, and a short behavior note. Keep the evidence anchored in paths and names that the human can open directly.
7. Note any contradictions between the code and existing documentation, plans, or concept artifacts. Treat the code as the ground truth and flag the drift for human resolution.
8. Write `neuroplast/project-concept/codebase-reverse-engineering-evidence.md` using the template above. Include `#project-concept` directly under the H1.
9. Record unresolved ambiguities in the evidence artifact's `Open Questions for the Human` section rather than guessing.
10. Do not perform refactors, migrations, or execution work during this phase. If the code appears broken, record the observation in the evidence artifact and continue.
11. Execute `conceptualize.md`, treating the evidence artifact as the primary input so it produces the Layer 1 and Layer 2 artifacts defined in `PLANNING_INSTRUCTIONS.md` and updates root `ARCHITECTURE.md` when the canonical structure changes.
12. When `conceptualize.md` reaches its Stop Condition, instruct the human operator to continue with `act.md` for bounded execution work.

## Behavioral Constraints
- Treat the code and its configuration as the ground truth. Treat existing `/neuroplast/project-concept/` artifacts as secondary evidence that may be stale.
- Do not invent runtime behavior that the code does not support. Record uncertainty as an open question.
- Keep the evidence artifact anchored in file paths, symbols, and named artifacts so a human can verify each claim directly.
- Do not expand scope into primary execution work during this phase.
- Keep the reverse-engineering pass domain-agnostic. Software, research, and other code-shaped repositories must all be describable through the same artifact shape.

## Validation Checklist
- [ ] All required folders exist.
- [ ] `neuroplast/project-concept/codebase-reverse-engineering-evidence.md` exists and follows the evidence artifact template.
- [ ] The evidence artifact includes `#project-concept` directly under the H1 title.
- [ ] Each inferred work surface cites at least one concrete path, symbol, or named artifact as evidence.
- [ ] Open questions are recorded instead of guessed.
- [ ] `conceptualize.md` has been executed after the evidence artifact was written, producing the required Layer 1 and Layer 2 artifacts per `PLANNING_INSTRUCTIONS.md`.
- [ ] Root `ARCHITECTURE.md` exists and reflects the canonical structure inferred from the pass when that structure was established or refined.
- [ ] No primary execution work (refactor, migration, runtime change) was performed during this phase.

## Failure Handling
- If `PLANNING_INSTRUCTIONS.md` or `conceptualize.md` is missing, stop and report: `Missing required input: PLANNING_INSTRUCTIONS.md` or `Missing required input: conceptualize.md`.
- If the repository is empty or there is no code to examine, stop and report: `No codebase available for reverse-engineering; use conceptualize.md for greenfield work instead.`
- If the code cannot be read because of environment limits, record the blocker in the active plan and degrade to the smallest bounded pass the environment supports before stopping.
- If naming conflicts arise between inferred work surfaces and existing concept files, normalize names and let `conceptualize.md` reconcile the links during its own validation step.

## Stop Condition
Stop after the evidence artifact is complete, `conceptualize.md` has finished its own Stop Condition for the inferred work surfaces, and the validation checklist passes.
