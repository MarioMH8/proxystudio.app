import type { DeepPartial } from '@shared/types';

import { RenderableLayer } from './layer.renderable';

interface LayerBottomInfo extends RenderableLayer {
	type: 'bottom-info';
}

const LayerBottomInfo = {
	default: (partial?: DeepPartial<LayerBottomInfo>): LayerBottomInfo => {
		const defaultValues = RenderableLayer.default(partial);

		return {
			...defaultValues,
			type: 'bottom-info',
			...partial,
			bounds: {
				...defaultValues.bounds,
				...partial?.bounds,
			},
		};
	},
};

export { LayerBottomInfo };
