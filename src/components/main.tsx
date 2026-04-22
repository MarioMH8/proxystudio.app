import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { cva } from 'cva';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: '',
	compoundVariants: [
		{
			className: 'xl:max-w-5xl',
			container: true,
			dimension: 'base',
		},
		{
			className: 'xl:max-w-7xl',
			container: true,
			dimension: 'lg',
		},
	],
	defaultVariants: {
		container: false,
		dimension: 'lg',
		fullscreen: false,
	},
	variants: {
		container: {
			true: 'container mx-auto',
		},
		dimension: {
			base: '',
			lg: '',
		},
		/** When true the main area fills the viewport below a fixed nav bar. */
		fullscreen: {
			false: 'py-28 space-y-12',
			true: 'h-screen pt-28',
		},
	},
});

type MainProperties = PropertiesWithAsChild<ComponentPropsWithRef<'main'> & VariantProperties<typeof variants>>;

function Main({ asChild, className, container, dimension, fullscreen, ...properties }: MainProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'main';

	return (
		<Comp
			className={cn(variants({ className, container, dimension, fullscreen }), className)}
			{...properties}
		/>
	);
}

Main.displayName = 'Main';

export default Main;
