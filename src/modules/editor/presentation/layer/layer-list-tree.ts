import type { Layer } from '@modules/card/domain';

interface LayerNode {
	allowsDropIntoEnd: boolean;
	depth: number;
	isExpanded: boolean;
	kind: 'layer';
	layer: Layer;
}

interface GroupBoundaryNode {
	depth: number;
	groupId: string;
	kind: 'group-boundary';
}

type LayerTreeNode = GroupBoundaryNode | LayerNode;

function buildLayerTree(layers: Layer[], expandedGroupIds: string[], depth = 0): LayerTreeNode[] {
	return [...layers].toReversed().flatMap(layer => {
		const isExpanded = expandedGroupIds.includes(layer.id);
		const nodes: LayerTreeNode[] = [
			{
				allowsDropIntoEnd: layer.type === 'group' && isExpanded,
				depth,
				isExpanded,
				kind: 'layer',
				layer,
			},
		];

		if (layer.type !== 'group' || !isExpanded) {
			return nodes;
		}

		return [
			...nodes,
			...buildLayerTree(layer.children, expandedGroupIds, depth + 1),
			{ depth, groupId: layer.id, kind: 'group-boundary' },
		];
	});
}

export type { GroupBoundaryNode, LayerNode, LayerTreeNode };

export { buildLayerTree };
