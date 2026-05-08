import { EDITOR_STATUS, selectEditorStatus } from '@modules/editor/store';
import useDebouncedValue from '@shared/hooks/use-debounced-value';
import { useAppSelector } from '@shared/store';
import { CircleCheckBigIcon, CircleDashedIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const ICON_SIZE = 14;
const SAVING_STATUS_DEBOUNCE_MS = 250;

function CardStatus(): ReactNode {
	const status = useAppSelector(selectEditorStatus);
	const displayStatus = useDebouncedValue(status, SAVING_STATUS_DEBOUNCE_MS, nextStatus => {
		return nextStatus === EDITOR_STATUS.SAVING;
	});

	switch (displayStatus) {
		case EDITOR_STATUS.DRAFT: {
			return (
				<CircleDashedIcon
					className='text-warning-500 opacity-50'
					size={ICON_SIZE}
				/>
			);
		}
		case EDITOR_STATUS.LOADING: {
			return (
				<CircleDashedIcon
					className='text-foreground-500 opacity-50 animate-spin'
					size={ICON_SIZE}
				/>
			);
		}
		case EDITOR_STATUS.SAVED: {
			return (
				<CircleCheckBigIcon
					className='text-success-500'
					size={ICON_SIZE}
				/>
			);
		}
		case EDITOR_STATUS.SAVING: {
			return (
				<CircleDashedIcon
					className='text-warning-500 opacity-50 animate-spin'
					size={ICON_SIZE}
				/>
			);
		}
	}
}

CardStatus.displayName = 'CardStatus';

export default CardStatus;
