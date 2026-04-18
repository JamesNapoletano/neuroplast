---
neuroplast:
  role: instruction
  step: plan
  requires:
    - neuroplast/WORKFLOW_CONTRACT.md
  writes_to:
    - neuroplast/project-concept
    - ARCHITECTURE.md
  outputs:
    - neuroplast/project-concept/* - High Level.md
    - neuroplast/project-concept/* - Mid Level.md
    - ARCHITECTURE.md
  optional: false
  human_review: recommended
  tags:
    - instruction
---

# Planning Instructions (AI-Operator Format)
#instruction

## Purpose
Generate a structured project-mind context for the repository so a human and an AI can orient quickly, choose the current objective, and resume work reliably.

## Inputs
- Repository concept, domain context, and relevant work surfaces (from the human or prior project context)
- Existing project files for naming consistency (if present)

## Outputs
- Domain-specific orientation artifact file(s)
- Domain-specific detailed context artifact file(s)
- Canonical architecture or project-map file:
  - `ARCHITECTURE.md` (repository root)

Optional supporting planning artifact in `/neuroplast/project-concept/`:
- `Architecture Notes.md`

All generated planning files must include `#project-concept` directly under the H1 title.

All output files should be placed in the designated planning output folder (typically `/neuroplast/project-concept/`).

## Layer Definitions

### Layer 1 — Orientation Artifacts (Per Work Surface or Subject Area)
Create one file per primary work surface, artifact family, subject area, or equivalent unit when that decomposition is useful.

```md
# <Subject Name> — Orientation
#project-concept
## Purpose
What this subject, work surface, or area is for.
## Current Reality
What is true now.
## Desired Outcome
What good looks like.
## Important Actors or Stakeholders
- Actor 1
- Actor 2
## Key Artifacts or Interfaces
- Artifact / interface — role
## Constraints
- Constraint 1
- Constraint 2
## Open Questions
- Question 1
## Link to Detailed Context
[[<Subject Name> - Detailed Context]]
```

### Layer 2 — Detailed Context (Per Work Surface or Subject Area)
Create one file per primary work surface, artifact family, subject area, or equivalent unit when that decomposition is useful.

```md
# <Subject Name> — Detailed Context
#project-concept
## Linked Orientation
[[<Subject Name> - Orientation]]
## Purpose
Describe the role of this subject in the overall project mind.
## Important State and Dependencies
List the key dependencies, inputs, outputs, or environmental assumptions.
## Process or Interaction Model
Describe how work, information, or decisions move through this area.
## Decisions and Rationale
Capture important choices and why they were made.
## Risks and Failure Modes
List likely failure modes, ambiguities, and uncertainty.
## Verification or Evidence
Describe how the team will know this area is healthy, complete, or correct.
## Relationship to Other Areas
Describe how this area connects to adjacent workflows, artifacts, or subjects.
## Open Questions
List unresolved decisions or missing information.
## Link to Canonical Architecture
[[ARCHITECTURE]]
```

### Layer 3 — Canonical Architecture Reference
Create or update the repository root architecture file:

```md
# Neuroplast Architecture
## Scope
Define what parts of the system this architecture covers.
## Project Structure
Describe the major systems, domains, artifacts, or work surfaces.
## Core Workflows
Describe the important loops, interactions, or operating flows.
## Tools and Interfaces
List important tools, interfaces, or platforms when relevant.
## State and Knowledge Model
Describe where important project state, decisions, and memory live.
## Constraints and Boundaries
List important constraints, safety rules, compliance needs, or operating limits.
## Verification Strategy
Describe how correctness, quality, or readiness is evaluated.
## Environment and Operations
Describe environment assumptions, operational rules, or deployment/runtime context when relevant.
## Architecture Decisions
List key architectural decisions and their rationale.
```

Optional supporting concept artifact:

```md
# Architecture Notes
Summarize planning-stage architecture context that informs root `ARCHITECTURE.md` without replacing it.
```

## Linking Rules
- Orientation → Detailed Context
- Detailed Context → Orientation + `ARCHITECTURE.md`
- `ARCHITECTURE.md` → no required back-links
- Obsidian wiki-links are recommended for compatible editors, but the workflow meaning must remain clear in plain markdown.

## Behavioral Constraints
- Maintain consistent naming across all layers.
- Do not introduce new subjects in detailed-context files that do not exist in orientation files.
- Keep all files self-contained and structured.
- Use predictable markdown formatting and headings.

## Validation Checklist
- [ ] Every chosen subject has both Orientation and Detailed Context files when multi-layer decomposition is used.
- [ ] Every Orientation file links to the matching Detailed Context file.
- [ ] Every Detailed Context file links to Orientation and `ARCHITECTURE.md`.
- [ ] Root `ARCHITECTURE.md` exists with all required sections.
- [ ] File names are consistent and links resolve.

## Failure Handling
- If the set of work surfaces or planning units is missing or ambiguous, stop and request an inventory before generating files.
- If output directory is missing, create it before writing files.
- If naming conflicts are found, normalize names and re-validate links.

## Stop Condition
Stop after all three layers are generated and validation checklist passes.
