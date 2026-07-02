# Neuroplast 2.0 — LCP v2.0 Integration
#plan

## Current Objective
Make Neuroplast a proper LCP v2.0 implementation: a living `.lcp/` context that Neuroplast reads (assembly) and writes (memory lifecycle), with quantization and schema-true validation baked into the CLI.

## Scope
- Upgrade `src/lcp-files/*` bridge templates to LCP v2.0 (`documents`, `active_profiles`, `extensions`).
- Store durable memory as LCP `knowledge_artifact` entries with lifecycle/provenance; render `neuroplast/learning/*.md` from them.
- Implement the operational binding: assemble (read) + `remember` write-back (upsert/supersede).
- Native `.lcpq` quantization (`neuroplast quantize`), regenerated on sync.
- Schema-true validation against vendored LCP v2.0 schemas + `.lcpq` staleness.
- Upgrade migration for existing repos; bump to 2.0.0.

## Status
Complete. See [[project-concept/changelog/2026-06-30.md]].

## Verification For This Cycle
- `npm test` green (53/53).
- `neuroplast validate` reports 0 errors on this repo.
- Quantizer interop verified against the LCP reference `lcpq.py`.
