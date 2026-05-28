import { Accordion } from '@components/accordion';
import border from '@components/border';
import { selectSingleSelectedRenderableLayer } from '@modules/editor/store';
import { cn } from '@shared/cva';
import { useAppSelector } from '@shared/store';
import type { ReactNode } from 'react';

import CommonLayerPropertiesPanel from './layer-properties-panel-common';

function LayerPropertiesPanel(): ReactNode {
	const selectedLayer = useAppSelector(selectSingleSelectedRenderableLayer);

	if (!selectedLayer) {
		return;
	}

	return (
		<Accordion
			className={cn(border({ side: 'top' }), 'p-3')}
			collapsible
			defaultValue='common'
			type='single'>
			<CommonLayerPropertiesPanel layer={selectedLayer} />
		</Accordion>
	);
}

LayerPropertiesPanel.displayName = 'LayerPropertiesPanel';

export default LayerPropertiesPanel;
