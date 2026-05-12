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
	addLayer: (card: Card, layerType: Layer['type']): Card => {
		return {
			...card,
			layers: [...card.layers, Layer.default({ type: layerType })],
			metadata: {
				...card.metadata,
				updatedAt: Date.now(),
			},
		};
	},
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
	deleteLayers: (card: Card, layerIds: string[]): Card => {
		const layers = Layer.deleteByIds(card.layers, new Set(layerIds));

		const hasChanged =
			layers.length !== card.layers.length || layers.some((layer, index) => layer !== card.layers[index]);

		if (!hasChanged) {
			return card;
		}

		return {
			...card,
			layers,
			metadata: {
				...card.metadata,
				updatedAt: Date.now(),
			},
		};
	},
	groupLayers: (card: Card, layerIds: string[]): Card => {
		const result = Layer.group(card.layers, layerIds);

		if (!result) {
			return card;
		}

		return {
			...card,
			layers: result.layers,
			metadata: {
				...card.metadata,
				updatedAt: Date.now(),
			},
		};
	},
	renameLayer: (card: Card, layerId: string, name: string): Card => {
		const layers = Layer.renameById(card.layers, layerId, name);
		const hasChanged = layers.some((layer, index) => layer !== card.layers[index]);

		if (!hasChanged) {
			return card;
		}

		return {
			...card,
			layers,
			metadata: {
				...card.metadata,
				updatedAt: Date.now(),
			},
		};
	},
	ungroupLayer: (card: Card, groupId: string): Card => {
		const layers = Layer.ungroupById(card.layers, groupId);
		const hasChanged =
			layers.length !== card.layers.length || layers.some((layer, index) => layer !== card.layers[index]);

		if (!hasChanged) {
			return card;
		}

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
