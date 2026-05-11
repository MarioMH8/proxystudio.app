import type { DeepPartial } from '@shared/types';

import { LayerArt } from './layer.art';
import { LayerBottomInfo } from './layer.bottom-info';
import { LayerFrame } from './layer.frame';
import { LayerGroup } from './layer.group';
import { LayerSerialNumber } from './layer.serial-number';
import { LayerSymbol } from './layer.symbol';
import { LayerText } from './layer.text';
import { LayerWatermark } from './layer.watermark';

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

const Layer = {
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

			const children = layer.children.map(child => {
				return child.id === layerId ? Layer.rename(child, name) : child;
			});

			const hasChanged = children.some((child, index) => child !== layer.children[index]);

			return hasChanged ? { ...layer, children } : layer;
		});
	},
};

export type { EffectiveLayer };

export { Layer };
