import Button from '@components/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@components/dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import FramePicker from './frame-picker';

interface FramePickerDialogProps {
	onOpenChange: (open: boolean) => void;
	open: boolean;
}
/**
 * Modal dialog for selecting a frame tile to add as a layer.
 * Opened via the "Add Layer" toolbar action.
 * Tile click dispatches addFrameLayer to cardSlice then closes the dialog.
 */
function FramePickerDialog({ onOpenChange, open }: FramePickerDialogProps): ReactNode {
	return (
		<Dialog
			onOpenChange={onOpenChange}
			open={open}>
			<DialogContent className='space-y-8'>
				<div className='flex items-start justify-between'>
					<div>
						<DialogTitle className='mb-1 text-lg font-semibold'>Add Frame Layer</DialogTitle>
						<DialogDescription className='text-sm text-foreground-500'>
							Select a frame to add as a new layer.
						</DialogDescription>
					</div>
					<DialogClose asChild>
						<Button
							aria-label='Close dialog'
							dimension='sm'
							icon
							transparent
							type='button'
							variant='default'>
							<X size={16} />
						</Button>
					</DialogClose>
				</div>
				<FramePicker onOpenChange={onOpenChange} />
			</DialogContent>
		</Dialog>
	);
}

FramePickerDialog.displayName = 'FramePickerDialog';

export type { FramePickerDialogProps };

export default FramePickerDialog;
