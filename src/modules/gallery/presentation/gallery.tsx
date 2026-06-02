import EmptyState from '@components/empty-state';
import Paragraph from '@components/paragraph';
import { AlertCircleIcon, ImagesIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import GalleryGrid from './gallery/gallery-grid';
import useGalleryCards from './gallery/use-gallery-cards';

function Gallery(): ReactNode {
	const { t } = useTranslation();
	const { cards, hasMoreCards, isInitialLoadDone, isLoadingMoreCards, loadError, loadNextCards } = useGalleryCards();
	const scrollReference = useRef<HTMLDivElement>(null);

	useEffect(() => {
		loadNextCards();
	}, [loadNextCards]);

	if (isInitialLoadDone && cards.length === 0 && !loadError) {
		return (
			<EmptyState
				className='mx-auto w-fit'
				icon={ImagesIcon}
				message={t('gallery.empty')}
			/>
		);
	}

	return (
		<section
			className='h-full w-full overflow-auto'
			ref={scrollReference}>
			<div className='mx-auto flex w-full max-w-7xl flex-col gap-3 p-4 sm:p-6'>
				<GalleryGrid
					cards={cards}
					hasMoreCards={hasMoreCards}
					isLoadingMoreCards={isLoadingMoreCards}
					loadingLabel={t('gallery.loading')}
					loadMoreLabel={t('gallery.loadMore')}
					onLoadMore={loadNextCards}
					scrollReference={scrollReference}
				/>
				{loadError ? (
					<Paragraph
						className='gap-2 text-center'
						dimension='xl'
						variant='danger'>
						<AlertCircleIcon className='mx-auto size-6' />
						{loadError}
					</Paragraph>
				) : undefined}
			</div>
		</section>
	);
}

Gallery.displayName = 'Gallery';

export default Gallery;
