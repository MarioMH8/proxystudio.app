import Main from '@components/main';
import { NavigationMenu, NavigationMenuSlot } from '@components/navigation-menu';
import SegmentControl from '@components/segment-control/segment-control';
import SegmentControlItem from '@components/segment-control/segment-control-item';
import Toaster from '@components/toaster';
import { TooltipProvider } from '@components/tooltip';
import { ImagesIcon, PencilRulerIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Fragment, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import UpdateNotifier from './update-notifier';

function Layout(): ReactNode {
	const { pathname } = useLocation();

	const isEditor = useMemo(() => pathname === '/', [pathname]);
	const isGallery = useMemo(() => pathname === '/gallery', [pathname]);

	return (
		<Fragment>
			<NavigationMenu>
				<NavigationMenuSlot position='center'>
					<SegmentControl>
						<SegmentControlItem
							asChild
							isActive={isEditor}>
							<Link
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
			</NavigationMenu>
			<TooltipProvider>
				<Main>
					<Outlet />
				</Main>
			</TooltipProvider>
			<Toaster theme='system' />
			<UpdateNotifier />
		</Fragment>
	);
}

Layout.displayName = 'Layout';

export default Layout;
