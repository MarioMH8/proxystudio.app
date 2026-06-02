import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import { ContextMenu as RadixContextMenu } from 'radix-ui';
import type { ReactNode } from 'react';

import { variants } from './context-menu-content';

type ContextMenuSubContentProps = RadixContextMenu.ContextMenuSubContentProps & VariantProperties<typeof variants>;

function ContextMenuSubContent({
	className,
	sideOffset = 5,
	variant = 'default',
	...properties
}: ContextMenuSubContentProps): ReactNode {
	return (
		<RadixContextMenu.Portal>
			<RadixContextMenu.SubContent
				className={cn(variants({ className, variant }), className)}
				sideOffset={sideOffset}
				{...properties}
			/>
		</RadixContextMenu.Portal>
	);
}

ContextMenuSubContent.displayName = 'ContextMenuSubContent';

export default ContextMenuSubContent;
