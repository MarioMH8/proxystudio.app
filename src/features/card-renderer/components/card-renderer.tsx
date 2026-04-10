import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import type Konva from 'konva';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { Layer as KonvaLayer, Stage } from 'react-konva';

import type { CardState } from '../../editor/store/slices/card.slice';
import type { CardRendererReference } from '../types';
import LayerRenderer from './layer-renderer';

interface CardRendererProps {
	/** Pure domain state: card data including layers */
	card: CardState;
	/** Viewport height (CSS pixels) */
	height: number;
	/** Pan X offset (default: 0) */
	panX?: number;
	/** Pan Y offset (default: 0) */
	panY?: number;
	/** Viewport width (CSS pixels) */
	width: number;
	/** Zoom level percentage (default: fit-to-viewport) */
	zoom?: number;
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

		// Calculate scale from zoom or fit-to-viewport
		const fitScale = Math.min(width / CARD_WIDTH, height / CARD_HEIGHT);
		const scale = zoom ? (zoom / 100) * fitScale : fitScale;

		// Center the card in the viewport
		const offsetX = (width - CARD_WIDTH * scale) / 2 + panX;
		const offsetY = (height - CARD_HEIGHT * scale) / 2 + panY;

		const exportPNG = useCallback(
			async (options?: { pixelRatio?: number }): Promise<Blob> => {
				const stage = stageReference.current;
				if (!stage) {
					throw new Error('Stage not available');
				}

				// Export at full resolution (2010x2814) regardless of viewport zoom
				const pixelRatio = options?.pixelRatio ?? 1 / scale;

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
							pixelRatio,
						})
						.catch((error: unknown) => {
							reject(error instanceof Error ? error : new Error('Export failed'));
						});
				});
			},
			[scale]
		);

		const getStage = useCallback((): Konva.Stage | undefined => stageReference.current ?? undefined, []);

		const resetTransform = useCallback((): void => {
			/*
			 * Reset is handled by the parent through zoom/pan props
			 * This is a signal to the parent to reset
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

		// Render visible layers in stack order (index 0 = topmost, rendered last via painter's algorithm)
		const visibleLayers = card.layers.filter(layer => layer.visible);
		// Reverse so index 0 (top of stack) is rendered last (on top)
		const renderOrder = visibleLayers.toReversed();

		return (
			<Stage
				height={height}
				ref={stageReference}
				scaleX={scale}
				scaleY={scale}
				width={width}
				x={offsetX}
				y={offsetY}>
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
		);
	}
);

CardRenderer.displayName = 'CardRenderer';

export type { CardRendererProps };
export default CardRenderer;
