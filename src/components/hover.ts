import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

const variants = cva({
	base: '',
	compoundVariants: [
		{
			className: 'hover:bg-foreground-100 dark:hover:bg-foreground-950',
			effect: 'bg',
			strength: 'soft',
			variant: 'default',
		},
		{
			className: 'hover:bg-foreground-400/40 dark:hover:bg-foreground-700',
			effect: 'bg',
			strength: 'default',
			variant: 'default',
		},
		{
			className: 'hover:bg-primary-500',
			effect: 'bg',
			strength: 'default',
			variant: 'primary',
		},
		{
			className: 'hover:bg-error-600 dark:hover:bg-error-400',
			effect: 'bg',
			strength: 'default',
			variant: 'danger',
		},
		{
			className: 'hover:bg-error-600/10 dark:hover:bg-error-400/10',
			effect: 'bg',
			strength: 'soft',
			variant: 'danger',
		},
		{
			className: 'hover:bg-success-600 dark:hover:bg-success-400',
			effect: 'bg',
			strength: 'default',
			variant: 'success',
		},
		{
			className: 'hover:bg-success-600/10 dark:hover:bg-success-400/10',
			effect: 'bg',
			strength: 'soft',
			variant: 'success',
		},
		{
			className: 'hover:bg-inherit dark:hover:bg-inherit',
			effect: 'bg',
			strength: 'default',
			variant: 'inherit',
		},
		{
			className: 'hover:text-primary-400 dark:hover:text-primary-600',
			effect: 'text',
			strength: 'default',
			variant: 'primary',
		},
		{
			className: 'hover:text-white',
			effect: 'text',
			strength: 'default',
			variant: 'inverse',
		},
	],
	defaultVariants: {
		effect: 'bg',
		strength: 'default',
		variant: 'default',
	},
	variants: {
		effect: {
			bg: '',
			text: '',
		},
		strength: {
			default: '',
			soft: '',
		},
		variant: {
			danger: '',
			default: '',
			inherit: '',
			inverse: '',
			primary: '',
			success: '',
		},
	},
});

type HoverVariantsProperties = VariantProperties<typeof variants>;

export type { HoverVariantsProperties };

export default variants;
