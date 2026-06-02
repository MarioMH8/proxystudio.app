import type { ReactNode } from 'react';
import { Fragment } from 'react';

interface NavigationMenuSlotProperties {
	children: ReactNode;
	position?: 'center' | 'left' | 'right';
}

function NavigationMenuSlot({ children }: NavigationMenuSlotProperties): ReactNode {
	return <Fragment>{children}</Fragment>;
}

NavigationMenuSlot.displayName = 'NavigationMenuSlot';

export type { NavigationMenuSlotProperties };

export default NavigationMenuSlot;
