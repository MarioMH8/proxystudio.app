import type { FrameTile } from '@domain';
import type { ReactNode } from 'react';

import { addFrameLayer, useEditorDispatch } from '../../store';
import { buildAddFrameLayerPayload, M15_STANDARD_GROUP } from '../data/m15-standard';
import FrameTileItem from './frame-tile';

interface FramePickerProps {
	onOpenChange: (open: boolean) => void;
}

function FramePicker({ onOpenChange }: FramePickerProps): ReactNode {
	const dispatch = useEditorDispatch();

	function handleTileSelect(tile: FrameTile): void {
		dispatch(addFrameLayer(buildAddFrameLayerPayload(tile)));
		onOpenChange(false);
	}

	return (
		<div className='overflow-y-auto'>
			{M15_STANDARD_GROUP.packs.map(pack => (
				<div
					aria-label={pack.name}
					className='px-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5'
					key={pack.id}
					role='listbox'>
					{pack.tiles.map(tile => (
						<FrameTileItem
							key={tile.id}
							onSelect={handleTileSelect}
							tile={tile}
						/>
					))}
				</div>
			))}
		</div>
	);
}

FramePicker.displayName = 'FramePicker';

export type { FramePickerProps };
export default FramePicker;
