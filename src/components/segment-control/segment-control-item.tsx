import type { ButtonProperties } from '@components/button';
import Button from '@components/button';
import hover from '@components/hover';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { ReactNode } from 'react';

const variants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {},
	variants: {
		isActive: {
			false: '',
			true: '',
		},
	},
});

type SegmentControlItemProperties = ButtonProperties & VariantProperties<typeof variants>;

function SegmentControlItem({ dimension = 'sm', isActive, ...properties }: SegmentControlItemProperties): ReactNode {
	return (
		<Button
			className={cn(!isActive && cn('opacity-60 hover:opacity-100', hover({ variant: 'inherit' })))}
			dimension={dimension}
			transparent={!isActive}
			{...properties}
		/>
	);
}

SegmentControlItem.displayName = 'SegmentControlItem';

export type { SegmentControlItemProperties };

export default SegmentControlItem;
