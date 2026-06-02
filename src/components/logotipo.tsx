import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'font-medium text-base',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

const accentVariants = cva({
	base: 'font-normal opacity-60',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type LogotipoProperties = PropertiesWithAsChild<ComponentPropsWithRef<'button'> & VariantProperties<typeof variants>>;

function Logotipo({ asChild = false, className, ...properties }: LogotipoProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'span';

	return (
		<Comp
			className={cn(variants({ className }), className)}
			{...properties}>
			Proxy<span className={cn(accentVariants())}>Studio</span>
		</Comp>
	);
}

Logotipo.displayName = 'Logotipo';

export type { LogotipoProperties };

export default Logotipo;
