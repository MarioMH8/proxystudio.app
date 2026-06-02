## ADDED Requirements

### Requirement: Use generic core layer types
The system SHALL represent core editor layers using the generic types `group`, `text`, and `image`, and SHALL attach `presetId` and `settings` to renderable layers that come from GamePack presets.

#### Scenario: Create renderable layer from preset
- **WHEN** the user creates a layer from a GamePack preset
- **THEN** the resulting layer uses a generic core type and stores the preset identifier plus preset-driven settings

### Requirement: Populate add-layer options from the active GamePack
The system SHALL derive add-layer options from the layer presets defined by the active GamePack instead of a hardcoded application list.

#### Scenario: Switch active pack changes add-layer options
- **WHEN** the active GamePack changes
- **THEN** the add-layer UI reflects the presets declared by the newly active pack

### Requirement: Render inspector controls from preset field definitions
The system SHALL render layer inspector controls from the declarative preset field definitions of the selected layer's preset.

#### Scenario: Show inspector for preset-defined fields
- **WHEN** the selected layer references a preset with declarative field definitions
- **THEN** the inspector renders editable controls for those fields without requiring hardcoded per-type inspector UI

#### Scenario: Persist inspector edits in preset settings
- **WHEN** a user edits a declarative preset field in the inspector
- **THEN** the system updates the layer's preset-backed `settings` data
