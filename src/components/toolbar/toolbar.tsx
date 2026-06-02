import background from '@components/background';
import border from '@components/border';
import { flexBoxClassName } from '@components/flex-box';
import rounded from '@components/rounded';
import shadow from '@components/shadow';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Toolbar as RadixToolbar } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'select-none',
		'gap-1 px-1 py-1.5',
		'w-fit',
		'backdrop-blur-md',
		background({ variant: 'surfaces' }),
		border({ strength: 'soft', variant: 'default' }),
		shadow({ depth: 'lg', strength: 'soft', variant: 'default' }),
		flexBoxClassName({ items: 'center', variant: 'inline' }),
		rounded({ dimension: 'xl' }),
	],
	compoundVariants: [],
	defaultVariants: {
		dimension: 'lg',
	},
	variants: {
		dimension: {
			base: 'h-9',
			lg: 'h-11',
			sm: 'h-8',
			xs: 'h-8',
		},
	},
});

type ToolbarProperties = RadixToolbar.ToolbarProps & VariantProperties<typeof variants>;

function Toolbar({ className, dimension, ...properties }: ToolbarProperties): ReactNode {
	return (
		<RadixToolbar.Root
			className={cn(variants({ className, dimension }), className)}
			{...properties}
		/>
	);
}

Toolbar.displayName = 'Toolbar';

export type { ToolbarProperties };

export default Toolbar;
