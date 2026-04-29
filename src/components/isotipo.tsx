import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'w-6 h-6',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type IsotipoProperties = Omit<ComponentPropsWithRef<'img'>, 'src' | 'srcSet'> & VariantProperties<typeof variants>;

function Isotipo({ alt = 'ProxyStudio isotipo', className, ...properties }: IsotipoProperties): ReactNode {
	return (
		<img
			alt={alt}
			className={cn(variants({ className }), className)}
			src='/favicon.svg'
			{...properties}
		/>
	);
}

Isotipo.displayName = 'Isotipo';

export type { IsotipoProperties };

export default Isotipo;
