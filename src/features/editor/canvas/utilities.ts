import { CARD_HEIGHT, CARD_WIDTH } from '@domain';

/**
 * Compute CSS scale factor so the card fits within the viewport.
 * zoom=100 means fit-to-viewport, zoom=200 means 2× fit, etc.
 */
function computeScale(viewportWidth: number, viewportHeight: number, zoom: number): number {
	const fitScale = Math.min(viewportWidth / CARD_WIDTH, viewportHeight / CARD_HEIGHT);

	return (zoom / 100) * fitScale;
}

/**
 * Compute the CSS translate X/Y values to center the card in the viewport,
 * then apply pan offsets.
 *
 * With transform-origin: top left, the card's top-left corner sits at (0,0) before
 * transform. We need to shift it to the viewport center, accounting for scale.
 */
function computeTranslate(
	viewportWidth: number,
	viewportHeight: number,
	scale: number,
	panX: number,
	panY: number
): { x: number; y: number } {
	return {
		x: (viewportWidth - CARD_WIDTH * scale) / 2 + panX,
		y: (viewportHeight - CARD_HEIGHT * scale) / 2 + panY,
	};
}

export { computeScale, computeTranslate };
