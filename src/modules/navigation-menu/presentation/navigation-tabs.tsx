import SegmentControl from '@components/segment-control/segment-control';
import SegmentControlItem from '@components/segment-control/segment-control-item';
import { ImagesIcon, PencilRulerIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useMatch } from 'react-router';

function NavigationTabs(): ReactNode {
	const { t } = useTranslation();
	const editorMatch = useMatch('/:card/editor');
	const galleryMatch = useMatch('/gallery');

	const isEditor = editorMatch !== null;
	const isGallery = galleryMatch !== null;

	return (
		<SegmentControl aria-label={t('navigation.primaryAriaLabel')}>
			<SegmentControlItem
				asChild
				isActive={isEditor}>
				<Link
					aria-current={isEditor ? 'page' : undefined}
					to='/editor'
					viewTransition>
					<PencilRulerIcon
						size={15}
						strokeWidth={1}
					/>
					{t('navigation.editor')}
				</Link>
			</SegmentControlItem>
			<SegmentControlItem
				asChild
				isActive={isGallery}>
				<Link
					aria-current={isGallery ? 'page' : undefined}
					to='/gallery'
					viewTransition>
					<ImagesIcon
						size={15}
						strokeWidth={1}
					/>
					{t('navigation.gallery')}
				</Link>
			</SegmentControlItem>
		</SegmentControl>
	);
}

NavigationTabs.displayName = 'NavigationTabs';

export default NavigationTabs;
