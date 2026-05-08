import type { DeepPartial } from '@shared/types';

import { LayerBase } from './layer.base';

interface LayerBottomInfo extends LayerBase {
	type: 'bottom-info';
}

const LayerBottomInfo = {
	default: (partial?: DeepPartial<LayerBottomInfo>): LayerBottomInfo => {
		return {
			...LayerBase.default(partial),
			type: 'bottom-info',
			...partial,
		};
	},
};

export { LayerBottomInfo };
