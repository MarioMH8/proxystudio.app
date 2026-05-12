import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import { ContextMenu as RadixContextMenu } from 'radix-ui';
import type { ReactNode } from 'react';

import { variants } from './context-menu-item';

type ContextMenuSubTriggerProps = RadixContextMenu.ContextMenuSubTriggerProps & VariantProperties<typeof variants>;

function ContextMenuSubTrigger({ className, ...properties }: ContextMenuSubTriggerProps): ReactNode {
	return (
		<RadixContextMenu.SubTrigger
			className={cn(font({ dimension: 'sm', variant: 'default' }), variants({ className }), className)}
			{...properties}
		/>
	);
}

ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

export default ContextMenuSubTrigger;
