# Verification-First Changelog Extension
#instruction

## Purpose
Make completed work easier to trust by summarizing how it was verified.

## Canonical References
- `neuroplast/WORKFLOW_CONTRACT.md`
- `neuroplast/manifest.yaml`
- `neuroplast/capabilities.yaml`
- `neuroplast/CHANGELOG_INSTRUCTIONS.md`

## Additional Steps
1. Read and follow `neuroplast/CHANGELOG_INSTRUCTIONS.md` first.
2. For behavior-changing or contract-relevant work, mention the key verification performed (for example tests, validate runs, or smoke checks).
3. If verification was partially blocked, summarize the fallback evidence rather than implying full verification.

## Validation Checklist
- [ ] Changelog entries mention meaningful verification for completed behavior changes when relevant.
- [ ] Verification claims stay accurate and scoped.

## Boundary Reminder
This extension is additive guidance and must not override the Neuroplast workflow contract.
