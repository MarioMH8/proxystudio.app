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
import type { ComponentRef } from 'react';
import { forwardRef } from 'react';

const variants = cva({
	base: [
		'group',
		'cursor-default',
		'py-3',
		'px-4',
		'transition-colors',
		rounded({ dimension: 'lg' }),
		'data-[state=open]:rounded-b-none',
		hover({ strength: 'soft', variant: 'default' }),
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type AccordionTriggerProps = FontVariantsProperties &
	RadixAccordion.AccordionTriggerProps &
	VariantProperties<typeof variants>;

const AccordionTrigger = forwardRef<ComponentRef<typeof RadixAccordion.Trigger>, AccordionTriggerProps>(
	(
		{
			children,
			className,
			dimension = 'sm',
			leading,
			tracking,
			uppercase,
			variant = 'default',
			weight = 'medium',
			...properties
		},
		forwardedReference
	) => (
		<FlexBox asChild>
			<RadixAccordion.Header>
				<RadixAccordion.Trigger
					className={cn(
						focus({ variant: 'primary' }),
						flexBoxClassName({ grow: 1, justify: 'between' }),
						variants({ className }),
						font({ dimension, leading, tracking, uppercase, variant, weight }),
						className
					)}
					ref={forwardedReference}
					{...properties}>
					{children}
					<ChevronDown
						aria-hidden
						className='shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] group-data-[state=open]:rotate-180'
						size={16}
					/>
				</RadixAccordion.Trigger>
			</RadixAccordion.Header>
		</FlexBox>
	)
);

AccordionTrigger.displayName = 'AccordionTrigger';

export default AccordionTrigger;
