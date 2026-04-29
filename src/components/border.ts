import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

const variants = cva({
	base: 'border-foreground-300/70 dark:border-foreground-700/70',
	compoundVariants: [],
	defaultVariants: {
		side: 'all',
	},
	variants: {
		side: {
			all: 'border',
			bottom: 'border-b',
		},
	},
});

type BorderVariantsProperties = VariantProperties<typeof variants>;

export type { BorderVariantsProperties };

export default variants;
