import type { FrameLayer, Layer } from '@domain';
import { describe, expect, it } from 'bun:test';

import { computeRenderOrder } from './card-renderer';

/** Helper to create a minimal FrameLayer for testing. */
function makeFrameLayer(overrides: Partial<FrameLayer> & { id: string }): FrameLayer {
	return {
		bounds: undefined,
		defaultName: 'Frame',
		name: 'Frame',
		opacity: 100,
		src: '/frames/m15/regular/white.png',
		tileId: 'tile-white',
		type: 'frame',
		visible: true,
		...overrides,
	};
}

describe('computeRenderOrder', () => {
	it('should return an empty array for no layers', () => {
		expect(computeRenderOrder([])).toEqual([]);
	});

	it('should filter out hidden layers', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'a', name: 'Visible', visible: true }),
			makeFrameLayer({ id: 'b', name: 'Hidden', visible: false }),
			makeFrameLayer({ id: 'c', name: 'Also Visible', visible: true }),
		];

		const result = computeRenderOrder(layers);
		expect(result).toHaveLength(2);
		expect(result.every(layer => layer.visible)).toBe(true);
	});

	it('should reverse the order for painter algorithm (index 0 = top, rendered last)', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'top', name: 'Top' }),
			makeFrameLayer({ id: 'middle', name: 'Middle' }),
			makeFrameLayer({ id: 'bottom', name: 'Bottom' }),
		];

		const result = computeRenderOrder(layers);
		expect(result).toHaveLength(3);
		// Bottom should render first, top should render last
		expect(result[0]?.name).toBe('Bottom');
		expect(result[1]?.name).toBe('Middle');
		expect(result[2]?.name).toBe('Top');
	});

	it('should filter before reversing (hidden layers do not affect order)', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'top', name: 'Top', visible: true }),
			makeFrameLayer({ id: 'hidden', name: 'Hidden', visible: false }),
			makeFrameLayer({ id: 'bottom', name: 'Bottom', visible: true }),
		];

		const result = computeRenderOrder(layers);
		expect(result).toHaveLength(2);
		expect(result[0]?.name).toBe('Bottom');
		expect(result[1]?.name).toBe('Top');
	});

	it('should not mutate the original array', () => {
		const layers: Layer[] = [makeFrameLayer({ id: 'a', name: 'A' }), makeFrameLayer({ id: 'b', name: 'B' })];
		const originalOrder = [...layers];

		computeRenderOrder(layers);

		expect(layers[0]?.name).toBe(originalOrder[0]?.name);
		expect(layers[1]?.name).toBe(originalOrder[1]?.name);
	});

	it('should return all layers when all are visible (reversed)', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'a', name: 'A' }),
			makeFrameLayer({ id: 'b', name: 'B' }),
			makeFrameLayer({ id: 'c', name: 'C' }),
		];

		const result = computeRenderOrder(layers);
		expect(result).toHaveLength(3);
		expect(result[0]?.name).toBe('C');
		expect(result[1]?.name).toBe('B');
		expect(result[2]?.name).toBe('A');
	});

	it('should return empty array when all layers are hidden', () => {
		const layers: Layer[] = [
			makeFrameLayer({ id: 'a', visible: false }),
			makeFrameLayer({ id: 'b', visible: false }),
		];

		expect(computeRenderOrder(layers)).toEqual([]);
	});
});
