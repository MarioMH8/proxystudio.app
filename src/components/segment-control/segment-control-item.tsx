import type { ButtonProperties } from '@components/button';
import Button from '@components/button';
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

function SegmentControlItem({ dimension = 'xs', isActive, ...properties }: SegmentControlItemProperties): ReactNode {
	return (
		<Button
			className={cn(!isActive && 'opacity-60 dark:hover:bg-inherit hover:bg-inherit hover:opacity-100')}
			dimension={dimension}
			transparent={!isActive}
			{...properties}
		/>
	);
}

SegmentControlItem.displayName = 'SegmentControlItem';

export type { SegmentControlItemProperties };

export default SegmentControlItem;
