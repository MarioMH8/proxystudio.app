import { EditorLayout } from '@features/editor';
import type { ReactNode } from 'react';

function Creator(): ReactNode {
	return <EditorLayout />;
}

Creator.displayName = 'CreatorPage';

export default Creator;
