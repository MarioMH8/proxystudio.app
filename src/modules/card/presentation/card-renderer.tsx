import type { Card } from '@modules/card/domain';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface CardRendererProperties {
	card: Card;
}

interface CardRendererReference {
	exportImage: () => string;
}

const CardRenderer = forwardRef<CardRendererReference, CardRendererProperties>(({ card }, reference) => {
	const canvasReference = useRef<HTMLCanvasElement>(null);

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
			className='bg-[#FABADA]'
			height={card.dimensions.height}
			ref={canvasReference}
			width={card.dimensions.width}
		/>
	);
});

CardRenderer.displayName = 'CardRenderer';

export type { CardRendererReference };

export default CardRenderer;
