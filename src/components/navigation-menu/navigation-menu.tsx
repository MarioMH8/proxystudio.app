import background from '@components/background';
import border from '@components/border';
import FlexBox from '@components/flex-box';
import Imagotipo from '@components/imagotipo';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import { Children } from 'react';
import { Link } from 'react-router';

import type { NavigationMenuSlotProperties } from './navigation-menu-slot';
import NavigationMenuSlot from './navigation-menu-slot';

const variants = cva({
	base: cn('w-full px-4 py-2', background({ variant: 'surfaces' })),
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type NavigationMenuProperties = PropertiesWithAsChild<ComponentPropsWithRef<'nav'>> & {
	children?: ReactElement<NavigationMenuSlotProperties> | ReactElement<NavigationMenuSlotProperties>[];
};

function NavigationMenu({ asChild = false, children, className, ...properties }: NavigationMenuProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'nav';

	const childrenArray = Children.toArray(children) as ReactElement[];

	const slots = childrenArray.filter(
		child => child.type === NavigationMenuSlot
	) as ReactElement<NavigationMenuSlotProperties>[];

	const renderSlot = (position: NavigationMenuSlotProperties['position']) => {
		const slot = slots.find(s => s.props.position === position);

		return slot?.props.children;
	};

	return (
		<FlexBox
			asChild
			direction='row'
			items='center'
			justify='between'>
			<Comp
				className={cn(variants({ className }), border({ side: 'bottom' }), className)}
				{...properties}>
				<FlexBox
					className='gap-2'
					items='center'>
					<Imagotipo asChild>
						<Link
							to='/'
							viewTransition
						/>
					</Imagotipo>
					{renderSlot('left')}
				</FlexBox>
				<FlexBox
					className='gap-2'
					items='center'>
					{renderSlot('center')}
				</FlexBox>
				<FlexBox
					className='gap-2'
					items='center'>
					{renderSlot('right')}
				</FlexBox>
			</Comp>
		</FlexBox>
	);
}

NavigationMenu.displayName = 'NavigationMenu';

export type { NavigationMenuProperties };

export default NavigationMenu;
