import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

const variants = cva({
	base: '',
	compoundVariants: [
		{
			className: 'shadow-foreground-200/60 dark:shadow-foreground-800/60',
			strength: 'soft',
			variant: 'default',
		},
		{
			className: 'shadow-foreground-300/70 dark:shadow-foreground-700/70',
			strength: 'default',
			variant: 'default',
		},
		{
			className: 'shadow-primary-200/60 dark:shadow-primary-800/60',
			strength: 'soft',
			variant: 'primary',
		},
		{
			className: 'shadow-primary-300/70 dark:shadow-primary-700/70',
			strength: 'default',
			variant: 'primary',
		},
	],
	defaultVariants: {
		depth: 'sm',
		strength: 'default',
		variant: 'neutral',
	},
	variants: {
		depth: {
			'2xl': 'shadow-2xl',
			lg: 'shadow-lg',
			sm: 'shadow-sm',
			xl: 'shadow-xl',
		},
		strength: {
			default: '',
			soft: '',
		},
		variant: {
			default: '',
			neutral: '',
			primary: '',
		},
	},
});

type ShadowVariantsProperties = VariantProperties<typeof variants>;

export type { ShadowVariantsProperties };

export default variants;
