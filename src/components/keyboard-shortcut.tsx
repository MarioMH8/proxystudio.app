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

const keyVariants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {
		dimension: 'base',
	},
	variants: {
		dimension: {
			'2xl': 'ml-2',
			'3xl': 'ml-2',
			'4xl': 'ml-2.5',
			'5xl': 'ml-2.5',
			'6xl': 'ml-3',
			'7xl': 'ml-3',
			base: 'ml-1.25',
			lg: 'ml-1.5',
			sm: 'ml-1',
			xl: 'ml-1.75',
			xs: 'ml-0.75',
		},
	},
});

const variants = cva({
	base: 'inline-flex items-center leading-none opacity-55',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
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
			xs: 'mr-0.25',
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
	modifiers: ModifierKey[];
};

function KeyboardShortcut({
	ariaKey,
	className,
	dimension = 'base',
	keyLabel,
	modifiers,
	...properties
}: KeyboardShortcutProperties): ReactNode {
	const keyDimension = KEY_DIMENSIONS[dimension];
	const ariaKeyShortcuts = [...modifiers.map(modifier => modifier.ariaKeyShortcuts), ariaKey].join(' ');

	return (
		<kbd
			aria-keyshortcuts={ariaKeyShortcuts}
			className={cn(variants({ className }), className)}
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
					}),
					keyVariants({ dimension })
				)}>
				{keyLabel}
			</span>
		</kbd>
	);
}

KeyboardShortcut.displayName = 'KeyboardShortcut';

export type { KeyboardShortcutProperties };

export default KeyboardShortcut;
