import type { DeepPartial } from '@shared/types';

import { Layer } from './layer/layer';

interface CardMetadata {
	createdAt: Date;
	updatedAt: Date;
}

interface Card {
	id: string;
	layers: Layer[];
	metadata: CardMetadata;
	name: string;
}

const Card = {
	default: ({ layers = [], metadata = {}, ...partial }: DeepPartial<Card> = {}): Card => {
		const id = partial.id ?? crypto.randomUUID();

		return {
			id,
			layers: layers.filter(layer => Layer.isLayer(layer)).map(partial => Layer.default(partial)),
			metadata: {
				createdAt: new Date(),
				updatedAt: new Date(),
				...metadata,
			},
			name: id,
			...partial,
		};
	},
	key: 'card',
};

export { Card };
