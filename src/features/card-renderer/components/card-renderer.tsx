import type { Card, Layer } from '@domain';
import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import type Konva from 'konva';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { Layer as KonvaLayer, Stage } from 'react-konva';

import type { CardRendererReference } from '../types';
import LayerRenderer from './layer-renderer';

interface CardRendererProps {
	/** Pure domain entity: card data including layers */
	card: Card;
	/** Viewport height (CSS pixels) */
	height: number;
	/** Pan X offset (default: 0) */
	panX?: number;
	/** Pan Y offset (default: 0) */
	panY?: number;
	/** Viewport width (CSS pixels) */
	width: number;
	/** Zoom level percentage (default: fit-to-viewport) */
	zoom?: number | undefined;
}

/** Compute the scale factor from viewport dimensions and optional zoom. */
function computeScale(
	viewportWidth: number,
	viewportHeight: number,
	cardWidth: number,
	cardHeight: number,
	zoom?: number
): number {
	const fitScale = Math.min(viewportWidth / cardWidth, viewportHeight / cardHeight);

	return zoom ? (zoom / 100) * fitScale : fitScale;
}

/** Compute the X/Y offsets to center the card in the viewport. */
function computeOffset(
	viewportWidth: number,
	viewportHeight: number,
	cardWidth: number,
	cardHeight: number,
	scale: number,
	panX: number,
	panY: number
): { x: number; y: number } {
	return {
		x: (viewportWidth - cardWidth * scale) / 2 + panX,
		y: (viewportHeight - cardHeight * scale) / 2 + panY,
	};
}

/** Filter visible layers and reverse for painter's algorithm rendering order. */
function computeRenderOrder(layers: Layer[]): Layer[] {
	return layers.filter(layer => layer.visible).toReversed();
}

/**
 * Portable card renderer.
 * Renders a card from pure domain data using react-konva.
 * No Redux dependency — receives all data as props.
 * Exposes imperative API via ref for export and stage access.
 */
const CardRenderer = forwardRef<CardRendererReference, CardRendererProps>(
	({ card, height, panX = 0, panY = 0, width, zoom }, reference) => {
		// Note: useRef<Konva.Stage>(null) is required by react-konva's Stage ref typing.

		const stageReference = useRef<Konva.Stage>(null);

		const scale = computeScale(width, height, CARD_WIDTH, CARD_HEIGHT, zoom);
		const offset = computeOffset(width, height, CARD_WIDTH, CARD_HEIGHT, scale, panX, panY);

		const exportPNG = useCallback(
			async (options?: { pixelRatio?: number }): Promise<Blob> => {
				const stage = stageReference.current;
				if (!stage) {
					throw new Error('Stage not available');
				}

				/*
				 * Export at full resolution (CARD_WIDTH x CARD_HEIGHT) cropped to the card bounds.
				 * pixelRatio=1/scale converts from scaled viewport coords back to card native pixels.
				 */
				const pixelRatio = options?.pixelRatio ?? 1 / scale;

				/*
				 * The card is positioned at (offset.x, offset.y) in the stage coordinate system.
				 * We need to crop the export to only the card area.
				 */
				const cardScaledWidth = CARD_WIDTH * scale;
				const cardScaledHeight = CARD_HEIGHT * scale;
				const cardX = (width - cardScaledWidth) / 2 + panX;
				const cardY = (height - cardScaledHeight) / 2 + panY;

				return new Promise<Blob>((resolve, reject) => {
					void stage
						.toBlob({
							callback: (blob: Blob | null) => {
								if (blob) {
									resolve(blob);
								} else {
									reject(new Error('Failed to export canvas to blob'));
								}
							},
							height: cardScaledHeight,
							pixelRatio,
							width: cardScaledWidth,
							x: cardX,
							y: cardY,
						})
						.catch((error: unknown) => {
							reject(error instanceof Error ? error : new Error('Export failed'));
						});
				});
			},
			[scale, width, height, panX, panY]
		);

		const getStage = useCallback((): Konva.Stage | undefined => stageReference.current ?? undefined, []);

		const resetTransform = useCallback((): void => {
			/*
			 * TODO: Accept an optional `onResetTransform` prop so the parent
			 * can dispatch resetZoom() + setPan({ x: 0, y: 0 }) when called.
			 * Currently a no-op — zoom/pan are controlled by the parent via props.
			 */
		}, []);

		useImperativeHandle(
			reference,
			() => ({
				exportPNG,
				getStage,
				resetTransform,
			}),
			[exportPNG, getStage, resetTransform]
		);

		const renderOrder = computeRenderOrder(card.layers);

		const layerCount = renderOrder.length;

		return (
			<div
				aria-label={`Card preview with ${String(layerCount)} visible ${layerCount === 1 ? 'layer' : 'layers'}`}
				role='img'>
				<Stage
					height={height}
					ref={stageReference}
					scaleX={scale}
					scaleY={scale}
					width={width}
					x={offset.x}
					y={offset.y}>
					<KonvaLayer>
						{renderOrder.map(layer => (
							<LayerRenderer
								cardHeight={CARD_HEIGHT}
								cardWidth={CARD_WIDTH}
								key={layer.id}
								layer={layer}
							/>
						))}
					</KonvaLayer>
				</Stage>
			</div>
		);
	}
);

CardRenderer.displayName = 'CardRenderer';

export { computeOffset, computeRenderOrder, computeScale };
export type { CardRendererProps };
export default CardRenderer;
