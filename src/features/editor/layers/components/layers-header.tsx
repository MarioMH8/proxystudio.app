import Button from '@components/button';
import Heading from '@components/heading';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';

import { setFramePickerOpen, useEditorDispatch } from '../../store';

function LayersHeader(): ReactNode {
	const dispatch = useEditorDispatch();

	const handleAddLayer = (): void => {
		dispatch(setFramePickerOpen({ open: true }));
	};

	return (
		<div className='flex items-center justify-between'>
			<Heading
				dimension='base'
				heading='h2'
				variant='default'
				weight='semibold'>
				Layers
			</Heading>
			<Button
				dimension='sm'
				onClick={handleAddLayer}
				title='Add layer'
				transparent
				variant='default'>
				<Plus
					aria-hidden='true'
					className='h-3.5 w-3.5'
				/>
				Add layer
			</Button>
		</div>
	);
}

LayersHeader.displayName = 'LayersHeader';

export default LayersHeader;
