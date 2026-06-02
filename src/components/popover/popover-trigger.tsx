import { Popover as RadixPopover } from 'radix-ui';
import type { ReactNode } from 'react';

type PopoverTriggerProps = RadixPopover.PopoverTriggerProps;

function PopoverTrigger(properties: PopoverTriggerProps): ReactNode {
	return <RadixPopover.Trigger {...properties} />;
}

PopoverTrigger.displayName = 'PopoverTrigger';

export default PopoverTrigger;
