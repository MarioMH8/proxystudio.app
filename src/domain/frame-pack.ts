import type { Bounds } from './card';

/** An individual selectable frame image within a pack */
interface FrameTile {
	/** Optional custom bounds (undefined = full card) */
	bounds: Bounds | undefined;
	/** Unique identifier within the pack */
	id: string;
	/** Named mask reference (future use) */
	mask: string | undefined;
	/** Display name (e.g., "White", "Blue P/T Box") */
	name: string;
	/** Image source URL */
	src: string;
	/** Optional smaller thumbnail for the picker grid */
	thumbnailSrc: string | undefined;
}

/** Default positions for layer types when a frame pack is loaded */
interface TextPreset {
	/** Text alignment */
	alignment: 'center' | 'left' | 'right';
	/** Position/size */
	bounds: Bounds;
	/** Font family */
	font: string;
	/** Font size */
	fontSize: number;
	/** Preset name */
	name: string;
}

/** Layout preset defining default positions for other layer types */
interface LayoutPreset {
	/** Default art layer position */
	artBounds: Bounds;
	/** Default set symbol position with vertical anchor */
	setSymbolBounds: Bounds & { vertical: boolean };
	/** Default text layer configurations */
	textPresets: TextPreset[];
	/** Default watermark position */
	watermarkBounds: Bounds;
}

/** A collection of related frame tiles belonging to a version */
interface FramePack {
	/** Parent FrameGroup ID */
	groupId: string;
	/** Unique identifier (e.g., "m15-standard") */
	id: string;
	/** Default positions for other layer types (undefined for addon packs) */
	layoutPreset: LayoutPreset | undefined;
	/** Display name (e.g., "M15 Standard") */
	name: string;
	/** Available frame tiles in this pack */
	tiles: FrameTile[];
}

/** A top-level category of frame packs */
interface FrameGroup {
	/** Unique identifier (e.g., "standard") */
	id: string;
	/** Display name (e.g., "Standard") */
	name: string;
	/** Frame packs in this group */
	packs: FramePack[];
}

export type { FrameGroup, FramePack, FrameTile, LayoutPreset, TextPreset };
