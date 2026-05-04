import { flexBoxClassName } from '@components/flex-box';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Toolbar as RadixToolbar } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: [flexBoxClassName({ items: 'center', variant: 'inline' })],
	compoundVariants: [],
	defaultVariants: {
		gap: 'sm',
	},
	variants: {
		gap: {
			base: 'gap-1',
			none: 'gap-0',
			sm: 'gap-0.5',
		},
	},
});

type ToolbarToggleGroupProperties = ComponentPropsWithRef<typeof RadixToolbar.ToggleGroup> &
	VariantProperties<typeof variants>;

function ToolbarToggleGroup({ className, gap, ...properties }: ToolbarToggleGroupProperties): ReactNode {
	return (
		<RadixToolbar.ToggleGroup
			className={cn(variants({ className, gap }), className)}
			{...properties}
		/>
	);
}

ToolbarToggleGroup.displayName = 'ToolbarToggleGroup';

export type { ToolbarToggleGroupProperties };

export default ToolbarToggleGroup;
