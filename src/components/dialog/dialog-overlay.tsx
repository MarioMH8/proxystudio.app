import background from '@components/background';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: ['fixed inset-0 z-30'],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: cn(background({ variant: 'overlay' }), 'backdrop-blur-sm'),
		},
	},
});

type DialogOverlayProps = RadixDialog.DialogOverlayProps & VariantProperties<typeof variants>;

function DialogOverlay({ className, variant = 'default', ...properties }: DialogOverlayProps): ReactNode {
	return (
		<RadixDialog.Overlay
			className={cn(variants({ className, variant }), className)}
			{...properties}
		/>
	);
}

DialogOverlay.displayName = 'DialogOverlay';

export default DialogOverlay;
