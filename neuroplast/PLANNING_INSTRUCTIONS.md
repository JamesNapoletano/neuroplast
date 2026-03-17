# Planning Instructions (AI-Operator Format)
#instruction

## Purpose
Generate a structured, three-layer conceptual architecture for an application and store all planning artifacts as markdown files.

## Inputs
- Application concept and page list (from user or prior planning context)
- Existing project files for naming consistency (if present)

## Outputs
- Per-page high-level file(s):
  - `<PageName> - High Level.md`
- Per-page mid-level file(s):
  - `<PageName> - Mid Level.md`
- Global architecture file:
  - `Tech Stack Architecture.md`

All generated planning files must include `#project-concept` directly under the H1 title.

All output files should be placed in the designated planning output folder (typically `/neuroplast/project-concept/`).

## Layer Definitions

### Layer 1 — High-Level Page Specs (Per Page)
Create one file per page:

```md
# <Page Name> — High Level
## Purpose
What the page is for.
## Description
High-level overview of what the user sees and does.
## Features
- Feature 1
- Feature 2
## Forms / Inputs
- Field — purpose
## Sections
- Section — description
## Navigation
- Arrives from: …
- Goes to: …
## Link to Mid-Level
[[<PageName> - Mid Level]]
```

### Layer 2 — Mid-Level Architecture (Per Page)
Create one file per page:

```md
# <Page Name> — Mid Level Architecture
## Linked High-Level
[[<PageName> - High Level]]
## Purpose
Describe the purpose of this page in the system.
## Primary Audiences
List the user groups this page serves.
## Page Information Architecture
Break down the major sections of the page and their roles.
## Navigation Model
Describe how users move through this page and its sections.
## Functional Requirements
Detail the functional expectations for each major section.
## UX and Visual Behavior
Describe layout, responsiveness, accessibility, and interaction expectations.
## Data and Integration Notes
List data inputs, outputs, payloads, and integration points.
## Error and Edge Cases
List expected failure modes and how the UI should respond.
## Security and Compliance
List security requirements, constraints, and compliance considerations.
## Content Dependencies
List any content or copy required before implementation.
## Relationship to Other Pages
Describe how this page connects to other workflows.
## Open Questions
List unresolved decisions or missing information.
## Link to Global Tech Stack
[[Tech Stack Architecture]]
```

### Layer 3 — Global Low-Level Tech Stack (Single File)
Create one global file:

```md
# Tech Stack Architecture (Global)
## Scope
Define what parts of the system this architecture covers.
## Recommended Tech Stack
List frameworks, languages, libraries, and tools.
## Application Structure
Describe route groups, shared layers, and folder conventions.
## Rendering Strategy
Describe server/client rendering rules and boundaries.
## Component Architecture
Break down major component groups and their internal structure.
## State Management
Describe local, shared, and global state patterns.
## Forms and Validation
Describe form libraries, validation rules, and submission flows.
## Navigation and Routing Behavior
Describe routing patterns, deep linking, and navigation rules.
## Design System
Describe tokens, scales, primitives, and shared UI conventions.
## Accessibility Requirements
List required accessibility standards and behaviors.
## Security Considerations
List security constraints and safe implementation patterns.
## Analytics and Observability
Describe event tracking, monitoring, and error reporting.
## Performance Targets
List performance goals and optimization tactics.
## Testing Strategy
Describe unit, integration, E2E, and accessibility testing approaches.
## Environment Configuration
List required environment variables and configuration rules.
## Deployment Model
Describe deployment structure and operational considerations.
## Architecture Decisions
List key architectural decisions and their rationale.
```

## Linking Rules
- High Level → Mid Level
- Mid Level → High Level + Tech Stack
- Tech Stack → no required back-links
- Use Obsidian wiki-links: `[[File Name]]`

## Behavioral Constraints
- Maintain consistent naming across all layers.
- Do not introduce new pages in mid-level files that do not exist in high-level files.
- Keep all files self-contained and structured.
- Use predictable markdown formatting and headings.

## Validation Checklist
- [ ] Every page has both High Level and Mid Level files.
- [ ] Every High Level file links to the matching Mid Level file.
- [ ] Every Mid Level file links to High Level and Tech Stack files.
- [ ] `Tech Stack Architecture.md` exists with all required sections.
- [ ] File names are consistent and links resolve.

## Failure Handling
- If page list is missing or ambiguous, stop and request a page inventory before generating files.
- If output directory is missing, create it before writing files.
- If naming conflicts are found, normalize names and re-validate links.

## Stop Condition
Stop after all three layers are generated and validation checklist passes.
