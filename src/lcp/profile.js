function getNeuroplastProfile() {
  return {
    versionStatement: "Neuroplast v1.3.1 implements LCP v1",
    rootArchitecturePath: "ARCHITECTURE.md",
    requiredDirectories: [
      "neuroplast/project-concept",
      "neuroplast/project-concept/changelog",
      "neuroplast/learning",
      "neuroplast/plans"
    ],
    requiredInstructionFiles: [
      "neuroplast/WORKFLOW_CONTRACT.md",
      "neuroplast/conceptualize.md",
      "neuroplast/reverse-engineering.md",
      "neuroplast/reconcile-conflicts.md",
      "neuroplast/PLANNING_INSTRUCTIONS.md",
      "neuroplast/act.md",
      "neuroplast/CONCEPT_INSTRUCTIONS.md",
      "neuroplast/CHANGELOG_INSTRUCTIONS.md",
      "neuroplast/think.md"
    ],
    requiredSupportFiles: [
      "neuroplast/capabilities.yaml",
      "neuroplast/manifest.yaml",
      "neuroplast/interaction-routing.yaml"
    ],
    expectedDocumentRoles: {
      manifest: "neuroplast/manifest.yaml",
      capabilities: "neuroplast/capabilities.yaml",
      contract: "neuroplast/WORKFLOW_CONTRACT.md",
      interaction_routing: "neuroplast/interaction-routing.yaml",
      architecture: "ARCHITECTURE.md",
      concept_dir: "neuroplast/project-concept",
      changelog_dir: "neuroplast/project-concept/changelog",
      plans_dir: "neuroplast/plans",
      learning_dir: "neuroplast/learning",
      environment_guides_dir: "neuroplast/adapters",
      adapter_assets_dir: "neuroplast/adapter-assets",
      extensions_dir: "neuroplast/extensions"
    }
  };
}

module.exports = {
  getNeuroplastProfile
};
