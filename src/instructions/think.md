---
neuroplast:
  role: instruction
  step: think
  requires:
    - .lcp/knowledge/neuroplast-learning.yaml
  writes_to:
    - .lcp/knowledge/neuroplast-learning.yaml
  outputs:
    - .lcp/knowledge/neuroplast-learning.yaml
    - .lcp/indexes/context.lcpq
    - .lcp/indexes/context.distilled.lcpq
  optional: false
  human_review: recommended
  tags:
    - instruction
---

# Learning Capture Instructions (AI-Operator Format)
#instruction

## Purpose
Capture reusable, non-sensitive learnings from the current work cycle as durable LCP memory. This is the **write-back** half of the LCP operational binding: each learning becomes an explicit knowledge-artifact entry with provenance, so memory can be trusted, superseded, and retired without losing history. Neuroplast holds no memory of its own outside this artifact — it is a workflow layered on the LCP context, not a second memory store.

## Source of Truth
`.lcp/knowledge/neuroplast-learning.yaml` is the sole, authoritative store for learning memory (LCP v2.0 `knowledge_artifact` entries). There is no separate rendered view; the quantized indexes derived from it (below) are disposable and always reconstructable from this file.

## Inputs
- Mistakes or insights from the current work cycle
- Existing memory in `.lcp/knowledge/neuroplast-learning.yaml`

## Outputs
- One or more new or superseding memory entries in `.lcp/knowledge/neuroplast-learning.yaml`
- Regenerated `.lcp/indexes/context.lcpq` (pack) and `.lcp/indexes/context.distilled.lcpq` (distill)

## Steps
1. Identify key mistakes, corrections, and reusable practices from the current work.
2. Exclude sensitive, brand-specific, or confidential details.
3. Decide whether the cycle produced one reusable learning or multiple materially distinct learnings.
4. For each learning, assess its confidence deliberately — do not accept the CLI default without judgment. Confidence is `0` (speculative) to `1` (established); it is what lets `neuroplast quantize --distill` prioritize established memory over speculative memory in the working view. Use this rubric as a starting point, not a rigid formula:
   - **0.9–1.0** — verified directly: a test passed, the user explicitly confirmed it, or the same practice was reinforced across multiple independent cycles.
   - **0.7–0.8** — reasonably confident: worked as expected this cycle, the reasoning is sound, and nothing contradicts it, but it has not been independently reinforced yet.
   - **0.5–0.6** — plausible but unverified: a single observation, an inference from indirect evidence, or a practice that seemed to work but wasn't directly checked.
   - **below 0.5** — speculative or tentative: record it if it may still be useful, but expect `distill`'s default `--min-confidence 0.5` threshold to exclude it from the working view until it is reinforced or confirmed.
5. For each learning, record it as durable memory using the CLI write-back so provenance, lifecycle, and both derived indexes stay consistent in one step:
   - New learning: `neuroplast remember --id <stable-id> --title "<Title>" --note "<body>" --confidence <0-1>` (the note body may be piped on stdin for multi-line content).
   - Revised learning: `neuroplast remember --id <new-id> --supersedes <prior-id> --note "<body>" --confidence <0-1>`. This marks the prior entry `superseded` and links the new one, preserving the revision chain. A revision's confidence is independent of the entry it supersedes — reassess it, don't copy it forward.
   - `remember` regenerates both `.lcp/indexes/context.lcpq` (pack) and `.lcp/indexes/context.distilled.lcpq` (distill) automatically — they are separate files, so writing one never leaves the other stale or reverts it.
6. If editing the artifact directly instead of using the CLI, follow the same memory lifecycle (add a new entry with an `id`, `status`, an assessed `confidence`, and `provenance`; never mutate or delete a prior entry — supersede it), then run `neuroplast sync` to regenerate both derived indexes.

## Validation Checklist
- [ ] Each learning entry captures actionable practice-level insight.
- [ ] No sensitive or brand-specific information is included.
- [ ] Each new entry has a stable `id`, a deliberately assessed `confidence` (not a silently accepted default), and `provenance`.
- [ ] Revisions supersede prior entries rather than overwriting them, with their own reassessed `confidence`.
- [ ] `neuroplast validate` reports a consistent memory lifecycle and current pack + distilled indexes.

## Failure Handling
- If `.lcp/knowledge/neuroplast-learning.yaml` is missing, run `neuroplast sync` to seed it before writing memory.
- If a supersession target id is unknown, confirm the prior entry id from the artifact before linking.

## Stop Condition
Stop after the execution cycle's reusable learnings have been recorded as validated LCP memory entries and both derived indexes have been regenerated.
