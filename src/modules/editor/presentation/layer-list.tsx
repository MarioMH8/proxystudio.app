import FlexBox from '@components/flex-box';
import Span from '@components/span';
import { Card, Layer } from '@modules/card/domain';
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

	const canDeleteSelection = selectedLayerIds.length > 0;
	const canGroupSelection = Layer.canGroupSelection(card.layers, selectedLayerIds);

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

	function handleLayerRename(layerId: string, name: string): void {
		dispatch(editorSlice.actions.setCard(Card.renameLayer(card, layerId, name)));
	}

	function handleLayerContextMenu(layerId: string): void {
		if (selectedLayerIds.includes(layerId)) {
			return;
		}

		dispatch(editorSlice.actions.layerPanelSelectionSet([layerId]));
	}

	function handleDeleteSelection(): void {
		if (!canDeleteSelection) {
			return;
		}

		dispatch(editorSlice.actions.setCard(Card.deleteLayers(card, selectedLayerIds)));
		dispatch(editorSlice.actions.layerPanelSelectionClear());
	}

	function handleGroupSelection(): void {
		if (!canGroupSelection) {
			return;
		}

		const previousGroupIds = new Set(Layer.findGroups(card.layers).map(layer => layer.id));
		const nextCard = Card.groupLayers(card, selectedLayerIds);
		const nextGroup = Layer.findGroups(nextCard.layers).find(layer => {
			return !previousGroupIds.has(layer.id);
		});

		dispatch(editorSlice.actions.setCard(nextCard));

		if (nextGroup?.type === 'group') {
			dispatch(
				editorSlice.actions.layerPanelExpandedGroupsSet([...new Set([nextGroup.id, ...expandedGroupIds])])
			);
			dispatch(editorSlice.actions.layerPanelSelectionSet([nextGroup.id]));
		}
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
					key={layer.id}
					layer={layer}
					onClick={event => handleLayerClick(event, layer.id)}
					onContextMenuSelection={() => handleLayerContextMenu(layer.id)}
					onDeleteSelection={handleDeleteSelection}
					onGroupSelection={handleGroupSelection}
					onRename={name => handleLayerRename(layer.id, name)}
					onToggleExpanded={layer.type === 'group' ? () => handleLayerExpandedToggle(layer.id) : undefined}
					permissions={{ canDeleteSelection, canGroupSelection }}
					state={{
						isExpanded: expandedGroupIds.includes(layer.id),
						isSelected: selectedLayerIds.includes(layer.id),
					}}
				/>
			))}
		</FlexBox>
	);
}

LayerList.displayName = 'LayerList';

export default LayerList;
