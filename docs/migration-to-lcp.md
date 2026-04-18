# Migrating Existing Neuroplast Repositories Toward Explicit LCP Alignment

Normative LCP source:

- <https://github.com/JamesNapoletano/lcp>

## Summary

Existing Neuroplast repositories remain valid. This release adds explicit LCP alignment and an `.lcp/` bridge layout without requiring users to abandon the existing `/neuroplast/` workflow.

## Upgrade Path

1. Upgrade Neuroplast.
2. Run `npx neuroplast sync --dry-run`.
3. Run `npx neuroplast sync`.
4. Run `npx neuroplast validate`.

## What Stays Stable

- `init`, `sync`, and `validate`
- `/neuroplast/` as the main working layout
- existing plans, learning notes, changelog entries, and extensions

## Version Tracking

- `Neuroplast v1.2.2 implements LCP v1`

Later:

- `Neuroplast vX.Y.Z implements LCP v1.0.0`
