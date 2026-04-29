import type { VariantProperties } from '@shared/cva';
import { cva } from '@shared/cva';

const variants = cva({
	base: '',
	compoundVariants: [
		{
			className: 'focus-visible:outline-none focus-visible:ring-2',
			dimension: 'base',
			mode: 'ring',
		},
		{
			className: 'focus-visible:outline-none focus-visible:ring-2',
			dimension: 'lg',
			mode: 'ring',
		},
		{
			className: 'focus-visible:outline-none focus-visible:ring-1',
			dimension: 'sm',
			mode: 'ring',
		},
		{
			className: 'focus-visible:outline-none focus-visible:ring-1',
			dimension: 'xs',
			mode: 'ring',
		},
		{
			className: 'focus-visible:ring-offset-2',
			dimension: 'base',
			mode: 'ring',
			noBorder: false,
		},
		{
			className: 'focus-visible:ring-offset-1',
			dimension: 'lg',
			mode: 'ring',
			noBorder: false,
		},
		{
			className: 'focus-visible:ring-offset-1',
			dimension: 'sm',
			mode: 'ring',
			noBorder: false,
		},
		{
			className: 'focus-visible:ring-offset-1',
			dimension: 'xs',
			mode: 'ring',
			noBorder: false,
		},
		{
			className: 'ring-offset-foreground-100 dark:ring-offset-foreground-950',
			mode: 'ring',
			noBorder: false,
		},
		{
			className: 'focus-visible:ring-foreground-500',
			mode: 'ring',
			strength: 'default',
			variant: 'default',
		},
		{
			className: 'focus-visible:ring-primary-500',
			mode: 'ring',
			strength: 'default',
			variant: 'primary',
		},
		{
			className: 'focus-visible:ring-success-500',
			mode: 'ring',
			strength: 'default',
			variant: 'success',
		},
		{
			className: 'focus-visible:ring-error-500',
			mode: 'ring',
			strength: 'default',
			variant: 'danger',
		},
		{
			className: 'focus-visible:ring-foreground-500/60',
			mode: 'ring',
			strength: 'soft',
			variant: 'default',
		},
		{
			className: 'focus-visible:ring-primary-500/60',
			mode: 'ring',
			strength: 'soft',
			variant: 'primary',
		},
		{
			className: 'focus-visible:ring-success-500/60',
			mode: 'ring',
			strength: 'soft',
			variant: 'success',
		},
		{
			className: 'focus-visible:ring-error-500/60',
			mode: 'ring',
			strength: 'soft',
			variant: 'danger',
		},
		{
			className: 'focus-visible:outline-2',
			dimension: 'base',
			mode: 'outline',
		},
		{
			className: 'focus-visible:outline-2',
			dimension: 'lg',
			mode: 'outline',
		},
		{
			className: 'focus-visible:outline-1',
			dimension: 'sm',
			mode: 'outline',
		},
		{
			className: 'focus-visible:outline-1',
			dimension: 'xs',
			mode: 'outline',
		},
		{
			className: 'focus-visible:outline-offset-2',
			dimension: 'base',
			mode: 'outline',
		},
		{
			className: 'focus-visible:outline-offset-2',
			dimension: 'lg',
			mode: 'outline',
		},
		{
			className: 'focus-visible:outline-offset-1',
			dimension: 'sm',
			mode: 'outline',
		},
		{
			className: 'focus-visible:outline-offset-1',
			dimension: 'xs',
			mode: 'outline',
		},
		{
			className: 'focus-visible:outline-foreground-500',
			mode: 'outline',
			strength: 'default',
			variant: 'default',
		},
		{
			className: 'focus-visible:outline-primary-500',
			mode: 'outline',
			strength: 'default',
			variant: 'primary',
		},
		{
			className: 'focus-visible:outline-success-500',
			mode: 'outline',
			strength: 'default',
			variant: 'success',
		},
		{
			className: 'focus-visible:outline-error-500',
			mode: 'outline',
			strength: 'default',
			variant: 'danger',
		},
		{
			className: 'focus-visible:outline-foreground-500/60',
			mode: 'outline',
			strength: 'soft',
			variant: 'default',
		},
		{
			className: 'focus-visible:outline-primary-500/60',
			mode: 'outline',
			strength: 'soft',
			variant: 'primary',
		},
		{
			className: 'focus-visible:outline-success-500/60',
			mode: 'outline',
			strength: 'soft',
			variant: 'success',
		},
		{
			className: 'focus-visible:outline-error-500/60',
			mode: 'outline',
			strength: 'soft',
			variant: 'danger',
		},
	],
	defaultVariants: {
		dimension: 'base',
		mode: 'ring',
		noBorder: false,
		strength: 'default',
		variant: 'default',
	},
	variants: {
		dimension: {
			base: '',
			lg: '',
			sm: '',
			xs: '',
		},
		mode: {
			outline: '',
			ring: '',
		},
		noBorder: {
			false: '',
			true: '',
		},
		strength: {
			default: '',
			soft: '',
		},
		transparent: {
			false: '',
			true: '',
		},
		variant: {
			danger: '',
			default: '',
			primary: '',
			success: '',
		},
	},
});

type FocusVariantsProperties = VariantProperties<typeof variants>;

export type { FocusVariantsProperties };

export default variants;
