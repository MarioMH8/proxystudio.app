import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Layer } from '@modules/card/domain';
import type { MouseEvent, ReactNode } from 'react';

import type { LayerDropState } from './layer-list.dnd';
import { DROP_ZONE } from './layer-list.dnd';
import LayerListItemContextMenu from './layer-list-item-context-menu';
import type { LayerListItemState } from './layer-list-item-view';
import LayerListItemView from './layer-list-item-view';

interface LayerListItemPermissions {
	canDeleteSelection: boolean;
	canGroupSelection: boolean;
	canToggleSelectionHidden: boolean;
	isSelectionHidden: boolean;
}

interface LayerListItemProperties {
	allowsDropIntoEnd: boolean;
	depth?: number;
	dropState?: LayerDropState | undefined;
	isGroupExpanded: boolean;
	layer: Layer;
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
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

	function setItemNodeReference(node: HTMLElement | null): void {
		setDraggableNodeReference(node);
		centerDrop.setNodeRef(node);
	}

	return (
		<LayerListItemContextMenu
			canDeleteSelection={permissions.canDeleteSelection}
			canGroupSelection={permissions.canGroupSelection}
			canToggleSelectionHidden={permissions.canToggleSelectionHidden}
			isSelectionHidden={permissions.isSelectionHidden}
			onDeleteSelection={onDeleteSelection}
			onGroupSelection={onGroupSelection}
			onToggleSelectionHidden={onToggleSelectionHidden}>
			<LayerListItemView
				depth={depth ?? 0}
				dnd={{
					attributes,
					isDragging,
					listeners,
					setBottomDropNodeRef: bottomDrop.setNodeRef,
					setItemNodeRef: setItemNodeReference,
					setTopDropNodeRef: topDrop.setNodeRef,
					transform: CSS.Translate.toString(transform),
				}}
				dropState={dropState}
				layer={layer}
				onClick={onClick}
				onContextMenuSelection={onContextMenuSelection}
				onRename={onRename}
				onToggleExpanded={onToggleExpanded}
				onToggleHidden={onToggleHidden}
				state={state}
			/>
		</LayerListItemContextMenu>
	);
}

LayerListItem.displayName = 'LayerListItem';

export type { LayerListItemPermissions, LayerListItemProperties };

export default LayerListItem;
