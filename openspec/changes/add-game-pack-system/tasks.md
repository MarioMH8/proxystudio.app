## 1. Establish the Phase 1 foundation

- [x] 1.1 Add the `src/modules/game-pack` domain entities, value objects, and repository contracts.
- [x] 1.2 Add provider-agnostic application use cases for validation, install/list/remove flows, usage counting, and preset lookup.
- [x] 1.3 Support confirmation-required removal when an installed pack is still referenced by cards.
- [x] 1.4 Export the initial GamePack module scaffold so later phases can build on it.

## 2. Finalize manifest and validation

- [x] 2.1 Review the current local Phase 2 GamePack manifest changes against the `game-pack-management` requirements.
- [x] 2.2 Close any remaining gaps in manifest schema, compatibility validation, and resource reference validation before install.
- [x] 2.3 Run `bun run lint` and `bun run typecheck` for the Phase 2 checkpoint.
- [ ] 2.4 Stop for user review and commit the approved Phase 2 files.

## 3. Persist installed packs locally

- [ ] 3.1 Add or update the local storage schema for installed GamePacks and any required cache metadata.
- [ ] 3.2 Implement the installed-pack persistence adapter behind `GamePackRepository`.
- [ ] 3.3 Load installed packs from local persistence on app startup and verify offline reload behavior.
- [ ] 3.4 Run `bun run lint` and `bun run typecheck`, then stop for user review and commit the approved Phase 3 changes.

## 4. Add the remote catalog adapter

- [ ] 4.1 Implement remote pack discovery behind `GamePackCatalogRepository` without leaking provider-specific details into the application layer.
- [ ] 4.2 Connect remote install flow to manifest retrieval, validation, and local persistence.
- [ ] 4.3 Verify that the app can list available packs and install one from the remote source end to end.
- [ ] 4.4 Run `bun run lint` and `bun run typecheck`, then stop for user review and commit the approved Phase 4 changes.

## 5. Introduce global pack selection and route guards

- [ ] 5.1 Add application state for installed packs and one global active GamePack selection.
- [ ] 5.2 Build the global selector and the no-packs-installed empty state.
- [ ] 5.3 Block Editor and Gallery when there are no installed GamePacks.
- [ ] 5.4 Run `bun run lint` and `bun run typecheck`, then stop for user review and commit the approved Phase 5 changes.

## 6. Bind cards to exact GamePack versions

- [ ] 6.1 Extend the card model and persistence layer with `gamePack: { id, version }`.
- [ ] 6.2 Ensure newly created cards inherit the currently active GamePack.
- [ ] 6.3 Resolve cards whose referenced pack is unavailable as `missing-pack`.
- [ ] 6.4 Run `bun run lint` and `bun run typecheck`, then stop for user review and commit the approved Phase 6 changes.

## 7. Reduce the core layer model

- [ ] 7.1 Replace game-specific core layer variants with the generic `group`, `text`, and `image` types.
- [ ] 7.2 Add `presetId` and preset-backed `settings` to renderable layers.
- [ ] 7.3 Update rendering and editor code paths that depend on the old layer model.
- [ ] 7.4 Run `bun run lint` and `bun run typecheck`, then stop for user review and commit the approved Phase 7 changes.

## 8. Drive editor creation and inspector from presets

- [ ] 8.1 Replace hardcoded add-layer options with presets from the active GamePack.
- [ ] 8.2 Render inspector controls from declarative preset field definitions.
- [ ] 8.3 Persist inspector edits back into preset-backed layer settings.
- [ ] 8.4 Run `bun run lint` and `bun run typecheck`, then stop for user review and commit the approved Phases 8 and 9 changes.

## 9. Complete the in-use pack removal flow

- [ ] 9.1 Connect pack usage counting to the remove-pack user flow.
- [ ] 9.2 Show a confirmation step when removing a pack that is still used by cards.
- [ ] 9.3 Mark affected cards as `missing-pack` after confirmed removal.
- [ ] 9.4 Run `bun run lint` and `bun run typecheck`, then stop for user review and commit the approved Phase 10 changes.
