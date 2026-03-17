# Concept Consistency Instructions (AI-Operator Format)
#instruction

## Purpose
Keep architecture and concept artifacts aligned with implemented changes.

## Inputs
- Current implementation changes
- `ARCHITECTURE.md`
- `/neuroplast/project-concept/` artifacts

## Outputs
- Updated `ARCHITECTURE.md` when implementation materially changes architecture
- Updated files under `/neuroplast/project-concept/` when implementation materially changes concept assumptions
- Updated concept files under `/neuroplast/project-concept/` include `#project-concept` directly under the H1 title

## Steps
1. Compare current implementation state to `ARCHITECTURE.md`.
2. If architecture-relevant differences exist, update `ARCHITECTURE.md`.
3. Compare current implementation state to `/neuroplast/project-concept/` documents.
4. If concept-relevant differences exist, update affected files in `/neuroplast/project-concept/`.
5. Ensure updated `/neuroplast/project-concept/` files include `#project-concept` under the H1 title (exclude `/changelog/`, which uses `#changelog`).
6. Keep terminology and structure consistent across architecture and concept documents.

## Validation Checklist
- [ ] `ARCHITECTURE.md` reflects current architecture decisions.
- [ ] Project concept files reflect current intended behavior and scope.
- [ ] Updated concept files include required Obsidian tags (`#project-concept`, or `#changelog` for changelog entries).
- [ ] Naming and links remain consistent after updates.

## Failure Handling
- If `ARCHITECTURE.md` is missing, create it before updating.
- If `/neuroplast/project-concept/` is missing, create required folders/files before updating.

## Stop Condition
Stop when architecture and concept artifacts are aligned with implementation state.
