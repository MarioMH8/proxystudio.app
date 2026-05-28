import Span from '@components/span';
import { selectCard } from '@modules/editor/store';
import { useAppSelector } from '@shared/store';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

import CardStatus from './card-status';

function CardHeader(): ReactNode {
	const card = useAppSelector(selectCard);

	return (
		<Fragment>
			<CardStatus />
			<Span
				dimension='sm'
				weight='light'>
				{card.name}
			</Span>
		</Fragment>
	);
}

CardHeader.displayName = 'CardHeader';

export default CardHeader;
