import type { DeepPartial } from '@shared/types';

import { LayerBase } from './layer.base';

interface LayerSerialNumber extends LayerBase {
	type: 'serial-number';
}

const LayerSerialNumber = {
	default: (partial?: DeepPartial<LayerSerialNumber>): LayerSerialNumber => {
		return {
			...LayerBase.default(partial),
			type: 'serial-number',
			...partial,
		};
	},
};

export { LayerSerialNumber };
