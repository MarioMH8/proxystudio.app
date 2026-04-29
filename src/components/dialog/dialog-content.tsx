import background from '@components/background';
import border from '@components/border';
import { flexBoxClassName } from '@components/flex-box';
import rounded from '@components/rounded';
import shadow from '@components/shadow';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

import DialogOverlay from './dialog-overlay';

const variants = cva({
	base: [
		'fixed',
		'left-1/2',
		'top-1/2',
		'z-50',
		'max-h-[85vh]',
		'w-full',
		'max-w-4xl',
		'-translate-x-1/2',
		'-translate-y-1/2',
		'overflow-visible',
		rounded({ dimension: 'lg' }),
		'p-6',
		shadow({ depth: 'xl' }),
	],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: background({ strength: 'default', variant: 'default' }),
		},
	},
});

type DialogContentProps = RadixDialog.DialogContentProps & VariantProperties<typeof variants>;

function DialogContent({ className, variant = 'default', ...properties }: DialogContentProps): ReactNode {
	return (
		<RadixDialog.Portal>
			<DialogOverlay />
			<RadixDialog.Content
				className={cn(
					border({ strength: 'default', variant: 'default' }),
					flexBoxClassName({ direction: 'column', items: 'none' }),
					variants({ className, variant }),
					className
				)}
				{...properties}
			/>
		</RadixDialog.Portal>
	);
}

DialogContent.displayName = 'DialogContent';

export default DialogContent;
