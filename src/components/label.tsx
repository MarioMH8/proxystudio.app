import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Label as RadixLabel, Slot } from 'radix-ui';
import type { ReactElement, ReactNode } from 'react';

const variants = cva({
	base: 'block',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type LabelProperties = PropertiesWithAsChild<
	FontVariantsProperties & RadixLabel.LabelProps & VariantProperties<typeof variants>
> & {
	children: [string, ReactElement];
};

function Label({
	asChild = false,
	className,
	dimension = 'sm',
	leading,
	tracking,
	uppercase,
	variant = 'muted',
	weight = 'medium',
	...properties
}: LabelProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'label';

	return (
		<Comp
			className={cn(
				font({ dimension, leading, tracking, uppercase, variant, weight }),
				variants({ className }),
				className
			)}
			{...properties}
		/>
	);
}

Label.displayName = 'Label';

export type { LabelProperties };

export default Label;
