import FlexBox from '@components/flex-box';
import Link from '@components/link';
import Span from '@components/span';
import type { Card } from '@modules/card/domain';
import { CardRenderer } from '@modules/card/presentation';
import type { ReactNode } from 'react';

interface GalleryGridItemProperties {
	card: Card;
	thumbnailWidth: number;
}

function GalleryGridItem({ card, thumbnailWidth }: GalleryGridItemProperties): ReactNode {
	const thumbnailScale = thumbnailWidth / card.dimensions.width;
	const updatedDate = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(card.metadata.updatedAt);

	const aspectRatio = `${card.dimensions.width.toString()} / ${card.dimensions.height.toString()}`;

	return (
		<Link
			className='group h-full w-full flex flex-col text-left rounded-xl'
			to={`/${card.id}/editor`}
			type='button'>
			<div
				className='w-full overflow-hidden rounded-xl'
				style={{ aspectRatio }}>
				<CardRenderer
					card={card}
					className='block h-auto w-full'
					scale={thumbnailScale}
				/>
			</div>
			<FlexBox
				className='px-1 py-2'
				direction='column'>
				<Span
					className='w-full'
					dimension='lg'
					tracking='normal'
					truncate
					variant='default'
					weight='semibold'>
					{card.name}
				</Span>
				<Span
					dimension='sm'
					tracking='normal'
					variant='muted'>
					{updatedDate}
				</Span>
			</FlexBox>
		</Link>
	);
}

GalleryGridItem.displayName = 'GalleryGridItem';

export default GalleryGridItem;
