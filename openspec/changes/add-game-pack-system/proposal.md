## Why

ProxyStudio currently has hardcoded game-specific behavior in the core application, which limits extensibility and makes it difficult to add new games without code changes. A declarative GamePack system is needed to move game rules, resources, and editor presets into installable packs with explicit versioning, offline persistence, and predictable card-to-pack compatibility.

## What Changes

- Establish the `src/modules/game-pack` domain and application scaffold for provider-agnostic pack workflows.
- Introduce a declarative `game-pack.json` manifest and separate manifest validation from the validated domain `GamePack` entity.
- Add application flows to discover, validate, install, list, and remove packs while keeping packs persisted locally for offline use after installation.
- Add a mandatory global active-pack selector and prevent access to Editor and Gallery when no packs are installed.
- Store an exact GamePack reference on every card using `{ id, version }`, and mark cards as `missing-pack` when their installed pack is removed.
- Refactor editor layer creation and inspection to be driven by pack presets and declarative preset fields instead of hardcoded game-specific layer types.

## Capabilities

### New Capabilities
- `game-pack-management`: Discover, validate, install, persist, list, and remove declarative GamePacks.
- `game-pack-selection`: Select a global active GamePack and enforce application access rules when no packs are installed.
- `card-game-pack-binding`: Persist exact `{ id, version }` pack references on cards and handle `missing-pack` behavior when a referenced pack is unavailable.
- `preset-driven-editor`: Build editor layer creation and inspector behavior from GamePack layer presets and declarative preset fields.

### Modified Capabilities
- None.

## Impact

- Affects especially `src/modules/game-pack`, card persistence, editor layer/domain models, app state, and route guards.
- Requires local persistence for installed packs and a remote catalog adapter for pack discovery and installation.
- Changes card data contracts by introducing an exact GamePack reference and a `missing-pack` state.
- Removes implicit reliance on bundled or hardcoded game definitions in the application core.
