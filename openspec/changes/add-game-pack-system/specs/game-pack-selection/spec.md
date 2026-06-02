## ADDED Requirements

### Requirement: Block pack-dependent routes when no packs are installed
The system SHALL prevent access to Editor and Gallery when there are no installed GamePacks.

#### Scenario: Block Editor without installed packs
- **WHEN** a user attempts to enter Editor and the installed pack list is empty
- **THEN** the system blocks entry and shows a pack-installation or selection path instead of loading the editor

#### Scenario: Block Gallery without installed packs
- **WHEN** a user attempts to enter Gallery and the installed pack list is empty
- **THEN** the system blocks entry and shows a pack-installation or selection path instead of loading the gallery

### Requirement: Select a global active GamePack
The system SHALL allow the user to select one global active GamePack from the set of installed packs.

#### Scenario: Change active pack
- **WHEN** the user selects a different installed GamePack in the global selector
- **THEN** the application updates the active GamePack used by pack-dependent flows

### Requirement: Require an installed pack for pack-dependent workflows
The system SHALL resolve pack-dependent workflows against the currently active installed GamePack.

#### Scenario: Enter pack-dependent flow with an active pack
- **WHEN** at least one GamePack is installed and one of them is active
- **THEN** the application allows pack-dependent workflows to continue with that active pack
