import { flexBoxClassName } from '@components/flex-box';
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
		flexBoxClassName({ items: 'center', justify: 'center', variant: 'inline' }),
		'leading-none',
		rounded({ context: 'inner', dimension: 'xl' }),
		hover({ strength: 'soft', variant: 'default' }),
		'select-none',
		'whitespace-nowrap',
		'cursor-default',
		'data-disabled:pointer-events-none data-disabled:opacity-50',
		'data-[state=on]:bg-primary-600 data-[state=on]:text-white data-[state=on]:hover:bg-primary-500',
	],
	compoundVariants: [
		{
			className: 'w-6 px-0',
			dimension: 'xs',
			icon: true,
		},
		{
			className: 'w-7.5 px-0',
			dimension: 'sm',
			icon: true,
		},
		{
			className: 'w-8.5 px-0',
			dimension: 'base',
			icon: true,
		},
		{
			className: 'w-9 px-0',
			dimension: 'lg',
			icon: true,
		},
	],
	defaultVariants: {
		dimension: 'lg',
		icon: false,
	},
	variants: {
		dimension: {
			base: 'h-8.5 px-3',
			lg: 'h-9 px-3.5',
			sm: 'h-7.5 px-2.5',
			xs: 'h-6 px-2',
		},
		icon: {
			false: '',
			true: '',
		},
	},
});

type ToolbarToggleItemProperties = RadixToolbar.ToolbarToggleItemProps & VariantProperties<typeof variants>;

function ToolbarToggleItem({ className, dimension, icon, ...properties }: ToolbarToggleItemProperties): ReactNode {
	return (
		<RadixToolbar.ToggleItem
			className={cn(
				font({ dimension: 'sm', tracking: 'normal', variant: 'default', weight: 'medium' }),
				focus({ dimension, noBorder: true, variant: 'primary' }),
				variants({ className, dimension, icon }),
				className
			)}
			{...properties}
		/>
	);
}

ToolbarToggleItem.displayName = 'ToolbarToggleItem';

export type { ToolbarToggleItemProperties };

export default ToolbarToggleItem;
