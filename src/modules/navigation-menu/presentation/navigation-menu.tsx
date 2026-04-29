import { NavigationMenu as SharedNavigationMenu, NavigationMenuSlot } from '@components/navigation-menu';
import SegmentControl from '@components/segment-control/segment-control';
import SegmentControlItem from '@components/segment-control/segment-control-item';
import { MenuSettings } from '@modules/settings/presentation';
import { ImagesIcon, PencilRulerIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router';

function NavigationMenu(): ReactNode {
	const { pathname } = useLocation();

	const isEditor = useMemo(() => pathname === '/', [pathname]);
	const isGallery = useMemo(() => pathname === '/gallery', [pathname]);

	return (
		<SharedNavigationMenu>
			<NavigationMenuSlot position='center'>
				<SegmentControl aria-label='Primary navigation'>
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
							Editor
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
							Gallery
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
