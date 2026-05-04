import type { AsideProperties } from '@components/aside';
import Aside from '@components/aside';
import FlexBox from '@components/flex-box';
import type { ReactNode } from 'react';
import { Panel } from 'react-resizable-panels';

import LayerToolbar from './layer-toolbar';

type LayerPanelProperties = Omit<AsideProperties, 'asChild' | 'side'>;

function LayersPanel(properties: LayerPanelProperties): ReactNode {
	return (
		<Aside
			asChild
			side='right'
			{...properties}>
			<FlexBox
				asChild
				className='gap-2'
				direction='column'
				items='stretch'>
				<Panel
					collapsible
					id='editor-layers-panel'
					maxSize='35%'
					minSize='15%'>
					<LayerToolbar />
				</Panel>
			</FlexBox>
		</Aside>
	);
}

LayersPanel.displayName = 'LayerPanel';

export default LayersPanel;
