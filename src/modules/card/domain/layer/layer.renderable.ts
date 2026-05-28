import type { DeepPartial } from '@shared/types';

import { LayerBase } from './layer.base';
import { LayerBounds } from './layer.bounds';

interface RenderableLayer extends LayerBase {
	bounds: LayerBounds;
	opacity: number;
	rotation: number;
}

const RenderableLayer = {
	default: (partial?: DeepPartial<RenderableLayer>): RenderableLayer => {
		return {
			...LayerBase.default(partial),
			bounds: LayerBounds.default(partial?.bounds),
			opacity: partial?.opacity ?? 1,
			rotation: partial?.rotation ?? 0,
		};
	},
};

export { RenderableLayer };
