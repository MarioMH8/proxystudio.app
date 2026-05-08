import type { DeepPartial } from '@shared/types';

import { LayerBase } from './layer.base';

interface LayerFrame extends LayerBase {
	type: 'frame';
}

const LayerFrame = {
	default: (partial?: DeepPartial<LayerFrame>): LayerFrame => {
		return {
			...LayerBase.default(partial),
			type: 'frame',
			...partial,
		};
	},
};

export { LayerFrame };
