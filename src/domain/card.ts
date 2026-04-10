import type { Layer } from './layer';

/** Resolution-independent rectangle (fractions 0–1 of card dimensions) */
interface Bounds {
	/** Height (fraction 0–1 of card height) */
	height: number;
	/** Width (fraction 0–1 of card width) */
	width: number;
	/** X position (fraction 0–1 of card width) */
	x: number;
	/** Y position (fraction 0–1 of card height) */
	y: number;
}

/** Root aggregate — a single card being edited */
interface Card {
	/** Canvas height in pixels */
	height: number;
	/** Unique identifier (UUID v4) */
	id: string;
	/** Ordered layer stack. Index 0 = topmost (rendered last, painter's algorithm) */
	layers: Layer[];
	/** Active frame pack identifier (e.g., "m15-standard") */
	version: string | undefined;
	/** Canvas width in pixels */
	width: number;
}

/** Default card dimensions */
const CARD_WIDTH = 2010;
const CARD_HEIGHT = 2814;

export { CARD_HEIGHT, CARD_WIDTH };
export type { Bounds, Card };
