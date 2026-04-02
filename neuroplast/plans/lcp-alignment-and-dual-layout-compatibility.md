# LCP Alignment and Dual-Layout Compatibility
#plan

## Goal
Reposition Neuroplast as an explicit implementation of the Local Cognitive Protocol (LCP), add normative references to the official LCP repository, introduce a repository-local `.lcp/` bridge layout alongside the existing `/neuroplast/` layout, and refactor validator/runtime boundaries so LCP semantics are separated from Neuroplast implementation behavior.

## Scope
- Update core positioning docs to state that Neuroplast implements LCP rather than defining it.
- Add mapping, compatibility, migration, and domain-generalization documentation.
- Add packaged `.lcp/` bridge artifacts that reference Neuroplast-managed files without creating a runtime dependency on the external LCP repository.
- Refactor validation to distinguish LCP bridge checks from Neuroplast profile checks.
- Preserve the existing `init`, `sync`, and `validate` command surface and backward compatibility.

## Constraints
- Keep the filesystem-first philosophy.
- Preserve `/neuroplast/` usability for existing users.
- Do not claim Neuroplast is the standard.
- Do not make LCP GitHub access a runtime dependency.
- Keep MCP outside the core implementation boundary.

## Deliverables
- README positioning update
- Architecture update
- `docs/lcp-mapping.md`
- `docs/lcp-compatibility.md`
- `docs/domain-generalization.md`
- `docs/migration-to-lcp.md`
- Packaged `.lcp/` bridge files
- Validator/runtime boundary refactor
- Updated tests for dual-layout behavior

## Implementation Steps
1. Add a Neuroplast-to-LCP mapping and compatibility model in docs.
2. Introduce packaged `.lcp/manifest.yaml` plus supporting bridge documents that point at Neuroplast-owned artifacts.
3. Update runtime constants/init flow so `.lcp/` bridge files are installed and managed.
4. Refactor validation into LCP bridge checks and Neuroplast profile checks.
5. Update README and architecture language to separate protocol semantics from implementation tooling.
6. Add migration guidance for existing Neuroplast repositories.
7. Run tests and validation; fix any regressions.
8. Record changelog and learning updates.

## Verification
- [ ] `npm test` passes.
- [ ] `npm run validate` passes for this repository.
- [ ] Initialized repositories still validate with the Neuroplast profile.
- [ ] `.lcp/manifest.yaml` is installed and validated as a bridge entrypoint.
- [ ] Docs clearly identify LCP as the normative external protocol source.
- [ ] Changelog records the follow-up 1.2.0 version-statement doc sync.

## Migration Decision
Migration required: yes

## Reason
This work changes package-managed assets, validation behavior, and the installed repository surface by adding an `.lcp/` compatibility layer while preserving existing `/neuroplast/` behavior.

## Follow-up
- Version-statement references were synced in a later documentation pass tracked by [[plans/minor-version-doc-sync-1.2.0.md]] and logged in [[project-concept/changelog/2026-04-02.md]].
