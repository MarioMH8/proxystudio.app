import type { CollisionDetection } from '@dnd-kit/core';
import { closestCenter, pointerWithin } from '@dnd-kit/core';
import type { Layer, LayerMoveTarget } from '@modules/card/domain';

const DROP_ZONE = {
	BOTTOM: 'bottom',
	CENTER: 'center',
	TOP: 'top',
} as const;

type DropZone = (typeof DROP_ZONE)[keyof typeof DROP_ZONE];

interface LayerDropState {
	position: LayerMoveTarget['position'];
	targetLayerId: string;
}

interface DragOverData {
	isExpanded: boolean;
	layerId: string;
	position?: LayerMoveTarget['position'];
	zone: DropZone;
}

interface GetDropStateParameters {
	activeLayerId: string | undefined;
	layer: Layer;
	zone: DropZone;
}

const collisionDetection: CollisionDetection = collisionDetectionArguments => {
	const pointerMatches = pointerWithin(collisionDetectionArguments);

	if (pointerMatches.length > 0) {
		return pointerMatches;
	}

	return closestCenter(collisionDetectionArguments);
};

function getDropState({ activeLayerId, layer, zone }: GetDropStateParameters): LayerDropState | undefined {
	if (!activeLayerId || activeLayerId === layer.id) {
		return undefined;
	}

	if (zone === DROP_ZONE.CENTER) {
		if (layer.type === 'group') {
			return {
				position: 'into-start',
				targetLayerId: layer.id,
			};
		}

		return {
			position: 'group-with',
			targetLayerId: layer.id,
		};
	}

	return {
		position: zone === DROP_ZONE.TOP ? 'after' : 'before',
		targetLayerId: layer.id,
	};
}

export type { DragOverData, DropZone, LayerDropState };

export { collisionDetection, DROP_ZONE, getDropState };
