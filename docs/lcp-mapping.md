# Neuroplast to LCP Mapping

Neuroplast is an implementation of the [Local Cognitive Protocol (LCP)](https://github.com/JamesNapoletano/lcp), not the protocol standard itself.

The official normative source for LCP is:

- <https://github.com/JamesNapoletano/lcp>

## Positioning

- **LCP** defines the domain-agnostic protocol.
- **Neuroplast** implements LCP as a repository-local project mind for humans and AI systems.
- **Neuroplast CLI/runtime behavior** is implementation tooling, not LCP core semantics.

## Concept Mapping

| Neuroplast concept | LCP primitive or role | Status | Notes |
| --- | --- | --- | --- |
| `neuroplast/manifest.yaml` | Neuroplast compatibility/profile manifest aligned to LCP manifest concepts | Neuroplast-specific | Referenced by `.lcp/manifest.yaml` bridge files. |
| `.lcp/manifest.yaml` | LCP manifest | LCP core-aligned | Explicit bridge entrypoint. |
| `neuroplast/WORKFLOW_CONTRACT.md` | Human-readable implementation contract | Neuroplast-specific | Describes how Neuroplast realizes LCP locally. |
| `neuroplast/capabilities.yaml` | Capability/profile declaration adjacent to LCP profiles/tool descriptions | Neuroplast-specific | Advisory only. |
| Instruction frontmatter | Workflow metadata | Neuroplast-specific | Useful for loaders and validation. |
| `neuroplast/plans/` | Active working context / reasoning artifacts | LCP-aligned conceptually | Durable local task memory. |
| `neuroplast/learning/` | Knowledge artifacts | LCP core-aligned | Durable local knowledge store. |
| `neuroplast/project-concept/` | Context artifacts | Mostly LCP-aligned | Generalized beyond software. |
| `neuroplast/project-concept/changelog/` | Journal/history knowledge artifacts | Neuroplast convention | Useful but not LCP core. |
| `neuroplast/extensions/` | Additive extensions | LCP-compatible | Must remain additive. |
| `neuroplast/adapters/` | Tool descriptions / environment guides | LCP-compatible | Non-normative. |
| `ARCHITECTURE.md` | Domain-specific knowledge artifact / implementation default | Neuroplast default | Not LCP core. |
| `init`, `sync`, `validate`, `.neuroplast-state.json` | Implementation tooling | Neuroplast-only | Outside LCP core semantics. |

## File-Level Translation Matrix

| Existing file or directory | LCP-facing interpretation | Compatibility treatment |
| --- | --- | --- |
| `neuroplast/manifest.yaml` | Neuroplast profile metadata | Preserved |
| `neuroplast/capabilities.yaml` | Advisory capability declaration | Preserved |
| `neuroplast/WORKFLOW_CONTRACT.md` | Human-readable implementation boundary | Preserved, repositioned |
| `neuroplast/plans/` | Reasoning / active context | Preserved |
| `neuroplast/learning/` | Knowledge artifacts | Preserved |
| `neuroplast/project-concept/` | Domain context artifacts | Preserved, broadened |
| `.lcp/manifest.yaml` | LCP manifest | Added |
| `.lcp/profiles/neuroplast-default.yaml` | LCP profile | Added |
| `.lcp/workflows/neuroplast-loop.yaml` | LCP workflow | Added |
| `.lcp/rules/neuroplast-boundaries.yaml` | LCP rule | Added |
| `.lcp/reasoning/neuroplast-execution-scaffold.yaml` | LCP reasoning scaffold | Added |
| `.lcp/tools/neuroplast-cli.yaml` | LCP tool description | Added |
| `.lcp/knowledge/neuroplast-compatibility.yaml` | LCP knowledge artifact | Added |

## Versioning Statement Model

- `Neuroplast v1.3.0 implements LCP v1`

Later, when upstream tags are pinned:

- `Neuroplast vX.Y.Z implements LCP v1.0.0`
