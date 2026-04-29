import { NavigationMenu as SharedNavigationMenu, NavigationMenuSlot } from '@components/navigation-menu';
import SegmentControl from '@components/segment-control/segment-control';
import SegmentControlItem from '@components/segment-control/segment-control-item';
import { MenuSettings } from '@modules/settings/presentation';
import { ImagesIcon, PencilRulerIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

function NavigationMenu(): ReactNode {
	const { pathname } = useLocation();
	const { t } = useTranslation();

	const isEditor = pathname === '/';
	const isGallery = pathname === '/gallery';

	return (
		<SharedNavigationMenu>
			<NavigationMenuSlot position='center'>
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
			</NavigationMenuSlot>
			<NavigationMenuSlot position='right'>
				<MenuSettings />
			</NavigationMenuSlot>
		</SharedNavigationMenu>
	);
}

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;
