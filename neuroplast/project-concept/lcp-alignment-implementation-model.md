# Neuroplast LCP Alignment Implementation Model
#project-concept

## Purpose
Describe how Neuroplast now positions itself relative to the Local Cognitive Protocol (LCP) while preserving backward compatibility.

## Core Statement
LCP is the normative external protocol source. Neuroplast is an implementation of LCP for repository-local cognitive augmentation.

## Implementation Layers
1. **LCP semantic layer** — normative concepts and declarative semantics from the official LCP repository.
2. **Neuroplast compatibility profile** — the `/neuroplast/` layout, `ARCHITECTURE.md`, instruction files, and validation defaults.
3. **Neuroplast implementation tooling** — `init`, `sync`, `validate`, managed-file refresh, migrations, and sync state.

## Compatibility Strategy
- Preserve `/neuroplast/` as the implementation-owned workspace.
- Add `.lcp/` as an explicit LCP bridge entrypoint.
- Keep validation trustworthy by checking both the LCP bridge and the Neuroplast profile.
- Keep runtime behavior local and filesystem-first, without network coupling to the LCP repository.

## Domain Positioning
Neuroplast is domain-agnostic. Software remains an important example, but Neuroplast also targets research, science, education, collaborative learning, and other repository-local knowledge contexts.

## Project-Mind Operating Model
Neuroplast should be understood as a project mind shared by humans and AI, not only as a software execution framework. Its files should preserve orientation, the current objective, durable reasoning context, change history, and reusable lessons across sessions and tools.

## Related
- [[plans/lcp-alignment-and-dual-layout-compatibility.md]]
- [[project-concept/release-and-compatibility-policy.md]]
