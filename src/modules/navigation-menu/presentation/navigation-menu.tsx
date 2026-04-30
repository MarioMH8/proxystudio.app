import { NavigationMenu as SharedNavigationMenu, NavigationMenuSlot } from '@components/navigation-menu';
import { CommandPalette } from '@modules/commands/presentation';
import { MenuSettings } from '@modules/settings/presentation';
import type { ReactNode } from 'react';

import NavigationTabs from './navigation-tabs';

function NavigationMenu(): ReactNode {
	return (
		<SharedNavigationMenu>
			<NavigationMenuSlot position='center'>
				<NavigationTabs />
			</NavigationMenuSlot>
			<NavigationMenuSlot position='right'>
				<CommandPalette />
				<MenuSettings />
			</NavigationMenuSlot>
		</SharedNavigationMenu>
	);
}

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;
