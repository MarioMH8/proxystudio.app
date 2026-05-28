import type { DeepPartial } from '@shared/types';

import { RenderableLayer } from './layer.renderable';

interface LayerFrame extends RenderableLayer {
	type: 'frame';
}

const LayerFrame = {
	default: (partial?: DeepPartial<LayerFrame>): LayerFrame => {
		const defaultValues = RenderableLayer.default(partial);

		return {
			...defaultValues,
			type: 'frame',
			...partial,
			bounds: {
				...defaultValues.bounds,
				...partial?.bounds,
			},
		};
	},
};

export { LayerFrame };
