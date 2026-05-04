import { useEditorContext } from '@modules/editor/store';
import { CircleCheckBigIcon, CircleDashedIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const ICON_SIZE = 14;

function CardStatus(): ReactNode {
	const { status } = useEditorContext();

	switch (status) {
		case 'DRAFT': {
			return (
				<CircleDashedIcon
					className='text-warning-500 opacity-50'
					size={ICON_SIZE}
				/>
			);
		}
		case 'SAVED': {
			return (
				<CircleCheckBigIcon
					className='text-success-500'
					size={ICON_SIZE}
				/>
			);
		}
		case 'SAVING': {
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
