import type { Card } from '@modules/card/domain';
import { useLazySearchCardsQuery } from '@modules/gallery/store';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 20;

interface UseGalleryCardsResult {
	cards: Card[];
	hasMoreCards: boolean;
	isInitialLoadDone: boolean;
	isLoadingMoreCards: boolean;
	loadError: string | undefined;
	loadNextCards: () => void;
}

function useGalleryCards(): UseGalleryCardsResult {
	const { t } = useTranslation();
	const [cards, setCards] = useState<Card[]>([]);
	const [hasMoreCards, setHasMoreCards] = useState(true);
	const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
	const [isLoadingMoreCards, setIsLoadingMoreCards] = useState(false);
	const [loadError, setLoadError] = useState<string>();
	const [searchCards] = useLazySearchCardsQuery();
	const offsetReference = useRef(0);
	const isFetchingReference = useRef(false);

	const loadNextCards = useCallback((): void => {
		if (isFetchingReference.current || !hasMoreCards) {
			return;
		}

		isFetchingReference.current = true;
		setIsLoadingMoreCards(true);
		setLoadError(undefined);

		void searchCards(
			{
				limit: PAGE_SIZE,
				offset: offsetReference.current,
				sort: 'updatedAt',
				sortDirection: 'desc',
			},
			true
		)
			.unwrap()
			.then(nextCards => {
				setCards(previousCards => {
					const knownIds = new Set(previousCards.map(card => card.id));
					const dedupedCards = nextCards.filter(card => !knownIds.has(card.id));

					return [...previousCards, ...dedupedCards];
				});

				offsetReference.current += nextCards.length;
				setHasMoreCards(nextCards.length === PAGE_SIZE);
			})
			.catch(() => {
				setLoadError(t('gallery.loadError'));
			})
			.finally(() => {
				isFetchingReference.current = false;
				setIsInitialLoadDone(true);
				setIsLoadingMoreCards(false);
			});
	}, [hasMoreCards, searchCards, t]);

	return {
		cards,
		hasMoreCards,
		isInitialLoadDone,
		isLoadingMoreCards,
		loadError,
		loadNextCards,
	};
}

export default useGalleryCards;
