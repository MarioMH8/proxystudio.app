import type { ReactNode } from 'react';

/**
 * Canvas empty state — dashed border placeholder at card dimensions.
 * Rendered inside the transformed viewport container so it follows zoom/pan.
 */
function CanvasEmptyState(): ReactNode {
	return (
		<div
			aria-hidden='true'
			className='flex h-full w-full items-center justify-center'>
			<div className='h-full w-full rounded border-2 border-dashed border-foreground-400 dark:border-foreground-600' />
		</div>
	);
}

export default CanvasEmptyState;
