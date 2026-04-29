import background from '@components/background';
import border from '@components/border';
import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { cva } from 'cva';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: [background({ variant: 'surfaces' }), border({ side: 'right' })],
	compoundVariants: [],
	defaultVariants: {},
	variants: {
		side: {
			left: border({ side: 'right' }),
			right: border({ side: 'left' }),
		},
	},
});

type AsideProperties = PropertiesWithAsChild<ComponentPropsWithRef<'aside'> & VariantProperties<typeof variants>>;

function LayersPanel({ asChild, className, side, ...properties }: AsideProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'aside';

	return (
		<Comp
			className={cn(variants({ className, side }), className)}
			{...properties}
		/>
	);
}

LayersPanel.displayName = 'Aside';

export type { AsideProperties };

export default LayersPanel;
