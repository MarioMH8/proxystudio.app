import Span from '@components/span';
import type { Layer } from '@domain';
import { cn } from '@shared/cva';
import { Image, Type } from 'lucide-react';
import type { ReactNode } from 'react';

interface LayerRowProps {
	layer: Layer;
}

const ICON_SIZE = 16;

function LayerRow({ layer }: LayerRowProps): ReactNode {
	const isTextLayer = layer.type === 'text';

	return (
		<li
			className={cn(
				'flex items-center gap-2 rounded-lg px-3 py-2.5 shadow-sm',
				'bg-foreground-100 dark:bg-foreground-800',
				'hover:bg-foreground-50 dark:hover:bg-foreground-700',
				'motion-safe:transition-[opacity,box-shadow,background-color] motion-safe:duration-150 cursor-pointer',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
			)}
			role='button'
			tabIndex={0}>
			<Span
				className='shrink-0'
				variant='middle'>
				{isTextLayer ? (
					<Type
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				) : (
					<Image
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				)}
			</Span>
			<Span
				className='min-w-0 flex-1 truncate'
				dimension='sm'>
				{layer.name}
			</Span>
		</li>
	);
}

LayerRow.displayName = 'LayerRow';

export default LayerRow;
