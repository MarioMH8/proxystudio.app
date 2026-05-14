import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Layer } from '@modules/card/domain';
import type { MouseEvent, ReactNode } from 'react';

import type { LayerDropState } from './layer-list.dnd';
import { DROP_ZONE } from './layer-list.dnd';
import type { LayerListItemPermissions, LayerListItemState } from './layer-list-item-view';
import LayerListItemView from './layer-list-item-view';

interface LayerListItemProperties {
	activeLayerId: string | undefined;
	allowsDropIntoEnd: boolean;
	depth?: number;
	dropState?: LayerDropState | undefined;
	isGroupExpanded: boolean;
	layer: Layer;
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	onContextMenuSelection: () => void;
	onDeleteSelection: () => void;
	onGroupSelection: () => void;
	onRename: (name: string) => void;
	onToggleExpanded?: (() => void) | undefined;
	onToggleHidden: () => void;
	onToggleSelectionHidden: () => void;
	permissions: LayerListItemPermissions;
	state: LayerListItemState;
}

function LayerListItem({
	activeLayerId,
	allowsDropIntoEnd,
	depth,
	dropState,
	isGroupExpanded,
	layer,
	onClick,
	onContextMenuSelection,
	onDeleteSelection,
	onGroupSelection,
	onRename,
	onToggleExpanded,
	onToggleHidden,
	onToggleSelectionHidden,
	permissions,
	state,
}: LayerListItemProperties): ReactNode {
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef: setDraggableNodeReference,
		transform,
	} = useDraggable({
		id: layer.id,
	});

	const topDrop = useDroppable({
		data: { isExpanded: isGroupExpanded, layerId: layer.id, zone: DROP_ZONE.TOP },
		id: `${layer.id}:${DROP_ZONE.TOP}`,
	});

	const centerDrop = useDroppable({
		data: { isExpanded: isGroupExpanded, layerId: layer.id, zone: DROP_ZONE.CENTER },
		id: `${layer.id}:${DROP_ZONE.CENTER}`,
	});

	const bottomDrop = useDroppable({
		data: {
			isExpanded: isGroupExpanded,
			layerId: layer.id,
			position: allowsDropIntoEnd ? Layer.DROP_POSITION.INTO_END : Layer.DROP_POSITION.BEFORE,
			zone: DROP_ZONE.BOTTOM,
		},
		id: `${layer.id}:${DROP_ZONE.BOTTOM}`,
	});

	function setButtonNodeReference(node: HTMLButtonElement | null): void {
		setDraggableNodeReference(node);
		centerDrop.setNodeRef(node);
	}

	return (
		<LayerListItemView
			activeLayerId={activeLayerId}
			depth={depth ?? 0}
			dnd={{
				attributes,
				isDragging,
				listeners,
				setBottomDropNodeRef: bottomDrop.setNodeRef,
				setButtonNodeRef: setButtonNodeReference,
				setTopDropNodeRef: topDrop.setNodeRef,
				transform: CSS.Translate.toString(transform),
			}}
			dropState={dropState}
			layer={layer}
			onClick={onClick}
			onContextMenuSelection={onContextMenuSelection}
			onDeleteSelection={onDeleteSelection}
			onGroupSelection={onGroupSelection}
			onRename={onRename}
			onToggleExpanded={onToggleExpanded}
			onToggleHidden={onToggleHidden}
			onToggleSelectionHidden={onToggleSelectionHidden}
			permissions={permissions}
			state={state}
		/>
	);
}

LayerListItem.displayName = 'LayerListItem';

export type { LayerListItemProperties };

export default LayerListItem;
