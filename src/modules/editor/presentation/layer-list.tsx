import FlexBox from '@components/flex-box';
import Span from '@components/span';
import type { Layer } from '@modules/card/domain';
import { editorSlice, selectCard, selectExpandedGroupIds, selectSelectedLayerIds } from '@modules/editor/store';
import { useAppDispatch, useAppSelector } from '@shared/store';
import type { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import LayerListItem from './layer-list-item';

interface LayerTreeNode {
	depth: number;
	layer: Layer;
}

function LayerList(): ReactNode {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);
	const expandedGroupIds = useAppSelector(selectExpandedGroupIds);
	const selectedLayerIds = useAppSelector(selectSelectedLayerIds);

	function buildLayerTree(layers: Layer[], depth = 0): LayerTreeNode[] {
		return [...layers].toReversed().flatMap(layer => {
			const nodes: LayerTreeNode[] = [{ depth, layer }];

			if (layer.type !== 'group' || !expandedGroupIds.includes(layer.id)) {
				return nodes;
			}

			return [...nodes, ...buildLayerTree(layer.children, depth + 1)];
		});
	}

	function handleLayerClick(event: MouseEvent<HTMLButtonElement>, layerId: string): void {
		if (event.metaKey || event.ctrlKey) {
			dispatch(editorSlice.actions.layerPanelSelectionToggle(layerId));

			return;
		}

		if (selectedLayerIds.length === 1 && selectedLayerIds[0] === layerId) {
			dispatch(editorSlice.actions.layerPanelSelectionClear());

			return;
		}

		dispatch(editorSlice.actions.layerPanelSelectionSet([layerId]));
	}

	function handleLayerExpandedToggle(layerId: string): void {
		dispatch(editorSlice.actions.layerPanelGroupExpandToggle(layerId));
	}

	const layers = buildLayerTree(card.layers);

	if (layers.length === 0) {
		return (
			<FlexBox
				className='h-full px-3 py-4'
				items='center'
				justify='center'>
				<Span
					className='text-center text-sm text-foreground-500'
					weight='light'>
					{t('layers.empty')}
				</Span>
			</FlexBox>
		);
	}

	return (
		<FlexBox
			className='h-full overflow-y-auto p-2'
			direction='column'
			items='stretch'>
			{layers.map(({ depth, layer }) => (
				<LayerListItem
					depth={depth}
					isExpanded={expandedGroupIds.includes(layer.id)}
					isSelected={selectedLayerIds.includes(layer.id)}
					key={layer.id}
					layer={layer}
					onClick={event => {
						handleLayerClick(event, layer.id);
					}}
					onToggleExpanded={layer.type === 'group' ? () => handleLayerExpandedToggle(layer.id) : undefined}
				/>
			))}
		</FlexBox>
	);
}

LayerList.displayName = 'LayerList';

export default LayerList;
