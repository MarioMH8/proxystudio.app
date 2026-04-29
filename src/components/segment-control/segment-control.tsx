import background from '@components/background';
import border from '@components/border';
import FlexBox from '@components/flex-box';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: cn(
		'w-full p-1 sm:w-auto',
		background({ strength: 'soft', variant: 'default' }),
		rounded({ dimension: 'lg' })
	),
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type SegmentControlProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'div'> & VariantProperties<typeof variants>
>;

function SegmentControl({ asChild, className, ...properties }: SegmentControlProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'div';

	return (
		<FlexBox
			asChild
			className='gap-1'
			items='center'
			justify='start'
			variant='inline'>
			<Comp
				className={cn(variants({ className }), border(), className)}
				{...properties}
			/>
		</FlexBox>
	);
}

SegmentControl.displayName = 'SegmentControl';

export type { SegmentControlProperties };

export default SegmentControl;
