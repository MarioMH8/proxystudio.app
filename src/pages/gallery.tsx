import EmptyState from '@components/empty-state';
import { ImagesIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

function Gallery(): ReactNode {
	const { t } = useTranslation();

	return (
		<EmptyState
			className='mx-auto w-fit'
			icon={ImagesIcon}
			message={t('gallery.empty')}
		/>
	);
}

Gallery.displayName = 'GalleryPage';

export default Gallery;
