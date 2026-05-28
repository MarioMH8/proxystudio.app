import type { DeepPartial } from '@shared/types';

import { RenderableLayer } from './layer.renderable';

interface LayerText extends RenderableLayer {
	type: 'text';
}

const LayerText = {
	default: (partial?: DeepPartial<LayerText>): LayerText => {
		const defaultValues = RenderableLayer.default(partial);

		return {
			...defaultValues,
			type: 'text',
			...partial,
			bounds: {
				...defaultValues.bounds,
				...partial?.bounds,
			},
		};
	},
};

export { LayerText };
