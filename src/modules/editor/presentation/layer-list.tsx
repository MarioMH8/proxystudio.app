import FlexBox from '@components/flex-box';
import Span from '@components/span';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, KeyboardSensor, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Card, Layer } from '@modules/card/domain';
import { editorSlice, selectCard, selectExpandedGroupIds, selectSelectedLayerIds } from '@modules/editor/store';
import { useAppDispatch, useAppSelector } from '@shared/store';
import type { MouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { DragOverData, LayerDropState } from './layer-list.dnd';
import { collisionDetection, getDropState } from './layer-list.dnd';
import GroupBoundaryDropTarget from './layer-list-group-boundary-drop-target';
import LayerListItem from './layer-list-item';
import { buildLayerTree } from './layer-list-tree';

function LayerList(): ReactNode {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);
	const expandedGroupIds = useAppSelector(selectExpandedGroupIds);
	const selectedLayerIds = useAppSelector(selectSelectedLayerIds);
	const [activeLayerId, setActiveLayerId] = useState<string | undefined>();
	const [dropState, setDropState] = useState<LayerDropState | undefined>();

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	const canDeleteSelection = selectedLayerIds.length > 0;
	const canGroupSelection = Layer.canGroupSelection(card.layers, selectedLayerIds);
	const nodes = buildLayerTree(card.layers, expandedGroupIds);

	function handleLayerClick(event: MouseEvent<HTMLButtonElement>, layerId: string): void {
		if (event.metaKey || event.ctrlKey) {
			dispatch(editorSlice.actions.toggleLayerSelection(layerId));

			return;
		}

		if (selectedLayerIds.length === 1 && selectedLayerIds[0] === layerId) {
			dispatch(editorSlice.actions.clearLayerSelection());

			return;
		}

		dispatch(editorSlice.actions.setLayerSelection([layerId]));
	}

	function handleLayerExpandedToggle(layerId: string): void {
		dispatch(editorSlice.actions.toggleLayerGroupExpanded(layerId));
	}

	function handleLayerRename(layerId: string, name: string): void {
		dispatch(editorSlice.actions.updateCard(Card.renameLayer(card, layerId, name)));
	}

	function handleLayerContextMenu(layerId: string): void {
		if (selectedLayerIds.includes(layerId)) {
			return;
		}

		dispatch(editorSlice.actions.setLayerSelection([layerId]));
	}

	function handleDeleteSelection(): void {
		if (!canDeleteSelection) {
			return;
		}

		dispatch(editorSlice.actions.updateCard(Card.deleteLayers(card, selectedLayerIds)));
		dispatch(editorSlice.actions.clearLayerSelection());
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

		dispatch(editorSlice.actions.updateCard(nextCard));

		if (nextGroup?.type === 'group') {
			dispatch(editorSlice.actions.setExpandedLayerGroupIds([...new Set([nextGroup.id, ...expandedGroupIds])]));
			dispatch(editorSlice.actions.setLayerSelection([nextGroup.id]));
		}
	}

	function handleDragStart(event: DragStartEvent): void {
		const layerId = typeof event.active.id === 'string' ? event.active.id : undefined;

		setActiveLayerId(layerId);

		if (layerId && !selectedLayerIds.includes(layerId)) {
			dispatch(editorSlice.actions.setLayerSelection([layerId]));
		}
	}

	function handleDragOver(event: DragOverEvent): void {
		const overData = event.over?.data.current as Partial<DragOverData> | undefined;

		if (!overData || typeof overData.layerId !== 'string' || typeof overData.zone !== 'string') {
			setDropState(undefined);

			return;
		}

		if (overData.position) {
			setDropState({
				position: overData.position,
				targetLayerId: overData.layerId,
			});

			return;
		}

		const layerResult = Layer.findLayerById(card.layers, overData.layerId);

		if (!layerResult) {
			setDropState(undefined);

			return;
		}

		setDropState(
			getDropState({
				activeLayerId,
				layer: layerResult.layer,
				zone: overData.zone,
			})
		);
	}

	function resetDragState(): void {
		setActiveLayerId(undefined);
		setDropState(undefined);
	}

	function handleDragEnd(event: DragEndEvent): void {
		const movedLayerId = typeof event.active.id === 'string' ? event.active.id : undefined;

		if (!movedLayerId || !dropState) {
			resetDragState();

			return;
		}

		const nextCard = Card.moveLayer(card, movedLayerId, dropState);

		if (nextCard !== card) {
			dispatch(editorSlice.actions.updateCard(nextCard));
			dispatch(editorSlice.actions.setLayerSelection([movedLayerId]));

			if (
				dropState.position === Layer.DROP_POSITION.INTO_END ||
				dropState.position === Layer.DROP_POSITION.INTO_START
			) {
				dispatch(
					editorSlice.actions.setExpandedLayerGroupIds([
						...new Set([dropState.targetLayerId, ...expandedGroupIds]),
					])
				);
			}
		}

		resetDragState();
	}

	if (nodes.length === 0) {
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
		<DndContext
			collisionDetection={collisionDetection}
			modifiers={[restrictToVerticalAxis]}
			onDragCancel={resetDragState}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			onDragStart={handleDragStart}
			sensors={sensors}>
			<FlexBox
				className='h-full overflow-y-auto p-2'
				direction='column'
				items='stretch'>
				{nodes.map(node => {
					if (node.kind === 'group-boundary') {
						if (!activeLayerId) {
							// eslint-disable-next-line unicorn/no-useless-undefined
							return undefined;
						}

						return (
							<GroupBoundaryDropTarget
								activeLayerId={activeLayerId}
								depth={node.depth}
								dropState={dropState}
								groupId={node.groupId}
								key={`${node.groupId}:group-boundary`}
							/>
						);
					}

					return (
						<LayerListItem
							activeLayerId={activeLayerId}
							allowsDropIntoEnd={node.allowsDropIntoEnd}
							depth={node.depth}
							dropState={dropState?.targetLayerId === node.layer.id ? dropState : undefined}
							isGroupExpanded={node.isExpanded}
							key={node.layer.id}
							layer={node.layer}
							onClick={event => handleLayerClick(event, node.layer.id)}
							onContextMenuSelection={() => handleLayerContextMenu(node.layer.id)}
							onDeleteSelection={handleDeleteSelection}
							onGroupSelection={handleGroupSelection}
							onRename={name => handleLayerRename(node.layer.id, name)}
							onToggleExpanded={
								node.layer.type === 'group' ? () => handleLayerExpandedToggle(node.layer.id) : undefined
							}
							permissions={{ canDeleteSelection, canGroupSelection }}
							state={{
								isExpanded: node.isExpanded,
								isSelected: selectedLayerIds.includes(node.layer.id),
							}}
						/>
					);
				})}
			</FlexBox>
		</DndContext>
	);
}

LayerList.displayName = 'LayerList';

export default LayerList;
