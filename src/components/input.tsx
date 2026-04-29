import background from '@components/background';
import border from '@components/border';
import focus from '@components/focus';
import font from '@components/font';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: [
		'w-full',
		rounded({ dimension: 'lg' }),
		border({ strength: 'default', variant: 'default' }),
		'motion-safe:transition-colors',
		'disabled:opacity-50',
		'placeholder-foreground-800/30 dark:placeholder-foreground-200/30',
	],
	compoundVariants: [
		{
			className: 'py-2',
			dimension: 'base',
			transparent: true,
		},
		{
			className: 'py-1',
			dimension: 'sm',
			transparent: true,
		},
		{
			className: 'py-0.5',
			dimension: 'xs',
			transparent: true,
		},
		{
			className: cn(border({ side: 'none' }), background({ variant: 'transparent' }), 'p-0 px-0 py-0'),
			inputType: 'range',
		},
	],
	defaultVariants: {},
	variants: {
		dimension: {
			base: 'px-4 py-3',
			sm: 'px-3 py-2',
			xs: 'px-2 py-1',
		},
		inputType: {
			default: '',
			range: cn(
				'h-2 p-0 accent-primary-600 disabled:cursor-not-allowed dark:accent-primary-400',
				background({ variant: 'default' }),
				rounded({ dimension: 'full' }),
				border({ side: 'none' })
			),
		},
		transparent: {
			false: background({ strength: 'soft', variant: 'default' }),
			true: cn(border({ side: 'none' }), background({ strength: 'soft', variant: 'default' })),
		},
	},
});

type InputVariantProperties = VariantProperties<typeof variants>;

type InputProperties = PropertiesWithAsChild<ComponentPropsWithRef<'input'> & InputVariantProperties>;

function className(
	className?: string,
	dimension: InputVariantProperties['dimension'] = 'base',
	transparent = false,
	inputType: InputVariantProperties['inputType'] = 'default'
): string {
	return cn(
		font({ dimension, variant: transparent ? 'muted' : 'default' }),
		focus({ noBorder: true, variant: 'default' }),
		variants({ className, dimension, inputType, transparent }),
		className
	);
}

function Input({ asChild = false, className: cls, dimension, transparent, ...properties }: InputProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'input';
	const inputType = properties.type === 'range' ? 'range' : 'default';

	return (
		<Comp
			className={className(cls, dimension, transparent, inputType)}
			{...properties}
		/>
	);
}

Input.displayName = 'Input';

export type { InputProperties, InputVariantProperties };

export { className };

export default Input;
