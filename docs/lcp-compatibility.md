# Neuroplast LCP Compatibility Profile

Normative LCP source:

- <https://github.com/JamesNapoletano/lcp>

## Terms

### LCP-aligned
A repository is **LCP-aligned** when it exposes local context through LCP-compatible declarative semantics.

### Neuroplast-compatible
A repository is **Neuroplast-compatible** when it also follows Neuroplast's managed layout, validation rules, and CLI expectations.

## Dual-Layout Model

Neuroplast now uses a dual-layout model:

1. **`.lcp/`** provides the explicit LCP-facing bridge entrypoint.
2. **`/neuroplast/`** remains the Neuroplast-owned working layout.

The `.lcp/` documents describe and reference Neuroplast-managed artifacts; they do not replace them.

## What Neuroplast Requires

- `.lcp/manifest.yaml`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/WORKFLOW_CONTRACT.md`
- Neuroplast instruction files
- Neuroplast working directories

## Boundary Rules

- LCP remains the external normative protocol source.
- Neuroplast must not claim to define LCP independently.
- Neuroplast-specific layout assumptions belong to the Neuroplast profile, not to LCP core language.
- Extensions and adapters remain additive and non-authoritative.

## Version Statement

- `Neuroplast v1.3.0 implements LCP v1`
