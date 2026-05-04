import focus from '@components/focus';
import font from '@components/font';
import hover from '@components/hover';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Toolbar as RadixToolbar } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'group',
		'relative',
		'select-none',
		'whitespace-nowrap',
		'cursor-default',
		hover({ strength: 'soft', variant: 'default' }),
		rounded({ dimension: 'sm' }),
	],
	compoundVariants: [
		{
			className: 'w-8 px-0',
			dimension: 'xs',
			icon: true,
		},
		{
			className: 'w-9 px-0',
			dimension: 'sm',
			icon: true,
		},
		{
			className: 'w-10 px-0',
			dimension: 'base',
			icon: true,
		},
	],
	defaultVariants: {
		dimension: 'base',
		icon: false,
	},
	variants: {
		dimension: {
			base: 'h-8 px-3',
			sm: 'h-7 px-2.5',
			xs: 'h-6 px-2',
		},
		icon: {
			false: '',
			true: '',
		},
	},
});

type ToolbarLinkProperties = RadixToolbar.ToolbarLinkProps & VariantProperties<typeof variants>;

function ToolbarLink({ className, dimension, icon, ...properties }: ToolbarLinkProperties): ReactNode {
	return (
		<RadixToolbar.Link
			className={cn(
				font({ dimension: 'sm', tracking: 'normal', variant: 'strong', weight: 'medium' }),
				focus({ dimension, noBorder: true, variant: 'primary' }),
				variants({ className, dimension, icon }),
				className
			)}
			{...properties}
		/>
	);
}

ToolbarLink.displayName = 'ToolbarLink';

export type { ToolbarLinkProperties };

export { variants };

export default ToolbarLink;
