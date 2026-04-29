import background from '@components/background';
import border from '@components/border';
import rounded from '@components/rounded';
import shadow from '@components/shadow';
import { cn } from '@shared/cva';
import { Command } from 'cmdk';
import type { ReactNode } from 'react';

interface CommandPaletteDialogProps {
	children: ReactNode;
	/** Called when the dialog requests open state change. */
	onOpenChange: (open: boolean) => void;
	/** Whether the dialog is currently open. */
	open: boolean;
}

/**
 * Styled wrapper for the cmdk Command.Dialog.
 * Renders a modal overlay + centered panel above all other content (z-50).
 */
function CommandPaletteDialog({ children, onOpenChange, open }: CommandPaletteDialogProps): ReactNode {
	return (
		<Command.Dialog
			contentClassName={cn(
				'fixed inset-x-4 top-[20%] z-50 mx-auto max-w-xl overflow-hidden',
				background({ strength: 'soft', variant: 'default' }),
				rounded({ dimension: 'xl' }),
				shadow({ depth: '2xl' }),
				border({ strength: 'default', variant: 'default' })
			)}
			onOpenChange={onOpenChange}
			open={open}
			overlayClassName={cn('fixed inset-0 z-50 backdrop-blur-sm', background({ variant: 'overlay' }))}>
			{children}
		</Command.Dialog>
	);
}

CommandPaletteDialog.displayName = 'CommandPaletteDialog';

export type { CommandPaletteDialogProps };
export default CommandPaletteDialog;
