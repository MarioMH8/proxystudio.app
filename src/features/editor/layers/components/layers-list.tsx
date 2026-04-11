import type { Layer } from '@domain';
import type { ReactNode } from 'react';

import LayerRow from './layers-row';

interface LayerListProps {
	layers: Layer[];
}

function LayerList({ layers }: LayerListProps): ReactNode {
	return (
		<ul
			aria-label='Layers'
			className='flex flex-col gap-1'
			role='list'>
			{layers.map(layer => (
				<LayerRow
					key={layer.id}
					layer={layer}
				/>
			))}
		</ul>
	);
}

LayerList.displayName = 'LayerList';

export default LayerList;
