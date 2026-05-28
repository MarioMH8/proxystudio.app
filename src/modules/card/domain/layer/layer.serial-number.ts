import type { DeepPartial } from '@shared/types';

import { RenderableLayer } from './layer.renderable';

interface LayerSerialNumber extends RenderableLayer {
	type: 'serial-number';
}

const LayerSerialNumber = {
	default: (partial?: DeepPartial<LayerSerialNumber>): LayerSerialNumber => {
		const defaultValues = RenderableLayer.default(partial);

		return {
			...defaultValues,
			type: 'serial-number',
			...partial,
			bounds: {
				...defaultValues.bounds,
				...partial?.bounds,
			},
		};
	},
};

export { LayerSerialNumber };
