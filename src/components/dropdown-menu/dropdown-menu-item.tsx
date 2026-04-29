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
		rounded({ dimension: 'sm' }),
		'select-none',
		'data-[disabled]:pointer-events-none data-[disabled]:text-mauve8',
		cn('text-foreground-950 dark:text-foreground-50', hover({ strength: 'default', variant: 'default' })),
		'data-[highlighted]:bg-foreground-400/40 dark:data-[highlighted]:bg-foreground-700',
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
				focus({ noBorder: true, variant: 'primary' }),
				flexBoxClassName({}),
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
