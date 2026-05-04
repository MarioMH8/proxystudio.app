import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import { cn, cva } from '@shared/cva';
import type { ModifierKey } from '@shared/platform';
import { MODIFIER_KIND } from '@shared/platform';
import type { ComponentPropsWithRef, ReactNode } from 'react';

type FontDimension = NonNullable<FontVariantsProperties['dimension']>;

const SYMBOL_DIMENSIONS: Record<FontDimension, FontDimension> = {
	'2xl': '3xl',
	'3xl': '4xl',
	'4xl': '5xl',
	'5xl': '6xl',
	'6xl': '7xl',
	'7xl': '7xl',
	base: 'xl',
	lg: '2xl',
	sm: 'lg',
	xl: '3xl',
	xs: 'base',
};

const KEY_DIMENSIONS: Record<FontDimension, FontDimension> = {
	'2xl': '2xl',
	'3xl': '3xl',
	'4xl': '4xl',
	'5xl': '5xl',
	'6xl': '6xl',
	'7xl': '7xl',
	base: 'base',
	lg: 'lg',
	sm: 'sm',
	xl: 'xl',
	xs: 'xs',
};

const variants = cva({
	base: 'inline-flex items-center leading-none opacity-55',
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		dimension: {
			'2xl': 'space-x-2',
			'3xl': 'space-x-2',
			'4xl': 'space-x-2.5',
			'5xl': 'space-x-2.5',
			'6xl': 'space-x-3',
			'7xl': 'space-x-3',
			base: 'space-x-1.25',
			lg: 'space-x-1.5',
			sm: 'space-x-1',
			xl: 'space-x-1.75',
			xs: 'space-x-0.75',
		},
		variant: {
			default: '',
			surface: 'rounded-xs bg-foreground-200/70 px-1.5 py-0.5 dark:bg-foreground-800/80',
		},
	},
});

const modifierVariants = cva({
	base: 'inline-flex items-center leading-none',
	compoundVariants: [],
	defaultVariants: {
		dimension: 'base',
	},
	variants: {
		dimension: {
			'2xl': 'mr-0.75',
			'3xl': 'mr-0.75',
			'4xl': 'mr-1',
			'5xl': 'mr-1',
			'6xl': 'mr-1.25',
			'7xl': 'mr-1.25',
			base: 'mr-0.5',
			lg: 'mr-0.625',
			sm: 'mr-0.375',
			xl: 'mr-0.75',
			xs: 'mr-px',
		},
		kind: {
			symbol: 'translate-y-[0.02em]',
			text: '',
		},
	},
});

type KeyboardShortcutProperties = Omit<ComponentPropsWithRef<'kbd'>, 'children'> & {
	ariaKey: string;
	dimension?: FontDimension;
	keyLabel: string;
	modifiers?: ModifierKey[];
	variant?: 'default' | 'surface';
};

function KeyboardShortcut({
	ariaKey,
	className,
	dimension = 'base',
	keyLabel,
	modifiers = [],
	variant = 'default',
	...properties
}: KeyboardShortcutProperties): ReactNode {
	const keyDimension = KEY_DIMENSIONS[dimension];
	const ariaKeyShortcuts = [...modifiers.map(modifier => modifier.ariaKeyShortcuts), ariaKey].join(' ');

	return (
		<kbd
			aria-keyshortcuts={ariaKeyShortcuts}
			className={cn(variants({ className, dimension, variant }), className)}
			{...properties}>
			{modifiers.map(modifier => {
				const modifierDimension =
					modifier.kind === MODIFIER_KIND.SYMBOL ? SYMBOL_DIMENSIONS[dimension] : keyDimension;

				return (
					<span
						className={cn(
							font({
								dimension: modifierDimension,
								leading: 'tight',
								tracking: modifier.kind === MODIFIER_KIND.SYMBOL ? 'tight' : 'normal',
								variant: 'muted',
								weight: 'light',
							}),
							modifierVariants({ dimension, kind: modifier.kind })
						)}
						key={`${modifier.kind}-${modifier.label}`}>
						{modifier.label}
					</span>
				);
			})}
			<span
				className={cn(
					font({
						dimension: keyDimension,
						leading: 'tight',
						tracking: 'tight',
						variant: 'muted',
						weight: 'light',
					})
				)}>
				{keyLabel}
			</span>
		</kbd>
	);
}

KeyboardShortcut.displayName = 'KeyboardShortcut';

export type { KeyboardShortcutProperties };

export default KeyboardShortcut;
