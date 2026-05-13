import type { DeepPartial } from '@shared/types';

interface LayerBase {
	hidden: boolean;
	id: string;
	name?: string | undefined;
}

const LayerBase = {
	default: (partial?: DeepPartial<LayerBase>): LayerBase => {
		return {
			hidden: false,
			id: crypto.randomUUID(),
			...partial,
		};
	},
};

export { LayerBase };
