import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {
		truncate: false,
	},
	variants: {
		truncate: {
			false: '',
			true: 'truncate',
		},
	},
});

type SpanProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'span'> & FontVariantsProperties & VariantProperties<typeof variants>
>;

function Span({
	asChild = false,
	className,
	dimension,
	leading,
	tracking,
	truncate,
	uppercase,
	variant,
	weight,
	...properties
}: SpanProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'span';

	return (
		<Comp
			className={cn(
				font({ dimension, leading, tracking, uppercase, variant, weight }),
				variants({ className, truncate }),
				className
			)}
			{...properties}
		/>
	);
}

Span.displayName = 'Span';

export type { SpanProperties };

export default Span;
