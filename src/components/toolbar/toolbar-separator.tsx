import background from '@components/background';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Toolbar as RadixToolbar } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: ['shrink-0', background({ strength: 'default', variant: 'default' })],
	compoundVariants: [],
	defaultVariants: {
		orientation: 'vertical',
	},
	variants: {
		orientation: {
			horizontal: 'h-px w-full my-1',
			vertical: 'h-5 w-px mx-1',
		},
	},
});

type ToolbarSeparatorProperties = RadixToolbar.ToolbarSeparatorProps & VariantProperties<typeof variants>;

function ToolbarSeparator({
	className,
	orientation = 'vertical',
	...properties
}: ToolbarSeparatorProperties): ReactNode {
	return (
		<RadixToolbar.Separator
			className={cn(variants({ className, orientation }), className)}
			orientation={orientation}
			{...properties}
		/>
	);
}

ToolbarSeparator.displayName = 'ToolbarSeparator';

export type { ToolbarSeparatorProperties };

export default ToolbarSeparator;
