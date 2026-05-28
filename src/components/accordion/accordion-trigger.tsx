import FlexBox, { flexBoxClassName } from '@components/flex-box';
import focus from '@components/focus';
import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import hover from '@components/hover';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { ChevronDown } from 'lucide-react';
import { Accordion as RadixAccordion } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'group cursor-default w-full',
	compoundVariants: [],
	defaultVariants: {
		surface: 'default',
	},
	variants: {
		surface: {
			default: cn(
				'py-3',
				'px-4',
				rounded({ dimension: 'lg' }),
				'data-[state=open]:rounded-b-none',
				hover({ strength: 'soft', variant: 'default' })
			),
			transparent: cn(
				'px-0 py-0',
				rounded({ dimension: 'none' }),
				'data-[state=open]:rounded-none',
				'hover:bg-transparent'
			),
		},
	},
});

type AccordionTriggerProps = FontVariantsProperties &
	RadixAccordion.AccordionTriggerProps &
	VariantProperties<typeof variants> & {
		ref?: ComponentPropsWithRef<typeof RadixAccordion.Trigger>['ref'];
	};

function AccordionTrigger({
	children,
	className,
	dimension = 'sm',
	leading,
	ref,
	surface = 'default',
	tracking,
	uppercase,
	variant = 'default',
	weight = 'medium',
	...properties
}: AccordionTriggerProps): ReactNode {
	return (
		<FlexBox asChild>
			<RadixAccordion.Header>
				<RadixAccordion.Trigger
					className={cn(
						focus({ variant: 'primary' }),
						flexBoxClassName({ grow: 1, justify: 'between' }),
						variants({ className, surface }),
						font({ dimension, leading, tracking, uppercase, variant, weight }),
						className
					)}
					ref={ref}
					{...properties}>
					{children}
					<ChevronDown
						aria-hidden
						className='shrink-0 transition-transform group-data-[state=open]:rotate-180'
						size={16}
					/>
				</RadixAccordion.Trigger>
			</RadixAccordion.Header>
		</FlexBox>
	);
}

AccordionTrigger.displayName = 'AccordionTrigger';

export default AccordionTrigger;
