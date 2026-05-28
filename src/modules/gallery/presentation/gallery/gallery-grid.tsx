import Paragraph from '@components/paragraph';
import type { Card } from '@modules/card/domain';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import GalleryGridItem from './gallery-grid-item';

const GRID_COLUMN_GAP = 20;
const GRID_ROW_GAP = 12;
const GRID_MIN_COLUMN_WIDTH = 240;
const GRID_CARD_META_HEIGHT = 46 + 8 * 2;
const FALLBACK_CARD_RATIO = 2814 / 2010;

interface GalleryGridProperties {
	cards: Card[];
	hasMoreCards: boolean;
	isLoadingMoreCards: boolean;
	loadMoreLabel: string;
	loadingLabel: string;
	onLoadMore: () => void;
}

function GalleryGrid({
	cards,
	hasMoreCards,
	isLoadingMoreCards,
	loadingLabel,
	loadMoreLabel,
	onLoadMore,
}: GalleryGridProperties): ReactNode {
	const listReference = useRef<HTMLDivElement>(null);
	const [listWidth, setListWidth] = useState(0);
	const columnCount = Math.max(
		1,
		Math.floor((listWidth + GRID_COLUMN_GAP) / (GRID_MIN_COLUMN_WIDTH + GRID_COLUMN_GAP))
	);
	const cardRatio = cards[0] ? cards[0].dimensions.height / cards[0].dimensions.width : FALLBACK_CARD_RATIO;
	const columnWidth = Math.max(1, (listWidth - GRID_COLUMN_GAP * (columnCount - 1)) / columnCount);
	const thumbnailWidth = Math.max(96, columnWidth);
	const rowHeight = Math.ceil(thumbnailWidth * cardRatio + GRID_CARD_META_HEIGHT + GRID_ROW_GAP);
	const cardRows = Math.ceil(cards.length / columnCount);

	const rowVirtualizer = useVirtualizer({
		count: cardRows + (hasMoreCards ? 1 : 0),
		estimateSize: () => rowHeight,
		getScrollElement: () => listReference.current,
		onChange: instance => {
			const virtualItems = instance.getVirtualItems();
			const lastVirtualItem = virtualItems.at(-1);

			if (!lastVirtualItem) {
				return;
			}

			if (hasMoreCards && lastVirtualItem.index >= cardRows - 1) {
				onLoadMore();
			}
		},
		overscan: 5,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();

	useEffect(() => {
		const currentListElement = listReference.current;

		if (!currentListElement) {
			return;
		}

		const resizeObserver = new ResizeObserver(entries => {
			const entry = entries[0];

			if (!entry) {
				return;
			}

			setListWidth(Math.floor(entry.contentRect.width));
		});

		resizeObserver.observe(currentListElement);
		setListWidth(Math.floor(currentListElement.clientWidth));

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		rowVirtualizer.measure();
	}, [columnCount, rowHeight, rowVirtualizer]);

	return (
		<div ref={listReference}>
			<div
				className='relative w-full'
				style={{ height: rowVirtualizer.getTotalSize() }}>
				{virtualItems.map(virtualItem => {
					const rowStartIndex = virtualItem.index * columnCount;
					const rowCards = cards.slice(rowStartIndex, rowStartIndex + columnCount);

					return (
						<div
							className='absolute left-0 top-0 w-full'
							key={virtualItem.key}
							style={{ transform: `translateY(${virtualItem.start.toString()}px)` }}>
							{rowCards.length > 0 ? (
								<div
									className='grid'
									style={{
										columnGap: GRID_COLUMN_GAP,
										gridTemplateColumns: `repeat(${columnCount.toString()}, minmax(0, 1fr))`,
										rowGap: GRID_COLUMN_GAP,
									}}>
									{rowCards.map(card => {
										return (
											<GalleryGridItem
												card={card}
												key={card.id}
												thumbnailWidth={thumbnailWidth}
											/>
										);
									})}
								</div>
							) : hasMoreCards ? (
								<div className='grid h-16 place-items-center'>
									<Paragraph
										dimension='sm'
										tracking='normal'
										variant='muted'>
										{isLoadingMoreCards ? loadingLabel : loadMoreLabel}
									</Paragraph>
								</div>
							) : undefined}
						</div>
					);
				})}
			</div>
		</div>
	);
}

GalleryGrid.displayName = 'GalleryGrid';

export default GalleryGrid;
