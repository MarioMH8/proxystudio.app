import type { DeepPartial } from '@shared/types';

import { LayerBase } from './layer.base';

interface LayerSymbol extends LayerBase {
	type: 'symbol';
}

const LayerSymbol = {
	default: (partial?: DeepPartial<LayerSymbol>): LayerSymbol => {
		return {
			...LayerBase.default(partial),
			type: 'symbol',
			...partial,
		};
	},
};

export { LayerSymbol };
