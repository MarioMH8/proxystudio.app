import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

const variants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {
		dimension: 'base',
	},
	variants: {
		dimension: {
			base: 'rounded',
			full: 'rounded-full',
			lg: 'rounded-lg',
			md: 'rounded-md',
			none: 'rounded-none',
			sm: 'rounded-sm',
			xl: 'rounded-xl',
			xs: 'rounded-xs',
		},
	},
});

type RoundedVariantsProperties = VariantProperties<typeof variants>;

export type { RoundedVariantsProperties };

export default variants;
