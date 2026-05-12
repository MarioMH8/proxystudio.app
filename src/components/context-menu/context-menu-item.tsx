import { flexBoxClassName } from '@components/flex-box';
import focus from '@components/focus';
import font from '@components/font';
import hover from '@components/hover';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { ContextMenu as RadixContextMenu } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'group relative',
		'h-8',
		'px-4 py-2',
		font({ dimension: 'sm', variant: 'default' }),
		focus({ noBorder: true, variant: 'primary' }),
		flexBoxClassName({}),
		rounded({ dimension: 'sm' }),
		'select-none',
		'data-disabled:pointer-events-none data-disabled:text-foreground-600 dark:data-disabled:text-foreground-400',
		hover({ strength: 'default', variant: 'default' }),
		'data-highlighted:bg-foreground-400/40 dark:data-highlighted:bg-foreground-700',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type ContextMenuItemProps = RadixContextMenu.ContextMenuItemProps & VariantProperties<typeof variants>;

function ContextMenuItem({ className, ...properties }: ContextMenuItemProps): ReactNode {
	return (
		<RadixContextMenu.Item
			className={cn(variants({ className }), className)}
			{...properties}
		/>
	);
}

ContextMenuItem.displayName = 'ContextMenuItem';

export { variants };

export default ContextMenuItem;
