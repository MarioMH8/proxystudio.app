import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { cva } from 'cva';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {
		direction: 'row',
		items: 'center',
		variant: 'default',
	},
	variants: {
		content: {
			stretch: 'content-stretch',
		},
		direction: {
			column: 'flex-col',
			row: 'flex-row',
		},
		grow: {
			1: 'flex-1',
			auto: 'flex-auto',
			none: 'flex-none',
		},
		items: {
			baseline: 'items-baseline',
			center: 'items-center',
			end: 'items-end',
			none: '',
			start: 'items-start',
			stretch: 'items-stretch',
		},
		justify: {
			between: 'justify-between',
			center: 'justify-center',
			end: 'justify-end',
			start: 'justify-start',
		},
		variant: {
			default: 'flex',
			inline: 'inline-flex',
		},
	},
});

type FlexBoxVariantProperties = VariantProperties<typeof variants>;

type FlexBoxProperties = PropertiesWithAsChild<ComponentPropsWithRef<'div'> & FlexBoxVariantProperties>;

type FlexBoxClassNameProperties = FlexBoxVariantProperties & {
	className?: string | undefined;
};

function flexBoxClassName({ className, direction, items, justify, variant }: FlexBoxClassNameProperties): string {
	return cn(variants({ className, direction, items, justify, variant }), className);
}

function FlexBox({
	asChild,
	className,
	direction,
	items,
	justify,
	variant,
	...properties
}: FlexBoxProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'div';

	return (
		<Comp
			className={flexBoxClassName({ className, direction, items, justify, variant })}
			{...properties}
		/>
	);
}

FlexBox.displayName = 'FlexBox';

export type { FlexBoxVariantProperties };

export { flexBoxClassName };

export default FlexBox;
