# Minor Version Doc Sync 1.2.2
#plan

## Scope
- Bump the package version from `1.2.1` to `1.2.2`.
- Align all canonical human-readable version statements with the new package version.
- Bundle the already-prepared required `reverse-engineering.md` promotion into the same patch release and record both release items clearly in the same dated changelog entry.

## Sync Impact Decision
- no migration needed

## Assumptions
- The required `reverse-engineering.md` promotion is already implemented and verified locally; this release cycle packages it together with the patch bump.
- Existing historical plans and changelog references to `1.2.0` and `1.2.1` remain valid historical records and should not be rewritten.

## Execution Steps
1. Update `package.json` to `1.2.2`.
2. Update current release-facing canonical version statements from `1.2.1` to `1.2.2` across README, docs, source profile templates, source manifests, and managed `.lcp` profile artifacts.
3. Record the release as two bullets under the same `2026-04-18` changelog entry: one for the required reverse-engineering promotion and one for the `1.2.2` patch/version-sync release packaging.
4. Verify no stale `1.2.1` canonical version statements remain in current release-facing files.
5. Run `npm test` and `npm run release:verify`.

## Verification
- [ ] `package.json` is `1.2.2`.
- [ ] Canonical version statements match `1.2.2` in release-facing docs and profiles.
- [ ] Changelog documents both the reverse-engineering promotion and the `1.2.2` patch release as separate bullets under the same date.
- [ ] `npm test` passes.
- [ ] `npm run release:verify` passes.

## Handoff
- Existing installs that have not yet received the required `reverse-engineering.md` file should run `npx neuroplast sync` after upgrading.

## Related
- [[plans/required-reverse-engineering-instruction-shipping.md]]
- [[plans/minor-version-doc-sync-1.2.1.md]]
- [[project-concept/changelog/2026-04-18.md]]
- [[project-concept/release-operations.md]]
