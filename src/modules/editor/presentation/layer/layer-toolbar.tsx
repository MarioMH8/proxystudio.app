import border from '@components/border';
import type { FlexBoxProperties } from '@components/flex-box';
import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import { cn } from '@shared/cva';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import AddLayerDropdown from './add-layer-dropdown';

const baseClassName = 'px-3 py-1';

type LayerPanelProperties = Omit<FlexBoxProperties, 'asChild' | 'side'>;

function LayerToolbar({ className, ...properties }: LayerPanelProperties): ReactNode {
	const { t } = useTranslation();

	return (
		<FlexBox
			className={cn(baseClassName, border({ side: 'bottom' }), className)}
			items='center'
			justify='between'
			{...properties}>
			<Heading
				dimension='sm'
				heading='h2'
				uppercase
				variant='muted'
				weight='medium'>
				{t('layers.title')}
			</Heading>
			<FlexBox
				className='gap-2'
				items='center'>
				<AddLayerDropdown />
			</FlexBox>
		</FlexBox>
	);
}

LayerToolbar.displayName = 'LayerToolbar';

export default LayerToolbar;
