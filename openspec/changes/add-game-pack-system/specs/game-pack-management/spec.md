## ADDED Requirements

### Requirement: Declarative GamePack manifests
The system SHALL represent each installable GamePack with a declarative manifest read from `game-pack.json`. The manifest SHALL include `schemaVersion`, `id`, `version`, and `name`, and MAY include `description`, `compatibility`, `capabilities`, `resources`, and `layerPresets`.

#### Scenario: Reject manifest with missing required fields
- **WHEN** the install or validation flow reads a manifest that omits a required field
- **THEN** the system rejects the manifest before creating a domain `GamePack`

#### Scenario: Build domain pack from validated manifest
- **WHEN** the system validates a manifest successfully
- **THEN** it creates a provider-agnostic domain `GamePack` from the manifest data

### Requirement: Validate compatibility and resources before install
The system SHALL validate manifest structure, declared compatibility, and resource references before persisting a GamePack as installed.

#### Scenario: Reject incompatible pack
- **WHEN** a manifest declares compatibility that does not match the running application constraints
- **THEN** the install flow fails with a validation result and does not persist the pack

#### Scenario: Reject invalid resources
- **WHEN** a manifest contains invalid or malformed resource references
- **THEN** the validation result reports the resource errors and installation does not continue

### Requirement: Persist installed packs for offline use
The system SHALL persist installed GamePacks locally so that previously installed packs remain available after application reload and without network access.

#### Scenario: Use installed pack after reload without network
- **WHEN** a user installs a GamePack and later reloads the application while offline
- **THEN** the system still lists the installed pack and allows pack-dependent features to resolve it locally

### Requirement: Discover packs from a remote catalog
The system SHALL list available GamePacks from a remote catalog through a provider-agnostic catalog repository.

#### Scenario: List available remote packs
- **WHEN** the catalog repository can reach a remote pack source
- **THEN** the system returns a list of available GamePacks without exposing provider-specific details in the application contract

### Requirement: Confirm removal of in-use packs
The system SHALL require explicit confirmation before removing an installed GamePack that is referenced by one or more cards.

#### Scenario: Remove unused pack without confirmation
- **WHEN** a user removes a GamePack whose usage count is zero
- **THEN** the system removes the pack without requiring additional confirmation

#### Scenario: Require confirmation for in-use pack
- **WHEN** a user removes a GamePack whose usage count is greater than zero
- **THEN** the system returns a confirmation-required result before completing removal
