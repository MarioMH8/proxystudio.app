import { flexBoxClassName } from '@components/flex-box';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: [flexBoxClassName({ items: 'center', variant: 'inline' }), rounded({ dimension: 'md' })],
	compoundVariants: [],
	defaultVariants: {
		spacing: 'compact',
	},
	variants: {
		spacing: {
			compact: 'gap-1 p-0',
			default: 'gap-0.5 p-0.5',
		},
	},
});

type ToolbarGroupProperties = PropertiesWithAsChild<ComponentPropsWithRef<'div'> & VariantProperties<typeof variants>>;

function ToolbarGroup({ asChild = false, className, spacing, ...properties }: ToolbarGroupProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'div';

	return (
		<Comp
			className={cn(variants({ className, spacing }), className)}
			{...properties}
		/>
	);
}

ToolbarGroup.displayName = 'ToolbarGroup';

export type { ToolbarGroupProperties };

export { variants };

export default ToolbarGroup;
