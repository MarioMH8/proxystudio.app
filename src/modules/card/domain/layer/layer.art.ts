import type { DeepPartial } from '@shared/types';

import { RenderableLayer } from './layer.renderable';

interface LayerArt extends RenderableLayer {
	type: 'art';
}

const LayerArt = {
	default: (partial?: DeepPartial<LayerArt>): LayerArt => {
		const defaultValues = RenderableLayer.default(partial);

		return {
			...defaultValues,
			type: 'art',
			...partial,
			bounds: {
				...defaultValues.bounds,
				...partial?.bounds,
			},
		};
	},
};

export { LayerArt };
