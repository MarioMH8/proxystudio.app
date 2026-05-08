import border from '@components/border';
import Button from '@components/button';
import type { FlexBoxProperties } from '@components/flex-box';
import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import Span from '@components/span';
import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import { useAppSelector } from '@shared/store';
import { cva } from 'cva';
import { FolderIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { selectCard } from '../store';
import AddLayerDropdown from './add-layer-dropdown';

const variants = cva({
	base: 'px-3 py-1',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type LayerPanelProperties = Omit<FlexBoxProperties, 'asChild' | 'side'> & VariantProperties<typeof variants>;

function LayerToolbar({ className, ...properties }: LayerPanelProperties): ReactNode {
	const { t } = useTranslation();
	const card = useAppSelector(selectCard);

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
				<Span
					className='ml-3'
					dimension='sm'
					variant='muted'
					weight='extralight'>
					({card.layers.length})
				</Span>
			</Heading>
			<FlexBox
				className='gap-2'
				items='center'>
				<Button
					aria-label={t('layers.open')}
					dimension='xs'
					icon
					transparent>
					<FolderIcon
						aria-hidden='true'
						size={14}
					/>
				</Button>
				<AddLayerDropdown />
			</FlexBox>
		</FlexBox>
	);
}

LayerToolbar.displayName = 'LayerToolbar';

export default LayerToolbar;
