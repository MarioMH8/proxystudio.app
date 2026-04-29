import type { AsideProperties } from '@components/aside';
import Aside from '@components/aside';
import type { VariantProperties } from '@shared/cva';
import { cva } from 'cva';
import type { ReactNode } from 'react';
import { Panel } from 'react-resizable-panels';

const variants = cva({
	base: 'min-w-xs',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type LayerPanelProperties = Omit<AsideProperties, 'asChild' | 'side'> & VariantProperties<typeof variants>;

function LayersPanel(properties: LayerPanelProperties): ReactNode {
	return (
		<Aside
			asChild
			side='right'
			{...properties}>
			<Panel
				collapsible
				id='editor-layers-panel'
				maxSize='35%'
				minSize='15%'
			/>
		</Aside>
	);
}

LayersPanel.displayName = 'LayerPanel';

export default LayersPanel;
