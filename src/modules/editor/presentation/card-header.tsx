import KeyboardShortcut from '@components/keyboard-shortcut';
import Span from '@components/span';
import { useEditorContext } from '@modules/editor/store';
import { modifierKey } from '@shared/platform';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

import CardStatus from './card-status';

const key = modifierKey();

function CardHeader(): ReactNode {
	const { card } = useEditorContext();

	return (
		<Fragment>
			<CardStatus />
			<Span
				dimension='sm'
				weight='light'>
				{card.name}
			</Span>
			<KeyboardShortcut
				aria-hidden='true'
				ariaKey='S'
				dimension='sm'
				keyLabel='S'
				modifiers={[key]}
				variant='surface'
			/>
		</Fragment>
	);
}

CardHeader.displayName = 'CardHeader';

export default CardHeader;
