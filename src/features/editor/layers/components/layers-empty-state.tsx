import EmptyState from '@components/empty-state';
import { Layers } from 'lucide-react';
import type { ReactNode } from 'react';

function LayerEmptyState(): ReactNode {
	return (
		<div className='flex h-full items-center justify-center'>
			<EmptyState
				icon={Layers}
				message='No layers yet. Click "Add Layer" to get started.'
			/>
		</div>
	);
}

LayerEmptyState.displayName = 'LayerEmptyState';

export default LayerEmptyState;
