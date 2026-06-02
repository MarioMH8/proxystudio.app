import type { DeepPartial } from '@shared/types';

import { RenderableLayer } from './layer.renderable';

interface LayerSymbol extends RenderableLayer {
	type: 'symbol';
}

const LayerSymbol = {
	default: (partial?: DeepPartial<LayerSymbol>): LayerSymbol => {
		const defaultValues = RenderableLayer.default(partial);

		return {
			...defaultValues,
			type: 'symbol',
			...partial,
			bounds: {
				...defaultValues.bounds,
				...partial?.bounds,
			},
		};
	},
};

export { LayerSymbol };
