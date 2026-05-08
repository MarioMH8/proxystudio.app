import type { DeepPartial } from '@shared/types';

import type { EffectiveLayer } from './layer';
import { LayerBase } from './layer.base';

interface LayerGroup extends LayerBase {
	children: EffectiveLayer[];
	type: 'group';
}

const LayerGroup = {
	default: (partial?: Omit<DeepPartial<LayerGroup>, 'children'>, children: EffectiveLayer[] = []): LayerGroup => {
		return {
			...LayerBase.default(partial),
			children: [...children],
			type: 'group',
			...partial,
		};
	},
};

export { LayerGroup };
