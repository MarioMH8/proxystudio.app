import background from '@components/background';
import border from '@components/border';
import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import rounded from '@components/rounded';
import shadow from '@components/shadow';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Tooltip as RadixTooltip } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'motion-safe:transition-all',
		'select-none',
		rounded(),
		'px-2 py-1',
		'will-change-[transform,opacity]',
		border(),
		shadow({ depth: 'lg' }),
		'data-[state=delayed-open]:data-[side=bottom]:animate-slide-down',
		'data-[state=delayed-open]:data-[side=left]:animate-slide-right',
		'data-[state=delayed-open]:data-[side=right]:animate-slide-left',
		'data-[state=delayed-open]:data-[side=top]:animate-slide-top',
	],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: [
				background({ variant: 'default' }),
				border({ side: 'none', strength: 'soft', variant: 'default' }),
				shadow({ depth: 'lg', strength: 'soft', variant: 'default' }),
			],
			primary: [
				background({ strength: 'soft', variant: 'primary' }),
				border({ side: 'none', strength: 'soft', variant: 'primary' }),
				shadow({ depth: 'lg', strength: 'soft', variant: 'primary' }),
			],
		},
	},
});

type TooltipContentProps = FontVariantsProperties &
	RadixTooltip.TooltipContentProps &
	VariantProperties<typeof variants>;

function TooltipContent({
	className,
	dimension = 'sm',
	leading,
	side = 'bottom',
	sideOffset = 8,
	tracking,
	uppercase,
	variant,
	weight,
	...properties
}: TooltipContentProps): ReactNode {
	return (
		<RadixTooltip.TooltipContent
			className={cn(
				font({ dimension, leading, tracking, uppercase, variant, weight }),
				variants({ className, variant }),
				className
			)}
			side={side}
			sideOffset={sideOffset}
			{...properties}
		/>
	);
}

TooltipContent.displayName = 'TooltipContent';

export default TooltipContent;
