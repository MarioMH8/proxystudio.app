## ADDED Requirements

### Requirement: Persist exact GamePack reference on cards
The system SHALL persist a `gamePack` reference on each card using an exact `{ id, version }` pair.

#### Scenario: Save card with exact pack version
- **WHEN** the application creates or saves a card under the GamePack-aware model
- **THEN** the stored card includes `gamePack.id` and `gamePack.version`

### Requirement: New cards inherit the active GamePack
The system SHALL assign the global active GamePack to newly created cards.

#### Scenario: Create card from active pack
- **WHEN** a user creates a new card while a GamePack is active
- **THEN** the new card stores the active pack's exact `{ id, version }` reference

### Requirement: Mark cards as missing-pack when their pack is unavailable
The system SHALL mark cards as `missing-pack` when their referenced GamePack is no longer installed.

#### Scenario: Remove referenced pack
- **WHEN** a user confirms removal of an installed GamePack that is referenced by existing cards
- **THEN** the system marks those cards as `missing-pack`

#### Scenario: Open card whose pack is not installed
- **WHEN** the application loads a card whose stored `{ id, version }` does not match any installed GamePack
- **THEN** the card is treated as `missing-pack`
