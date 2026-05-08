import type { DeepPartial } from '@shared/types';

import type { EffectiveLayer } from './layer/layer';
import { Layer } from './layer/layer';
import { LayerGroup } from './layer/layer.group';

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
	groupLayers: (card: Card, layerIds: string[]): Card => {
		const selectedLayers = new Set(layerIds);
		const groupableLayers = card.layers.filter(
			(layer): layer is EffectiveLayer => selectedLayers.has(layer.id) && layer.type !== 'group'
		);

		if (groupableLayers.length < 2) {
			return card;
		}

		let hasCreatedGroup = false;

		return {
			...card,
			layers: card.layers.flatMap(layer => {
				if (!selectedLayers.has(layer.id) || layer.type === 'group') {
					return [layer];
				}

				if (hasCreatedGroup) {
					return [];
				}

				hasCreatedGroup = true;

				return [LayerGroup.default(undefined, [...groupableLayers])];
			}),
			metadata: {
				...card.metadata,
				updatedAt: Date.now(),
			},
		};
	},
	ungroupLayer: (card: Card, groupId: string): Card => {
		const group = card.layers.find(
			(layer): layer is Extract<Layer, { type: 'group' }> => layer.type === 'group' && layer.id === groupId
		);

		if (!group) {
			return card;
		}

		const layers = card.layers.flatMap(layer => {
			if (layer.type !== 'group' || layer.id !== groupId) {
				return [layer];
			}

			return layer.children.map(child => Layer.default(child));
		});

		return {
			...card,
			layers,
			metadata: {
				...card.metadata,
				updatedAt: Date.now(),
			},
		};
	},
};

export { Card };
