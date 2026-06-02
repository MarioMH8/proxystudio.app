import type { DeepPartial } from '@shared/types';

import type { Layer } from './layer';
import { LayerBase } from './layer.base';

interface LayerGroup extends LayerBase {
	children: Layer[];
	type: 'group';
}

const LayerGroup = {
	default: (partial?: Omit<DeepPartial<LayerGroup>, 'children'>, children: Layer[] = []): LayerGroup => {
		return {
			...LayerBase.default(partial),
			children: [...children],
			type: 'group',
			...partial,
		};
	},
};

export { LayerGroup };
