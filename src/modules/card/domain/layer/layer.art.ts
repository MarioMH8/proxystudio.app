import type { DeepPartial } from '@shared/types';

import { LayerBase } from './layer.base';

interface LayerArt extends LayerBase {
	type: 'art';
}

const LayerArt = {
	default: (partial?: DeepPartial<LayerArt>): LayerArt => {
		return {
			...LayerBase.default(partial),
			type: 'art',
			...partial,
		};
	},
};

export { LayerArt };
