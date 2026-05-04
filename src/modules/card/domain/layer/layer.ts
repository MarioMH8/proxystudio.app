import type { DeepPartial } from '@shared/types';

import { LayerGroup } from './layer.group';

type Layer = LayerGroup;

type PartialLayer = DeepPartial<Layer> & { type: 'group' };

type EffectiveLayer = Exclude<Layer, LayerGroup>;

const Layer = {
	default: (layer: PartialLayer): Layer => {
		return LayerGroup.default(layer);
	},
	isLayer: (layer: DeepPartial<Layer>): layer is Layer => {
		return layer.type === 'group';
	},
};

export type { EffectiveLayer };

export { Layer };
