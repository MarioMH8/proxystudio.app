import { ContextMenu as RadixContextMenu } from 'radix-ui';
import type { ReactNode } from 'react';

type ContextMenuTriggerProps = RadixContextMenu.ContextMenuTriggerProps;

function ContextMenuTrigger(properties: ContextMenuTriggerProps): ReactNode {
	return <RadixContextMenu.Trigger {...properties} />;
}

ContextMenuTrigger.displayName = 'ContextMenuTrigger';

export default ContextMenuTrigger;
