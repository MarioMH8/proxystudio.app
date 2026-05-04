import border from '@components/border';
import FlexBox from '@components/flex-box';
import { NavigationMenu as SharedNavigationMenu, NavigationMenuSlot } from '@components/navigation-menu';
import { CommandPalette } from '@modules/commands/presentation';
import { MenuSettings } from '@modules/settings/presentation';
import { cn } from '@shared/cva';
import type { ReactNode } from 'react';

import NavigationTabs from './navigation-tabs';

function NavigationMenu(): ReactNode {
	return (
		<SharedNavigationMenu>
			<NavigationMenuSlot position='left'>
				<FlexBox
					className={cn('h-full pl-4', border({ side: 'left' }), 'gap-2')}
					id='menu-left-portal'
					items='center'
				/>
			</NavigationMenuSlot>
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
