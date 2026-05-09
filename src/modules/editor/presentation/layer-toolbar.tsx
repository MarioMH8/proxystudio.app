import border from '@components/border';
import type { FlexBoxProperties } from '@components/flex-box';
import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import { cva } from 'cva';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import AddLayerDropdown from './add-layer-dropdown';
import GroupLayersButton from './group-layers-button';

const variants = cva({
	base: 'px-3 py-1',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type LayerPanelProperties = Omit<FlexBoxProperties, 'asChild' | 'side'> & VariantProperties<typeof variants>;

function LayerToolbar({ className, ...properties }: LayerPanelProperties): ReactNode {
	const { t } = useTranslation();

	return (
		<FlexBox
			className={cn(variants({ className }), border({ side: 'bottom' }), className)}
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
				<GroupLayersButton />
				<AddLayerDropdown />
			</FlexBox>
		</FlexBox>
	);
}

LayerToolbar.displayName = 'LayerToolbar';

export default LayerToolbar;
