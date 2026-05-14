import { useDroppable } from '@dnd-kit/core';
import { Layer } from '@modules/card/domain';
import { cn } from '@shared/cva';
import type { ReactNode } from 'react';

import type { LayerDropState } from './layer-list.dnd';
import { DROP_ZONE, getLayerTreeIndent } from './layer-list.dnd';

interface GroupBoundaryDropTargetProperties {
	activeLayerId: string | undefined;
	depth: number;
	dropState: LayerDropState | undefined;
	groupId: string;
}

function GroupBoundaryDropTarget({
	activeLayerId,
	depth,
	dropState,
	groupId,
}: GroupBoundaryDropTargetProperties): ReactNode {
	const { setNodeRef } = useDroppable({
		data: {
			isExpanded: true,
			layerId: groupId,
			position: Layer.DROP_POSITION.BEFORE,
			zone: DROP_ZONE.BOTTOM,
		},
		id: `${groupId}:group-boundary`,
	});

	const isActive =
		activeLayerId !== undefined &&
		dropState?.targetLayerId === groupId &&
		dropState.position === Layer.DROP_POSITION.BEFORE;

	return (
		<div
			className={cn('relative h-4', activeLayerId === groupId ? 'pointer-events-none' : '')}
			ref={setNodeRef}
			style={{ paddingLeft: getLayerTreeIndent(depth) }}>
			<span
				className={cn(
					'pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-primary transition-opacity',
					isActive ? 'opacity-100' : 'opacity-0'
				)}
			/>
		</div>
	);
}

GroupBoundaryDropTarget.displayName = 'GroupBoundaryDropTarget';

export default GroupBoundaryDropTarget;
