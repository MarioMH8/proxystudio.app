import { describe, expect, it } from 'bun:test';

import { Layer } from './layer';
import { LayerArt } from './layer.art';
import { LayerGroup } from './layer.group';
import { LayerText } from './layer.text';

describe('Layer', () => {
	describe('setHiddenByIds', () => {
		it('should hide selected layers and preserve the rest', () => {
			const art = LayerArt.default({ id: 'art' });
			const text = LayerText.default({ id: 'text' });
			const frame = LayerArt.default({ id: 'frame' });
			const group = LayerGroup.default({ id: 'group' }, [text]);

			const result = Layer.setHiddenByIds([art, group, frame], ['art', 'text'], true);

			expect(result[0]?.hidden).toBeTrue();
			expect(result[1]?.hidden).toBeFalse();
			expect(result[1]?.type === 'group' ? result[1].children[0]?.hidden : undefined).toBeTrue();
			expect(result[2]?.hidden).toBeFalse();
		});

		it('should return the same layers reference when there is no effective change', () => {
			const art = LayerArt.default({ hidden: true, id: 'art' });
			const layers = [art];

			const result = Layer.setHiddenByIds(layers, ['art'], true);

			expect(result).toBe(layers);
		});
	});

	describe('move', () => {
		it('should move a root layer before another root layer', () => {
			const art = LayerArt.default({ id: 'art' });
			const text = LayerText.default({ id: 'text' });
			const frame = LayerArt.default({ id: 'frame' });

			const result = Layer.move([art, text, frame], 'frame', {
				position: Layer.DROP_POSITION.BEFORE,
				targetLayerId: 'text',
			});

			expect(result.map(layer => layer.id)).toEqual(['art', 'frame', 'text']);
		});

		it('should group two layers when dropped on another layer', () => {
			const art = LayerArt.default({ id: 'art' });
			const text = LayerText.default({ id: 'text' });
			const frame = LayerArt.default({ id: 'frame' });

			const result = Layer.move([art, text, frame], 'frame', {
				position: Layer.DROP_POSITION.GROUP_WITH,
				targetLayerId: 'text',
			});

			expect(result).toHaveLength(2);
			expect(result[1]?.type).toBe('group');
			expect(result[1]?.type === 'group' ? result[1].children.map(layer => layer.id) : []).toEqual([
				'text',
				'frame',
			]);
		});

		it('should insert a layer at the end of a group', () => {
			const art = LayerArt.default({ id: 'art' });
			const text = LayerText.default({ id: 'text' });
			const frame = LayerArt.default({ id: 'frame' });
			const group = LayerGroup.default({ id: 'group' }, [text]);

			const result = Layer.move([art, group, frame], 'frame', {
				position: Layer.DROP_POSITION.INTO_END,
				targetLayerId: 'group',
			});

			expect(result[1]?.type).toBe('group');
			expect(result[1]?.type === 'group' ? result[1].children.map(layer => layer.id) : []).toEqual([
				'text',
				'frame',
			]);
		});

		it('should insert a layer at the end of the last expanded group', () => {
			const art = LayerArt.default({ id: 'art' });
			const text = LayerText.default({ id: 'text' });
			const group = LayerGroup.default({ id: 'group' }, [text]);
			const frame = LayerArt.default({ id: 'frame' });

			const result = Layer.move([art, frame, group], 'art', {
				position: Layer.DROP_POSITION.INTO_END,
				targetLayerId: 'group',
			});
			const lastLayer = result.at(-1);

			expect(lastLayer?.type).toBe('group');
			expect(lastLayer?.type === 'group' ? lastLayer.children.map(layer => layer.id) : []).toEqual([
				'text',
				'art',
			]);
		});

		it('should move a child layer out of a group', () => {
			const art = LayerArt.default({ id: 'art' });
			const text = LayerText.default({ id: 'text' });
			const frame = LayerArt.default({ id: 'frame' });
			const group = LayerGroup.default({ id: 'group' }, [text, frame]);

			const result = Layer.move([art, group], 'frame', {
				position: Layer.DROP_POSITION.BEFORE,
				targetLayerId: 'art',
			});

			expect(result.map(layer => layer.id)).toEqual(['frame', 'art', 'group']);
			expect(result[2]?.type === 'group' ? result[2].children.map(layer => layer.id) : []).toEqual(['text']);
		});

		it('should not move a group into one of its descendants', () => {
			const child = LayerText.default({ id: 'child' });
			const group = LayerGroup.default({ id: 'group' }, [child]);
			const art = LayerArt.default({ id: 'art' });

			const result = Layer.move([group, art], 'group', {
				position: Layer.DROP_POSITION.BEFORE,
				targetLayerId: 'child',
			});

			expect(result).toEqual([group, art]);
		});
	});
});
