import type { Bounds } from './card';

/** Discriminant for all layer types */
type LayerType = 'art' | 'bottomInfo' | 'frame' | 'setSymbol' | 'text' | 'watermark';

/** Common fields shared by all layer types */
interface LayerBase {
	/** Immutable original name (for revert on empty rename) */
	defaultName: string;
	/** Unique identifier (UUID v4) */
	id: string;
	/** User-editable display name */
	name: string;
	/** Opacity percentage (0–100) */
	opacity: number;
	/** Layer type discriminant */
	type: LayerType;
	/** Whether layer is rendered on canvas */
	visible: boolean;
}

/** A layer that displays a frame image (border, pinline, P/T box) */
interface FrameLayer extends LayerBase {
	/** Custom position/size on canvas (undefined = full card) */
	bounds: Bounds | undefined;
	/** Image source URL (e.g., /frames/m15/regular/white.png) */
	src: string;
	/** Reference to the FrameTile that created this layer */
	tileId: string;
	type: 'frame';
}

/** A layer that displays user-uploaded artwork */
interface ArtLayer extends LayerBase {
	/** Position/size (initialized from pack preset) */
	bounds: Bounds;
	/** Rotation in degrees */
	rotation: number;
	/** Image source (user upload) */
	src: string;
	type: 'art';
	/** Zoom factor */
	zoom: number;
}

/** A layer that displays formatted text */
interface TextLayer extends LayerBase {
	/** Text alignment */
	alignment: 'center' | 'left' | 'right';
	/** Position/size (initialized from pack preset) */
	bounds: Bounds;
	/** Text color */
	color: string;
	/** Markup text content (DSL) */
	content: string;
	/** Font family */
	font: string;
	/** Font size */
	fontSize: number;
	type: 'text';
}

/** A layer that displays a set symbol */
interface SetSymbolLayer extends LayerBase {
	/** Position/size (initialized from pack preset) */
	bounds: Bounds;
	/** Symbol image source */
	src: string;
	type: 'setSymbol';
}

/** A layer that displays a watermark */
interface WatermarkLayer extends LayerBase {
	/** Position/size */
	bounds: Bounds;
	/** Optional left gradient color */
	colorLeft: string | undefined;
	/** Optional right gradient color */
	colorRight: string | undefined;
	/** Watermark image source */
	src: string;
	type: 'watermark';
}

/** A layer that displays bottom information (collector number, rarity, etc.) */
interface BottomInfoLayer extends LayerBase {
	/** Artist credit */
	artist: string;
	/** Collector number */
	collectorNumber: string;
	/** Language code */
	language: string;
	/** Rarity indicator */
	rarity: string;
	/** Set code */
	setCode: string;
	type: 'bottomInfo';
	/** Year */
	year: string;
}

/** Discriminated union of all layer types */
type Layer = ArtLayer | BottomInfoLayer | FrameLayer | SetSymbolLayer | TextLayer | WatermarkLayer;

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
};
