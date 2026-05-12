import { flexBoxClassName } from '@components/flex-box';
import focus from '@components/focus';
import font from '@components/font';
import hover from '@components/hover';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'group relative',
		'h-8',
		'px-4 py-2',
		'select-none',
		'data-disabled:pointer-events-none data-disabled:opacity-50',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type DropdownMenuItemProps = RadixDropdownMenu.DropdownMenuItemProps & VariantProperties<typeof variants>;

function DropdownMenuItem({ className, ...properties }: DropdownMenuItemProps): ReactNode {
	return (
		<RadixDropdownMenu.Item
			className={cn(
				font({ dimension: 'sm', variant: 'default' }),
				hover({ strength: 'soft', variant: 'default' }),
				focus({ noBorder: true, strength: 'soft', variant: 'default' }),
				flexBoxClassName({}),
				rounded({ dimension: 'sm' }),
				variants({ className }),
				className
			)}
			{...properties}
		/>
	);
}

DropdownMenuItem.displayName = 'DropdownMenuItem';

export { variants };

export default DropdownMenuItem;
