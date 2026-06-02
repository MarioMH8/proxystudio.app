import type { DeepPartial } from '@shared/types';

import { RenderableLayer } from './layer.renderable';

interface LayerWatermark extends RenderableLayer {
	type: 'watermark';
}

const LayerWatermark = {
	default: (partial?: DeepPartial<LayerWatermark>): LayerWatermark => {
		const defaultValues = RenderableLayer.default(partial);

		return {
			...defaultValues,
			type: 'watermark',
			...partial,
			bounds: {
				...defaultValues.bounds,
				...partial?.bounds,
			},
		};
	},
};

export { LayerWatermark };
