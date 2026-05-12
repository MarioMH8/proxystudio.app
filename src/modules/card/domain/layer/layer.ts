import type { DeepPartial } from '@shared/types';

import { LayerArt } from './layer.art';
import { LayerBottomInfo } from './layer.bottom-info';
import { LayerFrame } from './layer.frame';
import { LayerGroup } from './layer.group';
import { LayerSerialNumber } from './layer.serial-number';
import { LayerSymbol } from './layer.symbol';
import { LayerText } from './layer.text';
import { LayerWatermark } from './layer.watermark';

const LAYER_DROP_POSITION = {
	AFTER: 'after',
	BEFORE: 'before',
	GROUP_WITH: 'group-with',
	INTO_END: 'into-end',
	INTO_START: 'into-start',
} as const;

type LayerDropPosition = (typeof LAYER_DROP_POSITION)[keyof typeof LAYER_DROP_POSITION];

type Layer =
	| LayerArt
	| LayerBottomInfo
	| LayerFrame
	| LayerGroup
	| LayerSerialNumber
	| LayerSymbol
	| LayerText
	| LayerWatermark;

type PartialLayer = DeepPartial<Layer> & { type: Layer['type'] };

type EffectiveLayer = Exclude<Layer, LayerGroup>;

interface GroupableSelection {
	layers: Layer[];
}

interface LayerContainer {
	layers: Layer[];
	parentGroupId: string | undefined;
}

interface LayerContainerSearchResult {
	container: LayerContainer;
	index: number;
	layer: Layer;
}

interface GroupInsertResult {
	group: LayerGroup;
	layers: Layer[];
}

interface LayerMoveTarget {
	position: LayerDropPosition;
	targetLayerId: string;
}

const Layer = {
	canGroupSelection: (layers: Layer[], layerIds: string[]): boolean => {
		return Layer.getGroupableSelection(layers, layerIds) !== undefined;
	},
	default: (layer: PartialLayer): Layer => {
		switch (layer.type) {
			case 'art': {
				return LayerArt.default(layer);
			}
			case 'bottom-info': {
				return LayerBottomInfo.default(layer);
			}
			case 'frame': {
				return LayerFrame.default(layer);
			}
			case 'group': {
				return LayerGroup.default(layer);
			}
			case 'serial-number': {
				return LayerSerialNumber.default(layer);
			}
			case 'symbol': {
				return LayerSymbol.default(layer);
			}
			case 'text': {
				return LayerText.default(layer);
			}
			case 'watermark': {
				return LayerWatermark.default(layer);
			}
		}
	},
	deleteByIds: (layers: Layer[], deletedLayerIds: Set<string>): Layer[] => {
		return layers.flatMap<Layer>(layer => {
			if (deletedLayerIds.has(layer.id)) {
				return [];
			}

			if (layer.type !== 'group') {
				return [layer];
			}

			const children = Layer.deleteByIds(layer.children, deletedLayerIds);

			if (children.length === 0) {
				return [];
			}

			const hasChanged =
				children.length !== layer.children.length ||
				children.some((child, index) => child !== layer.children[index]);

			return hasChanged ? [{ ...layer, children }] : [layer];
		});
	},
	DROP_POSITION: LAYER_DROP_POSITION,
	findGroups: (layers: Layer[]): LayerGroup[] => {
		return layers.flatMap(layer => {
			if (layer.type !== 'group') {
				return [];
			}

			return [layer, ...Layer.findGroups(layer.children)];
		});
	},
	findLayerById: (layers: Layer[], layerId: string): LayerContainerSearchResult | undefined => {
		return Layer.findLayerByIdWithinContainer(layers, layerId);
	},
	findLayerByIdWithinContainer: (
		layers: Layer[],
		layerId: string,
		parentGroupId?: string
	): LayerContainerSearchResult | undefined => {
		for (const [index, layer] of layers.entries()) {
			if (layer.id === layerId) {
				return {
					container: { layers, parentGroupId },
					index,
					layer,
				};
			}

			if (layer.type !== 'group') {
				continue;
			}

			const result = Layer.findLayerByIdWithinContainer(layer.children, layerId, layer.id);

			if (result) {
				return result;
			}
		}

		return undefined;
	},
	getGroupableSelection: (layers: Layer[], layerIds: string[]): GroupableSelection | undefined => {
		if (layerIds.length < 2) {
			return;
		}

		const uniqueLayerIds = [...new Set(layerIds)];
		const selectedLayers = uniqueLayerIds.map(layerId => Layer.findLayerById(layers, layerId));

		if (selectedLayers.some(selection => !selection)) {
			return;
		}

		const resolvedSelections = selectedLayers.filter(selection => selection !== undefined);

		if (resolvedSelections.length !== uniqueLayerIds.length) {
			return;
		}

		const layersInOrder = Layer.topLevelSelection(resolvedSelections.map(selection => selection.layer));

		if (layersInOrder.length < 2) {
			return;
		}

		for (const selectedLayer of layersInOrder) {
			if (
				layersInOrder.some(layer => {
					return layer.id !== selectedLayer.id && Layer.hasLayerId(selectedLayer, layer.id);
				})
			) {
				return;
			}
		}

		return {
			layers: layersInOrder,
		};
	},
	group: (layers: Layer[], layerIds: string[]): GroupInsertResult | undefined => {
		const groupableSelection = Layer.getGroupableSelection(layers, layerIds);

		if (!groupableSelection) {
			return;
		}

		const selectedLayerIds = new Set(groupableSelection.layers.map(layer => layer.id));
		const group = LayerGroup.default(undefined, groupableSelection.layers);
		const layersWithoutSelection = Layer.deleteByIds(layers, selectedLayerIds);

		return {
			group,
			layers: [group, ...layersWithoutSelection],
		};
	},
	hasLayerId: (layer: Layer, layerId: string): boolean => {
		if (layer.id === layerId) {
			return true;
		}

		if (layer.type !== 'group') {
			return false;
		}

		return layer.children.some(child => Layer.hasLayerId(child, layerId));
	},
	insertAdjacent: (layers: Layer[], movedLayer: Layer, target: LayerMoveTarget): Layer[] => {
		const targetLayerResult = Layer.findLayerById(layers, target.targetLayerId);

		if (!targetLayerResult) {
			return layers;
		}

		const nextContainerLayers = [...targetLayerResult.container.layers];
		const insertIndex =
			target.position === Layer.DROP_POSITION.BEFORE ? targetLayerResult.index : targetLayerResult.index + 1;
		nextContainerLayers.splice(insertIndex, 0, movedLayer);

		return Layer.replaceContainerLayers(layers, targetLayerResult.container.parentGroupId, nextContainerLayers);
	},
	insertAsGroupedLayer: (layers: Layer[], movedLayer: Layer, targetLayerId: string): Layer[] => {
		const targetLayerResult = Layer.findLayerById(layers, targetLayerId);

		if (!targetLayerResult || targetLayerResult.layer.type === 'group') {
			return layers;
		}

		const nextContainerLayers = [...targetLayerResult.container.layers];
		const group = LayerGroup.default(undefined, [targetLayerResult.layer, movedLayer]);
		nextContainerLayers.splice(targetLayerResult.index, 1, group);

		return Layer.replaceContainerLayers(layers, targetLayerResult.container.parentGroupId, nextContainerLayers);
	},
	insertIntoGroup: (layers: Layer[], movedLayer: Layer, target: LayerMoveTarget): Layer[] => {
		const groupResult = Layer.findLayerById(layers, target.targetLayerId);

		if (groupResult?.layer.type !== 'group') {
			return layers;
		}

		const insertIndex = target.position === Layer.DROP_POSITION.INTO_START ? 0 : groupResult.layer.children.length;
		const children = [...groupResult.layer.children];
		children.splice(insertIndex, 0, movedLayer);

		return Layer.replaceContainerLayers(layers, groupResult.layer.id, children);
	},
	isLayer: (layer: DeepPartial<Layer>): layer is Layer => {
		return (
			layer.type === 'art' ||
			layer.type === 'bottom-info' ||
			layer.type === 'frame' ||
			layer.type === 'group' ||
			layer.type === 'serial-number' ||
			layer.type === 'symbol' ||
			layer.type === 'text' ||
			layer.type === 'watermark'
		);
	},
	move: (layers: Layer[], movedLayerId: string, target: LayerMoveTarget): Layer[] => {
		if (movedLayerId === target.targetLayerId) {
			return layers;
		}

		const movedLayerResult = Layer.findLayerById(layers, movedLayerId);
		const targetLayerResult = Layer.findLayerById(layers, target.targetLayerId);

		if (!movedLayerResult || !targetLayerResult) {
			return layers;
		}

		if (movedLayerResult.layer.type === 'group' && Layer.hasLayerId(movedLayerResult.layer, target.targetLayerId)) {
			return layers;
		}

		const nextLayers = Layer.deleteByIds(layers, new Set([movedLayerId]));

		switch (target.position) {
			case Layer.DROP_POSITION.AFTER:
			case Layer.DROP_POSITION.BEFORE: {
				return Layer.insertAdjacent(nextLayers, movedLayerResult.layer, target);
			}
			case Layer.DROP_POSITION.GROUP_WITH: {
				return Layer.insertAsGroupedLayer(nextLayers, movedLayerResult.layer, target.targetLayerId);
			}
			case Layer.DROP_POSITION.INTO_END:
			case Layer.DROP_POSITION.INTO_START: {
				return Layer.insertIntoGroup(nextLayers, movedLayerResult.layer, target);
			}
		}
	},
	normalizeName: (name: string): string | undefined => {
		const normalizedName = name.trim();

		return normalizedName.length > 0 ? normalizedName : undefined;
	},
	rename: <T extends EffectiveLayer | Layer>(layer: T, name: string): T => {
		const normalizedName = Layer.normalizeName(name);

		if (normalizedName === undefined) {
			if (layer.name === undefined) {
				return layer;
			}

			const { name: _name, ...nextLayer } = layer;

			return nextLayer as T;
		}

		if (layer.name === normalizedName) {
			return layer;
		}

		return { ...layer, name: normalizedName };
	},
	renameById: (layers: Layer[], layerId: string, name: string): Layer[] => {
		return layers.map(layer => {
			if (layer.id === layerId) {
				return Layer.rename(layer, name);
			}

			if (layer.type !== 'group') {
				return layer;
			}

			const children = Layer.renameById(layer.children, layerId, name);
			const hasChanged = children.some((child, index) => child !== layer.children[index]);

			return hasChanged ? { ...layer, children } : layer;
		});
	},
	replaceContainerLayers: (layers: Layer[], groupId: string | undefined, nextContainerLayers: Layer[]): Layer[] => {
		if (groupId === undefined) {
			return nextContainerLayers;
		}

		const nextLayers = layers.map(layer => {
			if (layer.type === 'group' && layer.id === groupId) {
				return { ...layer, children: nextContainerLayers };
			}

			if (layer.type !== 'group') {
				return layer;
			}

			const children = Layer.replaceContainerLayers(layer.children, groupId, nextContainerLayers);

			if (children === layer.children) {
				return layer;
			}

			return { ...layer, children };
		});

		return nextLayers;
	},
	topLevelSelection: (layers: Layer[]): Layer[] => {
		return layers.filter(layer => {
			return !layers.some(candidate => candidate.id !== layer.id && Layer.hasLayerId(candidate, layer.id));
		});
	},
	ungroupById: (layers: Layer[], groupId: string): Layer[] => {
		return layers.flatMap(layer => {
			if (layer.type === 'group' && layer.id === groupId) {
				return layer.children.map(child => Layer.default(child));
			}

			if (layer.type !== 'group') {
				return [layer];
			}

			const children = Layer.ungroupById(layer.children, groupId);
			const hasChanged =
				children.length !== layer.children.length ||
				children.some((child, index) => child !== layer.children[index]);

			if (!hasChanged) {
				return [layer];
			}

			return [{ ...layer, children }];
		});
	},
};

export type { EffectiveLayer, LayerDropPosition, LayerMoveTarget };

export { Layer };
