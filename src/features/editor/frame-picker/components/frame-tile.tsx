import Button from '@components/button';
import Span from '@components/span';
import type { FrameTile } from '@domain';
import type { ReactNode } from 'react';

interface FrameTileProps {
	/** Called when the tile is clicked */
	onSelect: (tile: FrameTile) => void;
	/** The frame tile to display */
	tile: FrameTile;
}

/**
 * Individual frame tile in the picker grid.
 * Renders a thumbnail image and name label.
 * Click handler calls onSelect.
 */
function FrameTileItem({ onSelect, tile }: FrameTileProps): ReactNode {
	const thumbnailSource = tile.thumbnailSrc ?? tile.src;

	return (
		<Button asChild>
			<button
				className='group flex flex-col items-center gap-1 rounded-lg border border-transparent p-2 text-center transition-all hover:border-foreground-300 hover:bg-foreground-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:border-foreground-600 dark:hover:bg-foreground-800'
				onClick={() => {
					onSelect(tile);
				}}
				role='option'
				type='button'>
				<img
					alt={tile.name}
					className='h-auto w-full rounded object-contain'
					src={thumbnailSource}
				/>
				<Span
					dimension='xs'
					variant='default'
					weight='medium'>
					{tile.name}
				</Span>
			</button>
		</Button>
	);
}

FrameTileItem.displayName = 'FrameTileItem';

export type { FrameTileProps };
export default FrameTileItem;
