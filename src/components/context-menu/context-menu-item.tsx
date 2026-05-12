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
		'select-none',
		'data-disabled:pointer-events-none data-disabled:opacity-50',
	],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			danger: '',
			default: '',
		},
	},
});

type ContextMenuItemProps = RadixContextMenu.ContextMenuItemProps & VariantProperties<typeof variants>;

function ContextMenuItem({ className, variant = 'default', ...properties }: ContextMenuItemProps): ReactNode {
	return (
		<RadixContextMenu.Item
			className={cn(
				font({ dimension: 'sm', variant }),
				hover({ strength: 'soft', variant }),
				focus({ noBorder: true, variant }),
				flexBoxClassName({}),
				rounded({ dimension: 'sm' }),
				variants({ className, variant }),
				className
			)}
			{...properties}
		/>
	);
}

ContextMenuItem.displayName = 'ContextMenuItem';

export { variants };

export default ContextMenuItem;
