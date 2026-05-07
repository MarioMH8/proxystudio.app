import type { DeepPartial } from '@shared/types';

import { Layer } from './layer/layer';

interface CardMetadata {
	createdAt: number;
	updatedAt: number;
}

interface CardDimensions {
	height: number;
	width: number;
}

interface Card {
	dimensions: CardDimensions;
	id: string;
	layers: Layer[];
	metadata: CardMetadata;
	name: string;
}

const Card = {
	default: ({ dimensions = {}, layers = [], metadata = {}, ...partial }: DeepPartial<Card> = {}): Card => {
		const id = partial.id ?? crypto.randomUUID();

		return {
			dimensions: {
				height: 2814,
				width: 2010,
				...dimensions,
			},
			id,
			layers: layers.filter(layer => Layer.isLayer(layer)).map(partial => Layer.default(partial)),
			metadata: {
				createdAt: Date.now(),
				updatedAt: Date.now(),
				...metadata,
			},
			name: id,
			...partial,
		};
	},
	key: 'card',
};

export { Card };
