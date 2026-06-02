import { ContextMenu as RadixContextMenu } from 'radix-ui';
import type { ReactNode } from 'react';

type ContextMenuProps = RadixContextMenu.ContextMenuProps;

function ContextMenu(properties: ContextMenuProps): ReactNode {
	return <RadixContextMenu.Root {...properties} />;
}

ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;
