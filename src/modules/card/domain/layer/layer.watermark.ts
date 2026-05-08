import type { DeepPartial } from '@shared/types';

import { LayerBase } from './layer.base';

interface LayerWatermark extends LayerBase {
	type: 'watermark';
}

const LayerWatermark = {
	default: (partial?: DeepPartial<LayerWatermark>): LayerWatermark => {
		return {
			...LayerBase.default(partial),
			type: 'watermark',
			...partial,
		};
	},
};

export { LayerWatermark };
