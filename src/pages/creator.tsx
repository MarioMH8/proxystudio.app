import type { ReactNode } from 'react';

import { EditorLayout } from '../features/editor';

function Creator(): ReactNode {
	return (
		<div className='h-full w-full'>
			<EditorLayout />
		</div>
	);
}

Creator.displayName = 'CreatorPage';

export default Creator;
