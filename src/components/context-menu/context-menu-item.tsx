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

type ContextMenuItemFlexProperties = Omit<Parameters<typeof flexBoxClassName>[0], 'className' | 'variant'>;

type ContextMenuItemProps = RadixContextMenu.ContextMenuItemProps & VariantProperties<typeof variants>;

type ContextMenuItemProperties = ContextMenuItemFlexProperties &
	ContextMenuItemProps & {
		flexVariant?: Parameters<typeof flexBoxClassName>[0]['variant'];
	};

function ContextMenuItem({
	className,
	direction,
	flexVariant,
	items,
	justify,
	variant = 'default',
	...properties
}: ContextMenuItemProperties): ReactNode {
	return (
		<RadixContextMenu.Item
			className={cn(
				font({ dimension: 'sm', variant }),
				hover({ strength: 'soft', variant }),
				focus({ noBorder: true, variant }),
				flexBoxClassName({ direction, items, justify, variant: flexVariant }),
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
