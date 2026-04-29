import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { cva } from 'cva';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: [
		'h-full',
		'bg-foreground-100 dark:bg-foreground-950',
		'bg-[radial-gradient(circle,oklch(0.9_0.006_240)_1px,transparent_1px)]',
		'dark:bg-[radial-gradient(circle,oklch(0.28_0.012_260)_1px,transparent_1px)]',
		'bg-size-[22px_22px] bg-top-left',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type EditorContainerProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'div'> & VariantProperties<typeof variants>
>;

function EditorContainer({ asChild, className, ...properties }: EditorContainerProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'div';

	return (
		<Comp
			className={cn(variants({ className }), className)}
			{...properties}
		/>
	);
}

EditorContainer.displayName = 'EditorContainer';

export default EditorContainer;
