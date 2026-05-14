import type { Card } from '@modules/card/domain';
import { cn } from '@shared/cva';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface CardRendererProperties {
	card: Card;
	className?: string;
	scale?: number;
}

interface CardRendererReference {
	exportImage: () => string;
}

const CardRenderer = forwardRef<CardRendererReference, CardRendererProperties>(
	({ card, className, scale = 1 }, reference) => {
		const canvasReference = useRef<HTMLCanvasElement>(null);
		const normalizedScale = Number.isFinite(scale) ? Math.max(0.01, scale) : 1;
		const canvasHeight = Math.max(1, Math.round(card.dimensions.height * normalizedScale));
		const canvasWidth = Math.max(1, Math.round(card.dimensions.width * normalizedScale));

		useImperativeHandle(reference, () => ({
			exportImage() {
				if (!canvasReference.current) {
					throw new Error('CardRenderer canvas is not available');
				}

				return canvasReference.current.toDataURL('image/png');
			},
		}));

		return (
			<canvas
				className={cn('bg-[#FABADA]', className)}
				height={canvasHeight}
				ref={canvasReference}
				width={canvasWidth}
			/>
		);
	}
);

CardRenderer.displayName = 'CardRenderer';

export type { CardRendererReference };

export default CardRenderer;
