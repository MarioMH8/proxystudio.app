import type { DeepPartial } from '@shared/types';

interface LayerBase {
	id: string;
	name?: string | undefined;
}

const LayerBase = {
	default: (partial?: DeepPartial<LayerBase>): LayerBase => {
		return {
			id: crypto.randomUUID(),
			...partial,
		};
	},
};

export { LayerBase };
