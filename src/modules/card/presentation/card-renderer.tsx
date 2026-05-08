import type { Card } from '@modules/card/domain';
import type { ReactNode } from 'react';

interface CardRendererProperties {
	card: Card;
}

function CardRenderer({ card }: CardRendererProperties): ReactNode {
	return (
		<canvas
			className='bg-[#FABADA]'
			height={card.dimensions.height}
			width={card.dimensions.width}
		/>
	);
}

CardRenderer.displayName = 'CardRenderer';

export default CardRenderer;
