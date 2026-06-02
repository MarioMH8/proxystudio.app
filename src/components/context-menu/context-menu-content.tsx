import background from '@components/background';
import border from '@components/border';
import rounded from '@components/rounded';
import shadow from '@components/shadow';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { ContextMenu as RadixContextMenu } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'min-w-36',
		'p-1',
		'space-y-1',
		shadow({ depth: 'lg' }),
		rounded({ dimension: 'md' }),
		'will-change-[transform,opacity]',
		'data-[side=bottom]:animate-slide-down',
		'data-[side=left]:animate-slide-right',
		'data-[side=right]:animate-slide-left',
		'data-[side=top]:animate-slide-top',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {
		variant: {
			default: [
				background({ variant: 'surfaces' }),
				border({ strength: 'default', variant: 'default' }),
				shadow({ depth: 'lg', strength: 'default', variant: 'default' }),
			],
			primary: [
				background({ strength: 'soft', variant: 'primary' }),
				border({ strength: 'soft', variant: 'primary' }),
				shadow({ depth: 'lg', strength: 'soft', variant: 'primary' }),
			],
		},
	},
});

type ContextMenuContentProps = RadixContextMenu.ContextMenuContentProps & VariantProperties<typeof variants>;

function ContextMenuContent({ className, variant = 'default', ...properties }: ContextMenuContentProps): ReactNode {
	return (
		<RadixContextMenu.Portal>
			<RadixContextMenu.Content
				className={cn(variants({ className, variant }), className)}
				{...properties}
			/>
		</RadixContextMenu.Portal>
	);
}

ContextMenuContent.displayName = 'ContextMenuContent';

export { variants };

export default ContextMenuContent;
