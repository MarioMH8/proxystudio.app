## Context

ProxyStudio currently embeds game-specific behavior in the core app, especially around layer types, preset creation, and resource assumptions. The target state is a declarative GamePack system where each installable pack defines its own metadata, compatibility, resources, and editor presets through `game-pack.json`, while the application remains provider-agnostic and can use installed packs offline.

Product decisions are already locked: GamePack is the main extensibility unit, cards bind to one exact pack version, packs are declarative only, no pack is bundled with the app, a global pack selector is mandatory, removing an in-use pack requires confirmation and produces `missing-pack`, and legacy migration is explicitly out of scope.

The implementation is phased. Early phases establish the provider-agnostic GamePack domain, repository contracts, and application use cases. Later phases add the declarative manifest contract, local persistence, remote discovery, global pack selection, card binding, and preset-driven editor behavior.

## Goals / Non-Goals

**Goals:**
- Introduce a stable declarative manifest contract that can be validated before installation.
- Keep GamePack domain and application layers provider-agnostic while enabling remote discovery and local offline persistence.
- Make pack availability and active selection an application-level concern that can gate pack-dependent routes.
- Bind cards to exact pack versions so rendered/editor behavior is reproducible.
- Drive layer creation and inspector behavior from pack presets instead of hardcoded game-specific editor logic.

**Non-Goals:**
- Migrating legacy card data that predates the GamePack reference model.
- Supporting executable hooks, scripts, or other remote code inside packs.
- Bundling a default pack inside the app build.
- Designing provider-specific catalog behavior in the domain layer.

## Decisions

### 1. Separate manifest transport contract from domain entity
`GamePackManifest` defines the exact declarative structure read from `game-pack.json`, while `GamePack` remains the validated domain entity used by application flows. This keeps transport validation explicit and prevents partially validated remote data from leaking into the core domain.

Alternative considered: treating the manifest JSON as the domain object directly. Rejected because it would couple domain behavior to untrusted transport data and make validation/error handling less explicit.

### 2. Separate installed-pack state from the validated domain pack
`GamePack` represents the validated declarative pack definition, while `InstalledGamePack` represents a pack that has been installed into the application and is available for use. Installation-specific metadata such as source information belongs to the installed-pack model rather than the core domain pack.

This keeps the core pack definition focused on declarative content and prevents persistence or provenance concerns from leaking into the validated domain entity.

Alternative considered: storing installation metadata directly on `GamePack`. Rejected because it would mix declarative pack content with local application state and make install/list/remove flows harder to reason about.

### 3. Use an exact GamePack reference as the canonical pack identity
All application flows that identify a specific GamePack SHALL use an exact reference composed of `{ id, version }`. Catalog lookup, installation, installed-pack resolution, usage checks, and removal all operate on this canonical reference instead of partial identifiers.

This keeps pack identity consistent across domain and application flows, avoids ambiguity between versions of the same pack, and aligns operational workflows with the exact-reference model used by cards.

Alternative considered: using pack ID alone for some application flows and reserving `{ id, version }` only for persisted cards. Rejected because it would introduce inconsistent identity rules and make version-sensitive operations ambiguous.

### 4. Bind cards to an exact `{ id, version }` pair
Every card created under the new model stores one precise GamePack identity. This avoids ambiguity when a pack evolves, ensures rendering/editor behavior remains deterministic, and makes missing-pack detection straightforward.

Alternative considered: storing only pack ID or floating to the latest compatible version. Rejected because cards could silently change behavior after updates.

### 5. Use provider-agnostic repositories with HTTP/GitHub hidden in infrastructure
Application use cases depend on `GamePackCatalogRepository`, `GamePackRepository`, and `GamePackUsageRepository`. Remote discovery/install behavior lives in infrastructure adapters so the domain does not care whether the source is GitHub, plain HTTP, or another provider.

Alternative considered: encoding GitHub-specific URLs and install logic in the application layer. Rejected because it would hard-code a delivery mechanism into core product behavior.

### 6. Persist installed packs locally and treat network as install-time only
The app will require network for first-time pack installation but must persist installed packs so they remain available after reload and offline. Local persistence also becomes the source of truth for the global selector and route guards.

Alternative considered: resolving packs from the network on each app start. Rejected because it conflicts with the locked offline requirement and would make editor usage fragile.

### 7. Model pack removal as a confirmation-aware application flow
Removing an installed GamePack is a two-step application flow. The system first checks pack usage through the usage repository. If the pack is still referenced, the removal flow returns a confirmation-required result instead of deleting immediately. Deletion only proceeds after explicit confirmation.

This keeps destructive behavior explicit, allows the UI to present a safe confirmation step, and ensures that pack removal behavior remains consistent regardless of the calling surface.

Alternative considered: letting the UI decide when to warn about in-use packs while keeping the remove operation unconditional. Rejected because safety rules would be duplicated outside the application layer and could be bypassed by different callers.

### 8. Make active pack selection global and mandatory for pack-dependent flows
The active GamePack is application state, not an editor-local choice. Editor and Gallery depend on an installed/selected pack, so route access must be blocked when no packs are installed, and new cards must derive their pack reference from the active selection.

Alternative considered: choosing a pack per card creation flow without a global selector. Rejected because it adds friction and weakens the product decision that the selector is mandatory.

### 9. Reduce the core layer model to generic renderable primitives
Core layers will be reduced to `group`, `text`, and `image`, while GamePack presets provide `presetId` and declarative field definitions for pack-specific behavior. This moves MTG-specific assumptions out of core editor models and into pack data.

Alternative considered: keeping game-specific core layer types and only decorating them with pack metadata. Rejected because core/editor coupling would remain and new packs would still require app code changes.

## Risks / Trade-offs

- [Pack resource model may be underspecified for offline usage] -> Keep resource contracts declarative now and finalize any cache metadata during local persistence and remote catalog phases.
- [Exact version binding can increase install friction] -> Make install/list flows explicit and expose clear missing-pack states rather than silently upgrading cards.
- [Route guarding can block existing user flows if no pack is installed] -> Provide a dedicated empty state that funnels users into pack installation/selection instead of failing deep inside Editor or Gallery.
- [Refactoring editor layers and inspector is cross-cutting] -> Phase the work so pack infrastructure lands before replacing hardcoded editor creation and inspector paths.
- [No legacy migration means mixed old/new card data may exist during rollout] -> Keep migration out of scope and limit requirements to the new GamePack-aware model until a dedicated migration change is proposed.

## Migration Plan

1. Establish the provider-agnostic GamePack domain, repository contracts, and application scaffold.
2. Finalize manifest validation and install flow around `GamePackManifest` and domain conversion.
3. Add local persistence for installed packs so the app can reload and operate offline after installation.
4. Add a remote catalog adapter behind repository interfaces.
5. Introduce global active-pack selection and route guards for pack-dependent areas.
6. Extend card data with exact GamePack references and make new cards inherit the active pack.
7. Refactor core layer models, add preset-driven layer creation, and render inspector controls from declarative preset fields.
8. Wire the in-use pack removal flow so confirmed removal marks affected cards as `missing-pack`.

Rollback strategy: before card data contracts change, rollback is a code-only revert. After exact GamePack references become part of persisted cards, rollback requires keeping readers compatible with the new field or shipping a forward/backward compatibility layer in a follow-up change.

## Open Questions

- Should installed pack resources be cached as raw blobs, normalized asset records, or manifest-relative references plus lazy fetch metadata?
- Where should the active GamePack selection be persisted so it survives reloads without creating conflicts with future multi-workspace behavior?
