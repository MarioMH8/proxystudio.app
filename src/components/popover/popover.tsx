import { Popover as RadixPopover } from 'radix-ui';
import type { ReactNode } from 'react';

type PopoverProps = RadixPopover.PopoverProps;

function Popover(properties: PopoverProps): ReactNode {
	return <RadixPopover.Root {...properties} />;
}

Popover.displayName = 'Popover';

export default Popover;
