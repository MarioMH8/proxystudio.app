import Main from '@components/main';
import Toaster from '@components/toaster';
import { TooltipProvider } from '@components/tooltip';
import { NavigationMenu } from '@modules/navigation-menu/presentation';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Outlet } from 'react-router';

import UpdateNotifier from './update-notifier';

function Layout(): ReactNode {
	return (
		<Fragment>
			<NavigationMenu />
			<TooltipProvider>
				<Main className='h-full'>
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
