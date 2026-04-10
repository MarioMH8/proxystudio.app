/**
 * Domain barrel export.
 * Pure domain types — no editing concerns, no runtime state.
 */

/** Unique identifier for domain entities */
type EntityId = string;

export type { EntityId };
export type { Bounds, Card } from './card';
export { CARD_HEIGHT, CARD_WIDTH } from './card';
export type { FrameGroup, FramePack, FrameTile, LayoutPreset, TextPreset } from './frame-pack';
export type {
	ArtLayer,
	BottomInfoLayer,
	FrameLayer,
	Layer,
	LayerBase,
	LayerType,
	SetSymbolLayer,
	TextLayer,
	WatermarkLayer,
} from './layer';
