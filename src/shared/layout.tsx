import Main from '@components/main';
import Toaster from '@components/toaster';
import { TooltipProvider } from '@components/tooltip';
import { NavigationMenu } from '@modules/navigation-menu/presentation';
import { selectTheme } from '@modules/settings/store';
import { useAppSelector } from '@shared/store';
import UpdateNotifier from '@shared/update-notifier';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Outlet } from 'react-router';

function Layout(): ReactNode {
	const theme = useAppSelector(selectTheme);

	return (
		<Fragment>
			<NavigationMenu />
			<TooltipProvider>
				<Main className='min-h-0 flex-1'>
					<Outlet />
				</Main>
			</TooltipProvider>
			<Toaster theme={theme} />
			<UpdateNotifier />
		</Fragment>
	);
}

Layout.displayName = 'Layout';

export default Layout;
