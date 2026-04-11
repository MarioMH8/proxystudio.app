import type { ReactNode } from 'react';

/**
 * Canvas empty state — dashed border with centered message.
 * Matches the reference design when no layers exist.
 */
function CanvasEmptyState(): ReactNode {
	return (
		<div
			aria-hidden='true'
			className='absolute inset-0 flex items-center justify-center'>
			<div className='flex aspect-5/7 h-[70%] max-h-[90%] items-center justify-center rounded border-2 border-dashed border-foreground-400 dark:border-foreground-600' />
		</div>
	);
}

export default CanvasEmptyState;
