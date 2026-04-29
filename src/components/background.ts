import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

const variants = cva({
	base: '',
	compoundVariants: [
		{
			className: 'bg-foreground-200 dark:bg-foreground-800',
			strength: 'default',
			variant: 'default',
		},
		{
			className: 'bg-foreground-100 dark:bg-foreground-950',
			strength: 'soft',
			variant: 'default',
		},
		{
			className: 'bg-error-600',
			strength: 'default',
			variant: 'danger',
		},
		{
			className: 'bg-black/40',
			strength: 'default',
			variant: 'overlay',
		},
		{
			className: 'bg-foreground-950/50 dark:bg-foreground-950/80',
			strength: 'soft',
			variant: 'overlay',
		},
		{
			className: 'bg-primary-600',
			strength: 'default',
			variant: 'primary',
		},
		{
			className: 'bg-primary-200 dark:bg-primary-800',
			strength: 'soft',
			variant: 'primary',
		},
		{
			className: 'bg-success-600',
			strength: 'default',
			variant: 'success',
		},
		{
			className: 'bg-transparent',
			strength: 'default',
			variant: 'transparent',
		},
	],
	defaultVariants: {
		strength: 'default',
		variant: 'default',
	},
	variants: {
		strength: {
			default: '',
			soft: '',
		},
		variant: {
			danger: '',
			default: '',
			overlay: '',
			primary: '',
			success: '',
			transparent: '',
		},
	},
});

type BackgroundVariantsProperties = VariantProperties<typeof variants>;

export type { BackgroundVariantsProperties };

export default variants;
