import { ContextMenu as RadixContextMenu } from 'radix-ui';
import type { ReactNode } from 'react';

type ContextMenuSubProps = RadixContextMenu.ContextMenuSubProps;

function ContextMenuSub(properties: ContextMenuSubProps): ReactNode {
	return <RadixContextMenu.Sub {...properties} />;
}

ContextMenuSub.displayName = 'ContextMenuSub';

export default ContextMenuSub;
