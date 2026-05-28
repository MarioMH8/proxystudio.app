interface LayerBounds {
	height: number;
	width: number;
	x: number;
	y: number;
}

const LayerBounds = {
	default: (partial?: Partial<LayerBounds>): LayerBounds => {
		return {
			height: 0,
			width: 0,
			x: 0,
			y: 0,
			...partial,
		};
	},
};

export { LayerBounds };
