import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { useCommandPaletteContext } from './command-palette-context';

type CommandPaletteTriggerProperties = PropertiesWithAsChild<ComponentPropsWithRef<'button'>>;

function CommandPaletteTrigger({
	asChild = false,
	onClick,
	type = 'button',
	...properties
}: CommandPaletteTriggerProperties): ReactNode {
	const { setOpen } = useCommandPaletteContext();
	const Component = asChild ? Slot.Slot : 'button';

	return (
		<Component
			onClick={(event: Parameters<NonNullable<ComponentPropsWithRef<'button'>['onClick']>>[0]) => {
				onClick?.(event);

				if (!event.defaultPrevented) {
					setOpen(true);
				}
			}}
			type={asChild ? undefined : type}
			{...properties}
		/>
	);
}

CommandPaletteTrigger.displayName = 'CommandPaletteTrigger';

export type { CommandPaletteTriggerProperties };
export default CommandPaletteTrigger;
