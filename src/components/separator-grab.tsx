import background from '@components/background';
import border from '@components/border';
import FlexBox from '@components/flex-box';
import focus from '@components/focus';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { GripHorizontalIcon, GripVerticalIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SeparatorProps } from 'react-resizable-panels';
import { Separator } from 'react-resizable-panels';

const variants = cva({
	base: [
		`data-[separator='active']:bg-foreground-200 dark:data-[separator='active']:bg-foreground-800`,
		`data-[separator='focus']:bg-foreground-200 dark:data-[separator='focus']:bg-foreground-800`,
		focus({ dimension: 'sm', noBorder: true, variant: 'default' }),
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {
		orientation: {
			horizontal: 'w-2 sm:w-1',
			vertical: 'h-2 sm:h-1',
		},
	},
});

type SeparatorGrabProperties = SeparatorProps & VariantProperties<typeof variants>;

function SeparatorGrab({ className, orientation, ...properties }: SeparatorGrabProperties): ReactNode {
	return (
		<FlexBox
			asChild
			items='center'
			justify='center'>
			<Separator
				className={cn(variants({ className, orientation }), className)}
				{...properties}>
				<span
					className={cn(
						'rounded-sm',
						background({ variant: 'surfaces' }),
						border(),
						orientation === 'vertical' ? 'px-0.5' : 'py-2 pl-1.5 pr-0'
					)}>
					{orientation === 'vertical' ? (
						<GripHorizontalIcon className='w-6 h-6 sm:w-4 sm:h-4 shrink-0' />
					) : (
						<GripVerticalIcon className='w-6 h-6 sm:w-4 sm:h-4 shrink-0' />
					)}
				</span>
			</Separator>
		</FlexBox>
	);
}

SeparatorGrab.displayName = 'SeparatorGrab';

export type { SeparatorGrabProperties };

export default SeparatorGrab;
