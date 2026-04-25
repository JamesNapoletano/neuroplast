# OpenCode Skills Should Match the Tool-Native Folder Layout
#learning

## Insight
Copy/paste-ready assets only help when they match the destination tool's actual file conventions. For OpenCode, a skill is not just a markdown file with a kebab-case name; it lives in a folder named for the skill and the file inside must be `SKILL.md`.

## Reusable Practice
- Verify the destination tool's real on-disk asset shape before shipping copy/paste-ready wrappers.
- For OpenCode skills, use `skills/<skill-name>/SKILL.md` rather than flat markdown files.
- Include the tool-native frontmatter fields so the copied asset is directly usable.
- Update validation and tests whenever the packaged asset layout changes so the managed-file contract stays trustworthy.

## Related
- [[plans/opencode-neuroplast-agents.md]]
- [[project-concept/interaction-routing-compatibility-proof.md]]
- [[learning/opencode-should-use-thin-agents-to-invoke-shared-neuroplast-skills.md]]
