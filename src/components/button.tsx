import background from '@components/background';
import border from '@components/border';
import { flexBoxClassName } from '@components/flex-box';
import focus from '@components/focus';
import font from '@components/font';
import hover from '@components/hover';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'gap-2 tracking-wide',
	compoundVariants: [
		{
			className: 'p-3 w-11 h-11',
			dimension: 'base',
			icon: true,
		},
		{
			className: 'px-5 py-2.5',
			dimension: 'base',
			icon: false,
		},
		{
			className: 'p-2 w-9 h-9',
			dimension: 'sm',
			icon: true,
		},
		{
			className: 'px-3.5 py-2',
			dimension: 'sm',
			icon: false,
		},
		{
			className: 'p-1.5 w-8 h-8',
			dimension: 'xs',
			icon: true,
		},
		{
			className: 'px-2 py-1.5',
			dimension: 'xs',
			icon: false,
		},
		{
			className: cn(
				font({ tracking: 'normal', variant: 'muted' }),
				background({ strength: 'soft', variant: 'default' }),
				border({ strength: 'default', variant: 'default' }),
				hover({ strength: 'soft', variant: 'default' }),
				'rounded-full'
			),
			surface: 'command',
		},
		{
			className: 'gap-2 px-2.75 py-1.5',
			dimension: 'base',
			icon: false,
			surface: 'command',
		},
		{
			className: 'gap-1.5 px-2.25 py-1',
			dimension: 'sm',
			icon: false,
			surface: 'command',
		},
		{
			className: 'gap-1.25 px-1.75 py-0.625',
			dimension: 'xs',
			icon: false,
			surface: 'command',
		},
		{
			className: background({ strength: 'default', variant: 'default' }),
			surface: 'default',
			transparent: false,
			variant: 'default',
		},
		{
			className: background({ variant: 'primary' }),
			surface: 'default',
			transparent: false,
			variant: 'primary',
		},
		{
			className: background({ variant: 'danger' }),
			surface: 'default',
			transparent: false,
			variant: 'danger',
		},
		{
			className: background({ variant: 'success' }),
			surface: 'default',
			transparent: false,
			variant: 'success',
		},
		{
			className: cn('text-foreground-600', hover({ strength: 'soft', variant: 'default' })),
			surface: 'default',
			transparent: true,
			variant: 'default',
		},
		{
			className: cn('text-primary-600', hover({ effect: 'text', variant: 'inverse' })),
			surface: 'default',
			transparent: true,
			variant: 'primary',
		},
		{
			className: cn('text-error-600 dark:text-error-400', hover({ strength: 'soft', variant: 'danger' })),
			surface: 'default',
			transparent: true,
			variant: 'danger',
		},
		{
			className: cn('text-success-600 dark:text-success-400', hover({ strength: 'soft', variant: 'success' })),
			surface: 'default',
			transparent: true,
			variant: 'success',
		},
	],
	defaultVariants: {
		dimension: 'base',
		surface: 'default',
		transparent: false,
		variant: 'default',
		weight: 'normal',
	},
	variants: {
		dimension: {
			base: ['text-base', rounded({ dimension: 'lg' })],
			sm: ['text-sm', rounded({ dimension: 'base' })],
			xs: ['text-xs', rounded({ dimension: 'sm' })],
		},
		disabled: {
			false: [],
			true: 'opacity-50 pointer-events-none',
		},
		icon: {
			false: '',
			true: '',
		},
		surface: {
			command: '',
			default: '',
		},
		transparent: {
			false: '',
			true: '',
		},
		variant: {
			danger: cn('text-white', hover({ variant: 'danger' })),
			default: cn('text-foreground-950 dark:text-foreground-50', hover({ variant: 'default' })),
			primary: cn('text-white', hover({ variant: 'primary' })),
			success: cn('text-white', hover({ variant: 'success' })),
		},
		weight: {
			bold: 'font-bold',
			light: 'font-light',
			medium: 'font-medium',
			normal: 'font-normal',
			semibold: 'font-semibold',
		},
	},
});

type ButtonProperties = PropertiesWithAsChild<ComponentPropsWithRef<'button'> & VariantProperties<typeof variants>>;

function Button({
	asChild = false,
	className,
	dimension = 'base',
	disabled,
	icon = false,
	surface,
	transparent = false,
	variant,
	weight = 'normal',
	...properties
}: ButtonProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'button';

	return (
		<Comp
			className={cn(
				focus({ dimension, variant }),
				flexBoxClassName({ items: 'center', justify: 'center' }),
				variants({ className, dimension, disabled, icon, surface, transparent, variant, weight }),
				className
			)}
			disabled={disabled}
			{...properties}
		/>
	);
}

Button.displayName = 'Button';

export type { ButtonProperties };

export { variants };

export default Button;
