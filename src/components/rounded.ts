import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

const variants = cva({
	base: '',
	compoundVariants: [
		{
			className: 'rounded-lg',
			context: 'inner',
			dimension: 'xl',
		},
		{
			className: 'rounded-md',
			context: 'inner',
			dimension: 'lg',
		},
		{
			className: 'rounded',
			context: 'inner',
			dimension: 'md',
		},
		{
			className: 'rounded-sm',
			context: 'inner',
			dimension: 'base',
		},
		{
			className: 'rounded-xs',
			context: 'inner',
			dimension: 'sm',
		},
	],
	defaultVariants: {
		context: 'default',
		dimension: 'base',
	},
	variants: {
		context: {
			default: '',
			inner: '',
		},
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
