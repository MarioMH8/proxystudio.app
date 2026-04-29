import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

const variants = cva({
	base: '',
	compoundVariants: [
		{
			className: 'border-foreground-300/70 dark:border-foreground-700/70',
			strength: 'soft',
			variant: 'default',
		},
		{
			className: 'border-foreground-300 dark:border-foreground-700',
			strength: 'default',
			variant: 'default',
		},
		{
			className: 'border-primary-300/70 dark:border-primary-800/70',
			strength: 'soft',
			variant: 'primary',
		},
		{
			className: 'border-primary-300 dark:border-primary-700',
			strength: 'default',
			variant: 'primary',
		},
	],
	defaultVariants: {
		side: 'all',
		strength: 'soft',
		variant: 'default',
	},
	variants: {
		side: {
			all: 'border',
			bottom: 'border-b',
			left: 'border-l',
			none: 'border-0',
			right: 'border-r',
			top: 'border-t',
		},
		strength: {
			default: '',
			soft: '',
		},
		variant: {
			default: '',
			primary: '',
		},
	},
});

type BorderVariantsProperties = VariantProperties<typeof variants>;

export type { BorderVariantsProperties };

export default variants;
