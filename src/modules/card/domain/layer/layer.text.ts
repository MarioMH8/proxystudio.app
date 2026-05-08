import type { DeepPartial } from '@shared/types';

import { LayerBase } from './layer.base';

interface LayerText extends LayerBase {
	type: 'text';
}

const LayerText = {
	default: (partial?: DeepPartial<LayerText>): LayerText => {
		return {
			...LayerBase.default(partial),
			type: 'text',
			...partial,
		};
	},
};

export { LayerText };
